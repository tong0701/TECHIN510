"""Chronological timeline — placeholder."""

import streamlit as st

from auth import require_auth

st.set_page_config(page_title="Timeline — Origins", page_icon="📅", layout="wide")

require_auth()

st.title("Timeline")
st.caption("Chronological story timeline will appear here.")
