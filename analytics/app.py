import streamlit as st

from data import scalar, set_date_filter
from views import overview, users, pageviews, ads, features

st.set_page_config(page_title="e-Dnevnik Plus Analytics", layout="wide")

min_date = scalar("SELECT min(date) FROM events_all")
max_date = scalar("SELECT max(date) FROM events_all")

with st.sidebar:
    st.title("e-Dnevnik Plus Analytics")

    st.caption("Date filter")
    date_from = st.date_input("From", value=min_date, min_value=min_date, max_value=max_date)
    date_to = st.date_input("To", value=max_date, min_value=min_date, max_value=max_date)
    set_date_filter(date_from, date_to)

    st.divider()
    total = scalar("SELECT count(*) FROM events")
    st.metric("Filtered rows", f"{total:,}")

tab_overview, tab_users, tab_pageviews, tab_ads, tab_features = st.tabs(
    ["Overview", "Users", "Page Views", "Ads", "Features"]
)

with tab_overview:
    overview.render()
with tab_users:
    users.render()
with tab_pageviews:
    pageviews.render()
with tab_ads:
    ads.render()
with tab_features:
    features.render()
