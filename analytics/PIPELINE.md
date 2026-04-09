# Analytics Pipeline

## Overview

The analytics dashboard visualizes GA4 event data from the e-Dnevnik Plus Chrome extension. Data lives in BigQuery, gets exported to a local Parquet file, and the Streamlit app queries it via DuckDB — zero ongoing BigQuery cost.

## Data Flow

```
BigQuery (GA4 raw export)
    │
    │  1. bq query → flat_export table
    │     (UNNEST event_params into columns)
    │
    │  2. bq extract → GCS CSV shards
    │
    │  3. gsutil cp → local CSV shards
    │
    │  4. Shards → Parquet (chunked conversion)
    │
    │  5. Merge with existing Parquet (if incremental)
    │
    ▼
DuckDB (in-process, reads Parquet directly)
    │
    ▼
Streamlit Dashboard
```

## Export Module

The export pipeline lives in `export/` as a Python package:

```
export/
  __init__.py    # Pipeline logic (main function)
  __main__.py    # CLI entry point
  query.sql      # BQ flattening SQL template
```

### Usage

```bash
cd analytics
python -m export          # Incremental: only fetch new events
python -m export --full   # Full re-export from Nov 2024
```

### Incremental Mode (default)

1. Reads `max(event_timestamp)` from existing `data/events.parquet` via DuckDB
2. Converts to a date, goes back 2 days as safety margin (intraday tables finalize next day)
3. Queries BQ with `_TABLE_SUFFIX >= '{cutoff}' AND event_timestamp > {max_ts}`
4. Exports only the new rows → temp Parquet
5. Concatenates with existing Parquet via DuckDB `UNION ALL`
6. Cleans up remote (BQ temp table, GCS shards) and local temp files

If no existing Parquet exists, falls back to a full export.

### Full Mode (`--full`)

Ignores existing data and re-exports everything from Nov 2024. Replaces the Parquet file entirely.

### SQL Template

`export/query.sql` contains a `{where_clause}` placeholder that the pipeline fills dynamically:
- Full: `_TABLE_SUFFIX >= '20241101'`
- Incremental: `_TABLE_SUFFIX >= '{cutoff_date}' AND event_timestamp > {max_timestamp}`

### Gotchas

- **Destination table naming:** Must NOT start with `events_` — we use `flat_export`. Otherwise `events_*` wildcard queries match it and fail with schema mismatch.
- **Legacy SQL flag:** `--nouse_legacy_sql` silently fails with `--destination_table`. Use `--use_legacy_sql=false`.
- **Null-typed Parquet columns:** When a CSV chunk has an all-null column, PyArrow infers it as `null` type. The pipeline explicitly casts these to `string` when merging chunks.
- **Memory:** CSV-to-Parquet conversion uses 2M-row chunks to avoid OOM on 16 GB machines.

## Dashboard Architecture

```
analytics/
├── app.py              # Streamlit entry point, sidebar, tabs
├── data.py             # DuckDB connection, query helpers
├── export/             # BQ export pipeline
│   ├── __init__.py     # main(full=False)
│   ├── __main__.py     # CLI: python -m export [--full]
│   └── query.sql       # SQL template with {where_clause}
├── views/              # Tab modules (NOT pages/ — Streamlit auto-discovers pages/)
│   ├── overview.py     # KPIs, daily events, event distribution, sender breakdown
│   ├── users.py        # DAU, user types, class years, top schools, installs
│   ├── pageviews.py    # Top pages, views by sender, daily trend, hourly heatmap
│   ├── ads.py          # Placement stats, CTR, daily impressions/clicks, top ads
│   └── features.py     # Button clicks by feature/sender, top options, daily trend
├── data/               # gitignored
│   └── events.parquet  # Single source of truth (~1.35 GB, 26M rows)
├── .gitignore
├── GA.md               # GA4 event documentation
└── PIPELINE.md         # This file
```

### Why DuckDB, not pandas

Loading 26M rows into pandas requires 6-21 GB of RAM. DuckDB reads Parquet directly from disk, runs SQL aggregations in-process, and returns only small result DataFrames for charts. Memory usage: ~200 MB.

### Why views/, not pages/

Streamlit auto-discovers `.py` files in a `pages/` subdirectory and adds them to sidebar navigation. We use `st.tabs()` instead, so the directory is named `views/`.

### Date Filtering

`data.py` exposes `set_date_filter(from, to)` which creates a filtered DuckDB view (`events`) over the full data (`events_all`). All page queries hit `events`, so the filter applies globally.

