# 0002: presence without a count

Status: accepted (crit 9).

## Context

Crit 9 makes the wall real-time: a trace one visitor leaves reaches every
other open tab within about a second, without a reload. The transport follows
from [0001](0001-plain-node-and-sqlite.md): Server-Sent Events from the same
`node:http` server, since the wall only ever pushes server to client. That
part isn't a decision worth recording.

The decision that is: **can a visitor tell that anyone else is here?** Until
someone posts, a live wall looks exactly like a static one. The final-project
brief wants an app that's better because other people are using it right now,
and a co-present stranger who never posts is invisible. Against that,
README's own definition of good is small and quiet, and `CLAUDE.md` rules
out visible reader counts and anything that exists to bring someone back.

## Options weighed

1. **No presence at all.** Traces arrive live; nothing else does. Quietest,
   and nothing to get wrong. But the co-presence the brief asks for only
   exists in the instant someone posts, and two people reading the wall
   together in a crit can't tell they're together.
2. **An exact count** ("3 here now"). The obvious answer, and the one most
   real-time demos show. It's a reader count by another name, which
   `CLAUDE.md` rules out for a reason: a number invites watching it go up,
   and a wall with "1 here now" on it reads as a failure rather than a quiet
   room.
3. **Per-visitor markers** (cursors, coloured dots, "someone is typing").
   The liveliest option. It needs a visible identity per visitor, which
   README defers until a feature needs it, and a typing indicator turns a
   passing thought into a performance someone else is watching you give.
4. **Coarse, unnumbered presence.** One line of plain text with three
   states: you're the only one here; someone else is here; a few others are
   here. It answers "am I alone?" and nothing more.

## Decision

Option 4. Presence is counted by distinct visitor cookie, not by connection,
so your own second tab never tells you "someone else is here". The line is a
polite live region, so a screen-reader user gets the same signal as a
sighted one when it changes, without being interrupted.

New traces arrive live at the top of the list for everyone, quietly: no
sound, no title-bar badge, no "new" highlight. A tab that drops and
reconnects asks for every trace after the last one it saw (the `id` on each
event, which `EventSource` sends back as `Last-Event-ID`), so nothing posted
during the gap goes missing.

## Consequences

- The three states hide the difference between two visitors and twenty. A
  crit pod of five sees "a few others", the same as a crowd would. That's the
  point, and also the cost: the wall can't show that it's busy, which is the
  one thing a growth-minded app would want it to.
- An open tab holds an SSE connection, so Fly's proxy keeps the machine
  awake while anyone has the wall open, rather than stopping it between
  requests. Costs rise with attention, not with posts.
- Presence and fan-out live in one process's memory. That's correct only
  because `fly.toml` pins one machine; a second machine would split the room
  in two, and this record would need replacing with a shared broker.
- A visitor who blocks cookies gets a fresh identity per request, so they
  count as a new "someone" on every connection. Rare enough to accept.
