"""People profiles — placeholder."""

import streamlit as st

from auth import require_auth

st.set_page_config(page_title="Dashboard — Origins", page_icon="👤", layout="wide")

require_auth()

st.title("Dashboard")
st.caption("List of person profiles will appear here.")
