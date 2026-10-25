import streamlit as st

from core import ai, analisi, stato, ui

st.title("🖼️ Copertine")
st.write(
    "Claude guarda le copertine dei video nella raccolta e confronta quelle che hanno "
    "funzionato meglio con quelle andate peggio, per capire cosa fa cliccare il tuo pubblico."
)

df = ui.stato_raccolta()
if len(df) < 3:
    if not df.empty:
        st.info("Servono almeno 3 video nella raccolta.")
    st.stop()

df = df[df["copertina"].astype(bool)].reset_index(drop=True)
n_migliori = len(df)
if len(df) > 3:
    n_migliori = st.slider("Copertine migliori da analizzare", 3, min(15, len(df)), min(8, len(df)))
rimaste = len(df) - n_migliori
n_peggiori = 0
if rimaste > 0:
    n_peggiori = st.slider("Copertine peggiori per confronto", 0, min(6, rimaste), min(4, rimaste))
migliori = df.head(n_migliori)
peggiori = df.tail(n_peggiori) if n_peggiori else df.head(0)

st.subheader("🏅 Migliori")
ui.griglia_copertine(migliori)
if not peggiori.empty:
    st.subheader("📉 Peggiori")
    ui.griglia_copertine(peggiori)

st.subheader("Analisi di Claude")
st.caption(f"Costo indicativo: qualche decina di centesimi per {n_migliori + n_peggiori} immagini.")
if st.button("🤖 Analizza le copertine", type="primary"):
    blocchi = [
        {
            "gruppo": gruppo,
            "titolo": v["titolo"],
            "views": analisi.formatta_numero(v["views"]),
            "outlier": v["outlier"],
            "copertina": v["copertina"],
        }
        for gruppo, tabella in (("tra i migliori", migliori), ("tra i peggiori", peggiori))
        for v in tabella.to_dict("records")
    ]
    try:
        testo = ai.chiedi(ai.prompt_copertine(blocchi), effort="high")
        stato.salva_analisi("copertine", "Analisi copertine", testo)
    except ai.ErroreAI as e:
        st.error(str(e))
else:
    ui.mostra_analisi_salvata("copertine")
