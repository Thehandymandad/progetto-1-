"""Lettura delle chiavi segrete (da Streamlit Secrets o variabili d'ambiente)."""

import os

import streamlit as st

CHIAVI = {
    "YOUTUBE_API_KEY": "Chiave API di YouTube (Google Cloud)",
    "ANTHROPIC_API_KEY": "Chiave API di Claude (Anthropic)",
    "APP_PASSWORD": "Password per entrare nell'app",
}


def segreto(nome: str) -> str | None:
    try:
        valore = st.secrets.get(nome)
    except Exception:  # nessun file secrets.toml
        valore = None
    return valore or os.environ.get(nome)


def chiavi_mancanti() -> list[str]:
    return [nome for nome in CHIAVI if not segreto(nome)]
