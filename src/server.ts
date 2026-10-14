import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { marked } from "marked";
import { addTrace, isKind, recentTraces, type Trace, tracesAfter } from "./db.ts";
import { logEvent, logRequest, requestId, visitorTag } from "./log.ts";
import { presenceText, renderReadme, renderTrace, renderWall } from "./templates.ts";

const PORT = Number(process.env.PORT ?? 8080);
const VISITOR_COOKIE = "visitor";
const FIVE_YEARS = 60 * 60 * 24 * 365 * 5;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const value = part.slice(eq + 1).trim();
    try {
      out[part.slice(0, eq).trim()] = decodeURIComponent(value);
    } catch {
      // a malformed escape is just a cookie we don't recognise, not a crash
      out[part.slice(0, eq).trim()] = value;
    }
  }
  return out;
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function visitorCookie(id: string): string {
  // Persistent identity, not a login: this is what lets a returning stranger
  // find their own trace again without an account.
  return `${VISITOR_COOKIE}=${id}; Max-Age=${FIVE_YEARS}; Path=/; HttpOnly; SameSite=Lax`;
}

// Everyone with the wall open, held in this one process's memory. That's only
// correct because fly.toml pins a single machine (decision record 0002).
interface Listener {
  res: ServerResponse;
  visitorId: string;
}
const listeners = new Set<Listener>();

function send(res: ServerResponse, event: string, data: string, id?: number): void {
  res.write(`${id === undefined ? "" : `id: ${id}\n`}event: ${event}\ndata: ${data}\n\n`);
}

function sendTrace(l: Listener, t: Trace): void {
  // rendered per listener, since "yours" depends on who's looking
  send(l.res, "trace", JSON.stringify(renderTrace(t, l.visitorId)), t.id);
}

// Counted by visitor cookie, not connection, so your own second tab never
// shows up as "someone else".
function broadcastPresence(): void {
  const others = new Set([...listeners].map((l) => l.visitorId)).size - 1;
  for (const l of listeners) send(l.res, "presence", presenceText(others));
}

setInterval(() => {
  // a comment line keeps Fly's proxy from closing an idle stream
  for (const l of listeners) l.res.write(": still here\n\n");
}, 20_000).unref();

const server = createServer(async (req, res) => {
  const started = performance.now();
  const reqId = requestId();
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const cookies = parseCookies(req.headers.cookie);
  // Only an id this server could have issued counts; anything else (a
  // hand-typed "ada", a mangled value) gets a fresh identity, so nobody picks
  // their own id (decision record 0003).
  const cookieVisitor = cookies[VISITOR_COOKIE];
  const existingVisitor = cookieVisitor && UUID.test(cookieVisitor) ? cookieVisitor : undefined;
  const visitorId = existingVisitor ?? randomUUID();
  const visitor = visitorTag(visitorId);
  const setCookie = existingVisitor ? undefined : visitorCookie(visitorId);
  if (setCookie) logEvent(reqId, "visitor_new", { visitor });
  // /events stays open, so its line is written when it opens, not on finish
  if (url.pathname !== "/events") {
    res.on("finish", () => {
      const ms = Math.round(performance.now() - started);
      logRequest(reqId, req.method ?? "?", url.pathname, res.statusCode, ms, visitor);
    });
  }

  try {
    if (url.pathname === "/" && req.method === "GET") {
      const html = renderWall(recentTraces(), visitorId);
      res.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        ...(setCookie ? { "set-cookie": setCookie } : {}),
      });
      res.end(html);
      return;
    }

    if (url.pathname === "/trace" && req.method === "POST") {
      const raw = await readBody(req);
      const params = new URLSearchParams(raw);
      const kind = params.get("kind") ?? "";
      const text = (params.get("text") ?? "").trim().slice(0, 240);
      if (isKind(kind) && text.length > 0) {
        const trace = addTrace(visitorId, kind, text);
        logEvent(reqId, "trace_posted", { visitor, trace: trace.id, kind, text });
        for (const l of listeners) sendTrace(l, trace);
      } else {
        logEvent(reqId, "trace_dropped", {
          visitor,
          reason: isKind(kind) ? "empty text" : "unknown kind",
        });
      }
      res.writeHead(303, {
        location: "/",
        ...(setCookie ? { "set-cookie": setCookie } : {}),
      });
      res.end();
      return;
    }

    if (url.pathname === "/events" && req.method === "GET") {
      res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache",
        ...(setCookie ? { "set-cookie": setCookie } : {}),
      });
      // `after` is the newest trace the page was rendered with; on a
      // reconnect EventSource sends the last id it saw instead. Either way,
      // replay whatever this tab missed. A stream with neither has rendered
      // nothing, so it has missed nothing and starts from now.
      const lastEventId = req.headers["last-event-id"];
      const listener = { res, visitorId };
      if (url.searchParams.has("after") || lastEventId !== undefined) {
        const after = Math.max(Number(url.searchParams.get("after")) || 0, Number(lastEventId) || 0);
        for (const t of tracesAfter(after)) sendTrace(listener, t);
      }
      listeners.add(listener);
      broadcastPresence();
      logRequest(reqId, "GET", url.pathname, 200, Math.round(performance.now() - started), visitor);
      logEvent(reqId, "stream_opened", { visitor, open: listeners.size });
      req.on("close", () => {
        listeners.delete(listener);
        broadcastPresence();
        const seconds = Math.round((performance.now() - started) / 1000);
        logEvent(reqId, "stream_closed", { visitor, after: `${seconds}s`, open: listeners.size });
      });
      return;
    }

    if (url.pathname === "/readme/" && req.method === "GET") {
      const md = readFileSync("README.md", "utf8");
      const html = renderReadme(await marked.parse(md));
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("not found");
  } catch (err) {
    logEvent(reqId, "error", { visitor, path: url.pathname });
    console.error(`[${reqId}]`, err);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("internal error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on ${PORT}`);
});
