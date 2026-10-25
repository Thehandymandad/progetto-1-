"""Calcolo delle metriche: outlier, engagement, punteggio nicchia, pattern vincenti."""

import math
import re
from datetime import datetime, timezone

import pandas as pd

DURATA_MINIMA_SEC = 240  # sotto i 4 minuti consideriamo il video uno Short
CANALE_PICCOLO = 50_000  # iscritti
GIORNI = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
FASCE_DURATA = [(4, 8), (8, 12), (12, 20), (20, 40), (40, 10_000)]


def tabella_video(video: list[dict], canali: dict[str, dict], solo_lunghi: bool = True) -> pd.DataFrame:
    """Unisce video e canali e calcola le metriche principali.

    outlier = views del video / views medie per video del canale.
    Un outlier di 3 significa "ha fatto il triplo del solito per quel canale".
    """
    if not video:
        return pd.DataFrame()
    df = pd.DataFrame(video)
    if solo_lunghi:
        df = df[df["durata_sec"] >= DURATA_MINIMA_SEC]
    if df.empty:
        return df

    df["iscritti"] = pd.to_numeric(
        df["canale_id"].map(lambda c: (canali.get(c) or {}).get("iscritti")), errors="coerce"
    )
    df["media_canale"] = pd.to_numeric(
        df["canale_id"].map(lambda c: _media_views_canale(canali.get(c))), errors="coerce"
    )
    df["like"] = pd.to_numeric(df["like"], errors="coerce")
    df["commenti"] = pd.to_numeric(df["commenti"], errors="coerce")
    df["outlier"] = (df["views"] / df["media_canale"]).round(1)

    df["pubblicato"] = pd.to_datetime(df["pubblicato"], utc=True)
    adesso = datetime.now(timezone.utc)
    df["giorni"] = ((adesso - df["pubblicato"]).dt.total_seconds() / 86400).clip(lower=1).round()
    df["views_giorno"] = (df["views"] / df["giorni"]).round()
    df["like_%"] = (df["like"] / df["views"].where(df["views"] > 0) * 100).round(2)
    df["commenti_ogni_1000"] = (df["commenti"] / df["views"].where(df["views"] > 0) * 1000).round(2)
    df["durata_min"] = (df["durata_sec"] / 60).round(1)
    return df.sort_values("outlier", ascending=False).reset_index(drop=True)


def _media_views_canale(canale: dict | None) -> float | None:
    if not canale or not canale.get("n_video"):
        return None
    return max(canale["views_totali"] / canale["n_video"], 1)


def outlier_su_mediana(df: pd.DataFrame) -> pd.DataFrame:
    """Per i concorrenti: confronta ogni video con la mediana dei video recenti dello stesso canale.

    È più preciso della media totale del canale, perché non è falsato da vecchi video virali.
    """
    if df.empty:
        return df
    df = df.copy()
    mediana = df.groupby("canale_id")["views"].transform("median").clip(lower=1)
    df["outlier"] = (df["views"] / mediana).round(1)
    return df.sort_values("outlier", ascending=False).reset_index(drop=True)


def punteggio_nicchia(df: pd.DataFrame) -> dict:
    """Riassume una nicchia in poche metriche e un punteggio opportunità 0-100.

    - domanda: quante views al giorno fanno i video migliori (10/giorno -> 0, 10.000/giorno -> 1)
    - accessibilità: quota di video forti fatti da canali piccoli (< 50k iscritti)
    - spinta: quota di video che fanno almeno il doppio della media del loro canale
    """
    if df.empty:
        return {"video_analizzati": 0, "punteggio": 0}
    piccoli = df["iscritti"].fillna(10**9) < CANALE_PICCOLO
    views_giorno = df["views_giorno"].median()
    domanda = min(max((math.log10(views_giorno + 1) - 1) / 3, 0), 1)
    accessibilita = piccoli.mean()
    spinta = min((df["outlier"] >= 2).mean() / 0.5, 1)
    return {
        "video_analizzati": len(df),
        "views_mediane": int(df["views"].median()),
        "views_giorno_mediane": int(views_giorno),
        "iscritti_mediani": int(df["iscritti"].median()) if df["iscritti"].notna().any() else None,
        "canali_diversi": df["canale_id"].nunique(),
        "%_video_da_canali_piccoli": round(accessibilita * 100),
        "outlier_da_canali_piccoli": int(((df["outlier"] >= 3) & piccoli).sum()),
        "%_video_outlier_x2": round((df["outlier"] >= 2).mean() * 100),
        "like_%_mediano": df["like_%"].median(),
        "durata_mediana_min": df["durata_min"].median(),
        "punteggio": round(100 * (0.4 * domanda + 0.3 * accessibilita + 0.3 * spinta)),
    }


def caratteristiche_titolo(titolo: str) -> dict[str, bool]:
    parole = titolo.split()
    return {
        "Contiene un numero": bool(re.search(r"\d", titolo)),
        "È una domanda": "?" in titolo,
        "Parola in MAIUSCOLO": any(len(p) >= 3 and p.isupper() and p.isalpha() for p in parole),
        "Contiene emoji": bool(re.search(r"[\U0001F300-\U0001FAFF☀-➿]", titolo)),
        "Parentesi [ ] o ( )": bool(re.search(r"[\[\(]", titolo)),
        "Parla in prima persona": bool(re.search(r"\b(ho|ho fatto|mi|mio|mia|io)\b", titolo.lower())),
        "Titolo corto (≤ 50 caratteri)": len(titolo) <= 50,
    }


def pattern(df: pd.DataFrame) -> dict[str, pd.DataFrame]:
    """Cosa hanno in comune i video che funzionano meglio (outlier mediano per gruppo)."""
    if df.empty:
        return {}
    df = df.copy()
    ora_italiana = df["pubblicato"].dt.tz_convert("Europe/Rome")

    df["giorno"] = pd.Categorical(
        ora_italiana.dt.dayofweek.map(lambda d: GIORNI[d]), categories=GIORNI, ordered=True
    )
    per_giorno = df.groupby("giorno", observed=True).agg(
        video=("id", "count"), outlier_mediano=("outlier", "median")
    )

    df["ora"] = ora_italiana.dt.hour
    per_ora = df.groupby("ora").agg(video=("id", "count"), outlier_mediano=("outlier", "median"))

    etichette = [f"{a}-{b} min" if b < 10_000 else f"{a}+ min" for a, b in FASCE_DURATA]
    df["fascia"] = pd.cut(
        df["durata_min"], bins=[a for a, _ in FASCE_DURATA] + [10_000], labels=etichette, right=False
    )
    per_durata = df.groupby("fascia", observed=True).agg(
        video=("id", "count"), outlier_mediano=("outlier", "median")
    )

    righe = []
    caratteristiche = df["titolo"].map(caratteristiche_titolo)
    for nome in caratteristiche.iloc[0]:
        presente = caratteristiche.map(lambda c: c[nome])
        righe.append(
            {
                "caratteristica": nome,
                "video_con": int(presente.sum()),
                "outlier_con": df.loc[presente, "outlier"].median(),
                "outlier_senza": df.loc[~presente, "outlier"].median(),
            }
        )
    per_titolo = pd.DataFrame(righe).set_index("caratteristica")

    return {"giorno": per_giorno, "ora": per_ora, "durata": per_durata, "titolo": per_titolo}


def formatta_numero(n) -> str:
    if n is None or (isinstance(n, float) and math.isnan(n)):
        return "—"
    n = float(n)
    for soglia, suffisso in ((1e9, " Mld"), (1e6, " M"), (1e3, " k")):
        if abs(n) >= soglia:
            return f"{n / soglia:.1f}".replace(".", ",").replace(",0", "") + suffisso
    return f"{n:.0f}"


def _percentuale(x) -> str:
    return "n.d." if pd.isna(x) else f"{x}%"


def video_per_prompt(df: pd.DataFrame, quanti: int = 30) -> str:
    """Tabella compatta dei video da passare a Claude."""
    righe = []
    for _, v in df.head(quanti).iterrows():
        righe.append(
            f"- \"{v['titolo']}\" | canale: {v['canale']} ({formatta_numero(v['iscritti'])} iscritti) | "
            f"views: {formatta_numero(v['views'])} | outlier: x{v['outlier']} | "
            f"durata: {v['durata_min']} min | like: {_percentuale(v['like_%'])} | "
            f"pubblicato {int(v['giorni'])} giorni fa"
        )
    return "\n".join(righe)
