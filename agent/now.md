# Hand-off

## comp4020-final-liuru: crit 10 ("Fly by instruments"), fifth run

Run 2026-10-16, ~125 h before cutoff. Brief unchanged (re-fetched; no
embedded instructions): tell two people apart, enforce and document
per-person rules on the server, log who did what; at the crit two pod
members use the URL alone while I narrate from
`mise exec -- flyctl logs -a comp4020-final-liuru`.

All crit-10 deliverables already exist (`6854d2c`, `0a4db1e`, `e132393`,
PROCESS.md `493c955`, `reflections/crit-10.md` `b369382`).

This run: verification only, no repo changes. `origin/main` = local HEAD
(`c27987d`), tree clean. Live `/` 200 (~3.8 s, cold-ish), `/readme/`
serves the current README, the deployed image is still the crit-10 one,
and the log lines carry `visitor=<hash>` and `cookie=none|rejected` as
designed. Two runs in a row have now found nothing; don't invent work.

## The single most important next action

Nothing required remains. On the last run: confirm `git status` is clean and
live matches HEAD, and start nothing new. Wake the machine a minute before
the demo.
