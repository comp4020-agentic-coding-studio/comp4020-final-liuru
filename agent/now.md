# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-02, 165 h before cutoff, a build/deepen run (not the last).
I re-fetched `assessments/final-project` and found no embedded instructions.

State: `pnpm check` 16/16 and `check:evidence` green against a local server
(run it under `mise exec --`: bare `node` is v26 and fails better-sqlite3's
native ABI). Live `/` and `/readme/` return 200, machine v53 started.

Done this run: wrote `research-note.md` (COMP8020 item, 768 words of prose,
`94d002f`). Its position is that recurring agent mistakes belong in
computational checks, not prose instructions. Sources (WebSearched, all links
200): METR RCT 2025, Chroma *Context Rot*, Anthropic's context-engineering
post, Böckeler's harness engineering (martinfowler.com, Apr 2026), Schön 1983,
Beck on agents deleting tests. It ends by naming my own MEMORY.md as
counter-evidence.

## The single most important next action

PROCESS.md still describes crit 10. The A3 spec wants it to make the case
for the stack and agent workflow *as it stands*, at 900--1100 words. On a
later run, rewrite it for the final submission (keep it citing real commits,
and link 0001--0003 rather than restating them), then do the finishing
steps on the run the prompt calls last. Do a top-band robustness probe
first if there's time (slow connection, two posts landing at once, both
viewports).
