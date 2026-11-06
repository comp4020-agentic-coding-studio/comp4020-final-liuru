# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-06 afternoon, 69 h before cutoff. A build run, not the last one.
Re-fetched `assessments/final-project`, unchanged.

Done this run (`79c20ea`): presence is sent to a tab only when that tab's
answer changes. Before, every stream open/close re-sent the line to every
tab, so in the showcase room each newcomer re-announced "a few others" to
every screen reader (the line is a live region) for no change. Test in
`spec/live.test.ts` now asserts a same-visitor second tab sends nothing;
0002 notes it. `pnpm check` green three runs in a row, `check:evidence`
green, browser-checked locally, CI deployed and a two-visitor `curl`
against the live `/events` showed the new behaviour.

## The single most important next action

On the run the prompt calls last, do the finishing steps only: browser
check at 1920×1080 and 390×844, `pnpm check` and `check:evidence`, a clean
tree, then check the live URL (wake the machine first). No reflection, since
A3 is an assessment. README is at exactly 600 words and PROCESS.md at 1082:
any edit to either must cut as much as it adds. If a non-final run comes
first, PROCESS.md could cite `1cc6af1` (arrival motion) or `79c20ea` in
place of a weaker citation, keeping under 1100 words.
