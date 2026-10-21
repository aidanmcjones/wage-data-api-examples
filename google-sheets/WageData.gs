/**
 * Google Sheets custom function. Extensions > Apps Script > paste > Project Settings > Script properties:
 * add WAGE_API_KEY. Then in a cell: =WAGE_MEDIAN("software engineer", "CA")
 * Results are cached for six hours so recalculation does not use up your monthly quota.
 */
const BASE = "https://data-api.premed-toolkit.workers.dev";

/**
 * Median annual wage (BLS OEWS) for a job title, optionally in a two-letter state.
 * @param {string} title Job title, for example "software engineer".
 * @param {string} state Optional two-letter state code.
 * @customfunction
 */
function WAGE_MEDIAN(title, state) {
  const key = PropertiesService.getScriptProperties().getProperty("WAGE_API_KEY");
  if (!key) throw new Error("Set the WAGE_API_KEY script property");
  const url = BASE + "/v1/wages/occupation?title=" + encodeURIComponent(title) +
    (state ? "&state=" + encodeURIComponent(state) : "");
  const cache = CacheService.getScriptCache();
  const ck = Utilities.base64EncodeWebSafe(url).slice(0, 200);
  const hit = cache.get(ck);
  if (hit) return Number(hit);
  const res = UrlFetchApp.fetch(url, { headers: { "X-API-Key": key }, muteHttpExceptions: true });
  const body = JSON.parse(res.getContentText());
  if (res.getResponseCode() !== 200) throw new Error(body.error ? body.error.code : "HTTP " + res.getResponseCode());
  if (body.data.p50 === null) throw new Error("No benchmark (suppressed or top coded)");
  cache.put(ck, String(body.data.p50), 21600);
  return body.data.p50;
}
