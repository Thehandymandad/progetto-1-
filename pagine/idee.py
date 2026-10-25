import streamlit as st

from core import ai, analisi, stato, trascrizioni, ui

st.title("💡 Idee e hook")
st.write(
    "Claude mette insieme i video della raccolta e tutte le analisi salvate (nicchia, "
    "concorrenti, copertine, commenti) e ti propone 10 video da fare, con titoli, "
    "copertina, hook dei primi 30 secondi e scaletta."
)

df = ui.stato_raccolta()
if df.empty:
    st.stop()

nicchia = st.text_input("La tua nicchia", value=stato.nicchia(), placeholder="es. finanza personale")
note = st.text_area(
    "Note per Claude (facoltative)",
    placeholder="es. Voglio fare video senza mostrare il volto, ho un budget basso, "
    "posso pubblicare 1 video a settimana…",
)
usa_trascrizioni = st.toggle(
    "Leggi l'apertura dei 5 video migliori (per studiare gli hook)",
    value=True,
    help="Su alcuni video YouTube non rende disponibile la trascrizione: in quel caso li salta.",
)

salvate = stato.analisi()
if salvate:
    st.caption("Analisi che verranno usate: " + ", ".join(a["titolo"] for a in salvate.values()))
else:
    st.caption("Nessuna analisi salvata: per idee migliori fai prima Copertine e Commenti.")

if st.button("🤖 Genera le idee", type="primary", disabled=not nicchia.strip()):
    stato.imposta_nicchia(nicchia.strip())
    aperture = []
    if usa_trascrizioni:
        with st.spinner("Leggo come iniziano i video migliori…"):
            for v in df.head(5).to_dict("records"):
                testo = trascrizioni.apertura(v["id"])
                if testo:
                    aperture.append(f"### \"{v['titolo']}\" (outlier x{v['outlier']})\n{testo}")
        if not aperture:
            st.caption("Trascrizioni non disponibili per questi video: procedo senza.")
    precedenti = "\n\n".join(
        f"### {a['titolo']}\n{a['testo']}" for k, a in salvate.items() if k != "idee"
    )
    try:
        testo = ai.chiedi(
            ai.prompt_idee(
                nicchia.strip(),
                analisi.video_per_prompt(df, 40),
                precedenti,
                "\n\n".join(aperture),
                note.strip(),
            ),
            effort="high",
        )
        stato.salva_analisi("idee", "Idee per i prossimi video", testo)
    except ai.ErroreAI as e:
        st.error(str(e))
else:
    ui.mostra_analisi_salvata("idee")
