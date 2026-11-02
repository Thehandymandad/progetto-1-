# Creare e pubblicare un videogioco su Playgama — guida riassuntiva

> Fonti: SDK ufficiale Playgama Bridge (GitHub `Playgama/*` + pacchetto npm `@playgama/bridge` v2.4.0), pagine del wiki e del blog Playgama trovate via ricerca web (novembre 2026).
> I file originali scaricati sono in `documentazione-originale/`.
> Nota: playgama.com e wiki.playgama.com erano bloccati dalla rete di questa sessione, quindi le pagine del wiki sono riassunte dai risultati di ricerca e non lette per intero.

## 1. Cos'è Playgama

- **Distributore globale di giochi HTML5**: si occupa di pubblicazione, moderazione, monetizzazione e pagamenti internazionali.
- Con **una sola integrazione** il gioco va su Playgama.com e su più di 20 piattaforme partner: YouTube Playables, CrazyGames, Poki, GameDistribution, Yandex Games, Facebook Instant Games, Discord, Telegram, Reddit, TikTok, Microsoft Store, MSN, GameSnacks, Samsung, Huawei, Xiaomi, JioGames, VK, OK, Y8, Lagged, Dlightek e Portal.
- Rete dichiarata: **oltre 450 milioni di utenti al mese**.
- Portale sviluppatori: https://developer.playgama.com · Documentazione: https://wiki.playgama.com · Discord: https://discord.gg/pzqd2upxr8

## 2. Motori di gioco supportati

| Motore | Plugin ufficiale |
|---|---|
| JavaScript / HTML5 puro | `Playgama/bridge` (npm `@playgama/bridge`) |
| Unity (WebGL) | `Playgama/bridge-unity` |
| Godot 4 / Godot 3 | `Playgama/bridge-godot-4`, `Playgama/bridge-godot` |
| Construct 3 | `Playgama/bridge-construct` |
| GameMaker | `Playgama/bridge-gamemaker` |
| Defold | `Playgama/bridge-defold` |
| GDevelop | `Playgama/bridge-gdevelop` (+ progetto di esempio) |
| Cocos Creator | `Playgama/bridge-cocos-creator` |
| Scratch | `Playgama/bridge-scratch` |

## 3. Il processo in 7 passi

1. **Crea il gioco** in HTML5 o con uno dei motori sopra (export Web/WebGL).
2. **Integra Playgama Bridge SDK**. È obbligatorio per *ogni* gioco, compresa la sandbox, alla versione **2.2.0 o successiva**.
   ```html
   <script src="https://bridge.playgama.com/v2/stable/playgama-bridge.js"></script>
   ```
   In alternativa: `npm i @playgama/bridge`, poi `import bridge from '@playgama/bridge'`.
3. **Aggiungi `playgama-bridge-config.json`** accanto a `index.html`. Il file si crea con il config editor: https://playgama.github.io/bridge-config-editor/
4. **Inizializza l'SDK e segnala che il gioco è pronto**:
   ```javascript
   bridge.initialize().then(() => {
       // carica le risorse, mostra il menu...
       bridge.platform.sendMessage('game_ready') // quando il giocatore può davvero interagire
   })
   ```
5. **Prova in locale.** Fuori dalle piattaforme l'SDK restituisce valori di default sicuri invece di errori. Per il debug ci sono l'estensione Chrome *Playgama Bridge DevTools* e il QA tool.
6. **Carica la build** su developer.playgama.com: archivio, copertine, descrizione, prodotti in-app e classifiche. Scegli poi le piattaforme di pubblicazione. Esiste anche un server **MCP** che fa tutto questo da Claude Code/Cursor:
   ```bash
   claude mcp add --transport 'http' 'playgama-developer-cabinet' 'https://developer.playgama.com/api/mcp'
   ```
7. **Moderazione**: la revisione dichiarata richiede circa 24 ore. Prima ottieni un link sandbox, poi il gioco viene pubblicato.

## 4. Cosa offre l'SDK (API principali)

| Modulo | Funzioni chiave |
|---|---|
| **Pubblicità** (`bridge.advertisement`) | `showInterstitial()`, `showRewarded()`, `showBanner('top'/'bottom')`, `hideBanner()`, `preloadInterstitial/Rewarded()`, `checkAdBlock()`, `setMinimumDelayBetweenInterstitial()`; stati: loading / opened / closed / rewarded / failed |
| **Salvataggi cloud** (`bridge.storage`) | `get(key)`, `set(key, value)`, `delete(key)`: salva sulla piattaforma o in locale con la stessa API |
| **Acquisti in-game** (`bridge.payments`) | `getCatalog()`, `purchase(id)`, `getPurchases()`, `consumePurchase(id)`: catalogo unico per tutte le piattaforme |
| **Classifiche** (`bridge.leaderboards`) | `setScore(id, score)`, `getEntries(id)`, `showNativePopup(id)` |
| **Achievement** (`bridge.achievements`) | `unlock(id)`, `getAchievements()` |
| **Ricompense giornaliere** | `getRewards()`, `getCurrentDay()`, `claimCurrentReward()` |
| **Task/quest** | missioni giornaliere, settimanali e permanenti |
| **Giocatore** (`bridge.player`) | `authorize()`, `id`, `name`, `photos`, `isGuest` |
| **Piattaforma** (`bridge.platform`) | `id`, `language`, `isAudioEnabled`, `isPaused`, `getServerTime()`, `sendMessage(...)` |
| **Dispositivo** | tipo di dispositivo, orientamento, safe area |
| **Social** | condivisione, invito amici, aggiunta ai preferiti, valutazione del gioco |
| **Notifiche e cross-promo** | far tornare i giocatori e spostarli tra i tuoi giochi |
| **Multiplayer** | `createRoom`, `joinRoom(code)`, `joinOrCreateRoom` con sincronizzazione dello stato (`syncState`) e recupero dell'host |
| **Remote config e analytics** | modificare parametri senza nuova release, tracciare eventi personalizzati |

**Messaggi da inviare alla piattaforma** con `bridge.platform.sendMessage(...)`:
`game_ready`, `level_started`, `level_completed`, `level_failed`, `level_paused`, `level_resumed`, `in_game_loading_started/stopped`, `gameplay_started/stopped`, `player_got_achievement`.

**Eventi da ascoltare**, i più importanti:
- `AUDIO_STATE_CHANGED` e `PAUSE_STATE_CHANGED`: vanno rispettati, cioè il gioco deve togliere l'audio e mettersi in pausa durante le pubblicità.
- `VISIBILITY_STATE_CHANGED`
- `ORIENTATION_STATE_CHANGED`
- `REWARDED_STATE_CHANGED`

## 5. Requisiti tecnici (dal wiki, i valori variano per piattaforma)

- **Dimensione**:
  - archivio fino a **300 MB** secondo i requisiti generali;
  - alcune piattaforme chiedono **100–200 MB**;
  - il target consigliato è **≤ 50 MB**.
- **YouTube Playables** (la più severa):
  - caricamento iniziale fino a `GameReady` **≤ 30 MB**;
  - nessun singolo file oltre 30 MB;
  - `GameReady` va inviato solo quando il giocatore può interagire.
- **Numero di file**: i limiti indicati vanno da 500 a 8.000 file, a seconda della pagina del wiki.
- **Tempo di caricamento**: idealmente **< 3 secondi**, massimo 5 secondi.
- **Pubblicità**: la monetizzazione si sblocca con circa **100 sessioni giornaliere** e moderazione superata.
- Il QA tool controlla che l'SDK sia inizializzato, l'orientamento (portrait per YouTube) e una build sotto i 30 MB.

## 6. Requisiti di contenuto (cosa NON è ammesso)

- Violenza realistica contro bambini o animali.
- Contenuti politici o religiosi.
- "Predizioni" sulla vita o sulla salute del giocatore.
- **Copie di giochi già presenti nel catalogo** e uso senza licenza di marchi, loghi o musica.
- Acquisti esterni: sono ammessi solo quelli tramite Playgama Bridge.

## 7. Guadagni

- **Partner network**: lo sviluppatore riceve il **70%** netto fino a 1.000 $, l'**80%** oltre quella soglia e il **90%** oltre 3.000 $. La pagina sviluppatori dichiara "70–90%".
- Un FAQ citato da terzi indica un **50% fisso** per le giocate su playgama.com/iframe, con prelievo da 100 $. Le fonti non concordano: verifica i termini su developer.playgama.com.
- L'accordo è **non esclusivo**: i diritti restano allo sviluppatore.

### Fonti
- https://github.com/Playgama/bridge (e repository dei singoli motori)
- https://www.npmjs.com/package/@playgama/bridge
- https://wiki.playgama.com/playgama/game-requirements/content-requirements
- https://wiki.playgama.com/playgama/game-requirements/technical-requirements
- https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements
- https://wiki.playgama.com/platforms/youtube-playables-requirements-for-games
- https://wiki.playgama.com/playgama/submitting-a-game
- https://playgama.com/developers
- https://playgama.com/blog/business-faqs/poki-vs-crazygames-vs-gamedistribution-revenue-share/
- https://gamedev.net/blogs/entry/2298379-built-a-game-with-ai-get-your-first-players-and-ad-revenue-with-playgama-mcp
