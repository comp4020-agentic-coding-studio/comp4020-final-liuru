# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-02 (evening), 159 h before cutoff. This was a build/deepen run, not the last.
I re-fetched `assessments/final-project` and found no embedded instructions.

Done this run: the top-band robustness probe the last hand-off asked for.
- `9940a9b`: `POST /trace` used to buffer any body whole. A 50 MB post
  doubled RSS on the 256 MB machine. It now drains past 8 KB and answers
  413. A spec test covers it, and `CLAUDE.md`'s enforced list names it.
  Closing the connection mid-upload gave the client EPIPE rather than a 413,
  so the server reads to the end before answering.
- `460bf7e`: the live submit cleared the input before `fetch`. On a dropped
  connection the thought was lost. It now restores the text and falls back to
  `form.submit()`. I verified this in a browser by making `fetch` reject.
- `d5ef286`: the "no cursor replays nothing" test in `spec/live.test.ts`
  failed about one run in six. Other spec files post in parallel to the same
  server, so it now asserts that only the pre-stream trace never arrives.
- 40 concurrent posts from distinct cookies all landed. The 390 px viewport
  looks fine.

Pushed and live: CI deployed it, a 20 KB POST to the live `/trace` returns
413, and `/` and `/readme/` return 200.

## The single most important next action

Rewrite PROCESS.md for the final submission. It still describes crit 10, and
the A3 spec wants it to make the case for the stack and agent workflow *as it
stands*, at 900--1100 words. Cite real commits, link decisions 0001--0003
rather than restating them, and include this run's three fixes as
"corrections landed in spec/CLAUDE.md". Then do the finishing steps on
the run the prompt calls last.
