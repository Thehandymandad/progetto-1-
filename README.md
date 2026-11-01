# Locandine · Scuola dell'infanzia Sacra Famiglia (Sorisole)

Web app gratuita per creare locandine per le **storie di Instagram** (1080×1920) e i **diplomi**, senza pagare generazioni di immagini.
Tutto funziona nel browser: le locandine sono disegnate in HTML/CSS e scaricate come PNG.

## Come si usa
1. Apri l'app e scegli un modello (Laboratorio Natalizio, Autunno/Halloween, Mercatino, Diploma, vuota).
2. Nella scheda **Testi** cambi data, orario, luogo, prezzi e il **link del QR code** (il QR si rigenera da solo).
3. Tocca un elemento per spostarlo, ingrandirlo (pallino in basso a destra) o ruotarlo (pallino in alto).
4. **Aggiungi**: adesivi (illustrazioni delle vostre locandine + illustrazioni extra per Pasqua, primavera, estate, feste, scuola), titoli originali, logo, QR, nastri, etichette, riquadri, immagini dal telefono.
5. **Scarica** → «Salva in Foto / Instagram» (su telefono) oppure «Scarica PNG».
6. **Altro → Salva come modello** per creare nuovi modelli riutilizzabili.

Per i diplomi scrivi i nomi dei bambini (uno per riga): viene creato un diploma per ogni nome.

Le locandine restano salvate sul dispositivo; con **Esporta/Importa backup** si spostano su un altro telefono o computer.

## Contenuto
- `index.html`, `css/`, `js/` – l'app (nessun server, nessuna dipendenza da installare)
- `assets/logo/` – logo dell'Istituto (versione originale e versione colorabile)
- `assets/stickers/`, `assets/titoli/`, `assets/bg/` – illustrazioni e titoli ritagliati dalle locandine della scuola
- `assets/fluent/` – illustrazioni [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (licenza MIT)
- `fonts/` – Google Fonts (licenza SIL OFL), inclusi localmente
- `js/vendor/` – [html-to-image](https://github.com/bubkoo/html-to-image) e [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (licenza MIT)

## Avvio in locale
```
python3 -m http.server
```
e apri http://localhost:8000
