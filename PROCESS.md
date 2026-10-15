# Process overview

This is the crit-10 account. Crits 8 and 9 built a deployed wall where a
visitor tags a short thought as one of the Diamond Sūtra's six similes, then
made it live over Server-Sent Events with a presence line that never shows a
number; those stories are in this file's history at
[`f16f570`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/f16f570)
and
[`75cdcdd`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/75cdcdd).
The work runs as a series of stateless Claude Code invocations, each starting
from `memory/` (this agent's notes, outside the repo) and the crit's JSON
brief. Commit links go to
[the repo's history](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commits/main).

## From brief to decision

The crit-10 brief asks for three things. The app has to tell two people
apart, each in their own browser with no shared cookies. What each may see
and change has to be decided, checked on the server and written down. And at
the crit I don't touch the app: two pod members use the URL alone while I
narrate what they're doing from `flyctl logs`. If I can't tell them apart in
the logs, or one can change what belongs to the other, that's the finding.

The wall half-had this already. Since crit 8 a visitor has been a random id
in a long-lived `HttpOnly` cookie, used only to mark your own traces as
yours. But the server logged nothing except its port and uncaught errors, so
the narration the brief asks for was impossible.

[Decision record 0003](docs/decisions/0003-a-person-is-a-cookie.md), in
[`0a4db1e`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/0a4db1e),
weighs three answers to "who counts as a person": an account, a pseudonym
typed on first visit, and the anonymous browser cookie. As in crit 9, the
repo's own `CLAUDE.md` did most of the deciding. It forbids accounts, and a
pseudonym is the start of the profile README says the cookie exists to
avoid. The brief's "anything they need to get in has to be on the page"
pointed the same way, since the cookie needs no step at all. The cost is
named in the record: clear your cookies and you're someone new, with no way
back to your old traces.

Authorisation turned out to be the absence of a route. `CLAUDE.md` makes a
trace permanent once posted, so nobody may change or remove one, their own
included. The server answers four routes and nothing else, so an edit or
delete attempt gets a 404, and "yours" is computed per request on the
server, changing only how a trace renders for you, never what you can do to
it.

## Building the instruments

[`6854d2c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/6854d2c)
adds `src/log.ts`: one line per request and per event on stdout, tagged
with a short request id so a `POST /trace` and the `trace_posted` inside it
group together. The question that shaped it was what the log must never
hold. The cookie is the only credential a visitor has, so whoever reads the
log could post as them. The log names a visitor by the first eight hex
digits of the cookie's SHA-256 instead, enough to tell two apart and useless
for impersonating either. No IPs or user agents, for the same profile
reason. A trace's text is logged, since it's already public on the wall, but
escaped and quoted, so a newline in it can't forge a second log line.

The same commit tightens identity: the server now only accepts a cookie
shaped like an id it could have issued. A hand-typed `visitor=ada` is
replaced rather than adopted, so nobody picks their own identity.

Before writing any of that, I sent the running server a cookie with a broken
percent-escape, to see what a stranger's garbage would do to the code I was
about to change. It killed the process. `decodeURIComponent` threw a
`URIError` outside the route's own error handling, and a plain `node:http`
server has nothing above that to catch it, so one malformed request would
have taken the wall down for everyone until Fly restarted the machine. The
fix is a try/catch in the cookie parser, and `spec/identity.test.ts` now
sends that cookie and checks the server answers the next request too. The
same file pins down the rest of 0003: two cookies see the same trace with
"mine" on only the poster's copy, an invented id gets a fresh one back, and
`DELETE`, `PUT` and `POST /trace/<id>` all 404 while the trace survives.
`CLAUDE.md`'s enforced list names the file, and its logging rule says every
new route adds its line, so a future feature can't go dark in the log.

## Rehearsing the narration

Tests prove the rules hold. They don't prove the log reads well enough to
narrate from, which is what the crit actually tests. So I rehearsed it
against the deployed app without a browser: two `curl` cookie jars stand in
for the two Chrome profiles. Each opened `/events`, each posted a trace, and
one then sent a forged `visitor=ada`. Then I read `flyctl logs --no-tail`
cold, as I will at the crit.

The two visitors came apart cleanly by hash, from their first `visitor_new`
line through their stream opening and their posts. The forgery didn't. The
server did the right thing, replacing the cookie, but its log line was a
plain `visitor_new`, identical to a first visit. Narrating from that, I'd
have said "a third person just arrived" when what happened was someone
trying to be someone they weren't, the exact event the brief's failure
condition is about.
[`e132393`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/e132393)
adds `cookie=none` or `cookie=rejected` to that line and a sentence to 0003
saying what each means. CI deployed it and the live log now says which.

The rehearsal left two permanent traces on the live wall, labelled as
rehearsal. There's no delete, by design, so they stay; that's a small,
honest instance of the cost 0003 names.

## What the crit will test

Before the crit I'll open the URL a minute early, since a cold start takes
about four seconds. The first `visitor_new` after each classmate opens the
page is their introduction, and from there every line they cause carries the
same eight characters. If either tries to change the other's trace there's no
route to try it on, and if either edits their cookie the log says
`cookie=rejected`. The pod will argue for the option I didn't pick, most
likely a pseudonym, since a name in the log narrates better than a hash.
That's real, and 0003 gives it up on purpose: the wall would rather be hard
to narrate than start keeping names.
