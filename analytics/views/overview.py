import plotly.express as px
import streamlit as st

from data import query, scalar


def render() -> None:
    st.header("Overview")

    # ── KPI row ──────────────────────────────────────────────────────────
    col1, col2, col3, col4, col5 = st.columns(5)

    col1.metric("Total Events", f"{scalar('SELECT count(*) FROM events'):,}")
    st.caption("Raw event count, including all event types.")

    col2.metric(
        "Unique Devices",
        f"{scalar('SELECT count(DISTINCT user_pseudo_id) FROM events'):,}",
    )
    st.caption("Distinct `user_pseudo_id` values (one per browser install).")

    col3.metric(
        "Unique Users",
        f"{scalar('SELECT count(DISTINCT user_id) FROM events WHERE user_id IS NOT NULL'):,}",
    )
    st.caption(
        "Distinct `user_id` values (logged-in students only). "
        "Rows without `user_id` are excluded."
    )

    col4.metric(
        "Unique Sessions",
        f"{scalar('SELECT count(DISTINCT session_id) FROM events WHERE session_id IS NOT NULL'):,}",
    )
    st.caption("Distinct `session_id` values. Rows without a session ID are excluded.")

    installs = scalar("SELECT count(*) FROM events WHERE event_name = 'extension_install'")
    col5.metric("Installs", f"{installs:,}")
    st.caption("Count of `extension_install` events (one per install).")

    st.divider()

    # ── Daily events stacked area chart ──────────────────────────────────
    st.subheader("Daily Events by Type")
    st.caption(
        "Raw event count per day, broken down by `event_name`. "
        "Not deduplicated per user."
    )

    daily = query("""
        SELECT date, event_name, count(*) AS count
        FROM events
        GROUP BY date, event_name
        ORDER BY date
    """)
    fig_area = px.area(
        daily,
        x="date",
        y="count",
        color="event_name",
        labels={"date": "Date", "count": "Events", "event_name": "Event"},
    )
    fig_area.update_layout(legend=dict(orientation="h", y=-0.2))
    st.plotly_chart(fig_area, width="stretch")

    # ── Daily active users ───────────────────────────────────────────────
    st.subheader("Daily Active Users")
    st.caption(
        "Unique `user_id` (logged-in students) and `user_pseudo_id` (device installs) "
        "per day. A user/device is counted once per day regardless of event count."
    )

    dau = query("""
        SELECT
            date,
            count(DISTINCT user_pseudo_id) AS devices,
            count(DISTINCT user_id)         AS users
        FROM events
        GROUP BY date
        ORDER BY date
    """)
    fig_dau = px.line(
        dau.melt(id_vars="date", value_vars=["devices", "users"],
                 var_name="metric", value_name="count"),
        x="date",
        y="count",
        color="metric",
        labels={"date": "Date", "count": "Count", "metric": "Metric"},
        color_discrete_map={"devices": "#636EFA", "users": "#EF553B"},
    )
    fig_dau.update_layout(legend=dict(orientation="h", y=-0.2))
    st.plotly_chart(fig_dau, width="stretch")

    st.divider()

    # ── Bottom row: donut + horizontal bar ───────────────────────────────
    left, right = st.columns(2)

    with left:
        st.subheader("Event Type Distribution")
        st.caption(
            "Share of total raw events per `event_name`. Not deduplicated per user."
        )

        dist = query(
            "SELECT event_name, count(*) AS count FROM events GROUP BY event_name"
        )
        fig_pie = px.pie(
            dist,
            names="event_name",
            values="count",
            hole=0.4,
            labels={"event_name": "Event", "count": "Count"},
        )
        fig_pie.update_traces(textposition="inside", textinfo="percent+label")
        st.plotly_chart(fig_pie, width="stretch")

    with right:
        st.subheader("Sender Breakdown")
        st.caption(
            "Raw event count by `sender` (app, classic, popup, service_worker). "
            "Shows which extension component fires the most events."
        )

        sender = query(
            "SELECT sender, count(*) AS count FROM events "
            "WHERE sender IS NOT NULL GROUP BY sender ORDER BY count DESC"
        )
        fig_bar = px.bar(
            sender,
            x="count",
            y="sender",
            orientation="h",
            labels={"sender": "Sender", "count": "Events"},
            text="count",
        )
        fig_bar.update_traces(texttemplate="%{text:,}", textposition="outside")
        fig_bar.update_layout(yaxis=dict(categoryorder="total ascending"))
        st.plotly_chart(fig_bar, width="stretch")
