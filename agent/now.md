# Hand-off

## comp4020-final-liuru: third run --- still crit 8, deepening again

Same crit source as the first two runs
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged. 148.5h to cutoff, so still a middle-of-week
run per the week rule --- deepened again rather than starting crit 9's
real-time layer (still out of scope per this repo's own `CLAUDE.md` and
the brief).

**What this run found and fixed**, via the pattern the second run's
hand-off recommended (a fresh axe-core pass plus a boundary-condition
spec test, then look at what that test left on the page):

1. **Missing enforced-boundary test.** `CLAUDE.md` names the 240-character
   text cap as part of the "enforced" list, but `spec/trace.test.ts` never
   actually tested it. Added a test that posts an over-length string and
   checks the served page contains exactly the first 240 characters, not
   more. (`51e7a8f`)
2. **Missing `<main>` landmark on the wall page.** `renderReadme` wraps its
   body in `<main>`; `renderWall` didn't. A fresh axe-core injection (CDN
   `axe.min.js` technique, documented in `MEMORY.md`) against `/` found two
   real violations (`landmark-one-main`, `region`) that a static a11y pass
   done once before hadn't caught because nobody had re-run axe against
   this specific page since the H1 fix two runs ago. Fixed by wrapping the
   form and `ul.wall` in `<main>`; `/readme/` was already clean.
3. **Long unbroken text blows out mobile layout.** The new boundary test's
   own 300-character `x`-repeat POST, screenshotted at the 390×844 marking
   viewport, showed the trace list's `.when` (relative-time) column pushed
   fully off-screen --- `document.documentElement.scrollWidth` came back
   2213px against a 390px viewport. Root cause: `li.trace`'s CSS grid had
   no `min-width: 0` on the `.text` column, so its default `min-width: auto`
   overrode the fact that nothing was even setting `overflow-wrap` yet.
   Fixed with `overflow-wrap: anywhere; min-width: 0` on `li.trace .text`.
   Confirmed `scrollWidth` back to exactly 390px after. (`051ec4d`)

Verified the same way as the prior two runs: `sudo -n docker build`/`run
--tmpfs /data` (CI's own invocation), `pnpm check` against that real image,
then pushed and `flyctl deploy --remote-only --ha=false -a
comp4020-final-liuru` (repo still private), then re-verified against the
live URL specifically --- `<main>` present, mobile screenshot clean,
`scrollWidth` matching viewport, console/errors clean, and `pnpm check`
re-run with `APP_URL` pointed at the live app. The wall now carries three
traces (the original "proof of life, week 9" trace plus the two spec-test
traces this run's own `pnpm check` runs left behind), confirming the
volume survived a third redeploy.

## The single most important next action

No open defect. The next *real* content change (the real-time layer, a
documented multi-user decision) is crit 9's job --- re-fetch whatever crit
JSON the next run's prompt actually names rather than assuming it's crit 9
by number, same caution as the last two hand-offs.

Three fresh-eyes passes in a row have each found a real, previously-
unflagged bug (dark-mode contrast, duplicate H1, missing `<main>` landmark
plus a grid-overflow layout bug) by actually looking at the rendered page
rather than re-verifying prior fixes. A future middle-of-week run with no
new brief should keep defaulting to this rather than assuming there's
nothing left: pick a check not yet done (axe-core against a scheme/
viewport combination not yet tried, a keyboard-only pass through the form,
a second fresh read of README.md's claims against current source) before
concluding the deepen pass has nothing to do. If a pass genuinely turns up
nothing for two runs in a row, that's the point to say so plainly rather
than manufacturing busywork.
