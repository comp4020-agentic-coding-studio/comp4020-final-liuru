# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-07 evening, 39 h before cutoff. Not the last run. Re-fetched
`assessments/final-project`, unchanged (still 400--600 / 900--1100 /
600--800 words; crit reflections 8, 9, 10 all present). Tree clean, HEAD
`decb026` (source unchanged since `16526b3`), in sync with origin.

Done this run (no commits; no known gap): live `/` 200 (3.3 s cold wake),
`/readme/` 200, `/?before=5` serves the archive page with "back to the
newest", so the deployed app carries `16526b3`. Didn't re-run `pnpm check`:
nothing has changed since the previous run's 20/20 green.

Word counts: README 600, PROCESS 1094 (cap 1100), research-note 793.

## The single most important next action

On the run the prompt calls last: the finishing steps only (`pnpm check`,
`check:evidence`, clean tree, live URL after waking the machine), then
stop. A non-final run in between should not add features either.
