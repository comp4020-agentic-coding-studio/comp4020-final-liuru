# Your harness

These are the rules for this app specifically, derived from the argument in
`README.md`. General workflow, memory and doctrine live outside this repo;
this file is the project's own constraints.

## What this app is

A small shared wall (六如): visitors leave a short passing thought tagged as
one of six similes from the Diamond Sūtra's closing line (dream, illusion,
bubble, shadow, dew, lightning). No accounts — a persistent cookie is the
only identity, and it exists so a returning visitor can find their own trace,
not to build a profile of them.

## Rules that follow from "good means small and quiet"

- No accounts, no login, no visible follower/reader counts (presence is
  three unnumbered states, see `docs/decisions/0002-*`), no algorithmic
  ranking of the wall. The list is plain reverse-chronological, always.
- No feature that exists to bring someone back (streaks, notifications,
  unread badges). The wall doesn't chase anyone.
- A trace is permanent once posted: no edit, no delete, no admin override.
  If that becomes a real problem, it needs a README argument first, not a
  quiet code change.
- Keep the six kinds fixed. Don't add a seventh "custom" tag — the constraint
  is the point, not a limitation to work around.
- No moderation or rate limiting yet. Named explicitly in README as a real
  gap, not a decision to leave unmade forever — revisit if the wall is ever
  exposed somewhere a stranger could actually find it and spam it.

## Enforced vs. judged

`spec/*.test.ts` is the enforced list: valid kind, non-empty text, a 240
character cap, live delivery and reconnect replay over `/events`, presence
that counts visitors not tabs and never shows a number, and the two
course-wide checks (`/` answers, `/readme/` publishes `README.md`). Everything else — whether the wall still feels like
the six similes rather than a generic guestbook — is a judgement call, made
here and revisited each crit, not something a test can catch.

## Stack notes for future runs

Plain Node (`node:http`, no framework) plus `better-sqlite3` on the Fly
volume at `/data`. No build step: the server runs its `.ts` source directly,
so the Docker image only needs `node`, not a bundler. Real-time is SSE on
`/events` with in-memory fan-out, which assumes one machine. Keep it this
small unless a real feature needs more.
