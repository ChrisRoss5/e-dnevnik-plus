import plotly.express as px
import streamlit as st

from data import query, scalar


def render() -> None:
    st.header("Features")

    # --- KPI row ---
    total_clicks = scalar(
        "SELECT count(*) FROM events WHERE event_name = 'click_button'"
    )
    unique_devices = scalar(
        "SELECT count(DISTINCT user_pseudo_id) FROM events WHERE event_name = 'click_button'"
    )
    top_feature = scalar("""
        SELECT id FROM events
        WHERE event_name = 'click_button'
        GROUP BY id ORDER BY count(*) DESC LIMIT 1
    """)

    col1, col2, col3 = st.columns(3)
    col1.metric("Feature Clicks", f"{total_clicks:,}")
    col2.metric("Devices Using Features", f"{unique_devices:,}")
    col3.metric("Most Popular Feature", top_feature or "—")

    st.divider()

    # --- Clicks by feature (raw count) ---
    st.subheader("Clicks by Feature")
    st.caption(
        "Raw click_button events per feature area (id). "
        "Same user clicking multiple times counts each time."
    )

    clicks_by_feature = query("""
        SELECT id, count(*) AS clicks
        FROM events
        WHERE event_name = 'click_button'
        GROUP BY id ORDER BY clicks DESC
    """)
    order = clicks_by_feature["id"].tolist()[::-1]
    fig_clicks = px.bar(
        clicks_by_feature, x="clicks", y="id", orientation="h",
        category_orders={"id": order},
        labels={"id": "Feature", "clicks": "Clicks"},
    )
    fig_clicks.update_layout(height=max(350, len(order) * 40))
    st.plotly_chart(fig_clicks, width="stretch")

    st.divider()

    # --- Unique users per feature ---
    st.subheader("Unique Users per Feature")
    st.caption(
        "Unique devices (user_pseudo_id) that used each feature at least once."
    )

    users_by_feature = query("""
        SELECT id, count(DISTINCT user_pseudo_id) AS unique_users
        FROM events
        WHERE event_name = 'click_button'
        GROUP BY id ORDER BY unique_users DESC
    """)
    order_u = users_by_feature["id"].tolist()[::-1]
    fig_users = px.bar(
        users_by_feature, x="unique_users", y="id", orientation="h",
        category_orders={"id": order_u},
        labels={"id": "Feature", "unique_users": "Unique Users"},
    )
    fig_users.update_layout(height=max(350, len(order_u) * 40))
    st.plotly_chart(fig_users, width="stretch")

    st.divider()

    # --- Top options / settings toggled ---
    st.subheader("Top Options / Settings Toggled")
    st.caption(
        "Options or settings toggled via click_button events. "
        "Shows raw event count and unique devices per option."
    )

    options = query("""
        SELECT
            option_name,
            count(*) AS clicks,
            count(DISTINCT user_pseudo_id) AS unique_users
        FROM events
        WHERE event_name = 'click_button'
          AND option_name IS NOT NULL
          AND option_name != ''
        GROUP BY option_name
        ORDER BY clicks DESC
    """)
    st.dataframe(options, width="stretch", hide_index=True)

    st.divider()

    # --- Daily feature usage trend ---
    st.subheader("Daily Feature Usage")
    st.caption(
        "Daily click_button events broken down by feature area (id)."
    )

    daily = query("""
        SELECT date, id, count(*) AS clicks
        FROM events
        WHERE event_name = 'click_button'
        GROUP BY date, id ORDER BY date
    """)
    fig_daily = px.line(
        daily, x="date", y="clicks", color="id",
        labels={"date": "Date", "clicks": "Clicks", "id": "Feature"},
    )
    st.plotly_chart(fig_daily, width="stretch")
