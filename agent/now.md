# Hand-off

## comp4020-final-liuru: seventh run --- still crit 8, different-angle verification

Same crit source as all six prior runs
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
fetched again and unchanged. 117.5h to cutoff, still a middle-of-week run.
Working tree was clean before and after; no code change was needed this
run, so no commit.

**What this run did, deliberately not the sixth run's routine:** the sixth
run's own hand-off warned that a seventh axe-core-plus-screenshot pass would
start being manufactured busywork, and suggested two concrete alternatives
--- load-test the SQLite write path, or re-read `fly.toml`/CI line by line
against the live app's actual behaviour. Did both, found nothing wrong in
either:

- Live app (`comp4020-final-liuru.fly.dev`, Fly machine `d8d10e7a406598`,
  deployment version 9) returns 200 on both `/` and `/readme/`, and its
  served HTML already carries the `visually-hidden` kind-glyph labels from
  `2dd79d3`, the most recent app-code commit --- confirms the deployed
  machine isn't stale against what's on `main`, not just assumed from a
  prior run's own claim to have deployed it.
- Read `fly.toml` and `.github/workflows/checks.yml` fresh against
  `src/server.ts`/`src/db.ts` rather than re-verifying prior fixes:
  `DATA_DIR`/volume mount, the CI `--tmpfs /data` substitution, the
  `!github.event.repository.private` gate on both `check` and `deploy`
  jobs, all still consistent with the doctrine comments explaining them.
  Nothing to fix.
- Load-tested the write path directly: started the real `src/server.ts`
  locally (not the dev-mode CI container) against a throwaway `/tmp`
  `DATA_DIR`, fired 60 concurrent `curl` POSTs to `/trace` from 7 distinct
  cookie identities, and confirmed all 60 landed (`grep -c` on the
  rendered wall matched 60 exactly) with a clean server log --- no crash,
  no silent drop, no corrupted row. Expected given `better-sqlite3`'s
  synchronous calls inside Node's single-threaded event loop (no other
  request can interleave mid-insert), but worth actually proving for an
  app whose whole point is concurrent strangers writing to one table,
  not just reasoning about it from the driver's docs. Also re-read
  `templates.ts`'s `escapeHtml` usage fresh: every user-text interpolation
  (trace text, the glyph's `title`, the kind label) is escaped; no gap.

**Why this matters for future runs:** this confirms the "pick a genuinely
different class of check" instruction from the sixth run's hand-off is a
real, repeatable move when a fresh a11y/screenshot pass would just be the
same routine a seventh time --- re-reading infra config against actual
behaviour, and load-testing the one write path a "shared wall" app's whole
premise depends on, are both legitimate, distinct categories from the
display-layer checks the first six runs already covered well.

## The single most important next action

No open defect. Still no live/real-time layer, no server-side logging
beyond Fly's defaults, no moderation --- crit 9/11's job, not gaps to close
early. Re-fetch whatever crit JSON the next run's prompt actually names
rather than assuming it's crit 9 by number, same caution as the last six
hand-offs.

`PROCESS.md` still opens with "this is the first run against this repo"
and only cites first-run commits, even though seven runs now have made real
work happen since. Still expected --- doctrine has `PROCESS.md` rewritten as
a *finishing* step, not touched incrementally --- but whichever run finishes
crit 8 needs to rewrite it as a genuine account of all seven runs: five
shipped fixes, two (the sixth and this one) were clean verification passes
that are worth describing as real work, not silence.

If a future middle-of-week run has no specific lead, the sixth and seventh
runs between them have now covered: static-page a11y/landmarks/heading
order (runs 1--5), infra-config-vs-behaviour and concurrent-write-path
load testing (this run). A third fresh angle worth trying before repeating
either family a third time: actually re-read `README.md`'s claims line by
line against current `src/` the way the `comp4020-crit7-liuru` lesson in
`MEMORY.md` describes (a scope claim can drift false as code changes and
nothing in `pnpm check` catches prose accuracy) --- this run skipped that
specifically to try the two suggested angles instead, so it's still a real
gap, not something already ruled out.
