import { randomUUID } from "node:crypto";
import { expect, inject, it } from "vitest";

// Who counts as a person, and what each may change (decision record 0003): a
// visitor is a server-issued cookie, every visitor sees every trace, only the
// poster's own render marks a trace as theirs, and nobody can change or remove
// a trace once it's posted, their own included.
const baseUrl = inject("baseUrl");

function randomText(): string {
  return `spec-identity-${Math.random().toString(36).slice(2)}`;
}

async function post(cookie: string, text: string): Promise<Response> {
  return fetch(new URL("/trace", baseUrl), {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ kind: "shadow", text }),
    redirect: "manual",
  });
}

async function traceFor(cookie: string, text: string): Promise<string> {
  const page = await (await fetch(new URL("/", baseUrl), { headers: { cookie } })).text();
  const li = page.match(new RegExp(`<li id="trace-\\d+"(?:(?!</li>)[\\s\\S])*?${text}(?:(?!</li>)[\\s\\S])*?</li>`));
  expect(li, `no trace with ${text} on the wall`).not.toBeNull();
  return li![0];
}

it("issues a first-time visitor a long-lived, script-proof identity cookie", async () => {
  const res = await fetch(new URL("/", baseUrl));
  const cookie = res.headers.get("set-cookie") ?? "";
  expect(cookie).toMatch(/^visitor=[0-9a-f-]{36};/);
  expect(cookie).toMatch(/HttpOnly/);
  expect(cookie).toMatch(/SameSite=Lax/);
});

it("shows two visitors the same trace, marked as theirs only for its poster", async () => {
  const ada = `visitor=${randomUUID()}`;
  const bo = `visitor=${randomUUID()}`;
  const text = randomText();
  await post(ada, text);
  expect(await traceFor(ada, text)).toContain("mine");
  expect(await traceFor(bo, text)).not.toContain("mine");
});

it("ignores an identity the server never issued rather than letting a visitor pick one", async () => {
  const invented = "visitor=ada";
  const res = await post(invented, randomText());
  // replaced with a fresh server-issued id, not accepted as "ada"
  expect(res.headers.get("set-cookie")).toMatch(/^visitor=[0-9a-f-]{36};/);
  const text = randomText();
  await post(invented, text);
  // a second request with the same invented value is someone new again
  expect(await traceFor(invented, text)).not.toContain("mine");
});

it("offers no way to change or remove a trace, not even your own", async () => {
  const ada = `visitor=${randomUUID()}`;
  const text = randomText();
  await post(ada, text);
  const id = (await traceFor(ada, text)).match(/trace-(\d+)/)![1];

  for (const [method, path] of [
    ["DELETE", `/trace/${id}`],
    ["PUT", `/trace/${id}`],
    ["POST", `/trace/${id}`],
    ["DELETE", "/trace"],
  ] as const) {
    const res = await fetch(new URL(path, baseUrl), { method, headers: { cookie: ada }, redirect: "manual" });
    expect(res.status, `${method} ${path}`).toBe(404);
  }
  expect(await traceFor(ada, text)).toContain(text);
});

it("survives a malformed cookie instead of crashing", async () => {
  const res = await fetch(new URL("/", baseUrl), { headers: { cookie: "visitor=%E0%A4%A" } });
  expect(res.status).toBe(200);
  expect((await fetch(new URL("/", baseUrl))).status).toBe(200);
});
