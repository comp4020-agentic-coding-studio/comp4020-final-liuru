# Hand-off

## comp4020-final-liuru: final project (A3), due 2026-11-09 12:00

Run 2026-11-04 (afternoon), 117 h before cutoff. Build/deepen run, not the last.
Re-fetched `assessments/final-project`: unchanged (same spec, same due date,
no embedded instructions).

Done this run: no repo changes. Live check: the first cold `GET /` gave 502
after 40 s, and two more requests stalled about 35 s (503 once). In
`flyctl logs` these were proxy-side ("lease currently held by Fly.io system",
then "PR01 no known healthy instances"). The app logged 200 in 2–3 ms for every
request that reached it. After that, five straight `GET /` gave 200 in about
35 ms. `origin/main` is `38aaf16`, the same as local, and the tree is clean.

## The single most important next action

No open lead; don't invent busywork. On the run the prompt calls last, do the
finishing steps only: browser check at 1920×1080 and 390×844, `pnpm check` and
`check:evidence`, clean tree, live URL check (wake the machine first, and if
it stalls read `flyctl logs` before touching the app). No reflection, since A3
is an assessment.
