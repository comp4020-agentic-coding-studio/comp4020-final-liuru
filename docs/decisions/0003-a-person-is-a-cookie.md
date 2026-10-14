# 0003: a person is a cookie, and the log names them by a hash of it

Status: accepted (crit 10).

## Context

Crit 10 asks for three things the wall half-had already. It has to tell two
people apart, each in their own browser with nothing shared; what each may
see and change has to be decided and checked on the server; and the server
has to log who did what, well enough that I can narrate two classmates'
actions from `flyctl logs` alone without touching the app.

Since crit 8 a visitor has been a random id in a five-year `HttpOnly`
cookie, used for one thing: marking your own traces as yours. Nothing was
logged except the listening port and uncaught errors.

## Who counts as a person

1. **An account** (email or password). The default answer, and the one
   `CLAUDE.md` forbids: no accounts, no login. It would also put a sign-in
   step between a passer-by and the wall, which the brief's "anything they
   need to get in has to be on the page" turns into a form to fill in.
2. **A pseudonym** typed on first visit. Gives the log and the wall a
   readable name. But a name on a trace is the start of a profile, and
   README defers any visible distinction between visitors until a feature
   needs it; nothing here does.
3. **An anonymous browser.** The cookie the server already issues. Two
   Chrome profiles share no cookies, so they are two people with no step to
   take.

Option 3. The one change: the server now only accepts an id it could have
issued (a UUID). A cookie someone hand-types (`visitor=ada`) is replaced
with a fresh one rather than adopted, so nobody picks their own identity,
and a value shaped like someone else's has to be guessed out of 2¹²² rather
than chosen.

## What each person may see and change

Everyone sees every trace; the wall is public by design. Everyone may add a
trace. Nobody may change or remove one, their own included, because
`CLAUDE.md` makes a trace permanent once posted. So the authorisation rule
is the absence of a route: the server answers only `GET /`, `POST /trace`,
`GET /events` and `GET /readme/`, and any attempt to edit or delete (`PUT`,
`DELETE`, `POST /trace/<id>`) gets a 404. "Yours" is decided per request on
the server, by comparing the trace's stored visitor id to the requester's,
and only ever changes how a trace renders for you, never what you can do to
it. The cookie is `HttpOnly`, so a page script can't read or copy it.

## What gets logged

One line per event on stdout, tagged with a short request id so a request
and the events inside it group together:

```text
[0113d1] trace_posted visitor=fdee430d trace=1 kind=dew text="..."
[0113d1] POST /trace 303 1ms visitor=fdee430d
```

Logged: every request (method, path, status, time, visitor), a new visitor
being issued an id, every trace posted (with its text, since it's already
public on the wall) and every one dropped (with why), and each live stream
opening and closing with how many are open.

Never logged: the cookie itself. It's the only credential a visitor has, so
whoever reads it could post as them. The log carries the first eight hex
digits of its SHA-256 instead, enough to tell two visitors apart and useless
for impersonating either. No IP addresses or user agents either: the wall
doesn't need them, and they're the start of the profile the cookie exists
to avoid. A trace's text is escaped and quoted, so a newline in it can't
forge a second log line.

## Consequences

- At the crit I tell the two classmates apart by their hashes, not their
  names. The first `visitor_new` line after each opens the URL is the
  introduction; from there every line carries the same eight characters.
  `cookie=rejected` on that line means a visitor cookie arrived that this
  server never issued, so a forged id is visible rather than looking like a
  first visit.
- Clearing cookies or switching browsers makes you someone new, and you lose
  the "yours" marking on old traces. There's no recovery, since there's
  nothing to recover with. That's the cost of having no account.
- Anyone who copies a visitor's cookie out of their browser is that visitor.
  For a wall where being someone only marks traces as theirs, that's an
  acceptable ceiling.
- Logs live wherever Fly keeps them, not on the volume. The app writes
  stdout and manages no log files ([Twelve-Factor, XI](https://12factor.net/logs)).
