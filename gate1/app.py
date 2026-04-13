"""Origins — landing page with Supabase email/password auth."""

import streamlit as st

from auth import (
    format_auth_error,
    get_supabase,
    init_auth,
    is_authenticated,
    logout,
    persist_session_from_response,
)

st.set_page_config(
    page_title="Origins",
    page_icon="📖",
    layout="centered",
)

init_auth()

try:
    get_supabase()
except RuntimeError as e:
    st.error(str(e))
    st.stop()

st.title("Origins")
st.markdown(
    """
**Origins** is an AI-powered life story capture tool: an interviewer asks questions,
you answer by voice or text, and stories are organized into a chronological timeline
with photos.
"""
)

if is_authenticated():
    email = st.session_state.get("user_email", "your account")
    st.success(f"Signed in as **{email}**")
    c1, c2 = st.columns(2)
    with c1:
        if st.button("Log out", type="primary"):
            logout()
            st.rerun()
    with c2:
        st.page_link("pages/1_dashboard.py", label="Go to Dashboard →")
    st.divider()
    st.caption("Use the sidebar to open Dashboard, Interview, Timeline, or Story detail.")
else:
    tab_login, tab_signup = st.tabs(["Log in", "Sign up"])

    with tab_login:
        le = st.text_input("Email", key="login_email", autocomplete="email")
        lp = st.text_input("Password", type="password", key="login_password")
        if st.button("Log in", type="primary"):
            if not le or not lp:
                st.warning("Enter email and password.")
            else:
                try:
                    client = get_supabase()
                    res = client.auth.sign_in_with_password(
                        {"email": le.strip(), "password": lp}
                    )
                    if res.session:
                        persist_session_from_response(res.session)
                        st.rerun()
                    else:
                        st.error("No session returned. Try again or confirm your email.")
                except Exception as err:
                    st.error(format_auth_error(err))

    with tab_signup:
        se = st.text_input("Email", key="signup_email", autocomplete="email")
        sp = st.text_input("Password", type="password", key="signup_password")
        sp2 = st.text_input("Confirm password", type="password", key="signup_password2")
        if st.button("Create account", type="primary"):
            if not se or not sp:
                st.warning("Enter email and password.")
            elif sp != sp2:
                st.warning("Passwords do not match.")
            elif len(sp) < 6:
                st.warning("Use at least 6 characters for your password.")
            else:
                try:
                    client = get_supabase()
                    res = client.auth.sign_up(
                        {"email": se.strip(), "password": sp}
                    )
                    if res.session:
                        persist_session_from_response(res.session)
                        st.rerun()
                    else:
                        st.success("Check your email to finish signing up, then log in.")
                except Exception as err:
                    st.error(format_auth_error(err))
