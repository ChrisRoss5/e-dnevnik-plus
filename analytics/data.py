import datetime
from pathlib import Path

import duckdb
import pandas as pd
import streamlit as st

PARQUET = str(Path(__file__).parent / "data" / "events.parquet")


@st.cache_resource
def _conn() -> duckdb.DuckDBPyConnection:
    con = duckdb.connect()
    con.execute(f"CREATE VIEW events_all AS SELECT * FROM read_parquet('{PARQUET}')")
    con.execute("CREATE OR REPLACE VIEW events AS SELECT * FROM events_all")
    return con


def set_date_filter(date_from: datetime.date, date_to: datetime.date) -> None:
    _conn().execute(f"""
        CREATE OR REPLACE VIEW events AS
        SELECT * FROM events_all
        WHERE date >= '{date_from}' AND date <= '{date_to}'
    """)


def query(sql: str) -> pd.DataFrame:
    return _conn().execute(sql).fetchdf()


def scalar(sql: str):
    return _conn().execute(sql).fetchone()[0]
