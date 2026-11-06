import type { Kind, Trace } from "./db.ts";

const KIND_META: Record<Kind, { glyph: string; hanzi: string; label: string }> = {
  dream: { glyph: "☁", hanzi: "夢", label: "a dream" },
  illusion: { glyph: "◈", hanzi: "幻", label: "an illusion" },
  bubble: { glyph: "○", hanzi: "泡", label: "a bubble" },
  shadow: { glyph: "◐", hanzi: "影", label: "a shadow" },
  dew: { glyph: "•", hanzi: "露", label: "dew" },
  lightning: { glyph: "⚡", hanzi: "電", label: "a flash of lightning" },
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Pure, and also shipped to the browser verbatim (see liveScript), so an open
// tab keeps "just now" honest without a second copy of the rule.
function relativeTime(ms: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - ms) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

const shell = (title: string, body: string): string => `<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        font-family: ui-serif, Georgia, "Noto Serif CJK SC", serif;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1.5rem 1rem 4rem;
        line-height: 1.6;
      }
      header { margin-bottom: 1.5rem; }
      h1 { font-size: 1.4rem; margin-bottom: 0.25rem; }
      .sub { color: light-dark(#595959, #999); margin-top: 0; font-size: 0.95rem; }
      nav.meta a { color: inherit; }
      form.trace-form {
        display: grid;
        gap: 0.6rem;
        border: 1px solid #8883;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 2rem;
      }
      form.trace-form label { display: grid; gap: 0.25rem; font-size: 0.9rem; }
      form.trace-form select,
      form.trace-form input {
        font: inherit;
        padding: 0.4rem 0.5rem;
        border-radius: 0.3rem;
        border: 1px solid #8886;
      }
      form.trace-form button {
        font: inherit;
        justify-self: start;
        padding: 0.4rem 1rem;
        border-radius: 0.3rem;
        border: 1px solid #8886;
        background: transparent;
        cursor: pointer;
      }
      ul.wall { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
      li.trace {
        display: grid;
        grid-template-columns: 1.6rem 1fr auto;
        gap: 0.6rem;
        align-items: baseline;
        padding: 0.5rem 0.6rem;
        border-radius: 0.4rem;
        opacity: 0.92;
      }
      li.trace.mine { background: #8883; opacity: 1; }
      li.trace .glyph { font-size: 1.1rem; text-align: center; }
      li.trace .text { overflow-wrap: anywhere; min-width: 0; }
      li.trace .when { font-size: 0.75rem; color: light-dark(#595959, #999); white-space: nowrap; }
      /* a trace that arrives live passes in the way its simile does; motion
         here is ornament on top of the list, so reduced motion drops it */
      @media (prefers-reduced-motion: no-preference) {
        li.trace.arriving { animation: 1.2s ease-out arrive-dew; }
        li.trace.arriving.kind-dream { animation: 2.4s ease-out arrive-dream; }
        li.trace.arriving.kind-illusion { animation: 1.2s steps(1) arrive-illusion; }
        li.trace.arriving.kind-bubble { animation: 1.4s cubic-bezier(0.2, 0.8, 0.3, 1) arrive-bubble; }
        li.trace.arriving.kind-shadow { animation: 1.6s ease-out arrive-shadow; }
        li.trace.arriving.kind-dew { animation: 3s ease-in arrive-dew; }
        li.trace.arriving.kind-lightning { animation: 0.6s ease-out arrive-lightning; }
      }
      @keyframes arrive-dream { from { opacity: 0; filter: blur(6px); } }
      @keyframes arrive-illusion {
        0% { opacity: 0; }
        20% { opacity: 1; }
        35% { opacity: 0.1; }
        60% { opacity: 1; }
        75% { opacity: 0.3; }
      }
      @keyframes arrive-bubble { from { opacity: 0; transform: translateY(1.2rem) scale(0.94); } }
      @keyframes arrive-shadow { from { opacity: 0; transform: translateX(-1.5rem); } }
      @keyframes arrive-dew { from { opacity: 0; } }
      @keyframes arrive-lightning { from { background: light-dark(#ffe9a8, #6b5a1e); } }
      .presence { color: light-dark(#595959, #999); font-size: 0.85rem; min-height: 1.4em; margin: 0 0 0.5rem; }
      .paging { font-size: 0.9rem; margin: 1rem 0; }
      .paging a { color: inherit; }
      .empty { color: light-dark(#595959, #999); font-style: italic; }
      pre.readme-body { white-space: pre-wrap; }
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`;

export function renderTrace(t: Trace, visitorId: string): string {
  const meta = KIND_META[t.kind];
  const isMine = t.visitorId === visitorId;
  const mineLabel = isMine ? `<span class="visually-hidden">yours: </span>` : "";
  return `<li id="trace-${t.id}" class="trace kind-${t.kind}${isMine ? " mine" : ""}">
    <span class="glyph" aria-hidden="true" title="${meta.hanzi} ${escapeHtml(meta.label)}">${meta.glyph}</span>
    <span class="visually-hidden">tagged as ${escapeHtml(meta.label)}: </span>
    <span class="text">${mineLabel}${escapeHtml(t.text)}</span>
    <time class="when" datetime="${new Date(t.createdAt).toISOString()}">${relativeTime(t.createdAt, Date.now())}</time>
  </li>`;
}

// Three states and never a number: it answers "am I alone?" and nothing more
// (decision record 0002).
export function presenceText(others: number): string {
  if (others <= 0) return "you're the only one here right now";
  if (others === 1) return "someone else is here right now";
  return "a few others are here right now";
}

// Progressive enhancement: without it the form posts and the page reloads,
// as it always has. With it, traces arrive over /events and posting doesn't
// reload. If the stream is down, the form falls back to a plain post.
const liveScript = `
  ${relativeTime.toString()}
  // times were true when the server rendered them; keep them true
  setInterval(() => {
    for (const t of document.querySelectorAll("time.when")) {
      const next = relativeTime(Date.parse(t.dateTime), Date.now());
      if (t.textContent !== next) t.textContent = next;
    }
  }, 30_000);
  const wall = document.querySelector("ul.wall");
  const presence = document.getElementById("presence");
  const form = document.querySelector("form.trace-form");
  // an older page isn't the top of the wall: it hears presence, but new
  // traces and live posting belong to the newest page
  const archive = "archive" in wall.dataset;
  const source = new EventSource(archive ? "/events" : "/events?after=" + wall.dataset.after);
  let live = false;
  source.addEventListener("open", () => { live = !archive; });
  source.addEventListener("error", () => { live = false; presence.textContent = ""; });
  source.addEventListener("presence", (e) => { presence.textContent = e.data; });
  source.addEventListener("trace", (e) => {
    if (archive) return;
    if (document.getElementById("trace-" + e.lastEventId)) return;
    wall.querySelector(".empty")?.remove();
    wall.insertAdjacentHTML("afterbegin", JSON.parse(e.data));
    wall.firstElementChild.classList.add("arriving");
  });
  form.addEventListener("submit", async (e) => {
    if (!live) return;
    e.preventDefault();
    const body = new URLSearchParams(new FormData(form));
    const text = form.elements.text.value;
    form.elements.text.value = "";
    try {
      await fetch(form.action, { method: "POST", body, redirect: "manual" });
    } catch {
      // a dropped connection mustn't lose the thought: put it back and fall
      // back to a plain post, which the browser retries visibly
      form.elements.text.value = text;
      form.submit();
    }
  });
`;

export function renderWall(
  traces: Trace[],
  visitorId: string,
  { archive = false, hasOlder = false }: { archive?: boolean; hasOlder?: boolean } = {},
): string {
  const options = Object.entries(KIND_META)
    .map(([value, m]) => `<option value="${value}">${m.hanzi} ${escapeHtml(m.label)}</option>`)
    .join("");

  const items = traces.length
    ? traces.map((t) => renderTrace(t, visitorId)).join("\n")
    : `<li class="empty">nothing has passed through yet</li>`;
  const oldest = traces.at(-1)?.id;
  const older = hasOlder && oldest ? `<p class="paging"><a href="/?before=${oldest}">older traces</a></p>` : "";
  const newer = archive ? `<p class="paging"><a href="/">back to the newest</a></p>` : "";

  const body = `
    <header>
      <h1>六如 &mdash; a wall for passing things</h1>
      <p class="sub">leave a thought as one of the six as-ifs; it stays here, quietly, whether or not you come back</p>
      <nav class="meta"><a href="/readme/">what this is for</a></nav>
    </header>
    <main>
      <form class="trace-form" method="post" action="/trace">
        <label>this feels like&hellip;
          <select name="kind" required>${options}</select>
        </label>
        <label>what passed through
          <input type="text" name="text" maxlength="240" required placeholder="a fragment, not an essay" />
        </label>
        <button type="submit">let it go</button>
      </form>
      <p id="presence" class="presence" role="status"></p>
      ${newer}
      <ul class="wall"${archive ? ` data-archive` : ` aria-live="polite" aria-relevant="additions" data-after="${traces[0]?.id ?? 0}"`}>
        ${items}
      </ul>
      ${older}
    </main>
    <script type="module">${liveScript}</script>
  `;
  return shell("六如 — a wall for passing things", body);
}

export function renderReadme(bodyHtml: string): string {
  const body = `
    <nav class="meta"><a href="/">back to the wall</a></nav>
    <main>${bodyHtml}</main>
  `;
  return shell("About — 六如", body);
}
