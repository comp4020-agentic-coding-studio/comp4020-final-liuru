import { afterEach, expect, inject, it } from "vitest";

// The real-time layer (crit 9): a trace reaches every open stream within
// about a second, a reconnecting tab gets what it missed, and presence says
// whether you're alone without ever giving a number (decision record 0002).
const baseUrl = inject("baseUrl");

interface Stream {
  events: { event: string; id: string; data: string }[];
  // resolves on the first matching event at or after index `from`
  next(match: (e: { event: string; data: string }) => boolean, from?: number): Promise<string>;
  close(): void;
}

const open: Stream[] = [];
afterEach(() => {
  for (const s of open.splice(0)) s.close();
});

function visitor(): string {
  return `visitor=spec-${Math.random().toString(36).slice(2)}`;
}

async function listen(cookie: string, headers: Record<string, string> = {}): Promise<Stream> {
  const controller = new AbortController();
  const res = await fetch(new URL("/events", baseUrl), {
    headers: { cookie, ...headers },
    signal: controller.signal,
  });
  expect(res.headers.get("content-type")).toMatch(/^text\/event-stream/);
  const events: Stream["events"] = [];
  const waiters = new Set<() => void>();
  void (async () => {
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      for await (const chunk of res.body!) {
        buffer += decoder.decode(chunk, { stream: true });
        let end;
        while ((end = buffer.indexOf("\n\n")) !== -1) {
          const block = buffer.slice(0, end);
          buffer = buffer.slice(end + 2);
          const field = (name: string) =>
            block
              .split("\n")
              .find((line) => line.startsWith(`${name}: `))
              ?.slice(name.length + 2) ?? "";
          if (field("event")) events.push({ event: field("event"), id: field("id"), data: field("data") });
          for (const w of waiters) w();
        }
      }
    } catch {
      // aborted by close()
    }
  })();
  const stream: Stream = {
    events,
    next(match, from = 0) {
      const ms = 1000;
      let seen = from;
      return new Promise((resolve, reject) => {
        const check = () => {
          for (; seen < events.length; seen++) {
            if (match(events[seen]!)) {
              waiters.delete(check);
              clearTimeout(timer);
              resolve(events[seen]!.data);
              return;
            }
          }
        };
        const timer = setTimeout(() => {
          waiters.delete(check);
          reject(new Error(`no matching event within ${ms}ms`));
        }, ms);
        waiters.add(check);
        check();
      });
    },
    close: () => controller.abort(),
  };
  open.push(stream);
  return stream;
}

async function post(cookie: string, text: string): Promise<void> {
  await fetch(new URL("/trace", baseUrl), {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ kind: "lightning", text }),
    redirect: "manual",
  });
}

function randomText(): string {
  return `spec-live-${Math.random().toString(36).slice(2)}`;
}

it("a trace one visitor posts reaches another visitor's open stream within a second", async () => {
  const watcher = await listen(visitor());
  const poster = visitor();
  const text = randomText();
  await post(poster, text);
  const html = await watcher.next((e) => e.event === "trace" && e.data.includes(text));
  expect(html).not.toContain("mine");
});

it("marks the trace as yours only on your own stream", async () => {
  const cookie = visitor();
  const own = await listen(cookie);
  const text = randomText();
  await post(cookie, text);
  const html = await own.next((e) => e.event === "trace" && e.data.includes(text));
  expect(html).toContain("mine");
});

it("a reconnecting stream gets the traces it missed, and not the ones it already had", async () => {
  const cookie = visitor();
  const first = await listen(cookie);
  const seen = randomText();
  await post(visitor(), seen);
  await first.next((e) => e.event === "trace" && e.data.includes(seen));
  const lastId = first.events.find((e) => e.data.includes(seen))!.id;
  first.close();

  const missed = randomText();
  await post(visitor(), missed);
  const again = await listen(cookie, { "last-event-id": lastId });
  await again.next((e) => e.event === "trace" && e.data.includes(missed));
  expect(again.events.some((e) => e.data.includes(seen))).toBe(false);
});

it("presence says whether you're alone, counts visitors not tabs, and never shows a number", async () => {
  const a = await listen(visitor());
  await a.next((e) => e.event === "presence" && e.data.includes("only one"));

  const b = visitor();
  await listen(b);
  await a.next((e) => e.event === "presence" && e.data.includes("someone else"));

  // b's second tab is still one visitor
  const before = a.events.length;
  await listen(b);
  await a.next((e) => e.event === "presence", before);
  expect(a.events.at(-1)!.data).toContain("someone else");

  await listen(visitor());
  await a.next((e) => e.event === "presence" && e.data.includes("a few others"));

  for (const e of a.events.filter((e) => e.event === "presence")) {
    expect(e.data).not.toMatch(/\d/);
  }
});
