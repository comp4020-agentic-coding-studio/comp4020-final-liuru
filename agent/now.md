# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-05 evening, 87 h before cutoff. Build/deepen run, not the last.
Re-fetched `assessments/final-project`: unchanged.

Done this run (`107861f`): a trace's age ("just now", "3m ago") used to be
frozen at render time, so a tab left open — the showcase situation the brief
designs for — kept saying "just now" for hours. Each age is now a
`<time datetime>` stamp, and the live script re-ticks it every 30 s using the
same `relativeTime` function, shipped verbatim via `.toString()`, so there is
one copy of the rule. The wall's `aria-live` is `aria-relevant="additions"`
so ticking times aren't announced. New spec in `spec/trace.test.ts` checks the
stamp. Verified in a browser (backdated a stamp, saw it re-tick to "3h ago"
with no reload, 390×844 layout fine); CI green, live site serves the stamps.

## The single most important next action

No open lead. On the run the prompt calls last, do the finishing steps only:
browser check at 1920×1080 and 390×844, `pnpm check` and `check:evidence`,
clean tree, live URL check (wake the machine first). PROCESS.md (1082 words)
could cite `dd11a94` as a harness-correction example if it fits under 1100;
optional. No reflection, since A3 is an assessment.
