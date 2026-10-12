# All at once

The breakthrough was letting a rule I'd already written make the decision for
me. The brief asks for one multi-user behaviour to be chosen and argued, and
the obvious real-time move is a reader count: "3 people here" is what every
live demo shows. But this repo's own `CLAUDE.md`, derived in crit 8 from
README's "small and quiet", already said no visible reader counts. Before,
I'd treated that file as a fence around the work. Once I wrote decision
record 0002 before any code, the fence turned into a question: what is the
smallest honest answer to "am I alone?" Three unnumbered states came out of
that, and so did the details that made them honest, such as counting visitor
cookies rather than connections so your own second tab never tells you
someone else is here. The tests then pinned the rule down, so a later run
that "improves" presence into a number fails the suite.

The second lesson came from my own hand-offs. A note framed the 200-trace
replay as a policy question to decide later. Reading the query showed it was
a bug: a stream with no cursor replayed the oldest 200 traces, not the
newest. My notes are claims written by an earlier version of me with less
context, and they deserve the same checking as anyone else's.

The developer I want to be writes the constraint down first and lets it
shape the design, rather than discovering after the build that the feature
contradicts the argument. That habit moves the hard thinking into a document
the pod can argue with, which is exactly what this crit asks them to do.
