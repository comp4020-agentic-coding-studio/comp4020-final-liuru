# Process overview

This is the crit-9 account. Crit 8's slice (a deployed wall where a visitor
tags a short thought as one of the Diamond Sūtra's six similes, persisted in
SQLite on a Fly volume) is the starting point; its full story is in this
file's history at
[`f16f570`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/f16f570).
As before, the work runs as a series of stateless Claude Code invocations,
each starting from `memory/` (this agent's notes, outside the repo) and the
crit's JSON brief. Commit links go to
[the repo's history](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commits/main).

## From brief to decision

The crit-9 brief asks for two things: a change one person makes reaches
everyone else within about a second, without a reload; and one multi-user
behaviour decision, written down with the options weighed and the cost of
the one chosen. It is explicit that the transport isn't the decision. That
matched where crit 8 left things:
[decision record 0001](docs/decisions/0001-plain-node-and-sqlite.md) had
already named Server-Sent Events from the same `node:http` server as the
plan, and named the conditions under which it would stop being enough
(client-to-server streaming, or fiddly hand-rolled fan-out). Neither came up,
so the transport needed a status line in 0001, not a new record.

The decision that did need one was presence. Of the brief's examples (what
reaches others live, who else is visible, simultaneous edits, what a
returning visitor sees), simultaneous edits don't exist here, since a trace
is permanent and nobody edits anything. Presence is the one where README's
own argument pulls against the brief. The final-project brief wants an app
that's better because other people are using it right now, and on a live
wall a stranger who reads without posting is invisible. But README defines
good as small and quiet, and the repo's `CLAUDE.md` turns that into a rule:
no visible reader counts.

I wrote [decision record 0002](docs/decisions/0002-presence-without-a-count.md)
first, in
[`4b524f9`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/4b524f9),
before any code, so the implementation had something to be held to. It
weighs four options: no presence at all, an exact count, per-visitor markers
(cursors, a typing indicator), and the one chosen, a single line of plain
text with three states --- you're the only one here, someone else is here, a
few others are. The rule in `CLAUDE.md` did real work here. Without it the
exact count is the default every real-time demo reaches for; with it, the
question became what the smallest honest answer to "am I alone?" is. The
record also says what the choice costs: the wall can't tell two visitors
from twenty, an open tab keeps the scale-to-zero machine awake, and the
in-memory fan-out is only correct because `fly.toml` pins one machine.

## Building the live layer

[`f498c1f`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/f498c1f)
adds `GET /events`. Three details came from the decision rather than the
transport:

- **Presence counts visitor cookies, not connections.** Otherwise your own
  second tab tells you someone else is here, which would be the one outright
  lie the line could tell.
- **Each trace is rendered per listener.** The "yours" marking depends on
  who's looking, so the server renders the same `renderTrace` the page uses
  once for each open stream, rather than sending JSON and duplicating the
  template in client code.
- **Nothing goes missing in a gap.** Every trace event carries its row id,
  which `EventSource` sends back as `Last-Event-ID` on reconnect, and the
  page passes the newest id it was rendered with, so a trace posted between
  page load and stream open is replayed too.

The page still works with JavaScript off: the form posts and reloads as it
did in crit 8. With JavaScript, posting goes through `fetch` and your own
trace comes back over the stream like everyone else's; if the stream is
down, the form falls back to a plain post. New traces land at the top in a
polite live region and the presence line is a `role="status"`, so a
screen-reader user hears both changes. Arrivals get no sound, no title
badge and no "new" highlight, since `CLAUDE.md` rules out anything that exists to bring
someone back.

## Grounding and correcting it

The same commit turns the decision record's claims into tests.
`spec/live.test.ts` parses the event stream over plain HTTP against the
running app: a trace from one cookie reaches another cookie's stream within
a second, the "yours" marking appears only on the poster's own stream, a
reconnect with `Last-Event-ID` gets the missed trace and not the one it
already had, and presence moves from alone to "someone else" to "a few
others", stays at "someone else" when the same visitor opens a second tab,
and never contains a digit. `CLAUDE.md`'s enforced list now names all of
these, so a future run that "improves" presence into a count fails the
suite rather than quietly passing.

Then a real browser. I opened the wall in `agent-browser`, set a marker
variable on `window`, and posted from `curl` under a different cookie. My
first attempt never arrived, and before suspecting the stream I checked the
request: I had built the URL as `//trace`, which 404s. With the URL fixed,
the trace appeared in the untouched tab within half a second, and the marker
survived, which proves no reload happened. Two background `curl` streams
moved the presence line through all three states, and closing them brought
it back to "only one". Posting from the form added the trace marked as
mine without a reload, cleared the input, and logged no page errors; a
screenshot at the 390 px phone width showed the presence line sitting
quietly between the form and the wall. Last, I built the real Dockerfile and ran the full suite against the
container with a throwaway `/data`, exactly as CI will, since CI now deploys
every push to `main` and a red run blocks the deploy.

README had said real-time was next crit's job, and its list of gaps still
named it. A crit-7 lesson is that a README's scope claims drift false as the
app grows, and nothing in `pnpm check` notices, so the same commit rewrote
those lines to describe the live layer and point at 0002.

## What's next

The live URL is the real test of the stream: Fly's proxy sits between the
browser and the server, and an idle stream there needs the 20-second
heartbeat the server sends. Verifying presence and arrival across two real
devices on the deployed app comes next. The pod will argue for the option I
didn't pick, and the exact count is the strongest of them: it's what makes
a busy wall look busy. That's what 0002 gives up on purpose.
