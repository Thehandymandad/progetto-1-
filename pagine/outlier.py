import streamlit as st

from core import analisi, stato, ui, youtube

st.title("🚀 Video outlier")
st.write(
    "Un **outlier** è un video che ha fatto molte più views del solito per il suo canale. "
    "È il segnale più forte che un'idea (titolo + copertina + argomento) funziona davvero, "
    "indipendentemente da quanto è grande il canale."
)

ricerca = st.text_input("Cosa cerchi?", value=stato.nicchia(), placeholder="es. finanza personale")
col1, col2 = st.columns(2)
mesi = col1.select_slider("Pubblicati negli ultimi", options=[1, 3, 6, 12, 24], value=6,
                          format_func=lambda m: f"{m} mesi")
ordine = col2.radio("Ordina la ricerca per", ["Più visti", "Più pertinenti"], horizontal=True)
col3, col4 = st.columns(2)
outlier_minimo = col3.slider("Outlier minimo", 1.0, 20.0, 2.0, 0.5, format="x%.1f")
iscritti_max = col4.select_slider(
    "Canali fino a (iscritti)",
    options=[1_000, 10_000, 50_000, 100_000, 500_000, 1_000_000, 10**10],
    value=10**10,
    format_func=lambda n: "qualsiasi" if n == 10**10 else analisi.formatta_numero(n),
)
st.caption("Costo: circa 102 unità di quota YouTube per ricerca.")

if st.button("🔍 Cerca outlier", type="primary", disabled=not ricerca.strip()):
    try:
        with st.spinner("Cerco i video…"):
            ids = youtube.cerca_video(
                ricerca.strip(),
                youtube.data_inizio(mesi),
                ordine="viewCount" if ordine == "Più visti" else "relevance",
            )
            video = youtube.dettagli_video(tuple(ids))
            canali = youtube.dettagli_canali(tuple(sorted({v["canale_id"] for v in video})))
        st.session_state["outlier"] = analisi.tabella_video(video, canali)
    except youtube.ErroreYouTube as e:
        st.error(str(e))

df = st.session_state.get("outlier")
if df is not None:
    if df.empty:
        st.info("Nessun video lungo trovato. Prova un'altra ricerca.")
    else:
        filtrati = df[(df["outlier"] >= outlier_minimo) & (df["iscritti"].fillna(0) <= iscritti_max)]
        st.subheader(f"{len(filtrati)} outlier su {len(df)} video lunghi trovati")
        ui.tabella_video(filtrati.reset_index(drop=True), chiave="outlier")
        if filtrati.empty:
            st.caption("Abbassa l'outlier minimo o allarga il filtro sugli iscritti.")
