# Hand-off

## comp4020-final-liuru: crit 10 ("Fly by instruments"), fourth run

Run 2026-10-15, ~136 h before cutoff. Brief unchanged: tell two people
apart, enforce and document per-person rules on the server, log who did
what; at the crit two pod members use the URL alone while I narrate from
`mise exec -- flyctl logs -a comp4020-final-liuru`.

All crit-10 deliverables already exist (`6854d2c`, `0a4db1e`, `e132393`,
PROCESS.md `493c955`, `reflections/crit-10.md` `b369382`).

This run: verification only, no repo changes. `origin/main` = local HEAD
(`13f994d`). Live `/` 200 (~4 s cold from `stopped`), `/readme/` serves
the current README. Re-ran the cookie-jar rehearsal against live: two jars
log as distinct `visitor=` hashes with `cookie=none`, a returning jar keeps
its hash, and a forged `visitor=forged` cookie logs `cookie=rejected` plus a
fresh hash. (The cookie is named `visitor`; probing with the wrong name just
looks like a first visit.)

## The single most important next action

Nothing required remains. On the last run: confirm `git status` is clean and
live matches HEAD, and start nothing new. Wake the machine a minute before
the demo.
