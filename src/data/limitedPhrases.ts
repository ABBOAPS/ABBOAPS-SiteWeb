export interface LimitedPhrase {
  text: string;
  author: string;
}

export const LIMITED_PHRASES: readonly LimitedPhrase[] = [
  { text: "Poca favilla gran fiamma seconda.", author: "Dante — Paradiso, I, 34" },
  { text: "Fatti non foste a viver come bruti, ma per seguir virtute e conoscenza.", author: "Dante — Inferno, XXVI" },
  { text: "E quindi uscimmo a riveder le stelle.", author: "Dante — Inferno, XXXIV, 139" },
  { text: "Libertà va cercando, ch’è sì cara.", author: "Dante — Purgatorio, I" },
  { text: "L’amor che move il sole e l’altre stelle.", author: "Dante — Paradiso, XXXIII" },
  { text: "Seggendo in piuma, in fama non si vien.", author: "Dante — Inferno, XXIV" },
  { text: "E però leva sù; vinci l’ambascia.", author: "Dante — Inferno, XXIV" },
  { text: "Ché perder tempo a chi più sa più spiace.", author: "Dante — Purgatorio, III" },
  { text: "Quant’è bella giovinezza, che si fugge tuttavia!", author: "Lorenzo de’ Medici — Canzona di Bacco" },
  { text: "Chi vuol esser lieto, sia: di doman non c’è certezza.", author: "Lorenzo de’ Medici — Canzona di Bacco" },
  { text: "Umana cosa è l’avere compassione degli afflitti.", author: "Boccaccio — Decameron, Proemio" },
  { text: "Sol chi non lascia eredità d’affetti poca gioia ha dell’urna.", author: "Foscolo — Dei Sepolcri" },
  { text: "A egregie cose il forte animo accendono l’urne de’ forti.", author: "Foscolo — Dei Sepolcri" },
  { text: "Tutti fra sé confederati estima gli uomini.", author: "Leopardi — La ginestra" },
  { text: "Strinse i mortali in social catena.", author: "Leopardi — La ginestra" },
  { text: "Nobil natura è quella ch’a sollevar s’ardisce gli occhi mortali incontra al comun fato.", author: "Leopardi — La ginestra" },
  { text: "E il naufragar m’è dolce in questo mare.", author: "Leopardi — L’infinito" },
  { text: "La vita fugge, et non s’arresta una hora.", author: "Petrarca — Canzoniere, 272" },
  { text: "È dentro noi un fanciullino.", author: "Pascoli — Il fanciullino" },
  { text: "C’è qualcosa di nuovo oggi nel sole, anzi d’antico.", author: "Pascoli — L’aquilone" },
  { text: "Volli, e volli sempre, e fortissimamente volli.", author: "Alfieri — Lettera responsiva a Ranieri de’ Calsabigi" },
  { text: "Il buon senso c’era; ma se ne stava nascosto, per paura del senso comune.", author: "Manzoni — I promessi sposi, XXXII" },
  { text: "Il mondo è un bel libro, ma poco serve a chi non sa leggere.", author: "Goldoni — Pamela, atto I" },
  { text: "Il più bello studio che far possa un uomo nobile, è quello di vedere il mondo.", author: "Goldoni — Pamela" },
  { text: "Il fare un libro è meno che nïente, se il libro fatto non rifà la gente.", author: "Giuseppe Giusti — Epigrammi" },
  { text: "Quando uno vive, vive e non si vede.", author: "Pirandello — Uno, nessuno e centomila" },
  { text: "Una realtà non ci fu data e non c’è, ma dobbiamo farcela noi.", author: "Pirandello — Uno, nessuno e centomila" },
  { text: "La vita si muove di continuo.", author: "Pirandello — Uno, nessuno e centomila" },
  { text: "La vita non è né brutta né bella, ma è originale!", author: "Svevo — La coscienza di Zeno" },
  { text: "L’unica gioia al mondo è cominciare.", author: "Pavese — Il mestiere di vivere, 23 novembre 1937" },
  { text: "È bello vivere perché vivere è cominciare, sempre, ad ogni istante.", author: "Pavese — Il mestiere di vivere" },
  { text: "Un paese ci vuole, non fosse che per il gusto di andarsene via.", author: "Pavese — La luna e i falò" },
  { text: "Un paese vuol dire non essere soli.", author: "Pavese — La luna e i falò" },
  { text: "Ogni vera storia è storia contemporanea.", author: "Benedetto Croce — Teoria e storia della storiografia" },
  { text: "La filosofia è scritta in questo grandissimo libro che continuamente ci sta aperto innanzi a gli occhi.", author: "Galileo — Il Saggiatore" },
  { text: "La sapienza è figliola dell’esperienza.", author: "Leonardo da Vinci — Codici" },
  { text: "Tristo è quel discepolo che non avanza il suo maestro.", author: "Leonardo da Vinci" },
  { text: "Quel pittore che non dubita, poco acquista.", author: "Leonardo da Vinci — Trattato della pittura" },
  { text: "Chi poco pensa, molto erra.", author: "Leonardo da Vinci — Pensieri sulla morale" },
  { text: "Le stanze overo abitazioni piccole ravvivan lo ’ngegno, e le grandi lo sviano.", author: "Leonardo da Vinci" },
  { text: "Quando il giudizio supera l’opera, essa opera mai finisce di migliorare.", author: "Leonardo da Vinci — Trattato della pittura" },
  { text: "Non ha l’ottimo artista alcun concetto c’un marmo solo in sé non circonscriva.", author: "Michelangelo — Rime, 151" },
  { text: "Forse era ver, ma non però credibile a chi del senso suo fosse signore.", author: "Ariosto — Orlando furioso, I" },
  { text: "È del poeta il fin la meraviglia.", author: "Giovan Battista Marino — Il poeta e la meraviglia" },
  { text: "Chi non sa far stupir, vada alla striglia!", author: "Marino — Il poeta e la meraviglia" },
  { text: "Siamo proprio come le canne al vento.", author: "Grazia Deledda — Canne al vento" },
  { text: "Siamo canne, e la sorte è il vento.", author: "Grazia Deledda — Canne al vento" },
  { text: "Una gran pace regnava su quel villaggio improvvisato.", author: "Grazia Deledda — Canne al vento" },
  { text: "Andavamo andavamo, per giorni e per giorni.", author: "Dino Campana — Canti Orfici, Viaggio a Montevideo" },
  { text: "Quando il paese nuovo arriderà selvaggio su la sconfinata marina?", author: "Dino Campana — Canti Orfici" },
];

export function pickLimitedPhrase(random = Math.random()): LimitedPhrase {
  const index = Math.min(LIMITED_PHRASES.length - 1, Math.floor(random * LIMITED_PHRASES.length));
  return LIMITED_PHRASES[index];
}
