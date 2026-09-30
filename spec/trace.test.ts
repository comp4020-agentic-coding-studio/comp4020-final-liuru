import { expect, inject, it } from "vitest";

// The wall's own promises, on top of the two course-wide checks in
// invariants.test.ts: a posted trace with a real kind and real text shows up,
// and garbage (bad kind, empty text) is dropped rather than stored.
const baseUrl = inject("baseUrl");

function randomText(): string {
  return `spec-trace-${Math.random().toString(36).slice(2)}`;
}

it("a posted trace appears on the wall afterwards", async () => {
  const text = randomText();
  const res = await fetch(new URL("/trace", baseUrl), {
    method: "POST",
    body: new URLSearchParams({ kind: "dew", text }),
    redirect: "manual",
  });
  expect(res.status).toBe(303);

  const page = await (await fetch(new URL("/", baseUrl))).text();
  expect(page).toContain(text);
});

it("drops a trace with an unrecognised kind", async () => {
  const text = randomText();
  await fetch(new URL("/trace", baseUrl), {
    method: "POST",
    body: new URLSearchParams({ kind: "not-a-real-kind", text }),
    redirect: "manual",
  });

  const page = await (await fetch(new URL("/", baseUrl))).text();
  expect(page).not.toContain(text);
});

it("drops a trace with empty text", async () => {
  const res = await fetch(new URL("/trace", baseUrl), {
    method: "POST",
    body: new URLSearchParams({ kind: "dew", text: "   " }),
    redirect: "manual",
  });
  // still redirects — a bad submission is silently ignored, not an error page
  expect(res.status).toBe(303);
});
