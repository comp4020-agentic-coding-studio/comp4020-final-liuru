# Process overview

This is the first run against this repo: the final project's proof-of-life
crit. Everything below happened in one stateless Claude Code invocation,
working from `memory/` (this agent's own persistent notes, outside the repo)
and the two course-source documents named by this crit's prompt.

## From brief to concept

I read two things before writing any code: the crit's own JSON
(`crits/08-its-alive`) and the final project brief it points at. The crit's
bar is narrow on purpose — deployed, doing its "core thing," with a trace
that survives a return visit — and explicitly defers the real-time layer,
the feature list, and polish to later crits. The final brief is the wider
contract this slice has to grow into: multi-user, real-time, persistent, and
a definition of "good" the student actually has to argue for, not assume.
Its own notes on good gesture at the small web, home-cooked software, and
tools built for a handful of people rather than a market — reference points
I hadn't invented, so I spent a few minutes with real search results on each
before writing README.md's argument around them, rather than paraphrasing
the brief's gesture back at itself.

The concept — a shared wall where a visitor tags a short thought as one of
the Diamond Sūtra's six similes (dream, illusion, bubble, shadow, dew,
lightning) — isn't an arbitrary skin on a generic guestbook. Those six are
where this agent's own name in the course comes from (Tang Yin's Buddhist
name, 六如), and the theme sets a real constraint rather than a coat of
paint: everything the app shows is supposed to read as already passing, so
the wall couldn't have accounts, streaks, or a "which post is popular" sort
without contradicting its own premise. That's the actual design decision
behind [`ff0b374`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/ff0b374)'s
README: plain reverse-chronological, no ranking, no follow mechanism.

## Building the slice

[`bf52500`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/bf52500)
replaced the busybox placeholder with the actual app: plain `node:http` (no
framework — the whole route table is four branches) plus `better-sqlite3` for
the one table this needs. I chose against a framework deliberately, not by
default: the brief's own "start from the smallest schema that can carry the
core interaction" is a directive, not a suggestion, and a wall with one form
and one list doesn't need routing middleware or a template engine on top of
what `node:http` and a template-literal function already do. The Dockerfile
became a real multi-stage build — a `node:24-slim` builder stage with a
compiler installed only long enough to compile `better-sqlite3`'s native
binding, discarded before the runtime stage copies over just the compiled
`node_modules` and source. `pnpm-workspace.yaml` needed a second
`allowBuilds` entry for `better-sqlite3` itself, since pnpm blocks a
dependency's install script by default and the existing entry only covered
`esbuild`.

Persistence is the one thing this week's spec actually cares about
("find their trace still there when they come back"), so I tested it
directly rather than trusting the code: posted a trace through a real cookie
jar with `curl`, killed the server, started a fresh process against the same
`DATA_DIR`, and confirmed the same trace was still there — not a review of
the SQL, an actual restart. [`073f417`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/073f417)
turns that same promise, plus the validation the server does silently
(reject an unrecognised kind, reject empty text, cap length at 240
characters), into three tests that run against the app the same way the
course-supplied `invariants.test.ts` does — over HTTP, against whatever's
actually running, not against internal functions.

## Verifying what actually ships

`pnpm check` is not enough on its own to trust a Docker-based deliverable,
because it only proves the code is right when run directly with `node`, not
that the image CI and Fly will actually build and run behaves the same way.
So I built the real Dockerfile locally (`docker build`, the same one CI
runs), started the resulting image with `--tmpfs /data` exactly the way the
CI job does, and ran `pnpm check` a second time against that container over
HTTP — not the dev server. Both runs passed identically, which is the actual
evidence that what's committed is what will run in production, not an
assumption bridged by "well, it worked locally."

I also drove the running app with `agent-browser` rather than trusting a
curl response: submitted a real trace through the actual HTML form (not a
raw POST), screenshotted the result at both the marking viewports (1280×900
desktop, 390×844 phone), and read back `console`/`errors` to confirm nothing
was silently failing client-side. The wall renders correctly at both sizes,
and the "mine" highlight on a freshly-posted trace showed up as intended
before I trusted it in README's description of the feature.

## What this run didn't do

I didn't wire up real-time updates, a rate limit, or moderation — all three
are named explicitly in README.md as real gaps with a specific later crit
responsible for each, not oversights I missed. I also didn't invent a
"good" argument from nothing: the three sources cited in README (Robin
Sloan's home-cooked-software essay, the Small Technology Foundation's small-
web case, and small local-multiplayer game design) came from actual web
searches run this session, checked against what they say before being cited,
not recalled from memory and hoped to be accurate.

## What's next

Crit 9 asks for the real-time layer and a documented multi-user decision —
the wall currently updates only on reload, which is the one thing standing
between this slice and actually delivering the co-presence the brief argues
for. That's the concrete next step, not a vague "polish it" — see README's
own "what I deliberately didn't build yet" section.
