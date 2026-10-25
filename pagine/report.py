from datetime import datetime

import streamlit as st

from core import analisi, stato, ui

st.title("📁 Raccolta e report")

df = ui.stato_raccolta()
if not df.empty:
    st.subheader("Video nella raccolta")
    colonne = [c for c in ui.COLONNE if c in df.columns]
    evento = st.dataframe(
        df[colonne],
        column_config=ui.COLONNE,
        hide_index=True,
        width="stretch",
        row_height=60,
        on_select="rerun",
        selection_mode="multi-row",
        key="tabella_raccolta",
    )
    selezionati = evento.selection.rows
    col1, col2 = st.columns(2)
    if col1.button(f"🗑️ Rimuovi selezionati ({len(selezionati)})", disabled=not selezionati, width="stretch"):
        stato.rimuovi_dalla_raccolta(df.iloc[selezionati]["id"].tolist())
        st.rerun()
    if col2.button("🧹 Svuota la raccolta", width="stretch"):
        stato.svuota_raccolta()
        st.rerun()

salvate = stato.analisi()
st.subheader("Analisi salvate")
if not salvate:
    st.caption("Ancora nessuna analisi. Le trovi qui dopo averle fatte nelle altre pagine.")
for a in salvate.values():
    with st.expander(f"{a['titolo']} ({a['quando']})"):
        st.markdown(a["testo"])

if salvate or not df.empty:
    oggi = datetime.now().strftime("%d/%m/%Y")
    parti = [f"# Report YouTube Coach — {oggi}"]
    if stato.nicchia():
        parti.append(f"**Nicchia:** {stato.nicchia()}")
    for a in salvate.values():
        parti.append(f"## {a['titolo']}\n_{a['quando']}_\n\n{a['testo']}")
    if not df.empty:
        righe = [
            f"- [{v['titolo']}]({v['url']}) — {v['canale']} · "
            f"{analisi.formatta_numero(v['views'])} views · outlier x{v['outlier']}"
            for v in df.to_dict("records")
        ]
        parti.append("## Video nella raccolta\n" + "\n".join(righe))
    st.download_button(
        "⬇️ Scarica il report",
        data="\n\n".join(parti),
        file_name=f"report-youtube-{datetime.now():%Y-%m-%d}.md",
        mime="text/markdown",
        type="primary",
        width="stretch",
    )
    st.caption("Il file .md si apre con l'app File dell'iPhone, Note o qualsiasi editor di testo.")
