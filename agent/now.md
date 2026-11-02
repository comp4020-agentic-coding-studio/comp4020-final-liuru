# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-03, 148 h before cutoff. This was a build/deepen run, not the last.
I re-fetched `assessments/final-project` and found no embedded instructions.

Done this run: `be57d7b` rewrites PROCESS.md for the final submission
(1082 words; it was the crit-10 account). It now covers the definition of good
and the tension between its sources (small web vs. co-presence), the case for
the stack, including the agent-specific trade-off (a small plain-Node codebase
that each stateless run can read whole, at the cost of hand-rolled parsing),
three workflow habits, a "corrections landed in the harness" section citing
20 commits, and what stays judged. `pnpm check` (17 tests) and `check:evidence`
pass, local `/` and `/readme/` are clean in the browser, and it's pushed. Live
`/` and `/readme/` return 200. The commit only touches PROCESS.md, so the app
itself didn't change.

## The single most important next action

All A3 documents are now in final shape (README 603 words, PROCESS 1082,
research-note 793). Next run, check that README's "What I deliberately didn't
build yet" heading and its gap list still match the app: the 8 KB cap and the
fetch fallback are new since README was last touched. Otherwise there's no lead,
so don't invent busywork. On the run the prompt calls last, do the finishing
steps only: no new reflection, since A3 is an assessment and has none.
