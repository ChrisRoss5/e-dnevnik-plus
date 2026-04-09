import plotly.express as px
import streamlit as st

from data import query, scalar


def render() -> None:
    st.header("Users")

    # --- Top-level metrics ---
    col1, col2, col3, col4 = st.columns(4)
    col1.metric(
        "Devices (user_pseudo_id)",
        f"{scalar('SELECT count(DISTINCT user_pseudo_id) FROM events'):,}",
    )
    col2.metric(
        "Logged-in Users (user_id)",
        f"{scalar('SELECT count(DISTINCT user_id) FROM events WHERE user_id IS NOT NULL'):,}",
    )
    pct_no_uid = scalar(
        "SELECT round(100.0 * count(*) FILTER (WHERE user_id IS NULL) / count(*), 1) FROM events"
    )
    col3.metric("Events Without user_id", f"{pct_no_uid}%")
    installs = scalar("SELECT count(*) FROM events WHERE event_name = 'extension_install'")
    col4.metric("Total Installs", f"{installs:,}")

    st.divider()

    # --- DAU: dual line (user_id + user_pseudo_id) ---
    st.subheader("Daily Active Users")
    st.caption(
        "Two lines: unique devices (user_pseudo_id) and unique logged-in users "
        "(user_id) per day. Most events lack user_id, so the device line is always higher."
    )

    dau = query("""
        SELECT
            date,
            count(DISTINCT user_pseudo_id) AS devices,
            count(DISTINCT user_id)         AS logged_in_users
        FROM events
        GROUP BY date
        ORDER BY date
    """)
    fig_dau = px.line(
        dau,
        x="date",
        y=["devices", "logged_in_users"],
        labels={"date": "Date", "value": "Unique Users", "variable": "Metric"},
        color_discrete_map={"devices": "#636EFA", "logged_in_users": "#EF553B"},
    )
    fig_dau.update_layout(legend_title_text="")
    st.plotly_chart(fig_dau, width="stretch")

    st.divider()

    # --- User Type + Class Year side by side ---
    left, right = st.columns(2)

    with left:
        st.subheader("User Type Breakdown")
        st.caption(
            "Unique students (user_id) per type. Only page_view events carry user_type, "
            "so this only counts logged-in users who generated at least one page view."
        )

        ut = query("""
            SELECT user_type, count(DISTINCT user_id) AS users
            FROM events
            WHERE event_name = 'page_view'
              AND user_type IS NOT NULL
              AND user_id IS NOT NULL
            GROUP BY user_type
        """)
        fig_type = px.pie(
            ut,
            names="user_type",
            values="users",
            hole=0.4,
            labels={"user_type": "User Type", "users": "Users"},
        )
        st.plotly_chart(fig_type, width="stretch")

    with right:
        st.subheader("Class Year Distribution")
        st.caption(
            "Unique students (user_id) per class year. "
            "Elementary: years 1-8, High school: years 1-4. "
            "Only page_view events carry class_year."
        )

        cy = query("""
            SELECT class_year, count(DISTINCT user_id) AS users
            FROM events
            WHERE event_name = 'page_view'
              AND class_year IS NOT NULL
              AND user_id IS NOT NULL
            GROUP BY class_year
            ORDER BY class_year
        """)
        fig_class = px.bar(
            cy,
            x="class_year",
            y="users",
            labels={"class_year": "Class Year", "users": "Unique Students"},
        )
        fig_class.update_xaxes(dtick=1)
        st.plotly_chart(fig_class, width="stretch")

    st.divider()

    # --- Top 30 Schools ---
    st.subheader("Top 30 Schools")
    st.caption(
        "Unique students (user_id) per school. Only page_view events carry school_name, "
        "so this counts logged-in users who generated at least one page view."
    )

    schools = query("""
        SELECT school_name, count(DISTINCT user_id) AS users
        FROM events
        WHERE event_name = 'page_view'
          AND school_name IS NOT NULL
          AND user_id IS NOT NULL
        GROUP BY school_name
        ORDER BY users DESC
        LIMIT 30
    """)
    schools = schools.sort_values("users", ascending=True)
    fig_schools = px.bar(
        schools,
        x="users",
        y="school_name",
        orientation="h",
        labels={"school_name": "School", "users": "Unique Students"},
    )
    fig_schools.update_layout(height=700)
    st.plotly_chart(fig_schools, width="stretch")

    st.divider()

    # --- Daily Installs ---
    st.subheader("Daily Installs")
    st.caption(
        "New extension_install events per day. "
        "These fire from the service worker on first install and never carry a user_id."
    )

    installs = query("""
        SELECT date, count(*) AS installs
        FROM events
        WHERE event_name = 'extension_install'
        GROUP BY date
        ORDER BY date
    """)
    fig_installs = px.bar(
        installs,
        x="date",
        y="installs",
        labels={"date": "Date", "installs": "Installs"},
    )
    st.plotly_chart(fig_installs, width="stretch")
