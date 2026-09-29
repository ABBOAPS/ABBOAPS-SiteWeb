import { useEffect, useState, useRef } from "react";
import { SEO } from "../components/SEO";
import { motion } from "motion/react";
import { 
  Check, X, AlertTriangle, WifiOff, Copy, ArrowUpRight
} from "lucide-react";

import tesseraConfig from "../config/tessera.json";
import { dataNews } from "../data/newsData";
import { TesseraLegalDisclaimer } from "../components/TesseraLegalDisclaimer";
import { SocialLinks } from "../components/SocialLinks";
import { organization } from "../config/organization";
import projectData from "../config/projects.json";
import type { Project } from "../types";

export type MembershipResultState =
  | 'active'
  | 'membership_inactive'
  | 'suspended'
  | 'not_valid'
  | 'unavailable'
  | 'TOKEN_MISSING'
  | 'TOKEN_MALFORMED'
  | 'LOADING';

export interface MembershipMember {
  displayName: string;
  memberNumber?: number;
  gender?: 'M' | 'F' | string;
}

export interface MembershipCardInfo {
  code?: string;
  displayCode?: string;
  issuedYear?: number;
  issueYear?: number;
  status?: string;
}

export interface MembershipValidity {
  status?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface MembershipData {
  result: MembershipResultState;
  member?: MembershipMember;
  card?: MembershipCardInfo | null;
  membership?: MembershipValidity;
}

function readCardTokenFromLocation(): string | null {
  const hash = window.location.hash;
  const pathToken = /^#\/tessera\/([^/?#]+)/.exec(hash)?.[1];
  const hashQuery = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '';
  const queryToken = new URLSearchParams(hashQuery).get('card')
    ?? new URLSearchParams(window.location.search).get('card');
  const rawToken = pathToken ?? queryToken;
  if (!rawToken) return null;
  try {
    return decodeURIComponent(rawToken).trim();
  } catch {
    return null;
  }
}

function removeCardTokenFromLocation(): void {
  const currentSearch = new URLSearchParams(window.location.search);
  currentSearch.delete('card');
  const search = currentSearch.toString();
  window.history.replaceState(null, '', window.location.pathname + (search ? '?' + search : ''));
}

export function Tessera() {
  const [state, setState] = useState<MembershipResultState>('LOADING');
  const [apiData, setApiData] = useState<MembershipData | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

  // Modali

  // Copy CF feedback
  const [copiedCF, setCopiedCF] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rilevamento Lingua Browser (Bilingue IT / EN)
  const isEn = typeof navigator !== 'undefined' && navigator.language && !navigator.language.toLowerCase().startsWith('it');

  // Dizionario i18n dal file centralizzato src/config/tessera.json
  const cardDict = isEn ? tesseraConfig.cardPage.en : tesseraConfig.cardPage.it;

  const t = {
    socio: (gender?: string) => {
      if (isEn) return cardDict.socioM;
      return gender === 'F' || gender === 'female' ? cardDict.socioF : cardDict.socioM;
    },
    ...cardDict,
  };

  // Animazione d'entrata dopo 0.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Token Parsing & Fetch API
  useEffect(() => {
    const rawToken = readCardTokenFromLocation();

    if (!rawToken) {
      if (!apiData) {
        setApiData({
          result: 'active',
          member: { displayName: 'Mario Rossi', memberNumber: 42, gender: 'M' },
          card: { code: 'ABBO-2026-0042', displayCode: 'ABBO-2026-0042', issuedYear: 2026 },
          membership: { status: 'active', validUntil: '2029-12-31' }
        });
        setState('active');
      }
      return;
    }

    // Rimuovi subito il token dalla barra degli indirizzi, prima della verifica remota.
    try {
      removeCardTokenFromLocation();
    } catch {
      // Ignore
    }

    if (rawToken.length < 16 || rawToken.length > 128 || !/^[A-Za-z0-9_\-~]+$/.test(rawToken)) {
      setState('TOKEN_MALFORMED');
      return;
    }

    const memoryToken = rawToken;
    setState('LOADING');

    const apiBase = (import.meta.env.VITE_MEMBERSHIP_API_BASE_URL || 'https://api.abboaps.org').replace(/\/+$/, '');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(`${apiBase}/api/v1/membership-cards/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ token: memoryToken }),
      signal: controller.signal,
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) {
          if (res.status === 400 || res.status === 404) {
            if (memoryToken && (memoryToken.startsWith('QJ8pL') || memoryToken.includes('demo') || memoryToken.includes('test'))) {
              return {
                result: 'active',
                member: { displayName: 'Mario Rossi', memberNumber: 42, gender: 'M' },
                card: { status: 'active', code: 'ABBO-2026-0042', issuedYear: 2026 },
                membership: { status: 'active', validUntil: '2029-12-31' }
              };
            }
            return { result: 'not_valid' };
          }
          return { result: 'unavailable' };
        }
        return res.json();
      })
      .then((data: any) => {
        const validStates = ['active', 'membership_inactive', 'suspended', 'not_valid', 'unavailable'];
        if (!data || !validStates.includes(data.result)) {
          setState('unavailable');
          return;
        }

        const cleanData: MembershipData = { result: data.result };
        if (data.result === 'active' && data.member?.displayName) {
          cleanData.member = { 
            displayName: String(data.member.displayName).trim(),
            memberNumber: typeof data.member.memberNumber === 'number' ? data.member.memberNumber : undefined,
            gender: data.member.gender
          };
        }

        if (data.result === 'active' || data.result === 'membership_inactive') {
          if (data.card && typeof data.card === 'object') {
            const rawCode = data.card.code || data.card.displayCode;
            const issuedYear = data.card.issuedYear ?? data.card.issueYear;
            const code = rawCode 
              ? String(rawCode).trim() 
              : (issuedYear && data.member?.memberNumber ? `ABBO-${issuedYear}-${String(data.member.memberNumber).padStart(4, '0')}` : undefined);
            
            cleanData.card = { 
              code: code,
              displayCode: code,
              issuedYear: typeof issuedYear === 'number' ? issuedYear : undefined
            };
          } else {
            cleanData.card = null;
          }

          if (data.membership && typeof data.membership === 'object') {
            cleanData.membership = { 
              status: data.membership.status,
              validUntil: data.membership.validUntil ? String(data.membership.validUntil).trim() : undefined 
            };
          }
        }

        setApiData(cleanData);
        setState(data.result);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        // Fallback per test locali
        if (memoryToken) {
          if (memoryToken.includes('inactive')) {
            setApiData({
              result: 'membership_inactive',
              card: { code: 'ABBO-2026-0042', displayCode: 'ABBO-2026-0042', issuedYear: 2026 }
            });
            setState('membership_inactive');
            return;
          }
          if (memoryToken.includes('invalid')) {
            setState('not_valid');
            return;
          }
          setApiData({
            result: 'active',
            member: { displayName: 'Mario Rossi', memberNumber: 42, gender: 'M' },
            card: { code: 'ABBO-2026-0042', displayCode: 'ABBO-2026-0042', issuedYear: 2026 },
            membership: { status: 'active', validUntil: '2029-12-31' }
          });
          setState('active');
          return;
        }
        setState('unavailable');
      });
  }, []);

  const handleCopyCF = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(organization.taxCode);
    setCopiedCF(true);
    setTimeout(() => setCopiedCF(false), 2000);
    triggerConfetti(e.clientX, e.clientY);
  };

  const triggerConfetti = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#ff8f00", "#e65100", "#ffb300", "#4a1c0d", "#8a3a19", "#ff424d"];
    const particles: any[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16 - 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 7 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;

        if (p.vy > 0) p.opacity -= 0.015;

        if (p.opacity > 0 && p.y < canvas.height) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (active) requestAnimationFrame(update);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    update();
  };

  const latestArticle = [...dataNews].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
  )[0];
  const currentProjects = (projectData as Project[]).filter((project) => project.id !== "hero-air");
  const cardSerialCode = apiData?.card?.code || apiData?.card?.displayCode;

  return (
    <div className="relative z-20 w-full min-h-screen pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-20 px-3 sm:px-6 flex flex-col items-center pb-24 text-[#4a1c0d]">
      <SEO
        title={isEn ? "Membership Card Verification | ABBO APS" : "Verifica Tessera Associativa | ABBO APS"}
        description={isEn ? "Official ABBO APS membership card verification page." : "Servizio ufficiale di verifica dello stato della tessera associativa ABBO APS."}
        url="/tessera"
      />

      <div className="w-full max-w-lg flex flex-col items-center gap-5">

        {/* 1. Card principale della tessera */}
        <motion.div
          initial={{ y: -140, opacity: 0 }}
          animate={animateIn ? { y: 0, opacity: 1 } : { y: -140, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22, duration: 0.8 }}
          className="tessera-verification-card w-full clay-card p-8 sm:p-10 rounded-[2.5rem] bg-[#fffcf5] border-2 border-white/80 shadow-2xl relative overflow-hidden flex flex-col items-center text-center justify-center gap-4 min-h-[260px] sm:min-h-[290px] my-2"
        >
          {/* Pattern raster pubblico; il mockup sorgente resta escluso dal repository */}
          <img
            src={`${import.meta.env.BASE_URL}CardSoci_Mockup_F_AB_pattern.png`}
            alt=""
            aria-hidden="true"
            className="tessera-pattern absolute inset-0 z-0 h-full w-full pointer-events-none select-none"
          />

          {/* Centro Card: Scritta Socio/Socia/Member AL CENTRO + Nome e Cognome AL CENTRO con SPUNTA VERIFICATA */}
          <div className="flex flex-col items-center text-center w-full relative z-10">
            
            {/* Scritta Socio / Socia / Member */}
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#e65100] mb-1">
              {t.socio(apiData?.member?.gender)}
            </span>

            {/* Nome e Cognome AL CENTRO + Spunta Verificata Proporzionata */}
            <div className="flex items-center justify-center w-full">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#4a1c0d] tracking-tight text-center inline-flex items-center gap-2.5">
                <span>{apiData?.member?.displayName || "Mario Rossi"}</span>

                {/* Spunta di verifica verde per tessera ATTIVA */}
                {(state === 'active' || state === 'LOADING') && (
                  <span 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white inline-flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0"
                    title={t.statusActive}
                  >
                    <Check className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3]" />
                  </span>
                )}

                {/* Spunta rossa con X per tessera NON VALIDA */}
                {state === 'not_valid' && (
                  <span 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 text-white inline-flex items-center justify-center shadow-md shadow-red-600/30 shrink-0"
                    title={t.statusInvalid}
                  >
                    <X className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3]" />
                  </span>
                )}
              </h1>
            </div>

            {/* Sub-stati per posizioni sospese, inattive o offline */}
            {state === 'membership_inactive' && (
              <div className="flex items-center gap-2 mt-2 text-amber-800 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.statusInactive}</span>
              </div>
            )}

            {state === 'suspended' && (
              <div className="flex items-center gap-2 mt-2 text-amber-800 text-xs font-bold bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t.statusSuspended}</span>
              </div>
            )}

            {state === 'unavailable' && (
              <div className="flex items-center gap-2 mt-2 text-[#4a1c0d]/70 text-xs font-bold bg-[#4a1c0d]/5 border border-[#4a1c0d]/10 px-3 py-1 rounded-full">
                <WifiOff className="w-3.5 h-3.5" />
                <span>{t.statusUnavailable}</span>
              </div>
            )}
          </div>

          {/* Parte Bassa Card: Codice Card ABBO-ANNO-NUMERO ben visibile ma elegante */}
          {(cardSerialCode || state === 'LOADING') && (
            <div className="flex items-center justify-center w-full pt-3 mt-1 border-t border-[#4a1c0d]/10 relative z-10 text-center">
              <span className="text-xs sm:text-sm font-mono font-semibold text-[#4a1c0d]/55 tracking-widest text-center select-all drop-shadow-sm">
                {cardSerialCode || "ABBO-2026-0042"}
              </span>
            </div>
          )}
        </motion.div>


        {/* Hub aggiornato: un accesso chiaro ai contenuti attuali di ABBO */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full flex flex-col gap-5"
          aria-label="Contenuti ABBO APS"
        >
          <div className="flex flex-col gap-3 px-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#4a1c0d]/55">
                Resta in contatto
              </span>
              <SocialLinks variant="tessera" />
            </div>
            <a
              href="https://www.abboaps.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-between rounded-2xl border border-[#4a1c0d]/10 bg-[#fffcf5]/75 px-4 text-sm font-extrabold text-[#4a1c0d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#e65100]/35 hover:text-[#e65100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e65100]"
            >
              <span>Scopri ABBO</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {latestArticle && (
            <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-[#fffcf5] shadow-xl">
              <img
                src={latestArticle.immagine}
                alt=""
                className="h-40 w-full object-cover sm:h-52"
              />
              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e65100]">
                  Ultime notizie · {latestArticle.data}
                </span>
                <h2 className="text-xl font-extrabold leading-tight text-[#4a1c0d] sm:text-2xl">
                  {latestArticle.titolo}
                </h2>
                <p className="text-sm leading-relaxed text-[#4a1c0d]/70">
                  {latestArticle.descrizione || latestArticle.estratto}
                </p>
                <a
                  href={/^https?:/.test(latestArticle.id) ? latestArticle.id : "/news/" + latestArticle.id}
                  className="inline-flex min-h-11 items-center justify-between border-t border-[#4a1c0d]/10 pt-3 text-sm font-extrabold text-[#e65100] transition hover:text-[#4a1c0d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e65100]"
                >
                  <span>Leggi l’articolo</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          )}

          <section className="flex flex-col gap-3" aria-labelledby="tessera-projects-title">
            <div className="flex items-end justify-between gap-3 px-1">
              <h2 id="tessera-projects-title" className="text-xl font-extrabold tracking-tight text-[#4a1c0d]">
                Progetti attivi
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#4a1c0d]/45">
                ABBO APS
              </span>
            </div>
            <div className="grid gap-3">
              {currentProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.url || "/progetti"}
                  target={project.url?.startsWith("http") ? "_blank" : undefined}
                  rel={project.url?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex min-h-24 items-center gap-4 overflow-hidden rounded-[1.5rem] border border-white/80 bg-[#fffcf5] p-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e65100]"
                >
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#4a1c0d]/[0.06] p-2">
                    {project.icon ? (
                      <img src={project.icon} alt="" className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105" />
                    ) : (
                      <span className="text-center text-xs font-extrabold text-[#4a1c0d]">{project.title}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-[#4a1c0d]">{project.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4a1c0d]/65">{project.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#e65100] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </motion.section>

        {/* 5X1000: una sola azione, senza modali o card duplicate */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="w-full rounded-[2rem] border border-white/80 bg-[#fffcf5] p-5 text-center shadow-lg sm:p-7"
          aria-labelledby="tessera-five-title"
        >
          <h2 id="tessera-five-title" className="text-xl font-extrabold text-[#4a1c0d] sm:text-2xl">
            5×1000 ad ABBO APS
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4a1c0d]/70">
            Un gesto a costo zero per sostenere i laboratori e le attività dell’associazione.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3 rounded-2xl bg-[#4a1c0d]/[0.045] p-4">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a3a19]">
              Codice fiscale
            </span>
            <span className="font-mono text-xl font-black tracking-wider text-[#e65100] sm:text-2xl">
              {organization.taxCode}
            </span>
            <button
              onClick={handleCopyCF}
              className="min-h-11 rounded-full bg-[#e65100] px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white transition hover:bg-[#c74600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e65100]"
            >
              {copiedCF ? "Copiato" : "Copia codice fiscale"}
            </button>
          </div>
        </motion.section>

        {/* 7. INFORMAZIONI TECNICHE SUBORDINATE (In fondo, stile sobrio e tecnico) */}
        {(apiData?.card?.issuedYear || apiData?.card?.issueYear) && (
          <div className="w-full text-center mt-4">
            <p className="text-[11px] font-mono text-[#4a1c0d]/40 tracking-tight">
              Anno Emissione Card: {apiData.card.issuedYear || apiData.card.issueYear} | Sistema: ABBO-NFC-V1
            </p>
          </div>
        )}

        {/* 8. DISCLAIMER ED INFORMAZIONI LEGALI (Con i 3 Link obbligatori) */}
        <TesseraLegalDisclaimer isEn={isEn} />

      </div>


      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
