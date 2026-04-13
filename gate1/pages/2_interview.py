"""AI interview session — placeholder."""

import streamlit as st

from auth import require_auth

st.set_page_config(page_title="Interview — Origins", page_icon="🎙️", layout="wide")

require_auth()

st.title("Interview")
st.caption("AI interviewer session will run here.")
