# PIPELINE — Fair Pay Ireland

Five specialised agents collaborate in a fixed, unbroken pipeline. Each agent has its own system prompt, personality and domain expertise, produces a distinct deliverable, and hands it to the next agent. The output of every stage is visible to the user as a card, so the collaboration itself is the product.

```
Researcher ──> Designer ──> Maker ──> Communicator ──> Manager
   Research        Design        Working         GTM            Executive
   Brief           Spec          Prototype       Pack           Summary
```

## Handoff chain (what flows between agents)

1. **Researcher** live-fetches CSO data (EHA05, CPA08, RIA02, HPM09) + our `data/profiles.csv`, and writes a **Research Brief**.
   Handoff → **Designer**: the brief + the live numbers.
2. **Designer** turns the brief into a transparent **Design Spec**: interaction model, Fair Pay Index methodology (50/25/25), scoring rules, honest framing.
   Handoff → **Maker**: the spec to implement.
3. **Maker** runs the **working prototype** (`index.html`): live data layer, scoring engine, pipeline runner, results UI. It computes the user's live index and renders all five cards.
   Handoff → **Communicator**: the computed live results + the running prototype.
4. **Communicator** writes the **GTM pack** from the live results: value prop, headline, social posts, plain-English verdict.
   Handoff → **Manager**: results + GTM pack.
5. **Manager** distils everything into the **Executive Summary** — verdict, key drivers, caveats, next steps.

## How it runs

- The pipeline runs in the browser on a single click. No backend.
- Each agent's deliverable is written by Gemini (via an Apps Script proxy whose key lives in Script Properties — never in the repo) and rendered as a card.
- **Keyless fallback:** if the proxy is unreachable, a deterministic template writer produces the same structured deliverables from the same live numbers, so the pipeline always completes.
- Every card shows the live fetches that stage made, with source tags and timestamps.

## Live-data discipline (assignment gates)

- All official figures are fetched at query time via `fetch()` from CSO PxStat — never hardcoded, never cached-across-sessions, never pasted into prompts.
- Our synthetic sample profiles live in `data/profiles.csv` (a real queryable file served over HTTP) and are fetched at runtime — never typed into code or prompts.
- No API keys or credentials exist anywhere in this repository. The Gemini key is held server-side in the Apps Script proxy's Script Properties.

## Iteration evidence

The pipeline is designed to be re-run on every page load with fresh live data, and each run produces a full visible record (fetches, scores, deliverables). Any improvement to an agent's prompt or scoring rule is reflected immediately in the next run — so iteration is continuous and auditable, never a single-shot answer.

## Repo layout

```
agents/            Five persona/system-prompt docs + this pipeline doc
appsscript/        Apps Script proxy (holds the Gemini key in Script Properties)
data/profiles.csv  Synthetic sample profiles (real queryable source)
index.html         The working prototype (Maker's deliverable)
config.js          Proxy URL + model name (no secrets)
docs/              Submission document
```
