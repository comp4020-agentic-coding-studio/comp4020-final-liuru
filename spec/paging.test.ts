import { type ChildProcess, spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it } from "vitest";

// Nothing falls off the wall: past one page, every trace is still reachable
// through "older traces". Filling a page takes 200 posts, which would push
// other spec files' traces off the shared server's first page while they run
// in parallel, so this boots its own copy of src/server.ts on a throwaway
// DATA_DIR, as persist.test.ts does.
const dataDir = mkdtempSync(join(tmpdir(), "liuru-paging-"));
let child: ChildProcess | undefined;

afterAll(() => {
  child?.kill();
  rmSync(dataDir, { recursive: true, force: true });
});

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, () => {
      const { port } = probe.address() as { port: number };
      probe.close(() => resolve(port));
    });
  });
}

async function boot(): Promise<string> {
  const port = await freePort();
  child = spawn(process.execPath, ["src/server.ts"], {
    env: { ...process.env, PORT: String(port), DATA_DIR: dataDir },
    stdio: "ignore",
  });
  const url = `http://localhost:${port}`;
  for (let attempt = 0; attempt < 150; attempt++) {
    try {
      await fetch(url);
      return url;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`a fresh server on ${url} never answered`);
}

it("a trace pushed past the first page is still reachable through 'older traces'", { timeout: 60_000 }, async () => {
  const url = await boot();
  const text = `spec-paging-${Math.random().toString(36).slice(2)}`;
  const post = (t: string) =>
    fetch(new URL("/trace", url), {
      method: "POST",
      body: new URLSearchParams({ kind: "dew", text: t }),
      redirect: "manual",
    });
  await post(text);
  for (let i = 0; i < 200; i++) await post(`filler-${i}`);

  const first = await (await fetch(url)).text();
  expect(first, "the first page holds only the newest 200").not.toContain(text);
  const older = first.match(/href="(\/\?before=\d+)"/);
  expect(older, "a full page links to older traces").not.toBeNull();

  const second = await (await fetch(new URL(older![1], url))).text();
  expect(second).toContain(text);
  expect(second).toContain('href="/"');
  expect(second, "an older page has nothing older to link to").not.toMatch(/\?before=/);
});
