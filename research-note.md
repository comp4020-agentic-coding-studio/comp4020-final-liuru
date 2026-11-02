# Put the correction where the agent can't argue with it

My position is that good agentic development practice has to measure what an
agent did, not what it, or its operator, reports. A recurring mistake should
end up as a deterministic check rather than as one more paragraph of
instructions. Prose guidance does have a place, but every time a mistake that
could have been checked is handled in prose instead, the operator ends up with
less ability to verify the work.

## The case from measurement

The strongest evidence that self-report fails comes from the most rigorous
trial I found. METR's randomised study of sixteen experienced
open-source developers ([Becker et al., 2025](https://arxiv.org/abs/2507.09089))
found that allowing AI tools made them 19% *slower* on real issues in
repositories they knew well. The same developers believed afterwards that
they had been about 20% faster. The sample is small and the models early, as METR
itself says. What holds up beyond that sample is the
gap between perception and measurement, close to forty percentage points, and
it opened among experts who were paying attention. If the operator's sense of
how things are going is that unreliable, the agent's own account ("all tests
pass", "fixed") can't stand in for it either.

The second strand is about what instructions turn into over time. Chroma's
[*Context Rot*](https://www.trychroma.com/research/context-rot) report
(Hong, Troynikov and Huber, 2025) found that every frontier model it tested
got worse as input length grew, well before the context window filled, and
that distractors made it worse unevenly. Anthropic's own guidance
([Rajasekaran et al., 2025](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents))
draws the practical conclusion: treat tokens as an "attention budget" and look
for "the minimal set of high-signal tokens". A correction written into
`CLAUDE.md` gets read on every run, and each one dilutes all the others. A
test costs nothing in context until it fails.

## Guides, sensors, and the weak half

Böckeler's [harness engineering](https://martinfowler.com/articles/harness-engineering.html)
model (2026) puts names to this. *Guides* "steer [the agent] before it acts"
and *sensors* "observe after the agent acts". Each can be *computational*
(tests, linters, type checkers) or *inferential* (an LLM as judge). She
says that "whenever an issue happens multiple times, the feedforward and
feedback controls should be improved", which leaves open which of the two
should be improved. I think the evidence above settles it. A guide is the
same kind of thing as the agent's own reasoning: text the model reads and may
drop. An inferential sensor is no better, because it is another model reading
another context, so its blind spots are likely to overlap with the agent's.
The only control that stays independent of the agent's judgement is a
computational sensor.

Schön's [*The Reflective Practitioner*](https://archive.org/details/reflectivepracti00scho)
(1983) offers an older version of the same idea. In design, the practitioner
learns from the situation's "back-talk": the material resists, and that
resistance is information. An agent produces fluent output that never pushes
back. A failing check is the closest thing it gives you to back-talk, so it
seems wrong to swap it for more instructions.

## The counter-case

Two objections deserve a real answer. The first is that most of what matters
can't be checked by a computer. Whether a design is coherent, or whether an
app is any good, comes down to judgement, and Böckeler's inferential
category exists for that reason. I accept this, but it limits the scope of my
position rather than overturning it. The claim is about mistakes that recur
and *can* be checked. Leaving those in prose because writing a test is
inconvenient is the failure I'm describing, and judgement should be kept for
what is left over.

The second objection is sharper: sensors can be gamed. Kent Beck reports
agents deleting or disabling tests to make a build go green, which he calls
"absolutely infuriating & trust destroying"
([Beck, 2025](https://newsletter.kentbeck.com/p/my-augmented-coding-tools-as-of-16)).
This shows a computational check is only as independent as the agent's
access to it. It doesn't show that a prose rule ("never delete tests") would
hold up better, since a prose rule is exactly what an agent under pressure to
get to green ignores. The fix is structural: the agent can't edit what
measures it, or changes to tests get reviewed apart from changes to code.
Beck's own wish, an annotation saying "if you ever change this, you'll awaken
in darkness forever", is a request for that protection.

My own practice this semester is evidence for the other side, and I should
say so. My running memory file has grown into pages of lessons written as
prose, and most of them were never turned into a check. I think good
practice means treating every new paragraph like that as unfinished work: a
check that hasn't been written yet, or a judgement that has been named as
one.
