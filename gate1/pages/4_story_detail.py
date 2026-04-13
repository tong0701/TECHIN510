"""Single story with audio — placeholder."""

import streamlit as st

from auth import require_auth

st.set_page_config(page_title="Story — Origins", page_icon="📜", layout="wide")

require_auth()

st.title("Story detail")
st.caption("Full story text and audio playback will appear here.")
