"""Protezione con password, così nessun altro consuma le tue chiavi API."""

import hmac

import streamlit as st

from core import config


def richiedi_password() -> bool:
    password_attesa = config.segreto("APP_PASSWORD")
    if not password_attesa:
        st.error(
            "Manca la password dell'app. Aggiungi `APP_PASSWORD` nei Secrets di "
            "Streamlit (vedi la guida nel README)."
        )
        return False
    if st.session_state.get("autenticato"):
        return True

    st.title("🎬 YouTube Coach")
    with st.form("login"):
        password = st.text_input("Password", type="password")
        if st.form_submit_button("Entra", type="primary"):
            if hmac.compare_digest(password.encode(), password_attesa.encode()):
                st.session_state["autenticato"] = True
                st.rerun()
            st.error("Password sbagliata.")
    return False
