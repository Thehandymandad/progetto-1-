import streamlit as st

from core import config, stato

st.title("🎬 YouTube Coach")
st.write("Analizza i video della tua nicchia e ti aiuta a creare video migliori.")

mancanti = config.chiavi_mancanti()
if mancanti:
    st.error(
        "Mancano queste chiavi nei Secrets di Streamlit: "
        + ", ".join(f"`{m}` ({config.CHIAVI[m]})" for m in mancanti)
    )
else:
    st.success("Chiavi API configurate ✅")

col1, col2, col3 = st.columns(3)
col1.metric("Video nella raccolta", len(stato.raccolta()))
col2.metric("Analisi salvate", len(stato.analisi()))
col3.metric("Nicchia scelta", stato.nicchia() or "—")

st.subheader("Come si usa")
st.markdown(
    """
1. **🧭 Trova la nicchia**: confronta 3-5 argomenti e scopri dove c'è più spazio per un canale nuovo.
2. **🚀 Video outlier**: cerca i video che hanno fatto molte più views del solito per il loro canale.
3. **🏆 Concorrenti**: incolla i link dei canali concorrenti e scopri cosa funziona per loro.
4. Aggiungi i video interessanti alla **raccolta** (pulsante ➕ sotto ogni tabella).
5. **🖼️ Copertine** e **💬 Commenti**: Claude analizza le copertine e legge i commenti dei video raccolti.
6. **💡 Idee e hook**: Claude mette insieme tutto e ti propone i prossimi video, con titolo,
   copertina, hook dei primi 30 secondi e scaletta.
7. **📁 Raccolta e report**: scarica tutto in un file, così non perdi niente.
"""
)

with st.expander("ℹ️ Quota di YouTube e costi"):
    st.markdown(
        """
- YouTube concede **10.000 unità al giorno** gratis. Ogni ricerca costa circa **100 unità**,
  tutto il resto 1-2 unità. Quindi circa **80-90 ricerche al giorno**.
- I risultati restano in memoria per 6 ore: ripetere la stessa ricerca non consuma quota.
- Ogni analisi con Claude costa in genere **da pochi centesimi a qualche decina di centesimi**.
- La raccolta e le analisi restano finché tieni aperta l'app. Se l'app si riavvia si perdono:
  scarica il report quando hai qualcosa di utile.
"""
    )
