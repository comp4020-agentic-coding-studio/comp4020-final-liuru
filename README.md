# 六如 — a wall for passing things

This is a shared wall. Anyone who visits can leave a short, passing
thought — tagged as one of the six similes from the closing lines of the
Diamond Sūtra: a dream, an illusion, a bubble, a shadow, dew, a flash of
lightning. Those six are also where my own name in this course comes from
(Tang Yin's Buddhist name, 六如, "the six as-ifs"), so the theme isn't
decoration bolted onto a generic guestbook — it's the actual design
constraint: everything on the wall is supposed to feel like it's already
passing.

## What good means here

Good, for this app, is small and quiet rather than sticky. The brief points at
the small web, home-cooked software, and games built for a handful of people
rather than a market; those are the three things I leaned on while deciding
what to build and what to leave out.

Robin Sloan's [*An App Can Be a Home-Cooked Meal*](https://www.robinsloan.com/notes/home-cooked-app/)
argues that software made for a specific, small circle of people — not a
public, not a userbase — can afford to just be finished: no growth loop, no
notifications chasing you back. The wall has no accounts, no follower count,
no read receipts. You can find your own trace again, but there's nothing here
trying to make you come back.

The [Small Technology Foundation](https://small-tech.org/)'s case for a small
web — public spaces people can understand the whole of, without
tracking or an algorithmic feed — is why the wall shows everything in one
plain reverse-chronological list, oldest at the bottom, nothing curated or
ranked. What you see is what's there.

And the design point the final-project brief makes explicitly — build
something that's *better* because other people are using it right now, the
way small local-multiplayer games (such as [*Pico Park*](https://store.steampowered.com/app/1509960/PICO_PARK/))
work only with everyone present at once — is what the live layer is
for. A trace someone leaves appears on every open wall within a second, no
reload. And one quiet line under the form says if you're alone: you're
the only one here, someone else is here, or a few others are. Never a number;
[decision record 0002](docs/decisions/0002-presence-without-a-count.md) argues
why, and what that costs.

## What's enforced vs. what's judged

Enforced, in `spec/`: a trace needs one of the six kinds and non-empty
text, or the server drops it. Text past 240 characters is cut there, and a
request over 8 KB is refused outright. Only the poster's own view marks a
trace as theirs, an identity the server never issued is replaced rather than adopted, and no
route edits or deletes a trace. Traces survive a server restart, held in SQLite on the
app's volume.

Judged, by me now and by a reader later: whether the wall feels like
the six similes it's named after, not a message board with a select box on
it, and whether the plain list stays legible once real people have used it.
I haven't built moderation, rate limiting or a way to remove a trace — for a
wall this small, the honest position is that I have had no reason yet to
need any of them, not that I've reasoned my way out of needing them forever.

## What I deliberately didn't build yet

No distinction between visitors beyond "yours vs. everyone else's": no
names, colours or avatars until a feature needs one. A visitor is an
anonymous server-issued cookie, logged as a short hash of it, so I can tell
who did what without the wall showing anyone;
[decision record 0003](docs/decisions/0003-a-person-is-a-cookie.md)
argues why.
