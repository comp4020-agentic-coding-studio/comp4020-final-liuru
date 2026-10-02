# Hand-off

## comp4020-final-liuru: eighth run --- the README-vs-source check the seventh run left undone

Same crit source as all eight runs now
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged. 111.5h to cutoff, still a middle-of-week run
--- the prompt did not call this run the last one, so nothing was finished
or started fresh; `PROCESS.md` and `reflections/crit-8.md` stay untouched,
same as doctrine says. Working tree was clean before and after; no code
change was needed, so no commit.

**What this run did:** the seventh run's hand-off named one specific gap it
deliberately skipped --- reading `README.md`'s own claims line by line
against current `src/`, the way the `comp4020-crit7-liuru` README-drift
lesson in `MEMORY.md` describes. Did that fresh, claim by claim:

- "plain reverse-chronological... oldest at the bottom" against
  `db.ts`'s `ORDER BY id DESC` --- consistent (DESC puts the newest id
  first in the rendered list, so the oldest visible trace sits at the
  bottom; this isn't the bug-shaped reading it first looks like).
- "the server silently drops it rather than storing garbage" against
  `server.ts`'s `if (isKind(kind) && text.length > 0) addTrace(...)` with
  no `else` --- matches exactly, and `spec/trace.test.ts` exercises both
  the bad-kind and empty-text paths over real HTTP.
- "capped at 240 characters" against both the server's
  `.slice(0, 240)` and the form's `maxlength="240"` --- matches, and is
  the one claim with its own boundary test (`51e7a8f`).
- "no names, colours, or avatars... yours vs everyone else's" against
  `templates.ts`'s `KIND_META`/`.mine` class --- matches; the only
  per-visitor distinction is the background tint plus the
  `visually-hidden` "yours: " span, no colour-per-person scheme.
- "no real-time... no server-side logging... no moderation" against
  `server.ts` --- matches, nothing resembling any of the three exists.
- "traces persist in SQLite on the app's own volume" against `db.ts`'s
  `DATA_DIR`/WAL pragma --- matches, consistent with `fly.toml`'s volume
  mount already re-checked on the seventh run.

No drift found --- a genuinely clean result, not a skipped check. Also
re-ran the full verification chain one more time rather than trusting the
seventh run's version-9 deployment claim to still hold: started
`src/server.ts` locally against a throwaway `/tmp` `DATA_DIR`, ran
`pnpm check` against it (6/6 tests, clean typecheck), shut the server down
and confirmed nothing was left listening on 8080, then `curl`'d the live
`https://comp4020-final-liuru.fly.dev/` and `/readme/` directly and got
200 on both without redeploying anything.

**Why this matters for future runs:** this is the third distinct
verification category (after display-layer a11y/screenshots on runs 1--6,
and infra-config/load-testing on run 7) to come back clean on this small
an app. That's a real signal, not an excuse to stop checking --- but it
does mean a ninth run with no fresh lead should not reach for a fourth
variant of "read things and confirm they're consistent" against a repo
that hasn't changed. If nothing else surfaces, the honest move is a short,
explicitly-labelled clean-pass note like this one, not inventing a
defect to have something to fix.

## The single most important next action

No open defect, and now three independent verification passes (a11y/
display, infra/load, README-accuracy) all clean against the current
`main` (`f52e1e5`). Still no live/real-time layer, no server-side logging
beyond Fly's defaults, no moderation --- crit 9/11's job, not gaps to close
early. Re-fetch whatever crit JSON the next run's prompt actually names
rather than assuming it's crit 9 by number, same caution as the last seven
hand-offs.

`PROCESS.md` still opens with "this is the first run against this repo"
and only cites first-run commits, even though eight runs now have made
real work (five shipped fixes, three clean verification passes) happen
since. Still correctly untouched --- doctrine has `PROCESS.md` rewritten as
a *finishing* step --- but whichever run finishes crit 8 needs to rewrite
it as a genuine account of all eight runs, naming the verification passes
as real work, not silence.

If a future middle-of-week run truly has no fresh lead, four real options
remain before manufacturing anything: (1) wait for crit 9's actual brief
rather than guessing its shape, (2) re-read `CLAUDE.md`'s own "rules that
follow from good means small and quiet" list against current behaviour
(not yet done as its own explicit pass, distinct from the README check
just completed --- CLAUDE.md and README.md say similar things but aren't
literally the same document), (3) check whether `spec/README.md` (the
file documenting the spec's own split between enforced and judged) still
matches `spec/trace.test.ts` and `spec/invariants.test.ts` as those files
have grown, or (4) just confirm live/local/Docker agreement again, which
this run and the seventh both already did cleanly twice running.
