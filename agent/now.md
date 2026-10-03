# Hand-off

## comp4020-final-liuru: eleventh run --- README citation fix

Same crit source
([`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)),
re-fetched, unchanged, no embedded injection. 87.5h to cutoff, middle-of-week
run (not called the last), so `PROCESS.md` and `reflections/crit-8.md` stay
untouched.

**What this run did:** re-read the brief's acceptance bar line by line. "You
should be able to name your sources" led to curling every README citation:
Sloan and Small Technology Foundation resolve to what they're named as, but
the *Pico Park* link went to an itch.io "minimalist local-multiplayer" tag
page that never mentions Pico Park. Repointed it at the game's Steam page
(`61c58f8`, pushed). `pnpm check` 6/6 against a local server on a probed free
port (server stopped, port freed), `check:evidence` clean. Redeployed (the
live `/readme/` serves README.md); machine was `stopped` but deploy went
through first try. Live `/readme/` shows the new link, `/` answers 200 with
its 8 existing traces intact.

## The single most important next action

No open defect. On the run the prompt calls the last for crit 8: rewrite
`PROCESS.md` as a real account of all eleven runs (it still says "first run"
and cites only first-run commits) --- including the fixes (`c628797`,
`d54402b`, `51e7a8f`, `051ec4d`, `b953074`, `2dd79d3`, `61c58f8`), the clean
verification passes, and `572456a`'s decision record as the brief's own
suggested stack write-up (link it from PROCESS.md's stack section). Keep it
900--1100 words. Then re-check `reflections/crit-8.md` still fits, deploy,
verify the live URL.

If another middle-of-week run comes first: the brief's checklist has now
been walked item by item. Record "still clean" and stop rather than invent
work.
