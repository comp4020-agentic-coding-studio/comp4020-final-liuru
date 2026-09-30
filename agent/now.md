# Hand-off

## comp4020-final-liuru: second run --- still crit 8, deepening not re-scoping

Same crit source as the first run
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged --- confirms the first run's hand-off guess was
wrong: the prompt doesn't switch to crit 9 the moment crit 8's finishing
steps are done. The week rule ("open for its final 168 hours... deepen it
in the middle") governs even after a run has already shipped a complete
pass; 159.5h to cutoff meant this was a middle-of-the-week run, not a
finishing one, so the job was to deepen what's there, not start crit 9's
real-time layer (still explicitly out of scope per this repo's own
`CLAUDE.md` and the brief).

**What "deepen" meant this run, concretely:** the app's own narrow bar
(deploy, core thing works, trace persists) was already met, so I did a real
fresh-eyes browser pass on the live app rather than re-verifying prior
work, per the standing lesson that only driving the actual rendered page
catches what `pnpm check` can't. Found two real, previously-unflagged bugs:

1. **Dark-mode contrast.** `templates.ts` sets `color-scheme: light dark`
   but `.sub`/`.when`/`.empty` used fixed `#666`/`#777` literals that don't
   adapt. Measured via a live screenshot pixel-sample against the browser's
   own dark canvas (`rgb(18,18,18)`, confirmed with `agent-browser --set
   media dark`) rather than assumed: contrast came out 3.3--4.2:1, below
   WCAG AA's 4.5:1. Fixed with `light-dark(#595959, #999)` --- 7.0:1 light,
   6.6:1 dark, both computed by hand with the sRGB-luminance script this
   memory already documents. (`c628797`)
2. **Duplicate H1 on `/readme/`.** The page chrome wrapped the parsed
   README in its own `<h1>About this app</h1>`, but README.md's own first
   line renders as *its own* `<h1>`, nested inside --- two H1s on one page,
   with the README's real H2s structurally orphaned under the wrong
   heading. Caught only by reading the actual rendered heading sequence
   (`querySelectorAll('h1,h2,...')`), not by `pnpm check` --- nothing in the
   suite asserts heading order, same gap the memory's `heading-order` note
   already names. Fixed by dropping the chrome's own H1 and letting the
   README's own H1 stand as the page title. (`d54402b`)

Both verified the same way as the first run's deploy: `sudo -n docker
build`/`run --tmpfs /data` (CI's own invocation), `pnpm check` against that
real image (not just the dev server), then `agent-browser` at both marking
viewports plus a dark-mode emulation pass, console/errors clean, then
pushed and `flyctl deploy --remote-only --ha=false -a comp4020-final-liuru`
(repo still private, so still mine to run), then re-verified against the
live URL specifically (heading count, computed color, console) rather than
trusting the local build. A stray trace from an earlier verification pass
("proof of life, week 9") is still the only real content on the wall and
survived both redeploys, confirming the volume persists across deploys as
expected.

## The single most important next action

No open defect --- the wall is live, correct in both color schemes, and its
`/readme/` has a clean heading outline. The next *real* content change
(the real-time layer, a documented multi-user decision) is crit 9's job,
not something to start speculatively; re-fetch whatever crit JSON the next
run's prompt actually names rather than assuming it's crit 9 by number.
Given this run showed a fresh browser pass on an "already shipped" page
still finds real bugs, a future middle-of-the-week run with no new brief
should default to another such pass (a different page/viewport/scheme
combination, or an axe-core run via the CDN-injection technique already
documented) before assuming there's nothing left to deepen.
