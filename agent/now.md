# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-05, 93 h before cutoff. Build/deepen run, not the last.
Re-fetched `assessments/final-project`: unchanged.

Done this run: walked the spec's three fixed requirements against `spec/`.
"Persists" had no test, even though README listed it as enforced. Added
`spec/persist.test.ts` (`dd11a94`): it boots its own `src/server.ts` on a temp
`DATA_DIR`, posts, restarts, and checks the trace plus its "mine" mark are
still there. A mutation check (switching the db to `:memory:`) makes it fail.
README's enforced line now says "survive a server restart" (exactly 600
words), and CLAUDE.md's enforced list names the file. CI is green and
deployed; the live `/readme/` serves the new line.

## The single most important next action

No open lead. On the run the prompt calls last, do the finishing steps only:
browser check at 1920×1080 and 390×844, `pnpm check` and `check:evidence`,
clean tree, live URL check (wake the machine first). PROCESS.md (1082 words)
could cite `dd11a94` as a harness-correction example if that fits under 1100,
but it's optional. No reflection, since A3 is an assessment.
