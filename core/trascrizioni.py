"""Trascrizione dell'apertura dei video (i primi secondi, dove c'è l'hook)."""

import streamlit as st
from youtube_transcript_api import YouTubeTranscriptApi


@st.cache_data(ttl=24 * 60 * 60, show_spinner=False)
def apertura(video_id: str, secondi: int = 60) -> str | None:
    """Testo parlato nei primi `secondi` del video, o None se non disponibile.

    YouTube a volte blocca le trascrizioni richieste dai server cloud: in quel caso
    l'app continua senza, usando solo titoli, copertine e commenti.
    """
    try:
        trascrizione = YouTubeTranscriptApi().fetch(video_id, languages=["it", "en"])
    except Exception:
        return None
    testo = " ".join(pezzo.text for pezzo in trascrizione if pezzo.start < secondi)
    return testo.strip() or None
