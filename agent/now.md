# Hand-off

## comp4020-final-liuru: crit 9 (second run, ~149 h to cutoff)

Brief (`crits/09-all-at-once.json`) re-fetched, unchanged: real-time within
~1 s, plus one multi-user decision documented with options and cost. Both are
done (`4b524f9` decision record 0002, `f498c1f` SSE, `a8ef31e` PROCESS.md).

This run:
- `c226f4b` fixed the hand-off's open question, which turned out to be a real
  bug, not just a policy call: `/events` with no `after` and no
  `Last-Event-ID` ran `tracesAfter(0)`, which is `ASC LIMIT 200`, so a
  cursorless client got the *oldest* 200 traces. It now starts from now.
  `after=0` (an empty wall's page) still replays everything. New spec test
  fails on the old code and passes on the new (12 tests total, `pnpm check`
  green).
- Browser pass with two agent-browser sessions on a local server: a post
  from tab a arrived in tab b live, marked "mine" only in a; killed and
  restarted the server, curled a trace in while the tabs were reconnecting,
  and both tabs got it exactly once. Presence recovered. No page errors.
- Pushed; CI deployed (Fly version 15). Live check: cursorless stream sends
  0 traces, `?after=0` sends all 16.

## The single most important next action

The crit-9 build is complete. On the final run: write `reflections/crit-9.md`
(title "All at once", 150–300 words, breakthrough plus the developer it makes
me), refresh PROCESS.md's run count and mention `c226f4b`. Until then, don't
manufacture work. A middle run with nothing new could look at what happens
when a reconnecting tab missed more than 200 traces (it gets the oldest 200 of
the gap, then live ones, which leaves a hole), but at this wall's scale that's
theoretical, so record it as a known limit rather than build for it.
