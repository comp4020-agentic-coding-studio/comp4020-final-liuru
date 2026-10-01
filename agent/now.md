# Hand-off

## comp4020-final-liuru: fourth run --- still crit 8, deepening

Same crit source as the first three runs
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged. 141.5h to cutoff, so still a middle-of-week
run per the week rule --- deepened again rather than starting crit 9's
real-time layer (still out of scope per this repo's own `CLAUDE.md` and
the brief).

**What this run checked, and what it found:**

Three fresh-eyes passes this run turned up nothing new: axe-core against
dark mode + the 390×844 mobile viewport (a combination not yet tried) flagged
`color-contrast` on the muted `.sub`/`.when` text, but that's the same
UA-dark-canvas false positive documented in `MEMORY.md` already --- axe can't
resolve `background-color: rgba(0,0,0,0)` (the unset default that lets the
browser paint its own dark canvas) and assumes white; a screenshot pixel-
sample gave the real background (`rgb(18,18,18)`) and the hand-computed
contrast is 6.58:1, comfortably past AA. A keyboard-only pass (Tab through
readme link → select → input → button, arrow-key to change the select,
type, Enter to submit) worked cleanly end to end. A re-check of README.md's
and CLAUDE.md's claims against current source (ordering, no accounts/edit/
delete, no live layer, no logging beyond defaults) all still held.

**What it found and fixed:** the "mine" highlight (the CSS that lets a
visitor spot their own trace again, the feature README's "you can find your
own trace" line describes) was a `background` color difference only ---
nothing exposed it to assistive tech, and axe-core doesn't flag a missing
accessible-equivalent-of-a-visual-only-feature the way it flags a contrast
ratio or a missing landmark. Added a `.visually-hidden` "yours: " span
before the trace text on a visitor's own entries. (`b953074`)

Verified the same way as the prior three runs: `sudo -n docker build`/`run
--tmpfs /data` (CI's own invocation), `pnpm check` against that real image,
then pushed and `flyctl deploy --remote-only --ha=false -a
comp4020-final-liuru` (repo still private), then re-verified against the
live URL specifically --- posted a fresh trace through the real form,
confirmed the visually-hidden span renders on it, console/errors clean.

**Tooling note for next time:** backgrounding the local dev server with a
trailing `&`/`disown` in the same compound command as a `pkill` of the
previous instance produced a spurious exit code 144 and no listening
process (nothing fatal, just confusing) --- splitting "kill old, sleep,
start new in its own command" into separate tool calls was reliable.

## The single most important next action

No open defect. The next *real* content change (the real-time layer, a
documented multi-user decision) is crit 9's job --- re-fetch whatever crit
JSON the next run's prompt actually names rather than assuming it's crit 9
by number, same caution as the last three hand-offs.

One more thing worth flagging for whichever run finishes crit 8: `PROCESS.md`
still opens with "this is the first run against this repo" and only cites
commits from that first run, even though three more runs since have made
real fixes (dark-mode contrast, the H1, the `<main>` landmark, the boundary
test, this run's accessible-mine-label). That's expected to go stale mid-week
--- doctrine has `PROCESS.md` rewritten as a *finishing* step, not touched
incrementally --- but the run that finishes crit 8 needs to rewrite it as a
genuine account of all four runs, not just polish the first-run draft in
place.

Four fresh-eyes passes in a row have each found at least one real,
previously-unflagged bug by actually looking at the rendered page/markup
rather than re-verifying prior fixes, with this run's finding (a
visual-only feature with no accessible equivalent) a new category distinct
from the contrast/landmark/layout bugs the first three runs found. A future
middle-of-week run with no new brief should keep defaulting to this: pick a
check not yet done (a different viewport×scheme combination, a different
interaction path, a different "does the visual-only state have a non-visual
equivalent" question) before concluding the deepen pass has nothing to do.
This run's own three clean checks (axe dark+mobile, keyboard-only submit,
README/CLAUDE.md claims-vs-source) are now done and don't need repeating
unless the underlying code changes.
