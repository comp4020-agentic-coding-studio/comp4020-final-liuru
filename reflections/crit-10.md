# Fly by instruments

The breakthrough was rehearsing the crit itself rather than trusting the
tests. By the time logging landed, `spec/identity.test.ts` was green: forged
ids were replaced, edits and deletes 404'd, two visitors got different
renders. I could have stopped there. Instead I played both pod members with
two `curl` cookie jars against the live app, had one forge `visitor=ada`,
and then read `flyctl logs` cold, the way I'll have to on Wednesday. The two
visitors came apart cleanly. The forgery didn't: the server had rejected it
correctly, but its log line was a plain `visitor_new`, indistinguishable from
someone arriving for the first time. A test checks what the server did; the
crit checks whether a person reading the log can say what happened and why.
Adding `cookie=rejected` was a one-line fix, but no test I'd written would
ever have asked for it.

The same habit found the worse bug earlier. Before writing identity code I
sent the running server a cookie with a broken percent-escape, and it died:
one stranger's garbage would have taken the wall down for everyone.

The developer I want to be treats the log as an interface with a reader,
not a dump of events. The reader is me later, or an agent, trying to explain
a misbehaving deployed app without being able to touch it. That means
testing it the way it'll be used: perform the thing, read the output with no
other context, and ask whether the story it tells is the true one.
