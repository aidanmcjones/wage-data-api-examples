#!/usr/bin/env node
// Usage: WAGE_API_KEY=dak_... node wages.mjs [employer-slug]   (Node 18+)
const BASE = process.env.WAGE_API_BASE_URL ?? "https://data-api.premed-toolkit.workers.dev";
const KEY = process.env.WAGE_API_KEY;
if (!KEY) { console.error("Set WAGE_API_KEY (your API key)"); process.exit(1); }

async function get(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(BASE + path + (qs ? "?" + qs : ""), { headers: { "X-API-Key": KEY } });
  const body = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${body.error?.code}: ${body.error?.message}`);
  return body;
}

const slug = process.argv[2] ?? "amazon";
const emp = await get(`/v1/wages/employer/${encodeURIComponent(slug)}`);
const d = emp.data;
console.log(`${d.employer}: ${d.filings} filings, percentiles`, d.wage_percentiles_usd, `median vs OEWS ${d.median_vs_oews_ratio}`);
const occ = (await get("/v1/wages/occupation", { title: "software engineer", state: "CA" })).data;
console.log(`${occ.occupation} in ${occ.area_name} (${occ.area_level}): median ${occ.p50 === null ? "n/a (suppressed or top coded)" : "$" + occ.p50.toLocaleString("en-US")}`);
console.log("Sources:", emp.attribution.sources.map((s) => s.name).join(", "));
