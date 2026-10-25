import pandas as pd
import streamlit as st

from core import ai, analisi, stato, ui, youtube

st.title("🧭 Trova la nicchia")
st.write(
    "Scrivi da 2 a 5 argomenti che ti interessano (uno per riga). L'app cerca i video lunghi "
    "più visti per ognuno e li confronta: quanta domanda c'è, quanto è affollato e quanti "
    "canali piccoli riescono a fare numeri grandi."
)

argomenti_testo = st.text_area(
    "Argomenti", placeholder="finanza personale\nricette veloci\nviaggi low cost", height=130
)
mesi = st.select_slider("Video pubblicati negli ultimi", options=[3, 6, 12, 24], value=12,
                        format_func=lambda m: f"{m} mesi")
argomenti = [a.strip() for a in argomenti_testo.splitlines() if a.strip()][:5]
if argomenti:
    st.caption(f"Costo: circa {len(argomenti) * 102} unità di quota YouTube su 10.000 giornaliere.")

if st.button("🔍 Confronta gli argomenti", type="primary", disabled=not argomenti):
    risultati = {}
    barra = st.progress(0.0)
    try:
        for i, argomento in enumerate(argomenti):
            barra.progress(i / len(argomenti), text=f"Analizzo «{argomento}»…")
            ids = youtube.cerca_video(argomento, youtube.data_inizio(mesi))
            video = youtube.dettagli_video(tuple(ids))
            canali = youtube.dettagli_canali(tuple(sorted({v["canale_id"] for v in video})))
            risultati[argomento] = analisi.tabella_video(video, canali)
        barra.empty()
        st.session_state["nicchie"] = risultati
    except youtube.ErroreYouTube as e:
        barra.empty()
        st.error(str(e))

risultati: dict[str, pd.DataFrame] = st.session_state.get("nicchie", {})
if risultati:
    punteggi = pd.DataFrame(
        {argomento: analisi.punteggio_nicchia(df) for argomento, df in risultati.items()}
    ).T.sort_values("punteggio", ascending=False)

    st.subheader("Confronto")
    st.bar_chart(punteggi["punteggio"], horizontal=True, y_label="", x_label="Punteggio opportunità (0-100)")
    st.dataframe(
        punteggi,
        width="stretch",
        column_config={
            "punteggio": st.column_config.ProgressColumn("Punteggio", min_value=0, max_value=100, format="%d"),
            "views_mediane": st.column_config.NumberColumn("Views mediane", format="compact"),
            "views_giorno_mediane": st.column_config.NumberColumn("Views/giorno mediane", format="compact"),
            "iscritti_mediani": st.column_config.NumberColumn("Iscritti mediani", format="compact"),
        },
    )
    with st.expander("Come leggere il punteggio"):
        st.markdown(
            """
- **Domanda (40%)**: quante views al giorno fanno i video più visti dell'argomento.
- **Spazio per i piccoli (30%)**: quota di quei video pubblicati da canali sotto i 50.000 iscritti.
- **Outlier (30%)**: quota di video che fanno almeno il doppio della media del loro canale.
  Tanti outlier = il pubblico premia i video buoni, non solo i canali grandi.

È un indicatore per orientarti, non una verità assoluta: guarda anche i video qui sotto.
"""
        )

    st.subheader("I video più forti per argomento")
    for argomento, df in risultati.items():
        with st.expander(f"{argomento} — {len(df)} video lunghi"):
            ui.tabella_video(df.head(25), chiave=f"nicchia_{argomento}")
            if st.button(f"⭐ Scelgo «{argomento}» come nicchia", key=f"scegli_{argomento}"):
                stato.imposta_nicchia(argomento)
                st.toast(f"Nicchia impostata: {argomento}")

    st.subheader("Il parere di Claude")
    if st.button("🤖 Chiedi a Claude quale nicchia scegliere"):
        riassunto = punteggi.to_string()
        esempi = "\n\n".join(
            f"### {argomento}\n{analisi.video_per_prompt(df, 12)}" for argomento, df in risultati.items()
        )
        try:
            testo = ai.chiedi(ai.prompt_nicchie(riassunto, esempi), effort="high")
            stato.salva_analisi("nicchie", "Scelta della nicchia", testo)
        except ai.ErroreAI as e:
            st.error(str(e))
    else:
        ui.mostra_analisi_salvata("nicchie")
