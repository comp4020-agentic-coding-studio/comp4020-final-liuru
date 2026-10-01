# Hand-off

## comp4020-final-liuru: fifth run --- still crit 8, deepening

Same crit source as the first four runs
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged. 135.5h to cutoff, so still a middle-of-week
run per the week rule --- deepened again rather than starting crit 9's
real-time layer.

**What this run checked, and what it found:** a fresh read of
`src/templates.ts` turned up a gap in the same category the fourth run
found (a visual-only state with no accessible equivalent), but on a
different, more central feature this time: each trace's kind glyph (☁ ◈ ○
◐ • ⚡) carried "which of the six similes this is" only via a `title`
tooltip on a plain `<span>` --- a generic element with no naming role,
which browsers/screen readers don't reliably read out the way they would
an `alt` or `aria-label`. Fixed by marking the glyph `aria-hidden="true"`
and adding a `.visually-hidden` "tagged as `<label>`: " span before the
trace text, same pattern already established for the "mine" highlight.
Verified the actual rendered markup (not just the CSS) carries it, both
locally and on the live app after deploy. (`2dd79d3`)

**Fly deploy hit new, previously-undocumented friction:** `flyctl deploy`
failed six times in a row with "insufficient memory available to fulfill
request on the current host" while the one machine was `stopped` (Fly
scale-to-zero). The volume pins the machine to one physical host, and an
in-place rolling update on a *stopped* machine apparently needs more
momentary headroom on that host than restarting the existing image does
--- `flyctl machine start <id>` (plain restart, no image change) succeeded
immediately, and once the machine was `started` rather than `stopped`,
the very next `flyctl deploy` succeeded on the first try. Worth trying
before assuming a deploy failure like this is a real infra outage: start
the machine first, then deploy into an already-running machine rather
than a stopped one.

Verified the same way as prior runs: `sudo -n docker build`/`run --tmpfs
/data`, `pnpm check` against that real image (6 tests, all green), then
pushed, started the stopped machine, deployed, and re-verified against
the live URL specifically --- posted a fresh trace through the real form,
confirmed the new markup (`aria-hidden` glyph + visually-hidden kind
label) rendered on it, reloaded to confirm persistence, console/errors
clean both times.

## The single most important next action

No open defect. Still no live/real-time layer and no server-side logging
beyond Fly's defaults --- both are explicitly crit 9/11's job, not a gap to
close early. Re-fetch whatever crit JSON the next run's prompt actually
names rather than assuming it's crit 9 by number, same caution as the
last four hand-offs.

`PROCESS.md` still opens with "this is the first run against this repo"
and only cites first-run commits, even though five runs now have made
real fixes since (dark-mode contrast, the H1, the `<main>` landmark, the
boundary test, the "mine" a11y fix, this run's kind-glyph a11y fix).
That's still expected --- doctrine has `PROCESS.md` rewritten as a
*finishing* step, not touched incrementally --- but whichever run
finishes crit 8 needs to rewrite it as a genuine account of all five
runs, not just polish the first-run draft in place.

Five fresh-eyes passes in a row have each found at least one real,
previously-unflagged thing by actually looking at the rendered
page/markup rather than re-verifying prior fixes. The category that's
paid off twice now (fourth run: the "mine" highlight; this run: the kind
glyph) is "a CSS/visual-only distinction between otherwise-identical
elements, with no textual/ARIA trace" --- worth checking again for any
*new* visual distinction added later (e.g. whatever crit 9's real-time
layer ends up rendering), not assuming this repo has exhausted the
category just because two instances are now fixed. This run's own
checks (axe-core clean on the live page, keyboard/DOM verification of the
new markup, Fly deploy-while-stopped friction) don't need repeating
unless the underlying code or deploy setup changes.
