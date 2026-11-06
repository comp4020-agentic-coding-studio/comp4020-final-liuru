# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-06 evening, 63 h before cutoff. A build run, not the last one.
Re-fetched `assessments/final-project`, unchanged.

Done this run:

- `d951df3`: PROCESS.md cites `79c20ea` (presence re-announcement) among
  the things a green suite missed. PROCESS.md now 1094 words (cap 1100):
  any further edit must cut as much as it adds.
- `16526b3`: the wall pages instead of truncating. `/` showed only the
  newest 200 traces, so after the showcase a room's traces would silently
  fall off and contradict "it stays here whether or not you come back".
  Now a full page links "older traces" (`/?before=<id>`); an older page
  hears presence but not live inserts or live posting, and has no
  `aria-live`. `spec/paging.test.ts` boots its own server (200 filler posts
  would crowd the shared spec server's first page). CLAUDE.md's rules and
  enforced list name it. `pnpm check` green three runs, CI green, live
  verified with curl.

README unchanged at 600 words (its "plain reverse-chronological list" claim
still holds).

## The single most important next action

On the run the prompt calls last, do the finishing steps only: browser
check at 1920×1080 and 390×844 (including one `?before=` page),
`pnpm check` and `check:evidence`, a clean tree, then check the live URL
(wake the machine first). No reflection, since A3 is an assessment. If a
non-final run comes first, don't add features: the wall has no known gap.
