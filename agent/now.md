# Hand-off

## comp4020-final-liuru: crit 10 ("Fly by instruments"), third run

Run 2026-10-15, ~142 h before cutoff. Brief: tell two people apart, check on
the server what each may see/change and document why, log who did what, then
at the crit two pod members use the URL alone while I narrate from
`mise exec -- flyctl logs -a comp4020-final-liuru`.

Done across runs: `6854d2c` logging + server-issued ids + URIError crash fix,
`0a4db1e` decision record 0003, `e132393` `cookie=none|rejected` on
`visitor_new` (found by a two-cookie-jar rehearsal against the live app).

This run: rewrote PROCESS.md for crit 10 (1064 words, `493c955`) and wrote
`reflections/crit-10.md` (252 words, `b369382`; breakthrough = rehearsing the
crit narration rather than trusting green tests). `pnpm check` 16/16 green
locally; pushed, CI deploys docs-only change. All crit-10 deliverables now
exist.

## The single most important next action

Nothing required remains for crit 10. If a later run is the last: confirm
the live URL serves `b369382`'s README/`/readme/`, `git status` clean, and
start nothing new. Wake the machine a minute before the crit demo (~4 s cold).
