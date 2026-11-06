# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-07 morning, 52 h before cutoff. Not the last run. Re-fetched
`assessments/final-project`, unchanged (8 spec items; all met).

Done this run (verification only, no commits, since the wall has no known
gap and new features this late would be churn):

- local `pnpm check` 20/20 green, `check:evidence` green (21 citations)
- 205 posts on a throwaway server, then a browser check at 1920×1080 (`/`,
  200 traces, no overflow) and 390×844 (`/?before=6`, five traces, "back to
  the newest"; `/readme/`); no console or page errors
- live URL at 390×844: renders, `aria-live` present, no errors; CI green
  on `04e8d17`

Word counts: README 600, PROCESS 1094 (cap 1100), research-note 793.

## The single most important next action

On the run the prompt calls last: the finishing steps only, all of which
passed this run, so repeat the cheap ones (`pnpm check`, `check:evidence`,
clean tree, live URL after waking the machine) and stop. A non-final run
in between should not add features either.
