"""Supabase Auth helpers and session state for Streamlit."""

from __future__ import annotations

import os

import streamlit as st
from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()


def format_auth_error(err: Exception) -> str:
    """Short English messages for demo UI."""
    msg = str(err).strip()
    code = getattr(err, "code", None)
    if code == "email_not_confirmed":
        return "Please confirm your email before signing in."
    low = msg.lower()
    if "invalid login credentials" in low or "invalid credentials" in low:
        return "Invalid email or password."
    return msg


def _clear_tokens() -> None:
    for key in ("supabase_access_token", "supabase_refresh_token", "user_email"):
        st.session_state.pop(key, None)


def persist_session_from_response(session) -> None:
    """Store JWT session in st.session_state after sign-in or sign-up."""
    if session is None:
        return
    st.session_state["supabase_access_token"] = session.access_token
    st.session_state["supabase_refresh_token"] = session.refresh_token
    user = getattr(session, "user", None)
    if user and getattr(user, "email", None):
        st.session_state["user_email"] = user.email


def get_supabase() -> Client:
    """Create a client and attach the current user's session from session_state."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY must be set (copy .env.example to .env)."
        )
    client = create_client(url, key)
    access = st.session_state.get("supabase_access_token")
    refresh = st.session_state.get("supabase_refresh_token")
    if access and refresh:
        try:
            client.auth.set_session(access, refresh)
        except Exception:
            _clear_tokens()
    return client


def init_auth() -> None:
    """Restore Supabase session on each run when tokens exist."""
    access = st.session_state.get("supabase_access_token")
    refresh = st.session_state.get("supabase_refresh_token")
    if not access or not refresh:
        return
    try:
        client = get_supabase()
        sess = client.auth.get_session()
        if sess is None:
            resp = client.auth.refresh_session(refresh)
            if resp.session:
                persist_session_from_response(resp.session)
    except Exception:
        _clear_tokens()


def is_authenticated() -> bool:
    if not st.session_state.get("supabase_access_token"):
        return False
    try:
        client = get_supabase()
        sess = client.auth.get_session()
        return sess is not None and getattr(sess, "user", None) is not None
    except Exception:
        return False


def logout() -> None:
    try:
        client = get_supabase()
        client.auth.sign_out()
    except Exception:
        pass
    _clear_tokens()


def require_auth() -> None:
    """Stop rendering the page if the user is not signed in."""
    init_auth()
    if is_authenticated():
        return
    st.warning("Please sign in to view this page.")
    st.page_link("app.py", label="← Back to home / sign in")
    st.stop()
