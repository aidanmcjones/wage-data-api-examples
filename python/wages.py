#!/usr/bin/env python3
"""Employer wage lookup plus an occupation lookup. Standard library only.

Usage: WAGE_API_KEY=dak_... python3 wages.py [employer-slug]
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = os.environ.get("WAGE_API_BASE_URL", "https://data-api.premed-toolkit.workers.dev")


def get(path, **params):
    key = os.environ.get("WAGE_API_KEY")
    if not key:
        sys.exit("Set WAGE_API_KEY (your API key)")
    url = BASE + path + ("?" + urllib.parse.urlencode(params) if params else "")
    req = urllib.request.Request(url, headers={"X-API-Key": key})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = json.loads(e.read() or b"{}")
        err = body.get("error", {})
        sys.exit(f"HTTP {e.code} {err.get('code')}: {err.get('message')}")


if __name__ == "__main__":
    slug = sys.argv[1] if len(sys.argv) > 1 else "amazon"
    emp = get(f"/v1/wages/employer/{urllib.parse.quote(slug)}")
    d = emp["data"]
    print(f"{d['employer']}: {d['filings']} filings, percentiles {d['wage_percentiles_usd']}, median vs OEWS {d['median_vs_oews_ratio']}")
    occ = get("/v1/wages/occupation", title="software engineer", state="CA")["data"]
    print(f"{occ['occupation']} in {occ['area_name']} ({occ['area_level']}): median {'n/a (suppressed or top coded)' if occ['p50'] is None else format(occ['p50'], ',')}")
    # Keep the attribution with anything you display or republish.
    print("Sources:", ", ".join(s["name"] for s in emp["attribution"]["sources"]))
