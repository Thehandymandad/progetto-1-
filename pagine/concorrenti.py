import pandas as pd
import streamlit as st

from core import ai, analisi, ui, youtube
from core.stato import salva_analisi

st.title("🏆 Concorrenti")
st.write(
    "Incolla i link dei canali concorrenti (uno per riga). Puoi usare anche il tuo canale "
    "attuale. L'app analizza i loro ultimi video lunghi e trova cosa funziona."
)

canali_testo = st.text_area(
    "Canali", placeholder="https://www.youtube.com/@nomecanale\n@altrocanale", height=130
)
quanti = st.select_slider("Ultimi video da analizzare per canale", options=[10, 25, 50, 100], value=50)
link = [r.strip() for r in canali_testo.splitlines() if r.strip()][:10]
st.caption(f"Costo: circa {len(link) * (3 + quanti // 25)} unità di quota YouTube.")

if st.button("🔍 Analizza i canali", type="primary", disabled=not link):
    try:
        with st.spinner("Scarico i video dei canali…"):
            ids_canali = tuple(dict.fromkeys(youtube.risolvi_canale(l) for l in link))
            canali = youtube.dettagli_canali(ids_canali)
            ids_video = []
            for canale in canali.values():
                ids_video += youtube.ultimi_video_canale(canale["playlist_upload"], quanti)
            video = youtube.dettagli_video(tuple(ids_video))
        video = [v for v in video if v["canale_id"] in canali]
        df = analisi.outlier_su_mediana(analisi.tabella_video(video, canali))
        st.session_state["concorrenti"] = (df, canali)
    except youtube.ErroreYouTube as e:
        st.error(str(e))

if "concorrenti" in st.session_state:
    df, canali = st.session_state["concorrenti"]
    if df.empty:
        st.info("Nessun video lungo trovato per questi canali.")
        st.stop()

    st.subheader("Panoramica canali")
    righe = []
    for canale_id, gruppo in df.groupby("canale_id"):
        c = canali[canale_id]
        settimane = max((gruppo["pubblicato"].max() - gruppo["pubblicato"].min()).days / 7, 1)
        righe.append(
            {
                "canale": c["nome"],
                "iscritti": c["iscritti"],
                "video_analizzati": len(gruppo),
                "views_mediane": int(gruppo["views"].median()),
                "video_a_settimana": round(len(gruppo) / settimane, 1),
                "durata_mediana_min": gruppo["durata_min"].median(),
                "like_%_mediano": gruppo["like_%"].median(),
            }
        )
    panoramica = pd.DataFrame(righe).sort_values("iscritti", ascending=False)
    st.dataframe(
        panoramica,
        hide_index=True,
        width="stretch",
        column_config={
            "iscritti": st.column_config.NumberColumn("Iscritti", format="compact"),
            "views_mediane": st.column_config.NumberColumn("Views mediane", format="compact"),
        },
    )

    st.subheader("I video che hanno funzionato meglio")
    st.caption("Outlier = views del video ÷ mediana delle views dei video recenti dello stesso canale.")
    ui.tabella_video(df.head(30), chiave="concorrenti")

    st.subheader("Pattern")
    p = analisi.pattern(df)
    scheda_durata, scheda_giorno, scheda_ora, scheda_titolo = st.tabs(
        ["Durata", "Giorno", "Ora", "Titoli"]
    )
    with scheda_durata:
        st.bar_chart(p["durata"]["outlier_mediano"], y_label="Outlier mediano")
        st.dataframe(p["durata"], width="stretch")
    with scheda_giorno:
        st.bar_chart(p["giorno"]["outlier_mediano"], y_label="Outlier mediano")
        st.dataframe(p["giorno"], width="stretch")
    with scheda_ora:
        st.bar_chart(p["ora"]["outlier_mediano"], y_label="Outlier mediano", x_label="Ora (Italia)")
    with scheda_titolo:
        st.dataframe(
            p["titolo"],
            width="stretch",
            column_config={
                "outlier_con": st.column_config.NumberColumn("Outlier se presente", format="x%.1f"),
                "outlier_senza": st.column_config.NumberColumn("Outlier se assente", format="x%.1f"),
            },
        )
        st.caption("Se 'presente' è molto più alto di 'assente', quella caratteristica sembra aiutare.")

    st.subheader("Il parere di Claude")
    if st.button("🤖 Analizza i concorrenti con Claude"):
        testo_pattern = "\n\n".join(f"### {nome}\n{tab.to_string()}" for nome, tab in p.items())
        try:
            testo = ai.chiedi(
                ai.prompt_concorrenti(
                    panoramica.to_string(index=False),
                    analisi.video_per_prompt(df, 25),
                    analisi.video_per_prompt(df.sort_values("outlier"), 10),
                    testo_pattern,
                ),
                effort="high",
            )
            salva_analisi("concorrenti", "Analisi concorrenti", testo)
        except ai.ErroreAI as e:
            st.error(str(e))
    else:
        ui.mostra_analisi_salvata("concorrenti")
