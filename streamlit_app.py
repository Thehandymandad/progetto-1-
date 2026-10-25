"""YouTube Coach — punto di ingresso dell'app Streamlit."""

import streamlit as st

from core.auth import richiedi_password

st.set_page_config(page_title="YouTube Coach", page_icon="🎬", layout="wide")

if not richiedi_password():
    st.stop()

pagine = [
    st.Page("pagine/home.py", title="Home", icon="🏠", default=True),
    st.Page("pagine/nicchia.py", title="Trova la nicchia", icon="🧭"),
    st.Page("pagine/outlier.py", title="Video outlier", icon="🚀"),
    st.Page("pagine/concorrenti.py", title="Concorrenti", icon="🏆"),
    st.Page("pagine/copertine.py", title="Copertine", icon="🖼️"),
    st.Page("pagine/commenti.py", title="Commenti", icon="💬"),
    st.Page("pagine/idee.py", title="Idee e hook", icon="💡"),
    st.Page("pagine/report.py", title="Raccolta e report", icon="📁"),
]
st.navigation(pagine).run()
