import { createHash, randomBytes } from "node:crypto";

// One line per event on stdout, which is what `flyctl logs` shows:
//
//   [3f9a1c] trace_posted visitor=7c2e91ab trace=42 kind=dew text="..."
//   [3f9a1c] POST /trace 303 4ms visitor=7c2e91ab
//
// The bracketed tag is the request id, tying a request to the events inside
// it. Decision record 0003 says what gets logged and what never does.

export function requestId(): string {
  return randomBytes(3).toString("hex");
}

// The cookie is the only credential a visitor has, so it never reaches the
// log: anyone holding it could post as them. A short hash tells two visitors
// apart without being usable as either.
export function visitorTag(visitorId: string): string {
  return createHash("sha256").update(visitorId).digest("hex").slice(0, 8);
}

type Value = string | number | boolean;

function format(value: Value): string {
  // quoted and escaped whenever it could hold a space, a quote or a newline,
  // so a trace's text can't forge a second log line
  return typeof value === "string" && !/^[\w./:-]+$/.test(value) ? JSON.stringify(value) : String(value);
}

export function logEvent(reqId: string, event: string, fields: Record<string, Value> = {}): void {
  const rest = Object.entries(fields).map(([k, v]) => `${k}=${format(v)}`);
  console.log([`[${reqId}]`, event, ...rest].join(" "));
}

export function logRequest(
  reqId: string,
  method: string,
  path: string,
  status: number,
  ms: number,
  visitor: string,
): void {
  console.log(`[${reqId}] ${method} ${path} ${status} ${ms}ms visitor=${visitor}`);
}
