# Mantenere ABBO Docs

ABBO Docs vive nel sito pubblico `ABBOAPS-SiteWeb`. `APP SOCI` è una fonte di studio read-only durante la redazione.

## Aggiungere una pagina

Modifica `src/docs/content.ts` usando `make(slug, titolo, categoria, modalità, stato, ruoli, corpo, related)`. Il corpo usa Markdown in una stringa TypeScript; mantieni i dati fittizi e aggiungi almeno un collegamento correlato.

Gli stati sono `available`, `beta`, `partial`, `in-progress` e `planned`. Non promuovere una funzione solo perché compare in una roadmap: verifica codice e documenti sorgente.

## Controlli

```bash
npm run docs:validate
npm run docs:check-links
npm run docs:public-safety
npm run docs:check-pii
npm run typecheck
npm run build
```

La ricerca è client-side e usa solo il catalogo pubblico. I tour, la Docs Map, l'NFC Flow Explorer e la Template Map devono restare demo locali: non aggiungere richieste live o tracking senza una decisione esplicita.

## Revisione

Quando cambia APP SOCI: aggiorna l'inventario, verifica lo stato reale, redigi il testo, sanitizza i riferimenti, aggiorna `lastReviewed` e controlla i link. Non copiare documenti privati nel sito.
