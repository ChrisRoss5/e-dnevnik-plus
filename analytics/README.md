# Analytics

Streamlit dashboard for e-Dnevnik Plus GA4 data. Queries a local Parquet file via DuckDB.

## Setup

```bash
pip install -r requirements.txt
```

## Export data from BigQuery

```bash
python -m export          # incremental (fetches only new events)
python -m export --full   # full re-export from Nov 2024
```

Requires `bq` and `gsutil` CLI tools authenticated with the `e-dnevnik-plus` GCP project.

## Run the dashboard

```bash
streamlit run app.py
```

## Docs

- [GA.md](GA.md) — all tracked events, architecture, identity params
- [PIPELINE.md](PIPELINE.md) — export pipeline, gotchas, dashboard architecture
