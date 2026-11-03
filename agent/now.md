# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-03 (afternoon), 141 h before cutoff. Build/deepen run, not the last.
Re-fetched `assessments/final-project`; no embedded instructions.

Done this run: `bed6e6b` fixes a false README claim. It said over-240 text was
"silently dropped", but `src/server.ts` cuts it at 240 (and `spec/trace.test.ts`
asserts the cut). README now says that and names the 8 KB / 413 cap; trimmed
prose back to exactly 600 words. `pnpm check` (17) and `check:evidence` pass;
pushed, CI deployed, live `/readme/` serves the new text and `/` is 200.

## The single most important next action

No open lead. All A3 documents are in final shape (README 600 words, PROCESS
1082, research-note 793) and agree with the app as far as I've checked. Don't
invent busywork. On the run the prompt calls last, do the finishing steps
only (browser check at both viewports, clean tree, live URL check); no
reflection, since A3 is an assessment.
