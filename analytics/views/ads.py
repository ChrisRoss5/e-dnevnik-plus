import plotly.express as px
import streamlit as st

from data import query, scalar


def render() -> None:
    st.header("Ads")

    # ── KPI row ──────────────────────────────────────────────────────────
    impressions = scalar(
        "SELECT count(*) FROM events WHERE event_name = 'view_ad'"
    )
    clicks = scalar(
        "SELECT count(*) FROM events WHERE event_name = 'click_ad'"
    )
    ctr = clicks / impressions * 100 if impressions else 0
    unique_devices = scalar(
        "SELECT count(DISTINCT user_pseudo_id) FROM events WHERE event_name = 'view_ad'"
    )

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Impressions", f"{impressions:,}")
    c2.metric("Clicks", f"{clicks:,}")
    c3.metric("CTR", f"{ctr:.2f}%")
    c4.metric("Devices reached", f"{unique_devices:,}")
    st.caption(
        "Impressions = raw view_ad count (duplicates per user included). "
        "CTR = clicks / impressions. Devices = distinct user_pseudo_id values that saw at least one ad."
    )

    st.divider()

    # ── Placement stats table ────────────────────────────────────────────
    st.subheader("Placement Stats")
    placement = query("""
        SELECT
            id                                                          AS placement,
            count(*)       FILTER (event_name = 'view_ad')              AS impressions,
            count(*)       FILTER (event_name = 'click_ad')             AS clicks,
            round(
                count(*) FILTER (event_name = 'click_ad') * 100.0
                / nullif(count(*) FILTER (event_name = 'view_ad'), 0),
            2)                                                          AS "CTR %",
            count(DISTINCT user_pseudo_id)
                FILTER (event_name = 'view_ad')                         AS unique_devices,
            count(DISTINCT user_pseudo_id)
                FILTER (event_name = 'click_ad')                        AS unique_clickers
        FROM events
        WHERE event_name IN ('view_ad', 'click_ad')
        GROUP BY id
        ORDER BY impressions DESC
    """)
    st.dataframe(placement, hide_index=True, width="stretch")
    st.caption(
        "One row per placement. ad-popup / ad-navbar are App placements; "
        "ogl-navbar / ogl-floater are Classic placements (ogl = oglas, Croatian for ad). "
        "CTR is event-level (clicks / impressions), not user-level."
    )

    st.divider()

    # ── CTR by placement bar chart ───────────────────────────────────────
    st.subheader("CTR by Placement")
    fig_ctr = px.bar(
        placement.sort_values("CTR %", ascending=True),
        x="CTR %",
        y="placement",
        orientation="h",
        labels={"placement": "Placement", "CTR %": "CTR (%)"},
    )
    fig_ctr.update_layout(yaxis_title=None)
    st.plotly_chart(fig_ctr, width="stretch")
    st.caption(
        "Event-level CTR per placement. Higher is better, but compare with "
        "caution -- placements differ in visibility and user intent."
    )

    st.divider()

    # ── Daily impressions + clicks ───────────────────────────────────────
    st.subheader("Daily Impressions & Clicks")
    daily = query("""
        SELECT
            date,
            count(*) FILTER (event_name = 'view_ad')  AS impressions,
            count(*) FILTER (event_name = 'click_ad')  AS clicks
        FROM events
        WHERE event_name IN ('view_ad', 'click_ad')
        GROUP BY date
        ORDER BY date
    """)
    melted = daily.melt(
        id_vars="date",
        value_vars=["impressions", "clicks"],
        var_name="metric",
        value_name="count",
    )
    fig_daily = px.line(
        melted,
        x="date",
        y="count",
        color="metric",
        labels={"date": "Date", "count": "Count", "metric": "Metric"},
    )
    st.plotly_chart(fig_daily, width="stretch")
    st.caption(
        "Raw daily event counts for impressions (view_ad) and clicks (click_ad). "
        "Same user seeing the same ad multiple times counts each time."
    )

    st.divider()

    # ── Top ad creatives table ───────────────────────────────────────────
    st.subheader("Top Ad Creatives")
    creatives = query("""
        SELECT
            ad_id                                                       AS creative,
            count(*)       FILTER (event_name = 'view_ad')              AS impressions,
            count(*)       FILTER (event_name = 'click_ad')             AS clicks,
            round(
                count(*) FILTER (event_name = 'click_ad') * 100.0
                / nullif(count(*) FILTER (event_name = 'view_ad'), 0),
            2)                                                          AS "CTR %"
        FROM events
        WHERE event_name IN ('view_ad', 'click_ad')
        GROUP BY ad_id
        ORDER BY impressions DESC
    """)
    st.dataframe(creatives, hide_index=True, width="stretch")
    st.caption(
        "One row per ad creative (ad_id, e.g. 'gradivo.hr-instrukcije-app-v1'). "
        "CTR is event-level: total clicks / total impressions for that creative."
    )
