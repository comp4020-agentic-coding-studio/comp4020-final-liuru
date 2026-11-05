import { type ChildProcess, spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it } from "vitest";

// "Persists" means a trace outlives the process that stored it. The shared
// spec server can't be restarted mid-run, so this test boots its own copy of
// src/server.ts on a throwaway DATA_DIR, stops it, boots a fresh one on the
// same directory, and reads the wall back. It checks the source, not the
// image; the volume mount in fly.toml is what carries DATA_DIR across deploys.
const dataDir = mkdtempSync(join(tmpdir(), "liuru-persist-"));
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

async function stop(): Promise<void> {
  const proc = child;
  if (!proc || proc.exitCode !== null) return;
  await new Promise((resolve) => {
    proc.once("exit", resolve);
    proc.kill();
  });
  child = undefined;
}

it("a trace and its 'yours' mark survive a server restart", { timeout: 30_000 }, async () => {
  const cookie = `visitor=${crypto.randomUUID()}`;
  const text = `spec-persist-${Math.random().toString(36).slice(2)}`;

  let url = await boot();
  const posted = await fetch(new URL("/trace", url), {
    method: "POST",
    headers: { cookie },
    body: new URLSearchParams({ kind: "dew", text }),
    redirect: "manual",
  });
  expect(posted.status).toBeLessThan(400);
  await stop();

  url = await boot();
  const page = await (await fetch(url, { headers: { cookie } })).text();
  const li = page.match(new RegExp(`<li id="trace-\\d+"(?:(?!</li>)[\\s\\S])*?${text}(?:(?!</li>)[\\s\\S])*?</li>`));
  expect(li, "the trace is gone after a restart").not.toBeNull();
  expect(li![0]).toContain("mine");
});
