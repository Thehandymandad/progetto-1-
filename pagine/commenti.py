import streamlit as st

from core import ai, stato, ui, youtube

st.title("💬 Commenti")
st.write(
    "L'app legge i commenti più rilevanti dei video scelti e Claude ne estrae richieste "
    "di nuovi video, domande frequenti, lamentele e cosa piace al pubblico."
)

df = ui.stato_raccolta()
if df.empty:
    st.stop()

con_commenti = df[df["commenti"].fillna(0) > 0]
if con_commenti.empty:
    st.info("Nessun video della raccolta ha commenti visibili.")
    st.stop()

titoli = dict(zip(con_commenti["id"], con_commenti["titolo"]))
predefiniti = con_commenti.sort_values("commenti", ascending=False)["id"].head(5).tolist()
scelti = st.multiselect(
    "Video da analizzare (massimo 10)",
    options=list(titoli),
    default=predefiniti,
    format_func=lambda i: titoli[i],
    max_selections=10,
)
per_video = st.select_slider("Commenti per video", options=[25, 50, 100, 200], value=100)
st.caption(f"Costo: circa {len(scelti) * max(per_video // 100, 1)} unità di quota YouTube.")

if st.button("📥 Leggi i commenti", type="primary", disabled=not scelti):
    try:
        with st.spinner("Scarico i commenti…"):
            st.session_state["commenti"] = {v: youtube.commenti(v, per_video) for v in scelti}
    except youtube.ErroreYouTube as e:
        st.error(str(e))

letti: dict[str, list[dict]] = st.session_state.get("commenti", {})
if letti:
    totale = sum(len(c) for c in letti.values())
    st.subheader(f"{totale} commenti letti")
    for video_id, lista in letti.items():
        with st.expander(f"{titoli.get(video_id, video_id)} — {len(lista)} commenti"):
            if not lista:
                st.caption("Commenti disattivati per questo video.")
            for c in lista[:20]:
                st.markdown(f"> {c['testo']}\n\n👍 {c['like']} · 💬 {c['risposte']} risposte")
            if len(lista) > 20:
                st.caption(f"…e altri {len(lista) - 20} (Claude li legge tutti).")

    if st.button("🤖 Analizza i commenti con Claude"):
        blocchi = "\n\n".join(
            f"## Video: \"{titoli.get(video_id, video_id)}\"\n"
            + "\n".join(f"- ({c['like']} like) {c['testo'][:600]}" for c in lista)
            for video_id, lista in letti.items()
            if lista
        )
        try:
            testo = ai.chiedi(ai.prompt_commenti(blocchi), effort="high")
            stato.salva_analisi("commenti", "Analisi commenti", testo)
        except ai.ErroreAI as e:
            st.error(str(e))
    else:
        ui.mostra_analisi_salvata("commenti")
else:
    ui.mostra_analisi_salvata("commenti")
