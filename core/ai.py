"""Analisi con Claude: nicchie, copertine, commenti, concorrenti e idee per i video."""

import anthropic
import streamlit as st

from core import config

MODELLO = "claude-opus-5-5"

SISTEMA = """Sei un esperto di strategia YouTube che aiuta un creator italiano a far crescere \
un canale nuovo di video lunghi (non Shorts).
Regole:
- Rispondi sempre in italiano, in modo concreto e pratico: il creator non è un tecnico.
- Basati sui dati che ricevi e cita i video per titolo quando fai un esempio.
- Non inventare numeri: se un dato manca, dillo.
- Distingui ciò che i dati mostrano chiaramente da ciò che è una tua ipotesi.
- Usa titoli, elenchi puntati e grassetti in Markdown per rendere tutto facile da leggere su iPhone."""


class ErroreAI(Exception):
    pass


def chiedi(contenuto: str | list, effort: str = "medium") -> str:
    """Invia una richiesta a Claude, mostra la risposta mentre arriva e la restituisce."""
    chiave = config.segreto("ANTHROPIC_API_KEY")
    if not chiave:
        raise ErroreAI("Manca la chiave ANTHROPIC_API_KEY nei Secrets.")
    client = anthropic.Anthropic(api_key=chiave)

    def testo_in_arrivo():
        with client.beta.messages.stream(
            model=MODELLO,
            max_tokens=32000,
            system=SISTEMA,
            output_config={"effort": effort},
            # se Claude rifiuta per errore una richiesta, riprova in automatico con un altro modello
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",
            messages=[{"role": "user", "content": contenuto}],
        ) as stream:
            yield from stream.text_stream
            finale = stream.get_final_message()
        if finale.stop_reason == "refusal":
            raise ErroreAI("Claude non ha potuto completare questa richiesta. Prova a riformularla.")
        if finale.stop_reason == "max_tokens":
            yield "\n\n_(Risposta interrotta perché troppo lunga.)_"

    try:
        with st.spinner("Claude sta ragionando… può volerci un minuto."):
            generatore = testo_in_arrivo()
            primo = next(generatore, "")
        return st.write_stream(_concatena(primo, generatore))
    except anthropic.AuthenticationError as e:
        raise ErroreAI("La chiave di Claude non è valida. Controllala nei Secrets.") from e
    except anthropic.PermissionDeniedError as e:
        raise ErroreAI("La chiave di Claude non ha i permessi necessari.") from e
    except anthropic.RateLimitError as e:
        raise ErroreAI("Troppe richieste a Claude in poco tempo. Riprova tra un minuto.") from e
    except anthropic.BadRequestError as e:
        if "credit" in str(e).lower():
            raise ErroreAI("Credito Claude esaurito: ricarica su console.anthropic.com.") from e
        raise ErroreAI(f"Richiesta non valida: {e.message}") from e
    except anthropic.APIStatusError as e:
        raise ErroreAI(f"Errore del servizio Claude ({e.status_code}). Riprova più tardi.") from e
    except anthropic.APIConnectionError as e:
        raise ErroreAI("Impossibile contattare Claude. Controlla la connessione e riprova.") from e


def _concatena(primo: str, resto):
    if primo:
        yield primo
    yield from resto


# --- Prompt per ogni analisi ---------------------------------------------------------


def prompt_nicchie(riassunto: str, esempi: str) -> str:
    return f"""Sto scegliendo la nicchia per un nuovo canale YouTube italiano di video lunghi.
Ho confrontato questi argomenti usando i video più visti degli ultimi mesi.

## Metriche per argomento
{riassunto}

Legenda: "outlier" = views del video divise per la media del suo canale (x3 = il triplo del solito).
"punteggio" = indice 0-100 calcolato da domanda, spazio per canali piccoli e quota di outlier.

## Video più forti per argomento
{esempi}

Per ogni argomento dimmi:
1. **Verdetto** (vai / valuta / evita) in una riga
2. Domanda e concorrenza: cosa dicono davvero i dati
3. Gli "angoli" o sotto-nicchie con più spazio per un canale nuovo
4. Che tipo di video lunghi funzionano (format, durata)

Poi chiudi con:
- **La mia raccomandazione**: quale argomento sceglieresti e perché
- 5 idee per i primi video del canale in quella nicchia
- Cosa controllare ancora prima di decidere"""


def prompt_copertine(blocchi_video: list[dict]) -> list[dict]:
    contenuto = [
        {
            "type": "text",
            "text": "Ti mostro le copertine di alcuni video della mia nicchia. Per ognuna c'è il "
            "titolo e quanto ha performato (outlier = views diviso la media del canale).",
        }
    ]
    for i, v in enumerate(blocchi_video, 1):
        contenuto.append(
            {
                "type": "text",
                "text": f"Video {i} ({v['gruppo']}): \"{v['titolo']}\" — "
                f"{v['views']} views, outlier x{v['outlier']}",
            }
        )
        contenuto.append({"type": "image", "source": {"type": "url", "url": v["copertina"]}})
    contenuto.append(
        {
            "type": "text",
            "text": """Analizza le copertine e dimmi:
1. **Cosa hanno in comune le vincenti**: volti ed espressioni, testo (quante parole, che tipo), \
colori e contrasto, composizione, oggetti, frecce o cerchi
2. **Cosa sbagliano le meno performanti** rispetto alle vincenti
3. **Rapporto tra titolo e copertina**: si ripetono o si completano?
4. **Leggibilità da telefono**: cosa si capisce in mezzo secondo a dimensione miniatura
5. **Checklist** di 8-10 regole pratiche per le mie copertine in questa nicchia
6. **3 concept di copertina** pronti da realizzare (descrivi soggetto, espressione, testo, colori, \
disposizione)

Ricorda che è un'analisi su pochi esempi: indica quanto sei sicuro di ogni pattern.""",
        }
    )
    return contenuto


def prompt_commenti(blocchi: str) -> str:
    return f"""Questi sono i commenti più rilevanti di alcuni video della mia nicchia.

{blocchi}

Analizzali e dimmi:
1. **Richieste di nuovi video** ("fai un video su…"), con quante volte compaiono più o meno
2. **Domande frequenti** a cui nessuno risponde bene
3. **Lamentele e critiche**: cosa non piace ai video attuali (opportunità per fare meglio)
4. **Cosa amano**: momenti, stili, persone, format citati con entusiasmo
5. **Sentiment generale** per video, in una riga ciascuno
6. **Parole ed espressioni del pubblico** da usare in titoli e copertine
7. **10 idee di video** che nascono direttamente da questi commenti, ognuna con il commento \
che la ispira"""


def prompt_concorrenti(riassunto_canali: str, migliori: str, peggiori: str, pattern: str) -> str:
    return f"""Sto analizzando questi canali concorrenti nella mia nicchia.

## Canali
{riassunto_canali}

## Video che hanno funzionato meglio (outlier rispetto alla mediana del canale)
{migliori}

## Video che hanno funzionato peggio
{peggiori}

## Pattern calcolati
{pattern}

Dimmi:
1. **Cosa funziona** per questi canali: argomenti, format, struttura dei titoli
2. **Cosa non funziona**: cosa evitare
3. **Formule di titolo** ricorrenti nei video migliori, con esempi riscritti per me
4. **Buchi**: argomenti o format che nessuno copre bene e che potrei occupare
5. **Durata e frequenza** consigliate per un canale nuovo, basandoti sui dati
6. Come **differenziarmi** da ciascun canale in una frase"""


def prompt_idee(nicchia: str, video: str, analisi_precedenti: str, aperture: str, note: str) -> str:
    return f"""Aiutami a pianificare i prossimi video del mio nuovo canale YouTube italiano \
(video lunghi). Nicchia: **{nicchia}**.

## Video che funzionano nella nicchia (ordinati per outlier)
{video}

## Analisi già fatte (copertine, commenti, concorrenti, nicchie)
{analisi_precedenti or "Nessuna analisi salvata."}

## Come iniziano i video migliori (trascrizione dei primi secondi)
{aperture or "Trascrizioni non disponibili."}

## Note del creator
{note or "Nessuna."}

Proponi **10 idee di video**, ordinate dalla più promettente. Per ognuna scrivi:

### N. [Titolo di lavoro]
- **3 varianti di titolo** (sotto i 60 caratteri)
- **Perché può funzionare**: quali video o commenti tra quelli sopra lo dimostrano
- **Concept copertina**: soggetto, espressione, testo (max 4 parole), colori
- **Hook dei primi 30 secondi**: scrivi il testo parlato, frase per frase, pronto da leggere
- **Scaletta**: 5-8 punti con la durata indicativa di ogni parte
- **Durata consigliata**

Alla fine aggiungi:
- **Le regole per gli hook** che hai notato nelle aperture dei video migliori
- **In che ordine pubblicare** le 10 idee e perché"""
