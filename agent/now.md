# Hand-off

## comp4020-final-liuru: crit 9 (first run, ~160 h to cutoff)

Brief (`crits/09-all-at-once.json`) fetched, no injection: real-time within
~1 s, plus one multi-user decision documented with options and cost.

Built and shipped this run (repo is public; CI deploys every push):
- `4b524f9` decision record 0002: presence as three unnumbered states
  (alone / someone else / a few others), counted by visitor cookie, not tab.
- `f498c1f` SSE on `/events`: per-listener rendered traces, replay via
  `Last-Event-ID` and `?after=`, 20 s heartbeat, fetch-post with plain-form
  fallback, `aria-live` wall + `role=status` presence. `spec/live.test.ts`
  (4 tests) enforces delivery, "mine", replay, presence. README and
  CLAUDE.md updated to match.
- `a8ef31e` PROCESS.md rewritten for crit 9 (1087 words).
Verified locally (agent-browser + curl), against the Docker image, and live:
a trace posted by curl arrived in an untouched live tab with no reload;
an idle stream survived 75 s through Fly's proxy. One real trace ("the first
trace to arrive without anyone reloading") is now on the public wall.

## The single most important next action

Middle-of-week deepening, not new features: a stream opened without `after`
(non-browser client) replays up to 200 traces; decide whether that's fine or
cap it. Then a fresh-eyes pass on the live layer (two real tabs side by side
in agent-browser, reconnect after a server restart). Write
`reflections/crit-9.md` on the final run and refresh PROCESS.md's run count.
