# Process overview

This is the final-project account: why the wall is built the way it is, how
the work was run, and where corrections landed. The crit-by-crit stories are
in this file's history at
[`f16f570`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/f16f570)
(crit 8),
[`bf05164`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/bf05164)
(crit 9) and
[`493c955`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/493c955)
(crit 10). Commit links go to
[the repo's history](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commits/main).

## From brief to a definition of good

The brief asks what would make the app good rather than what it should do.
I answered the first question before writing code. The wall's premise comes
from this agent's own name, 六如, the Diamond Sūtra's six similes for things
that pass. A wall whose premise is "everything here is already passing"
can't have accounts, streaks or a popularity sort without contradicting
itself, so the theme rules out most of what the median multi-user app
reaches for.

The sources README cites are Sloan's home-cooked app, the Small Technology
Foundation's small web and *Pico Park*'s couch co-op. They pulled in two
directions, and I had to take a position between them. Sloan and the small
web argue for software that is finished and doesn't chase anyone. The brief
and *Pico Park* argue for co-presence, an app that is better because others
are in it right now. The wall takes co-presence
in its smallest form: traces arrive live, and one line of text says whether
you're alone, never how many are here.
[`ff0b374`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/ff0b374)
wrote that argument into README and turned it into `CLAUDE.md`'s rules in
the same commit, so the argument had rules attached from the start.

## The case for the stack

[Decision record 0001](docs/decisions/0001-plain-node-and-sqlite.md) has
the full reasoning. In short: plain `node:http`, template-literal HTML and
`better-sqlite3` on the Fly volume, with no framework and no build step
([`bf52500`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/bf52500)).
`fly.toml` fixes one 256 MB machine and one volume, which rules out a
separate database server. The app has four routes, and a framework would be
more code than the routes it serves.

The trade-off I weighed hardest was agent-specific. A framework gives an
agent a well-worn path, so it writes plausible code quickly. It also gives
it a large surface to be confidently wrong about. With a few hundred lines
of plain Node, each stateless run can read the entire server before it
changes anything, and a reviewer can too. The cost is that everything is
hand-written: body parsing, cookies, routing. That cost turned up in later
commits, as two failures a framework would have handled for me (below).

Real-time is Server-Sent Events from the same server
([`f498c1f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/f498c1f)).
Visitors only need the server to push to them; posting is an ordinary
form POST, so WebSockets' two-way channel would add nothing, and the page
still works with JavaScript off. 0001 had named SSE as the plan in crit 8,
along with the conditions under which it would stop being enough. None came
up, so crit 9 needed a status line in 0001, not a new record. The in-memory
fan-out is only correct because `fly.toml` pins one machine;
[0002](docs/decisions/0002-presence-without-a-count.md) says so.

## The agent workflow

Every run is a stateless Claude Code invocation. Continuity is the commit
history plus `memory/`, this agent's notes outside the repo: a hand-off
naming one next action, and a curated list of lessons from earlier runs.
Three habits shaped the work more than any single prompt.

**Decision record before code.** For presence (0002,
[`4b524f9`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/4b524f9))
and identity (0003,
[`0a4db1e`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/0a4db1e))
the record came first, so the implementation had something to be held to.
Both times `CLAUDE.md` did most of the deciding. It forbids reader counts,
which turned "what should presence show?" into "what is the smallest honest
answer to *am I alone*?". It forbids accounts, which left an anonymous
cookie as the only identity consistent with README.

**A different category each run.** Most of what later runs found was
invisible to a green `pnpm check`: dark-mode contrast at 3.3:1
([`c628797`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/c628797)),
a highlight that only meant something visually
([`b953074`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/b953074)),
and a citation whose link resolved but didn't name the game
([`61c58f8`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/61c58f8)).

**Verify as the marker will.** Before the first deploy I built the real
Dockerfile and ran the suite against the container, the way CI does. For
crit 10 I rehearsed the log narration with two `curl` cookie jars and read
`flyctl logs` cold. That rehearsal showed a forged cookie logged exactly
like a first visit, which
[`e132393`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/e132393)
fixed.

## Corrections landed in the harness

When a run got something wrong, the fix went into `spec/` or `CLAUDE.md`
where it could, not just into the code. `research-note.md` argues this as
a general position.

- **Untested promises.** `CLAUDE.md` called the 240-character cap enforced
  when nothing tested it.
  [`51e7a8f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/51e7a8f)
  added the test. The 300-character string it left on the wall then blew a
  grid column out to 2213 px on a phone, which
  [`051ec4d`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/051ec4d)
  fixed.
- **Hand-rolled code under hostile input.** A malformed percent-escape in a
  cookie killed the server outright. `spec/identity.test.ts` now sends one
  and checks the next request is still answered
  ([`6854d2c`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/6854d2c)).
  A 50 MB POST doubled the machine's memory.
  [`9940a9b`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/9940a9b)
  caps bodies at 8 KB with a 413, adds a test, and names the cap in
  `CLAUDE.md`'s enforced list. Both were costs of choosing plain Node.
- **A policy question that was a bug.** A hand-off called "replays up to
  200 traces" a policy to decide. The query actually replayed the *oldest*
  200 to any stream that arrived without a cursor.
  [`c226f4b`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/c226f4b)
  fixed it with a test, and
  [`57b6732`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/57b6732)
  recorded the remaining cap in 0002.
- **A flaky test.** One live test failed about one run in six, because
  other spec files post to the same server in parallel.
  [`d5ef286`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/d5ef286)
  asserts only on its own uniquely tagged trace.
- **A slow connection.** The top band asks for use the app wasn't designed
  for. The live submit cleared the input before `fetch` returned, so a
  dropped connection lost the thought.
  [`460bf7e`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/460bf7e)
  restores the text and falls back to a plain form post. I checked it in a
  browser by forcing `fetch` to reject. Forty concurrent posts from distinct
  cookies all landed.

## What stays judged

Whether the wall feels like the six similes
rather than a message board with a select box is a judgement, made at each
crit. So is whether a plain reverse-chronological list stays legible once a
room full of people has used it, which the showcase will test. No moderation and no delete remain deliberate gaps, named in README. A
spammed wall at the showcase would be the evidence that one of them needs
an argument of its own.
