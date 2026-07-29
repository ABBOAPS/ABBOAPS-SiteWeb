# Checklist del Gate di Produzione per l'Emissione dei 200 Poster

Prima di eseguire il comando di produzione per i 200 poster del Festival Abbiamo 1 (Edizione 2026), l'operatore deve verificare e spuntare ogni singolo punto di questa checklist.

---

## 1. Verifiche Infrastrutturali e di Dominio
- [ ] Il dominio ufficiale HTTPS (`https://www.abboaps.org/nfc/`) è attivo, raggiungibile e protetto da certificato SSL valido.
- [ ] Il workflow GitHub Actions `deploy.yml` è l'unico attivo per GitHub Pages e compila correttamente il sito principale + il verificatore in `/nfc/`.
- [ ] Il file `site/public/data/keyring.json` contiene la chiave pubblica ufficiale attiva e non sono presenti chiavi o dati di test.

## 2. Verifiche Crittografiche e di Sicurezza
- [ ] La chiave privata di produzione è stata generata in locale, cifrata con password master forte e salvata esclusivamente nella directory utente protetta (`platformdirs`).
- [ ] È stato eseguito e verificato con successo un test di backup e ripristino della chiave privata su supporto offline.
- [ ] Lo script `scripts/scan_for_secrets.py` è stato eseguito su tutto il repository con esito 100% pulito.

## 3. Verifiche di Prodotto e Asset Pubblici
- [ ] Titolo (`Poster Festival Abbiamo 1 — Edizione 2026`), codice (`FESTIVAL-ABBO-1-POSTER`), descrizione e data di uscita sono stati confermati dal direttivo ABBO APS.
- [ ] L'immagine di copertina WebP finale è stata caricata e l'hash SHA-256 è stato verificato.
- [ ] I 200 prodotti fisici recano stampato, inciso o tessuto il numero seriale univoco da `001 / 200` a `200 / 200`.

## 4. Verifiche Hardware NFC
- [ ] I tag NFC selezionati (NTAG215 o NTAG216) sono stati collaudati con 3 esemplari di prova su smartphone Android e iPhone.
- [ ] La dimensione NDEF per tutti i 200 URL rientra con margine di sicurezza nella memoria utente del chip.

---

## Frase di Conferma Tassativa per l'Emissione

Nel programma **ABBO NFC Studio**, l'emissione definitiva dei 200 token richiede l'inserimento manuale della frase:

```text
CONFERMO EMISSIONE DEFINITIVA DI 200 ESEMPLARI
```

> [!IMPORTANT]
> Una volta firmati ed emessi i 200 token, i dati del manifesto dell'edizione diventano **IMMUTABILI**.
