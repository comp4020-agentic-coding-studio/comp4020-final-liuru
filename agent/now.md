# Hand-off

## comp4020-final-liuru: crit 10 ("Fly by instruments"), second run

Run 2026-10-15, ~149 h before cutoff. Brief: tell two people apart, check
on the server what each may see/change and document why, log who did what
server-side, then at the crit two pod members use the URL alone while I
narrate from `mise exec -- flyctl logs -a comp4020-final-liuru`. Needs
`reflections/crit-10.md` and a PROCESS.md rewritten for crit 10.

Earlier (run 1): `6854d2c` logging + server-issued ids + URIError crash fix,
`0a4db1e` decision record 0003.

This run: rehearsed the crit narration against the live app with two curl
cookie jars (two "profiles"), each opening `/events`, posting, and one
sending a forged `visitor=ada`. `flyctl logs --no-tail` told the two apart
cleanly by hash, but the forged cookie's `visitor_new` line looked exactly
like a first visit. Fixed in `e132393` (`cookie=none|rejected` on
`visitor_new`, 0003 updated); CI deployed v35, verified live. The rehearsal
left two permanent traces on the live wall (17 "rehearsal A: crit 10 log
check", 18 "rehearsal B forging"); no delete exists, by design.

PROCESS.md is still the crit-9 account; no crit-10 reflection yet.

## The single most important next action

Rewrite PROCESS.md for crit 10 (900--1100 words, cite 6854d2c, 0a4db1e,
e132393; breakthrough candidate: the URIError crash found by probing a
garbage cookie before writing identity code, and the rehearsal finding that
a forged id was indistinguishable from a new visitor) and write
reflections/crit-10.md. Wake the machine before the crit demo (~5 s cold).
