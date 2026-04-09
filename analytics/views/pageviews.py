import plotly.express as px
import streamlit as st

from data import query, scalar

_PV_FILTER = "event_name = 'page_view'"

_DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def render() -> None:
    st.header("Page Views")

    total = scalar(f"SELECT count(*) FROM events WHERE {_PV_FILTER}")
    devices = scalar(
        f"SELECT count(DISTINCT user_pseudo_id) FROM events WHERE {_PV_FILTER}"
    )
    logged_in = scalar(
        f"SELECT count(DISTINCT user_id) FROM events WHERE {_PV_FILTER} AND user_id IS NOT NULL"
    )
    pages = scalar(
        f"SELECT count(DISTINCT page_url) FROM events WHERE {_PV_FILTER}"
    )

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Page Views", f"{total:,}")
    c2.metric("Unique Devices", f"{devices:,}")
    c3.metric("Logged-in Users", f"{logged_in:,}")
    c4.metric("Distinct Pages", f"{pages:,}")
    st.caption(
        "Unique Devices = distinct user_pseudo_id (one per browser install). "
        "Logged-in Users = distinct user_id (SHA-256 of username; ~19% of page_view rows have one)."
    )

    st.divider()

    # -- Top 25 pages ----------------------------------------------------------
    st.subheader("Top 25 Pages by View Count")
    top_pages = query(f"""
        SELECT page_url, count(*) AS views
        FROM events
        WHERE {_PV_FILTER}
        GROUP BY page_url
        ORDER BY views DESC
        LIMIT 25
    """)
    top_pages = top_pages.sort_values("views", ascending=True)
    fig_pages = px.bar(
        top_pages,
        x="views",
        y="page_url",
        orientation="h",
        labels={"page_url": "Page URL", "views": "Views"},
    )
    fig_pages.update_layout(height=600)
    st.plotly_chart(fig_pages, width="stretch")
    st.caption(
        "Raw page_view event count per URL. Not deduplicated per user. "
        "App URLs are matched Vue routes (e.g. /subjects); classic URLs are full hrefs from ocjene.skole.hr."
    )

    st.divider()

    # -- Sender breakdown & daily trend ----------------------------------------
    left, right = st.columns(2)

    with left:
        st.subheader("Views by Sender")
        sender = query(f"""
            SELECT sender, count(*) AS views
            FROM events
            WHERE {_PV_FILTER}
            GROUP BY sender
        """)
        fig_sender = px.pie(
            sender,
            names="sender",
            values="views",
            hole=0.4,
            labels={"sender": "Sender", "views": "Views"},
        )
        st.plotly_chart(fig_sender, width="stretch")
        st.caption(
            "Share of page_view events by sender. "
            "'app' = extension popup/dashboard, 'classic' = injected on ocjene.skole.hr."
        )

    with right:
        st.subheader("Daily Page Views by Sender")
        daily = query(f"""
            SELECT date, sender, count(*) AS views
            FROM events
            WHERE {_PV_FILTER}
            GROUP BY date, sender
            ORDER BY date
        """)
        fig_area = px.area(
            daily,
            x="date",
            y="views",
            color="sender",
            labels={"date": "Date", "views": "Views", "sender": "Sender"},
        )
        st.plotly_chart(fig_area, width="stretch")
        st.caption(
            "Total page_view events per day, stacked by sender. "
            "Spikes often correlate with school grading periods."
        )

    st.divider()

    # -- Hourly heatmap --------------------------------------------------------
    st.subheader("Hourly Heatmap (Day of Week)")
    heatmap = query(f"""
        SELECT
            dayofweek(timestamp) AS dow,
            hour,
            count(*) AS views
        FROM events
        WHERE {_PV_FILTER}
        GROUP BY dow, hour
    """)
    pivot = heatmap.pivot(index="dow", columns="hour", values="views").fillna(0)
    # Ensure all 24 hour columns exist even if some have zero traffic.
    for h in range(24):
        if h not in pivot.columns:
            pivot[h] = 0
    pivot = pivot[sorted(pivot.columns)]
    pivot.index = [_DOW_LABELS[i] for i in pivot.index]

    fig_heat = px.imshow(
        pivot,
        labels={"x": "Hour of Day (UTC)", "y": "Day of Week", "color": "Views"},
        x=[str(h) for h in range(24)],
        y=_DOW_LABELS,
        aspect="auto",
        color_continuous_scale="Blues",
    )
    st.plotly_chart(fig_heat, width="stretch")
    st.caption(
        "Page views by hour (UTC) and day of week. "
        "DuckDB dayofweek(): 0 = Monday, 6 = Sunday."
    )
