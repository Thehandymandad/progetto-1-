"""Accesso ai dati pubblici di YouTube tramite la YouTube Data API v3.

Costo in "unità" della quota giornaliera (10.000 gratis al giorno):
- ricerca: 100 unità ogni 50 risultati
- dettagli video / canali / playlist / commenti: 1 unità per chiamata
I risultati restano in memoria per 6 ore, così ripetere un'analisi non consuma quota.
"""

import re
from datetime import datetime, timedelta, timezone

import requests
import streamlit as st

from core import config

API = "https://www.googleapis.com/youtube/v3"
CACHE_SECONDI = 6 * 60 * 60


class ErroreYouTube(Exception):
    pass


def _get(endpoint: str, **params) -> dict:
    chiave = config.segreto("YOUTUBE_API_KEY")
    if not chiave:
        raise ErroreYouTube("Manca la chiave YOUTUBE_API_KEY nei Secrets.")
    params["key"] = chiave
    try:
        risposta = requests.get(f"{API}/{endpoint}", params=params, timeout=30)
    except requests.RequestException as e:
        raise ErroreYouTube(f"Impossibile contattare YouTube: {e}") from e
    if risposta.status_code == 200:
        return risposta.json()

    try:
        errore = risposta.json().get("error", {})
    except ValueError:
        errore = {}
    motivo = (errore.get("errors") or [{}])[0].get("reason", "")
    if motivo in ("quotaExceeded", "dailyLimitExceeded"):
        raise ErroreYouTube(
            "Hai finito la quota giornaliera di YouTube (10.000 unità). "
            "Si azzera ogni giorno alle 9:00 circa (mezzanotte ora del Pacifico)."
        )
    if motivo == "commentsDisabled":
        raise ErroreYouTube("commentsDisabled")
    if risposta.status_code in (400, 403) and "API key" in errore.get("message", ""):
        raise ErroreYouTube("La chiave YouTube non è valida o non ha l'API abilitata.")
    raise ErroreYouTube(
        f"Errore YouTube ({risposta.status_code}): {errore.get('message', risposta.text[:200])}"
    )


def parse_durata(iso: str) -> int:
    """'PT1H2M3S' -> 3723 secondi."""
    m = re.fullmatch(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not m:
        return 0
    giorni, ore, minuti, secondi = (int(x) if x else 0 for x in m.groups())
    return giorni * 86400 + ore * 3600 + minuti * 60 + secondi


def _miglior_copertina(thumbnails: dict) -> str:
    for formato in ("maxres", "standard", "high", "medium", "default"):
        if formato in thumbnails:
            return thumbnails[formato]["url"]
    return ""


def data_inizio(mesi: int) -> str:
    """Data in formato RFC 3339 di N mesi fa, per filtrare le ricerche."""
    inizio = datetime.now(timezone.utc) - timedelta(days=30 * mesi)
    return inizio.strftime("%Y-%m-%dT%H:%M:%SZ")


@st.cache_data(ttl=CACHE_SECONDI, show_spinner=False)
def cerca_video(
    query: str,
    pubblicati_dopo: str | None = None,
    ordine: str = "viewCount",
    lingua: str = "it",
    regione: str = "IT",
) -> list[str]:
    """Restituisce fino a 50 ID video per una ricerca (costo: 100 unità)."""
    params = {
        "part": "id",
        "q": query,
        "type": "video",
        "maxResults": 50,
        "order": ordine,
        "relevanceLanguage": lingua,
        "regionCode": regione,
    }
    if pubblicati_dopo:
        params["publishedAfter"] = pubblicati_dopo
    dati = _get("search", **params)
    return [item["id"]["videoId"] for item in dati.get("items", [])]


@st.cache_data(ttl=CACHE_SECONDI, show_spinner=False)
def dettagli_video(ids: tuple[str, ...]) -> list[dict]:
    video = []
    for i in range(0, len(ids), 50):
        dati = _get(
            "videos",
            part="snippet,statistics,contentDetails",
            id=",".join(ids[i : i + 50]),
            maxResults=50,
        )
        for item in dati.get("items", []):
            sn, stat = item["snippet"], item.get("statistics", {})
            video.append(
                {
                    "id": item["id"],
                    "titolo": sn["title"],
                    "canale_id": sn["channelId"],
                    "canale": sn["channelTitle"],
                    "pubblicato": sn["publishedAt"],
                    "descrizione": sn.get("description", ""),
                    "tag": sn.get("tags", []),
                    "durata_sec": parse_durata(item["contentDetails"].get("duration", "")),
                    "views": int(stat.get("viewCount", 0)),
                    "like": int(stat["likeCount"]) if "likeCount" in stat else None,
                    "commenti": int(stat["commentCount"]) if "commentCount" in stat else None,
                    "copertina": _miglior_copertina(sn.get("thumbnails", {})),
                    "url": f"https://www.youtube.com/watch?v={item['id']}",
                }
            )
    return video


@st.cache_data(ttl=CACHE_SECONDI, show_spinner=False)
def dettagli_canali(ids: tuple[str, ...]) -> dict[str, dict]:
    canali = {}
    for i in range(0, len(ids), 50):
        dati = _get(
            "channels",
            part="snippet,statistics,contentDetails",
            id=",".join(ids[i : i + 50]),
            maxResults=50,
        )
        for item in dati.get("items", []):
            stat = item.get("statistics", {})
            canali[item["id"]] = {
                "id": item["id"],
                "nome": item["snippet"]["title"],
                "handle": item["snippet"].get("customUrl", ""),
                "iscritti": None
                if stat.get("hiddenSubscriberCount")
                else int(stat.get("subscriberCount", 0)),
                "views_totali": int(stat.get("viewCount", 0)),
                "n_video": int(stat.get("videoCount", 0)),
                "playlist_upload": item["contentDetails"]["relatedPlaylists"]["uploads"],
            }
    return canali


@st.cache_data(ttl=CACHE_SECONDI, show_spinner=False)
def risolvi_canale(testo: str) -> str:
    """Trova l'ID canale da un link, un @handle o un ID (costo: 1 unità)."""
    testo = testo.strip().rstrip("/")
    if m := re.search(r"(UC[\w-]{22})", testo):
        return m.group(1)
    if m := re.search(r"youtube\.com/user/([\w.-]+)", testo):
        dati = _get("channels", part="id", forUsername=m.group(1))
    else:
        if m := re.search(r"youtube\.com/(@[\w.-]+)", testo):
            handle = m.group(1)
        elif m := re.search(r"youtube\.com/c/([\w.-]+)", testo):
            handle = "@" + m.group(1)
        else:
            handle = testo if testo.startswith("@") else "@" + testo
        dati = _get("channels", part="id", forHandle=handle)
    items = dati.get("items", [])
    if not items:
        raise ErroreYouTube(f"Canale non trovato: {testo}")
    return items[0]["id"]


@st.cache_data(ttl=CACHE_SECONDI, show_spinner=False)
def ultimi_video_canale(playlist_upload: str, quanti: int = 50) -> list[str]:
    ids, pagina = [], None
    while len(ids) < quanti:
        params = {"part": "contentDetails", "playlistId": playlist_upload, "maxResults": 50}
        if pagina:
            params["pageToken"] = pagina
        dati = _get("playlistItems", **params)
        ids += [item["contentDetails"]["videoId"] for item in dati.get("items", [])]
        pagina = dati.get("nextPageToken")
        if not pagina:
            break
    return ids[:quanti]


@st.cache_data(ttl=CACHE_SECONDI, show_spinner=False)
def commenti(video_id: str, quanti: int = 100) -> list[dict]:
    """I commenti più rilevanti di un video (costo: 1 unità ogni 100)."""
    risultati, pagina = [], None
    while len(risultati) < quanti:
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": min(100, quanti - len(risultati)),
            "order": "relevance",
            "textFormat": "plainText",
        }
        if pagina:
            params["pageToken"] = pagina
        try:
            dati = _get("commentThreads", **params)
        except ErroreYouTube as e:
            if str(e) == "commentsDisabled":
                return []
            raise
        for item in dati.get("items", []):
            top = item["snippet"]["topLevelComment"]["snippet"]
            risultati.append(
                {
                    "testo": top["textDisplay"],
                    "like": top.get("likeCount", 0),
                    "risposte": item["snippet"].get("totalReplyCount", 0),
                }
            )
        pagina = dati.get("nextPageToken")
        if not pagina:
            break
    return risultati
