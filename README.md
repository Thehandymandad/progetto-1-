# 🎬 YouTube Coach

Web app per analizzare i video YouTube della tua nicchia e creare video migliori.
Si usa da Safari sull'iPhone, senza installare niente.

## Cosa fa

| Pagina | A cosa serve |
|---|---|
| 🧭 **Trova la nicchia** | Confronta 2-5 argomenti: domanda, concorrenza, spazio per i canali piccoli. Claude ti consiglia quale scegliere. |
| 🚀 **Video outlier** | Trova i video che hanno fatto molte più views del solito per il loro canale. |
| 🏆 **Concorrenti** | Analizza gli ultimi video di uno o più canali: cosa funziona, durata, giorni, titoli. |
| 🖼️ **Copertine** | Claude confronta le copertine migliori e peggiori e ti dà regole e concept. |
| 💬 **Commenti** | Claude legge i commenti ed estrae richieste, domande, lamentele e idee. |
| 💡 **Idee e hook** | 10 idee di video con titoli, copertina, hook dei primi 30 secondi e scaletta. |
| 📁 **Raccolta e report** | I video salvati e tutte le analisi, da scaricare in un file. |

**Come funziona:** cerchi i video (nicchia, outlier, concorrenti) e aggiungi i migliori alla
**raccolta** con il pulsante ➕. Copertine, Commenti e Idee lavorano sui video della raccolta.

Su iPhone il menu delle pagine si apre toccando **»** in alto a sinistra.

---

## Messa online (una volta sola, circa 15 minuti, tutto da iPhone)

### 1. Controlla la chiave di Google

La tua chiave Google deve avere attiva la **YouTube Data API v3**:

1. Apri [console.cloud.google.com](https://console.cloud.google.com) e scegli il progetto della chiave.
2. Menu ☰ → **API e servizi** → **Libreria** → cerca **YouTube Data API v3** → **Abilita**
   (se c'è scritto "Gestisci", è già attiva).
3. **API e servizi** → **Credenziali**: lì trovi la chiave da copiare.

### 2. Controlla la chiave di Claude

Su [console.anthropic.com](https://console.anthropic.com) → **API Keys** trovi la chiave.
In **Billing** controlla di avere del credito caricato.

### 3. Pubblica l'app su Streamlit (gratis)

1. Apri [share.streamlit.io](https://share.streamlit.io) e tocca **Continue with GitHub**.
   Autorizza l'accesso, anche ai repository privati se te lo chiede.
2. Tocca **Create app** → **Deploy a public app from GitHub**.
3. Compila così:
   - **Repository:** `thehandymandad/progetto-1-`
   - **Branch:** il branch indicato da Claude (es. `claude/youtube-coach`), oppure `main`
   - **Main file path:** `streamlit_app.py`
   - **App URL:** scegli un nome, ad esempio `mio-youtube-coach`
4. Tocca **Advanced settings** e nel riquadro **Secrets** incolla questo, sostituendo i valori:

   ```toml
   YOUTUBE_API_KEY = "la-tua-chiave-youtube"
   ANTHROPIC_API_KEY = "la-tua-chiave-claude"
   APP_PASSWORD = "scegli-una-password"
   ```

   Lascia le virgolette. La password la scegli tu: è quella che userai per entrare.
5. Tocca **Save** e poi **Deploy**. Dopo 2-3 minuti l'app è online.

> ⚠️ Non scrivere mai le chiavi nel codice, in chat o su GitHub: vanno **solo** nei Secrets.
> Puoi cambiarle quando vuoi da Streamlit → la tua app → ⋮ → **Settings** → **Secrets**.

### 4. Mettila sulla schermata Home

In Safari apri l'indirizzo dell'app → tocca **Condividi** (quadrato con la freccia) →
**Aggiungi alla schermata Home**. Da quel momento la apri come una normale app.

---

## Da sapere

- **Quota YouTube:** 10.000 unità gratis al giorno. Una ricerca costa circa 100 unità, il resto
  1-2. Quindi circa 80-90 ricerche al giorno. La quota si azzera ogni mattina verso le 9.
- **Costo di Claude:** da pochi centesimi a qualche decina di centesimi per analisi.
  Le analisi usano il modello Claude Opus 5.5.
- **Dati salvati:** raccolta e analisi restano finché tieni aperta l'app. Se ricarichi la pagina
  o l'app si riavvia si perdono: scarica il **report** quando hai qualcosa di utile.
- **App in pausa:** se non la usi per un po', Streamlit la mette in pausa. Quando la riapri tocca
  **"Yes, get this app back up!"** e aspetta circa 30 secondi.
- **Trascrizioni:** su alcuni video YouTube non le rende disponibili ai server cloud.
  In quel caso le idee si basano solo su titoli, copertine e commenti.
- **Dati non disponibili:** i dislike non sono più pubblici. Retention e CTR sono visibili solo
  per il tuo canale: si potranno aggiungere in futuro collegando il tuo account Google.

## Per sviluppatori

```bash
pip install -r requirements.txt
cp .streamlit/secrets.toml.example .streamlit/secrets.toml   # e inserisci le chiavi
streamlit run streamlit_app.py
pip install pytest && python -m pytest tests                 # test con dati finti
```

Struttura: `streamlit_app.py` (ingresso e menu), `pagine/` (una pagina per sezione),
`core/youtube.py` (YouTube Data API), `core/analisi.py` (metriche),
`core/ai.py` (prompt e chiamate a Claude), `core/stato.py` (raccolta e analisi salvate).
