"""La "raccolta" di video e le analisi salvate, condivise tra tutte le pagine.

Restano in memoria finché la sessione è aperta: per conservarle scarica il report
dalla pagina "Raccolta e report".
"""

from datetime import datetime

import pandas as pd
import streamlit as st


def _raccolta() -> dict[str, dict]:
    return st.session_state.setdefault("raccolta", {})


def aggiungi_alla_raccolta(df: pd.DataFrame) -> int:
    raccolta = _raccolta()
    nuovi = 0
    for riga in df.to_dict("records"):
        if riga["id"] not in raccolta:
            nuovi += 1
        raccolta[riga["id"]] = riga
    return nuovi


def rimuovi_dalla_raccolta(ids: list[str]) -> None:
    for video_id in ids:
        _raccolta().pop(video_id, None)


def raccolta() -> pd.DataFrame:
    righe = list(_raccolta().values())
    if not righe:
        return pd.DataFrame()
    return pd.DataFrame(righe).sort_values("outlier", ascending=False).reset_index(drop=True)


def svuota_raccolta() -> None:
    st.session_state["raccolta"] = {}


def salva_analisi(chiave: str, titolo: str, testo: str) -> None:
    st.session_state.setdefault("analisi", {})[chiave] = {
        "titolo": titolo,
        "testo": testo,
        "quando": datetime.now().strftime("%d/%m/%Y %H:%M"),
    }


def analisi() -> dict[str, dict]:
    return st.session_state.setdefault("analisi", {})


def nicchia() -> str:
    return st.session_state.get("nicchia", "")


def imposta_nicchia(valore: str) -> None:
    st.session_state["nicchia"] = valore
