# Hand-off

## comp4020-final-liuru: first run --- crit 8, "It's alive!", proof of life shipped

New deliverable, first run against this repo. Fetched
[`crits/08-its-alive.json`](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/08-its-alive.json)
and the [final project brief](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/assessments/final-project/)
it points at. This crit's own bar is narrow: deployed, doing its "core
thing," a trace still there on return --- the real-time layer, the feature
list and polish are explicitly deferred to crits 9--12. The final project's
whole shape (schedule, word counts, marking weights) is now in `MEMORY.md`'s
"Identity and running theme" section so future runs don't have to re-fetch
the brief to recall it.

**Concept, built this run:** 六如 --- a shared wall where a visitor tags a
short passing thought as one of the Diamond Sūtra's six similes (dream,
illusion, bubble, shadow, dew, lightning), the line this agent's own name
comes from. No accounts; a persistent cookie is the only identity, just
enough to find your own trace again. Plain `node:http` + `better-sqlite3`
on the Fly volume at `/data`; no build step, Node 24 runs the `.ts` source
directly (confirmed working, both locally and in the Docker image).
Concept and constraints reasoned out in
[`ff0b374`](https://github.com/comp4020-agentic-coding-studio/comp4020-final-liuru/commit/ff0b374)'s
README --- the six-as-ifs theme is the actual design constraint (no
accounts/streaks/ranking, since all three would contradict "everything
here is supposed to feel like it's already passing"), not decoration.

**Done this run:** app + Dockerfile (`bf52500`), own spec tests for the
wall's validation/persistence promises (`073f417`), README.md (597 words,
three real-searched sources) + CLAUDE.md rules (`ff0b374`), PROCESS.md
(934 words) + `reflections/crit-8.md` (270 words, headed "It's alive!")
(`262ed15`). Verified: `pnpm check` green against the dev server AND
against the real `docker build` image run the way CI runs it (`--tmpfs
/data`), which needed `sudo -n docker ...` in this sandbox (plain `docker
build` fails with a socket permission error even though `groups` lists
`docker`-adjacent groups; sudo without a password prompt worked cleanly).
`agent-browser` at both marking viewports, console/errors clean, a real
form-submitted trace confirmed to survive a fresh server restart locally
and a page reload on the live deploy. Pushed (`262ed15` is `origin/main`
HEAD). Deployed with `flyctl deploy --remote-only --ha=false -a
comp4020-final-liuru` (repo still private, so this was mine to run); live
URL verified serving and persisting for real, not just locally.

One build note worth keeping for this repo specifically: `pnpm-
workspace.yaml`'s `allowBuilds` list has to name every dependency with a
native postinstall step, not just the first one that needs it --- the
starter already listed `esbuild`, and `better-sqlite3` needed adding
alongside it or `pnpm install` silently skips its build and the native
binding never compiles.

## The single most important next action

Crit 9 ("All at Once", presumably) asks for the real-time layer plus a
documented multi-user decision --- README.md's own "what I deliberately
didn't build yet" section already names this as the next gap: the wall
currently updates only on reload, so a second visitor's trace doesn't
appear live. That's the concrete next step, not "polish it." Before
building, re-fetch that crit's own JSON rather than assuming its title/
number from the final-project brief's summary --- the brief describes crit
9's *content* ("All at Once") but the actual crit slug/number for this
repo's next prompt should come from whatever the next run's prompt names.
