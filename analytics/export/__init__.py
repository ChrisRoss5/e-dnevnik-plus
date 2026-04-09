"""Incremental GA4 export from BigQuery to local Parquet."""

import shutil
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import duckdb
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

PKG_DIR = Path(__file__).parent
ANALYTICS_DIR = PKG_DIR.parent
DATA_DIR = ANALYTICS_DIR / "data"
PARQUET = DATA_DIR / "events.parquet"
SHARD_DIR = DATA_DIR / "shards"
SQL_FILE = PKG_DIR / "query.sql"

BQ_DATASET = "e-dnevnik-plus:analytics_465808061"
BQ_TABLE = f"{BQ_DATASET}.flat_export"
GCS_PREFIX = "gs://e-dnevnik-plus.appspot.com/exports/"
GCS_PATTERN = f"{GCS_PREFIX}flat_export-*.csv"

CSV_DTYPES = {
    "event_timestamp": "int64",
    "event_name": "str",
    "user_id": "str",
    "user_pseudo_id": "str",
    "sender": "str",
    "session_id": "Int64",
    "page_url": "str",
    "school_name": "str",
    "class_year": "Int64",
    "user_type": "str",
    "id": "str",
    "ad_id": "str",
    "option_name": "str",
    "event": "str",
    "version": "str",
    "previous_version": "str",
    "new_version": "str",
    "error": "str",
}


def _run(cmd: list[str]) -> None:
    print(f"  $ {' '.join(cmd)}")
    subprocess.run(cmd, check=True)


def _ts_to_date(ts_us: int) -> datetime:
    """Convert microsecond timestamp to datetime."""
    return datetime.fromtimestamp(ts_us / 1_000_000, tz=timezone.utc)


def _get_max_timestamp() -> int | None:
    """Read the latest event_timestamp from existing parquet, or None."""
    if not PARQUET.exists():
        return None
    result = duckdb.execute(
        f"SELECT max(event_timestamp) FROM read_parquet('{PARQUET}')"
    ).fetchone()
    return result[0] if result and result[0] else None


def _build_sql(full: bool) -> str:
    """Build the BQ SQL with appropriate WHERE clause."""
    template = SQL_FILE.read_text()

    if full:
        where = "_TABLE_SUFFIX >= '20241101'"
        print("Mode: full export (all data since Nov 2024)")
    else:
        max_ts = _get_max_timestamp()
        if max_ts is None:
            where = "_TABLE_SUFFIX >= '20241101'"
            print("Mode: full export (no existing data found)")
        else:
            last_date = _ts_to_date(max_ts)
            cutoff = last_date - timedelta(days=2)
            suffix = cutoff.strftime("%Y%m%d")
            where = f"_TABLE_SUFFIX >= '{suffix}' AND event_timestamp > {max_ts}"
            print(f"Mode: incremental from {last_date.date()} (suffix >= {suffix}, ts > {max_ts})")

    return template.replace("{where_clause}", where)


def _export_from_bq(sql: str) -> None:
    """Run BQ query → GCS extract → local download."""
    print("\n[1/3] Running BigQuery query...")
    _run([
        "bq", "query",
        "--use_legacy_sql=false",
        f"--destination_table={BQ_TABLE}",
        "--replace",
        "--max_rows=0",
        sql,
    ])

    print("\n[2/3] Extracting to GCS...")
    _run([
        "bq", "extract",
        "--destination_format=CSV",
        BQ_TABLE,
        GCS_PATTERN,
    ])

    print("\n[3/3] Downloading shards...")
    SHARD_DIR.mkdir(parents=True, exist_ok=True)
    _run(["gsutil", "-m", "cp", GCS_PATTERN, str(SHARD_DIR)])


def _shards_to_parquet(output: Path) -> int:
    """Convert CSV shards to a single Parquet file. Returns row count."""
    shards = sorted(SHARD_DIR.glob("flat_export-*.csv"))
    if not shards:
        print("ERROR: No shards found.", file=sys.stderr)
        sys.exit(1)

    print(f"\nConverting {len(shards)} CSV shards to Parquet...")
    writer = None
    schema = None
    total_rows = 0

    # Merge all shards into a temp CSV first (faster than chunk-reading each)
    tmp_csv = DATA_DIR / "tmp_export.csv"
    with open(tmp_csv, "wb") as out:
        for i, shard in enumerate(shards):
            with open(shard, "rb") as f:
                if i > 0:
                    f.readline()  # skip header
                shutil.copyfileobj(f, out)

    # Convert to parquet in chunks
    for chunk in pd.read_csv(tmp_csv, dtype=CSV_DTYPES, chunksize=2_000_000):
        chunk["timestamp"] = pd.to_datetime(chunk["event_timestamp"], unit="us")
        chunk["date"] = chunk["timestamp"].dt.date
        chunk["hour"] = chunk["timestamp"].dt.hour
        total_rows += len(chunk)

        table = pa.Table.from_pandas(chunk)
        if schema is None:
            # Fix null-typed columns (all-null chunks infer as null type)
            schema = pa.schema([
                f if f.type != pa.null() else pa.field(f.name, pa.string())
                for f in table.schema
            ])
            writer = pq.ParquetWriter(output, schema, compression="snappy")

        arrays = [
            pa.nulls(len(table), type=field.type) if table.column(field.name).type == pa.null()
            else table.column(field.name)
            for field in schema
        ]
        writer.write_table(pa.table(arrays, schema=schema))
        print(f"  {total_rows:,} rows processed")

    if writer:
        writer.close()
    tmp_csv.unlink()

    return total_rows


def _merge_parquets(new_parquet: Path) -> None:
    """Append new parquet data to the existing one."""
    if not PARQUET.exists():
        new_parquet.rename(PARQUET)
        return

    print("\nMerging with existing data...")
    merged = DATA_DIR / "merged.parquet"

    # Use DuckDB to concatenate — handles schema alignment
    duckdb.execute(f"""
        COPY (
            SELECT * FROM read_parquet('{PARQUET}')
            UNION ALL
            SELECT * FROM read_parquet('{new_parquet}')
        ) TO '{merged}' (FORMAT PARQUET, COMPRESSION SNAPPY)
    """)

    PARQUET.unlink()
    merged.rename(PARQUET)
    new_parquet.unlink(missing_ok=True)


def _cleanup_remote() -> None:
    """Remove BQ temp table and GCS shards."""
    print("\nCleaning up remote resources...")
    _run(["bq", "rm", "-f", "-t", BQ_TABLE])
    _run(["gsutil", "-m", "rm", GCS_PATTERN])


def _cleanup_local() -> None:
    """Remove local temp files."""
    if SHARD_DIR.exists():
        shutil.rmtree(SHARD_DIR)
    # Remove old CSV if present
    csv = DATA_DIR / "events.csv"
    if csv.exists():
        csv.unlink()
        print("Removed old events.csv")


def main(full: bool = False) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    sql = _build_sql(full)
    _export_from_bq(sql)

    new_parquet = DATA_DIR / "new_export.parquet"
    rows = _shards_to_parquet(new_parquet)

    if rows == 0:
        print("\nNo new data to add.")
        new_parquet.unlink(missing_ok=True)
    elif full:
        # Full export replaces everything
        if PARQUET.exists():
            PARQUET.unlink()
        new_parquet.rename(PARQUET)
    else:
        _merge_parquets(new_parquet)

    _cleanup_remote()
    _cleanup_local()

    size_mb = PARQUET.stat().st_size / 1e6 if PARQUET.exists() else 0
    total = 0
    if PARQUET.exists():
        total = duckdb.execute(
            f"SELECT count(*) FROM read_parquet('{PARQUET}')"
        ).fetchone()[0]
    print(f"\nDone. {total:,} rows, {size_mb:.0f} MB ({PARQUET.name})")
