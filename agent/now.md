# Hand-off

## comp4020-final-liuru: ninth run --- CLAUDE.md's own rules + spec/README.md, the two remaining fresh-check options

Same crit source as all nine runs now
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged. 100.5h to cutoff, still a middle-of-week run
--- the prompt did not call this run the last one, so `PROCESS.md` and
`reflections/crit-8.md` stay untouched, same as every prior run. Working
tree was clean before and after; no code change was needed, so no commit.

**What this run did:** the eighth run's hand-off left two options
unexplored before resorting to a fourth variant of "read and confirm
consistency." Did both:

1. Re-read `CLAUDE.md`'s "rules that follow from good means small and
   quiet" list against current `src/` line by line (distinct from the
   README check the eighth run did --- the two documents say similar things
   but aren't the same text). All five hold: no accounts/login/counts/
   ranking (confirmed against `server.ts`/`templates.ts`, nothing of the
   kind exists); plain reverse-chronological (`db.ts`'s `ORDER BY id DESC`
   + `templates.ts` rendering traces in that order, newest first = oldest
   at the bottom, same as the eighth run's README check already found);
   no streak/notification features (none exist); traces permanent, no
   edit/delete/admin route (confirmed --- only `GET /`, `POST /trace`,
   `GET /readme/` exist in `server.ts`); six kinds fixed, no seventh
   (`KINDS` in `db.ts` is the same six, `isKind` is the only gate).
2. Re-read `spec/README.md` against `spec/trace.test.ts` and
   `spec/invariants.test.ts` as those files currently stand. Its claims
   ("the two things the course relies on", "everything else in `spec/` is
   yours", "the specs for crits 8, 9 and 10... run in this repo") all still
   match: `invariants.test.ts` checks exactly `/` and `/readme/`, nothing
   more; `trace.test.ts` is the "yours to write" layer on top, matching
   the file's own header comment about what it covers. No drift.

Also re-ran the full verification chain again rather than trusting the
eighth run's version to still hold: local server against a throwaway
`/tmp` `DATA_DIR` (`pnpm check`, 6/6 tests, clean typecheck), confirmed
the process actually stopped and the port freed after `kill` (first
`pkill` attempt exited 144 without actually stopping it --- had to `kill`
the PID directly and re-check `ss -ltnp`, worth remembering: `pkill -f` on
a command line containing `DATA_DIR=...` as an env-var prefix doesn't
reliably match here, use the PID), then `curl`'d the live
`https://comp4020-final-liuru.fly.dev/` and `/readme/` directly: 200 on
both, no redeploy.

**Why this matters for future runs:** that's now five independent
verification categories clean against an unchanged repo (display-layer
a11y/screenshots, infra-config/load-testing, README-vs-source,
CLAUDE.md-vs-source, spec/README.md-vs-spec-files). The eighth run's own
"don't reach for a fourth variant" caution was right, and now applies
doubly: there is no sixth category of "read two documents and confirm
they agree" left to invent that wouldn't be busywork. A tenth run with no
fresh lead should not manufacture a sixth variant of this same pattern.

## The single most important next action

No open defect. Five independent verification passes all clean against
current `main` (`d126c9a`). Still no live/real-time layer, no
server-side logging beyond Fly's defaults, no moderation --- crit 9/11's
job, not gaps to close early. Re-fetch whatever crit JSON the next run's
prompt actually names rather than assuming it's crit 9 by number, same
caution as the last eight hand-offs.

`PROCESS.md` still opens with "this is the first run against this repo"
and only cites first-run commits, even though nine runs now have made
real work happen since (five shipped fixes, five clean verification
passes). Still correctly untouched --- doctrine has `PROCESS.md` rewritten
as a *finishing* step --- but whichever run finishes crit 8 needs to
rewrite it as a genuine account of all nine runs, naming the verification
passes as real work, not silence.

If a future middle-of-week run truly has no fresh lead, the honest move
is now: (1) wait for crit 9's actual brief rather than guessing its
shape, or (2) a plain, explicitly-labelled "checked again, still clean"
note citing which of the five categories was re-verified --- not a sixth
invented category. Manufacturing a new axis of "read things and compare"
on a repo that hasn't changed is no longer a good use of a run.
