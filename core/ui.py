"""Componenti grafici riusati dalle pagine."""

import pandas as pd
import streamlit as st

from core import stato
from core.analisi import formatta_numero

COLONNE = {
    "copertina": st.column_config.ImageColumn("Copertina", width="small"),
    "titolo": st.column_config.TextColumn("Titolo", width="large"),
    "canale": "Canale",
    "outlier": st.column_config.NumberColumn("Outlier", format="x%.1f", help="Views ÷ media del canale"),
    "views": st.column_config.NumberColumn("Views", format="compact"),
    "views_giorno": st.column_config.NumberColumn("Views/giorno", format="compact"),
    "iscritti": st.column_config.NumberColumn("Iscritti canale", format="compact"),
    "like_%": st.column_config.NumberColumn("Like %", format="%.2f%%"),
    "commenti": st.column_config.NumberColumn("Commenti", format="compact"),
    "durata_min": st.column_config.NumberColumn("Durata (min)", format="%.0f"),
    "giorni": st.column_config.NumberColumn("Giorni fa", format="%d"),
    "url": st.column_config.LinkColumn("Link", display_text="Apri ▶"),
}


def tabella_video(df: pd.DataFrame, chiave: str, aggiungi: bool = True) -> None:
    """Tabella dei video; se `aggiungi`, permette di selezionarli e metterli nella raccolta."""
    if df.empty:
        st.info("Nessun video trovato con questi criteri.")
        return
    colonne = [c for c in COLONNE if c in df.columns]
    evento = st.dataframe(
        df[colonne],
        column_config=COLONNE,
        hide_index=True,
        width="stretch",
        row_height=60,
        on_select="rerun" if aggiungi else "ignore",
        selection_mode="multi-row",
        key=f"tabella_{chiave}",
    )
    if not aggiungi:
        return
    selezionati = evento.selection.rows if evento else []
    col1, col2 = st.columns(2)
    if col1.button(
        f"➕ Aggiungi selezionati ({len(selezionati)})",
        key=f"agg_sel_{chiave}",
        disabled=not selezionati,
        width="stretch",
    ):
        nuovi = stato.aggiungi_alla_raccolta(df.iloc[selezionati])
        st.toast(f"{nuovi} video aggiunti alla raccolta")
    if col2.button(f"➕ Aggiungi tutti ({len(df)})", key=f"agg_tutti_{chiave}", width="stretch"):
        nuovi = stato.aggiungi_alla_raccolta(df)
        st.toast(f"{nuovi} video aggiunti alla raccolta")
    st.caption("Tocca la casella a sinistra di una riga per selezionarla.")


def griglia_copertine(df: pd.DataFrame, colonne: int = 3) -> None:
    righe = df.to_dict("records")
    for i in range(0, len(righe), colonne):
        celle = st.columns(colonne)
        for cella, v in zip(celle, righe[i : i + colonne]):
            with cella:
                st.image(v["copertina"], width="stretch")
                st.caption(f"**x{v['outlier']}** · {formatta_numero(v['views'])} views · {v['titolo']}")


def stato_raccolta() -> pd.DataFrame:
    """Mostra quanti video ci sono nella raccolta e la restituisce."""
    df = stato.raccolta()
    if df.empty:
        st.warning(
            "La raccolta è vuota. Prima trova dei video in **🧭 Trova la nicchia**, "
            "**🚀 Video outlier** o **🏆 Concorrenti** e aggiungili alla raccolta."
        )
    else:
        st.caption(f"📁 Nella raccolta ci sono **{len(df)} video**.")
    return df


def mostra_analisi_salvata(chiave: str) -> None:
    salvata = stato.analisi().get(chiave)
    if salvata:
        with st.expander(f"Ultima analisi salvata ({salvata['quando']})", expanded=True):
            st.markdown(salvata["testo"])
