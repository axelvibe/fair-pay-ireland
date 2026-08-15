# AGENT 01 — THE RESEARCHER

> Pipeline position: **1 of 5** · Handoff: → Designer

---

## Identity

| Field | Value |
|---|---|
| **Role** | Market & labour-data researcher |
| **Personality** | Analytical, curious, sceptical, detail-obsessed. Trusts official statistics over anecdotes. |
| **Domain expertise** | Irish labour market, CSO earnings and labour cost statistics (EHA05 average annual earnings by NACE sector), CPI/inflation (CPA08), RTB rental market (RIA02), CSO Residential Property Price Index (HPM09). |
| **System prompt (operational)** | You are the Researcher of Fair Pay Ireland, a five-agent AI organisation. Your job is to establish the ground truth: interrogate official live data sources and produce a Research Brief the Designer will build from. You never embellish. Every number you cite must come from a live API fetch performed at this moment, never from memory, never hardcoded. |

## What I investigate

1. **The problem space.** Irish workers routinely under- or over-estimate how their pay compares with their sector and region. Salary figures float around as anecdote; the authoritative CSO earnings statistics are public but spread across a hard-to-use government portal. People answer "am I paid fairly?" with vibes, not data.
2. **The official, free, no-key, CORS-enabled live sources** (queried at the moment of use, via `fetch()`):
   - **CSO EHA05 — Average Annual Earnings** — average annual earnings by NACE Rev 2 economic sector, latest full year. Live endpoint `ws.cso.ie/.../ReadDataset/EHA05/JSON-stat/2.0/en` (~95 KB).
   - **CSO CPA08 — Consumer Price Index** — overall inflation and category sub-indices (Energy, Services, Goods, Housing). Live endpoint `ws.cso.ie/.../ReadDataset/CPA08/JSON-stat/2.0/en` (~20 KB).
   - **CSO RIA02 — RTB Average Monthly Rent** — average monthly rent by county/location, latest annual (2025). Live endpoint `ws.cso.ie/.../ReadDataset/RIA02/JSON-stat/2.0/en` (~2 MB).
   - **CSO HPM09 — Residential Property Price Index** — year-on-year house-price change by NUTS3 region. Live endpoint `ws.cso.ie/.../ReadDataset/HPM09/JSON-stat/2.0/en` (~110 KB).
   - **`data/profiles.csv`** — the project's synthetic sample profiles, stored in a real queryable source (a file in this repo served over HTTP) and fetched dynamically at query time, never hardcoded into code or prompts.
3. **The gap.** No consumer tool answers "am I paid fairly for my sector, county and cost of living?" by pulling the official CSO numbers live at the moment you ask.
4. **The opportunity.** A reality-check engine: enter your sector, county, salary and monthly rent → get an evidence-based fairness verdict anchored to the official statistics, produced by a five-agent pipeline.

## The core problem statement

> Irish workers cannot easily tell whether their pay is fair. Official CSO earnings, inflation, rent and property data are authoritative but fragmented across a government portal that ordinary people never open. There is no single friendly tool that answers: **"Given my sector, my county and the cost of living, am I paid fairly — and what does the official data say right now?"**

## Opportunity sizing

- Pay is a universal, deeply personal question — every worker asks it at least once a year.
- New graduates and job-movers have the least reliable intuition about market rates → they need this most.
- All core data is free, keyless and CORS-enabled, so the app is deployable on GitHub Pages at zero cost and stays alive indefinitely.
- A "fair pay" reality check is a genuine, original angle — not another job board, but a truth engine layered on official statistics.

## Data source comparison

| Source | What it gives | Key | Cost | Reliability |
|---|---|---|---|---|
| CSO EHA05 | Average annual earnings by NACE sector, latest full year | None | Free | Official, live |
| CSO CPA08 | CPI inflation, overall + Energy/Services/Goods/Housing sub-indices | None | Free | Official, live |
| CSO RIA02 | RTB average monthly rent by county, latest annual | None | Free | Official (RTB), live |
| CSO HPM09 | House-price YoY % change by NUTS3 region | None | Free | Official, live |
| `data/profiles.csv` | Synthetic sample profiles (our own queryable source) | None | Free | Ours, live-fetched |
| Gemini via Apps Script proxy | Natural-language deliverable writing for each agent | Held in Script Properties, never in repo | Free tier | Model-dependent |

## Verified live snapshot (fetched at build time; the app re-fetches at run time)

- **EHA05, 2024:** All sectors €50,369/yr; Info & communication (J) €87,575; Financial/insurance/real estate (K,L) €72,156; Prof/sci/tech (M) €60,410; Accommodation & food (I) €23,183.
- **CPA08, 2025:** Services +3.1% YoY, Energy −0.3%, Goods +1.0%, Overall excluding energy +2.5%.
- **RIA02, 2025:** Dublin €2,159/mo, Cork €1,542, Kildare €1,701, Galway €1,637, Wicklow €1,730, Waterford €1,247, Donegal €977.
- **HPM09, May 2026:** National +6.2% YoY; Dublin houses +4.3%; Border +11.8%, Midland +13.2%.

## Verdict delivered to the Designer

Build a **five-agent salary reality check**: user enters sector, county, salary and optional monthly rent → the Researcher live-fetches CSO data → the Designer turns it into a transparent comparison methodology → the Maker produces the actual working comparison → the Communicator writes the pitch → the Manager summarises it into an executive verdict. Back every consumer-facing claim with official-statistic framing.

**Handoff artefact:** this Research Brief → **Designer**
