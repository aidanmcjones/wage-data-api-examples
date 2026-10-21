# Wage Data API examples

Runnable examples for the Wage Data API: H-1B (DOL LCA) employer wage percentiles next to BLS OEWS benchmarks, as JSON.

- Docs and live coverage: https://data-api.premed-toolkit.workers.dev/docs
- OpenAPI: https://data-api.premed-toolkit.workers.dev/v1/openapi.json
- Free tier: 100 successful calls per month, 10 per minute. Paid plans from $9 per month are on the docs page.

Every script reads your key from the `WAGE_API_KEY` environment variable. Nothing here contains a key. Set `WAGE_API_BASE_URL` only if you are pointing at a different host.

```bash
export WAGE_API_KEY="dak_your_key_here"
./curl/lookup.sh amazon
python3 python/wages.py amazon
node javascript/wages.mjs amazon
```

Google Sheets: paste `google-sheets/WageData.gs` into Extensions, Apps Script, and add the script property `WAGE_API_KEY`. Then `=WAGE_MEDIAN("software engineer", "CA")`.

## Read this before you use the numbers

LCA wages are the bottom of each filing's offered range, so employer medians run low against actual pay and against OEWS. Percentiles are unweighted per filing and describe visa filings, not all workers. Use the OEWS fields for the general labor market. Informational only; not legal, immigration or financial advice.

## Attribution

Keep the `attribution` block from each response with any data you display or republish. Derived from U.S. Department of Labor OFLC LCA disclosure data and BLS OEWS. Not affiliated with or endorsed by DOL or BLS. Title matching includes information from the O*NET 30.0 Database by USDOL/ETA, used under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/); modified; USDOL/ETA has not approved, endorsed, or tested these modifications. O*NET is a trademark of USDOL/ETA.

## License

MIT for the example code (see LICENSE). The data carries the attribution above.
