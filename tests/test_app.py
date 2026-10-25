"""Test dell'app con dati finti: nessuna chiamata reale a YouTube o Claude."""

from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

import pytest
import streamlit as st
from streamlit.testing.v1 import AppTest

from core import analisi, youtube

APP = Path(__file__).resolve().parent.parent / "streamlit_app.py"
SEGRETI = {"YOUTUBE_API_KEY": "finta", "ANTHROPIC_API_KEY": "finta", "APP_PASSWORD": "segreta"}


def _data(giorni_fa: int) -> str:
    return (datetime.now(timezone.utc) - timedelta(days=giorni_fa)).strftime("%Y-%m-%dT%H:%M:%SZ")


def finto_get(endpoint: str, **params) -> dict:
    if endpoint == "search":
        return {"items": [{"id": {"videoId": f"v{i}"}} for i in range(12)]}
    if endpoint == "playlistItems":
        return {"items": [{"contentDetails": {"videoId": f"v{i}"}} for i in range(12)]}
    if endpoint == "videos":
        ids = params["id"].split(",")
        return {
            "items": [
                {
                    "id": v,
                    "snippet": {
                        "title": f"Video {n}: 5 TRUCCHI che nessuno ti dice?" if n % 2 else f"Video {n} vlog",
                        "channelId": f"UC{n % 3:022d}",
                        "channelTitle": f"Canale {n % 3}",
                        "publishedAt": _data(10 + n * 7),
                        "thumbnails": {"high": {"url": f"https://i.ytimg.com/vi/{v}/hqdefault.jpg"}},
                    },
                    "statistics": {
                        "viewCount": str(1000 * (n + 1) ** 2),
                        "likeCount": str(50 * (n + 1)),
                        "commentCount": str(5 * n),
                    },
                    # un video su 4 è uno Short e va escluso
                    "contentDetails": {"duration": "PT45S" if n % 4 == 3 else f"PT{5 + n * 3}M10S"},
                }
                for v in ids
                for n in [int(v[1:])]
            ]
        }
    if endpoint == "channels":
        if "forHandle" in params or "forUsername" in params:
            return {"items": [{"id": "UC" + "0" * 22}]}
        return {
            "items": [
                {
                    "id": c,
                    "snippet": {"title": f"Canale {c[-1]}", "customUrl": f"@canale{c[-1]}"},
                    "statistics": {
                        "subscriberCount": str(20_000 * (int(c[-1]) + 1)),
                        "viewCount": "2000000",
                        "videoCount": "100",
                    },
                    "contentDetails": {"relatedPlaylists": {"uploads": "UU" + c[2:]}},
                }
                for c in params["id"].split(",")
            ]
        }
    if endpoint == "commentThreads":
        return {
            "items": [
                {
                    "snippet": {
                        "topLevelComment": {"snippet": {"textDisplay": f"Fai un video su {i}!", "likeCount": i}},
                        "totalReplyCount": 0,
                    }
                }
                for i in range(5)
            ]
        }
    raise AssertionError(endpoint)


@pytest.fixture(autouse=True)
def dati_finti():
    st.cache_data.clear()
    with (
        patch.object(youtube, "_get", finto_get),
        patch("core.ai.chiedi", return_value="**Analisi finta di Claude**"),
        patch("core.trascrizioni.apertura", return_value="Ciao a tutti, oggi vi mostro…"),
    ):
        yield


def app_autenticata() -> AppTest:
    at = AppTest.from_file(str(APP), default_timeout=30)
    for k, v in SEGRETI.items():
        at.secrets[k] = v
    at.run()
    at.text_input[0].input("segreta")
    at.button[0].click().run()
    assert not at.exception
    return at


def bottone(at: AppTest, inizio: str):
    return next(b for b in at.button if b.label.startswith(inizio))


def test_password_sbagliata_blocca():
    at = AppTest.from_file(str(APP))
    for k, v in SEGRETI.items():
        at.secrets[k] = v
    at.run()
    at.text_input[0].input("sbagliata")
    at.button[0].click().run()
    assert at.error and "sbagliata" in at.error[0].value
    assert "autenticato" not in at.session_state


def test_percorso_completo():
    at = app_autenticata()
    assert at.title[0].value == "🎬 YouTube Coach"

    at.switch_page("pagine/nicchia.py").run()
    at.text_area[0].input("cucina\nviaggi").run()
    bottone(at, "🔍 Confronta").click().run()
    assert not at.exception
    assert set(at.session_state["nicchie"]) == {"cucina", "viaggi"}
    bottone(at, "🤖 Chiedi").click().run()
    assert not at.exception
    bottone(at, "⭐ Scelgo «cucina»").click().run()
    assert at.session_state["nicchia"] == "cucina"

    at.switch_page("pagine/outlier.py").run()
    assert at.text_input[0].value == "cucina"
    bottone(at, "🔍 Cerca").click().run()
    assert not at.exception
    bottone(at, "➕ Aggiungi tutti").click().run()
    assert len(at.session_state["raccolta"]) > 0

    at.switch_page("pagine/concorrenti.py").run()
    at.text_area[0].input("https://www.youtube.com/@canale0").run()
    bottone(at, "🔍 Analizza").click().run()
    assert not at.exception
    bottone(at, "🤖 Analizza").click().run()
    assert not at.exception
    bottone(at, "➕ Aggiungi tutti").click().run()

    at.switch_page("pagine/copertine.py").run()
    assert not at.exception
    bottone(at, "🤖 Analizza le copertine").click().run()
    assert not at.exception

    at.switch_page("pagine/commenti.py").run()
    bottone(at, "📥 Leggi").click().run()
    assert not at.exception
    bottone(at, "🤖 Analizza i commenti").click().run()
    assert not at.exception

    at.switch_page("pagine/idee.py").run()
    bottone(at, "🤖 Genera").click().run()
    assert not at.exception

    at.switch_page("pagine/report.py").run()
    assert not at.exception
    assert set(at.session_state["analisi"]) == {"nicchie", "concorrenti", "copertine", "commenti", "idee"}
    assert at.get("download_button")


def test_pagine_con_raccolta_vuota():
    at = app_autenticata()
    for pagina in ["copertine", "commenti", "idee", "report", "home"]:
        at.switch_page(f"pagine/{pagina}.py").run()
        assert not at.exception, pagina


def test_parse_durata():
    assert youtube.parse_durata("PT1H2M3S") == 3723
    assert youtube.parse_durata("PT45S") == 45
    assert youtube.parse_durata("P1DT1M") == 86460
    assert youtube.parse_durata("") == 0


def test_tabella_e_punteggio():
    video = youtube.dettagli_video(tuple(f"v{i}" for i in range(12)))
    canali = youtube.dettagli_canali(tuple(sorted({v["canale_id"] for v in video})))
    df = analisi.tabella_video(video, canali)
    assert (df["durata_sec"] >= analisi.DURATA_MINIMA_SEC).all()
    assert len(df) == 9
    assert df["outlier"].is_monotonic_decreasing
    p = analisi.punteggio_nicchia(df)
    assert 0 <= p["punteggio"] <= 100
    assert set(analisi.pattern(df)) == {"giorno", "ora", "durata", "titolo"}


def test_formatta_numero():
    assert analisi.formatta_numero(1_500_000) == "1,5 M"
    assert analisi.formatta_numero(10_000) == "10 k"
    assert analisi.formatta_numero(None) == "—"
