# Fair Pay Ireland — Submission Document

**Course:** AI Project (NCI) · **Project:** "Fair Pay Ireland" — an agentic salary & cost-of-living reality check
**Live URL:** https://axelvibe.github.io/fair-pay-ireland/ · **Stack:** static GitHub Pages + CSO public APIs + Apps Script proxy (optional Gemini)

---

## 1. An Agentic Organisation — exactly five specialised AI agents

| # | Agent | Innovation archetype | System prompt & personality | Deliverable |
|---|-------|----------------------|-----------------------------|-------------|
| 1 | **Researcher** | Researcher | Analytical, curious, sceptical; interrogates live official data | Research Brief |
| 2 | **Designer** | Designer | Structured, user-empathic, honest-methodology-obsessed | Fair Pay Index Design Spec |
| 3 | **Maker** | Maker | Practical, rigorous, ship-oriented | Working prototype + live computed comparison |
| 4 | **Communicator** | Communicator | Persuasive, concise, human | GTM pack (value prop, headline, social posts) |
| 5 | **Manager** | Manager | Decisive, fair-minded, fluent | Executive Summary |

Each agent has its own **system prompt** (the `sys` field in `index.html` and the operational prompt in
`agents/01-researcher.md` … `agents/05-manager.md`), its own **personality** and its own **domain expertise**.
There are exactly five — no more, no less.

## 2. Unbroken pipeline (Researcher → Designer → Maker → Communicator → Manager)

The pipeline runs in fixed order in the browser (`runPipeline()` in `index.html`). Each agent receives the live
data digest **and** the previous agent's output (`prompt = dataDigest(...) + "Previous stage output:\n" + prevOutput`),
writes its deliverable, and hands it forward. All five cards render on screen, so the collaboration is visible:
each card shows the agent's live-data chips, its written deliverable, and a **"Handoff artefact → next agent"** footer.
The Manager's card is the final deliverable. This is not a report about AI — the AI is doing the work, live.

## 3. Evidence of iteration, not single-shot

- The pipeline **re-runs fresh on every click** — each run re-fetches all five CSO datasets at that moment, so any
  improvement to an agent's prompt or scoring rule is reflected in the very next run.
- The build was validated twice: a full DOM-shim smoke test of all five agent cards + verdict (see test output in this
  repo's git history and README), and a syntax check after a code-review pass that removed two dead branches.
- Iteration is continuous and auditable: run, review the cards, improve a prompt, run again.

## 4. Live external data source via tool call / MCP — queried at moment of use

> PASS. The Maker (and Researcher) call **five keyless, CORS-enabled public APIs** on every run, at the moment of use,
> via plain `fetch()` calls in code (`CSO_URL` + `loadLive()` in `index.html`). Nothing is hardcoded, cached across
> sessions, or copy-pasted into prompts.

| Dataset | Value used | Fetched this session |
|---|---|---|
| CSO **EHA05** | average annual earnings by NACE sector | ✓ (e.g. 2024: Info & comm €87,575; national €50,369) |
| CSO **CPM02** | All-Items CPI → headline inflation | ✓ (e.g. July 2026: +3.4% YoY) |
| CSO **CPA08** | CPI category sub-indices | ✓ |
| CSO **RIA02** | RTB average monthly rent by county | ✓ (e.g. 2025: Dublin €2,159/mo) |
| CSO **HPM09** | house-price YoY by region | ✓ (e.g. May 2026: Dublin +4.3%) |

Each dataset is parsed by an indexed parser (`parseEHA05`, `parseCPM02`, …) that navigates the JSON-stat `value`
array using the dimension order the API reports — so parsing stays correct as CSO publishes new months/years.
The endpoints are the official, long-lived CSO PxStat APIs (no API key required), so the connections remain
reachable well beyond 8 weeks after the deadline.

## 5. Synthetic data lives in a real queryable source, fetched dynamically

> PASS. The synthetic sample profiles live in `data/profiles.csv` — a real file in this repository, served over HTTP
> on GitHub Pages — and are fetched at runtime (`fetch(PROFILES_URL)` → `parseProfiles`). They are used to let users
> compare against illustrative scenarios. They are **not** typed into any prompt and **not** hardcoded into code.

## 6. GitHub Pages + live data connections reachable ≥ 8 weeks

The site is a static single-page app on GitHub Pages (`https://axelvibe.github.io/fair-pay-ireland/`) with zero backend.
All data comes from official government APIs (CSO PxStat) which do not require keys and do not expire. As long as the
repo remains public, the URL and the data connections keep working.

## 7. No secret keys / API keys / credentials in the repo or zip

> PASS. A `git grep` / code scan of `index.html`, `config.js`, and all repo files finds **no** API key or credential.
> The optional Gemini key lives **only** in the Apps Script proxy's Script Properties (`appsscript/Code.gs` —
> `PropertiesService.getScriptProperties()`), never in this repository. `config.js` contains only the non-secret
> public web-app URL, and the app runs keyless even if that URL is empty.

## 8. Zip of complete codebase + this document

The repository contains everything: the working app (`index.html`), the five agent personas and pipeline doc
(`agents/`), the proxy (`appsscript/Code.gs`), the synthetic data source (`data/profiles.csv`), config, README,
and this document. Zip the repo root for submission.

---

## Fair Pay Index methodology (Designer spec → Maker implementation)

Score 0–100, shown with its component breakdown:

- **Pay vs sector average (50 pts):** salary ÷ sector average from EHA05. 0.70× → 0 pts; 1.30× → 50 pts; linear.
- **Pay vs inflation (25 pts):** personal pay growth vs All-Items CPI from CPM02. Beats CPI → 25 pts; 5 pp below → 0 pts.
- **Rent burden (25 pts):** monthly rent × 12 ÷ gross salary. ≤30% → 25 pts; 45%+ → 0 pts. If no rent supplied, the
  RIA02 county-average rent is used as a scenario.

Honest framing: every headline carries its live-source tag; the tool reports *what the official statistics say*,
never an unearned claim of exact market worth.
