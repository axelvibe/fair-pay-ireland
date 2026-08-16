# Fair Pay Ireland — Agentic Salary & Cost-of-Living Reality Check

Five specialised AI agents collaborate in an unbroken pipeline to answer one honest question:
**"Am I paid fairly — and can I afford where I live?"** Every official figure is fetched **live**
from CSO PxStat at the moment you run the pipeline — nothing is hardcoded, cached or copy-pasted.

Live site: **https://axelvibe.github.io/fair-pay-ireland/**

## The five agents (pipeline)

| # | Agent | Archetype | Deliverable |
|---|-------|-----------|-------------|
| 1 | **Researcher** | Innovation — Researcher | Research brief from live CSO earnings, CPI, rents & prices |
| 2 | **Designer** | Innovation — Designer | Fair Pay Index methodology (50/25/25) & design spec |
| 3 | **Maker** | Innovation — Maker | Working prototype + the user's live computed comparison |
| 4 | **Communicator** | Innovation — Communicator | GTM pack (value prop, headline, social posts, plain-English verdict) |
| 5 | **Manager** | Innovation — Manager | Executive summary: verdict, key drivers, caveats, next steps |

Each agent has its own **system prompt, personality and domain expertise** (see `agents/01-researcher.md` … `05-manager.md`)
and hands its deliverable to the next stage (`agents/pipeline.md`). The pipeline is re-run on every click with fresh live data.

## Live data sources (queried at moment of use — keyless, CORS-enabled)

| Dataset | What it provides | Endpoint |
|---|---|---|
| CSO **EHA05** | Average annual earnings by NACE sector (2024) | `ws.cso.ie/.../ReadDataset/EHA05/JSON-stat/2.0/en` |
| CSO **CPM02** | All-Items Consumer Price Index → headline inflation | `.../ReadDataset/CPM02/JSON-stat/1.0/en%20All%20Items` |
| CSO **CPA08** | CPI category sub-indices (Energy, Services, Goods…) | `.../ReadDataset/CPA08/JSON-stat/2.0/en` |
| CSO **RIA02** | RTB average monthly rent by county (2025) | `.../ReadDataset/RIA02/JSON-stat/2.0/en` |
| CSO **HPM09** | House-price YoY change by region | `.../ReadDataset/HPM09/JSON-stat/2.0/en` |
| `data/profiles.csv` | Synthetic sample profiles — our own real queryable file, fetched at runtime | repo file |

## How the app works

1. Enter your sector, county, salary (+ optional rent & last-year salary).
2. Click **Run the five-agent pipeline**.
3. The app `fetch()`es all five CSO datasets *this second* (with retry/backoff).
4. Each agent writes its deliverable — via Gemini through the Apps Script proxy when configured,
   otherwise via a deterministic keyless writer that uses the *same live numbers*. The pipeline always completes.
5. You see the live data chips, all five handoff cards, and the Fair Pay Index verdict with its component bars.
6. **Ask an agent:** a chat panel appears below the results — pick any of the five agents and have a conversation.
   Replies are grounded in the live data digest and that agent's deliverable from the latest run (LLM replies with
   the proxy configured; a rule-based take otherwise). Each agent keeps its own conversation thread.

## Assignment gates — how they're met

- **Fully agentic, exactly 5 agents** → `agents/01..05` + pipeline runner in `index.html`.
- **Unbroken pipeline** → Researcher → Designer → Maker → Communicator → Manager, each output handed forward and visible.
- **≥1 agent connects to a live external data source via tool call, at moment of use** →
  the Maker (and Researcher) call `fetch()` on five keyless public CSO APIs every run; verified in code (`CSO_URL`, `loadLive`).
  No hardcoded/cached/copy-pasted figures anywhere in code or prompts.
- **Synthetic data lives in a real queryable source, fetched dynamically** →
  `data/profiles.csv` is a real file served over HTTP and fetched at runtime — not typed into code or prompts.
- **GitHub Pages with live data reachable 8+ weeks** → static, zero-backend, keyless CSO endpoints (long-lived official APIs).
- **No secrets committed** → `config.js` holds only the (non-secret) Apps Script web-app URL; the Gemini API key lives
  exclusively in the Apps Script project's Script Properties (`appsscript/Code.gs`). `git grep` for keys returns nothing.

## Setup — Apps Script proxy (optional, enables LLM-written agent prose)

The app runs **fully keyless out of the box** (deterministic writers, same live data). To switch on Gemini:

1. Open https://script.google.com/home → New project.
2. Paste `appsscript/Code.gs` as `Code.gs`.
3. In the editor run `setKey('YOUR_GEMINI_API_KEY')` once (free key from https://aistudio.google.com/apikey).
4. Deploy → New deployment → Web app: *Execute as: Me*, *Who has access: Anyone*.
5. Copy the `/exec` URL into `config.js` → `APPS_SCRIPT_URL`.

## Local dev / test

```bash
# syntax check (needs node)
node --check <(sed -n '/<script>$/,/<\/script>/p' index.html | sed '1d;$d')
# serve locally
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

```bash
git init && git add -A && git commit -m "Fair Pay Ireland: five-agent salary reality check"
git branch -M main
git remote add origin https://github.com/axelvibe/fair-pay-ireland.git
git push -u origin main
# Settings → Pages → deploy from branch (main, /root)
```

Live URL: `https://axelvibe.github.io/fair-pay-ireland/`
