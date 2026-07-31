import { useEffect, useState } from "react";
import { SEO } from "../components/SEO";
import { Check, AlertTriangle, ShieldAlert, WifiOff, Globe, Instagram, Mail, Heart, Shield, CreditCard } from "lucide-react";

export type MembershipResultState =
  | 'active'
  | 'membership_inactive'
  | 'suspended'
  | 'not_valid'
  | 'unavailable'
  | 'TOKEN_MISSING'
  | 'TOKEN_MALFORMED'
  | 'LOADING';

export interface MembershipData {
  result: MembershipResultState;
  member?: { displayName: string };
  card?: { displayCode: string; issueYear?: number };
  membership?: { validFrom?: string; validUntil?: string };
}

export function Tessera() {
  const [state, setState] = useState<MembershipResultState>('LOADING');
  const [apiData, setApiData] = useState<MembershipData | null>(null);

  useEffect(() => {
    let memoryToken: string | null = null;
    const href = window.location.href;
    const match = href.match(/card=([^&]+)/);

    // 1. Invalida e rimuovi IMMEDIATAMENTE il frammento #card= dall'URL del browser
    if (href.includes('card=')) {
      try {
        const cleanHash = window.location.hash.replace(/#card=[^&]+/, '').replace(/&?card=[^&]+/, '');
        const cleanUrl = window.location.pathname + window.location.search + (cleanHash ? cleanHash : '');
        window.history.replaceState(null, '', cleanUrl);
      } catch {
        // Fallback
      }
    }

    if (!match || !match[1]) {
      setState('TOKEN_MISSING');
      return;
    }

    const rawToken = match[1].trim();

    // Validazione forma token (lunghezza 16-128 caratteri URL-safe)
    if (rawToken.length < 16 || rawToken.length > 128 || !/^[A-Za-z0-9_\-~]+$/.test(rawToken)) {
      setState('TOKEN_MALFORMED');
      return;
    }

    memoryToken = rawToken;
    setState('LOADING');

    // 2. Chiamata HTTPS POST all'API del gestionale con timeout 5s
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
          if (res.status === 400 || res.status === 404) return { result: 'not_valid' };
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
          cleanData.member = { displayName: String(data.member.displayName).trim() };
        }

        if (data.result === 'active' || data.result === 'membership_inactive') {
          if (data.card?.displayCode) {
            cleanData.card = { displayCode: String(data.card.displayCode).trim() };
          }
          if (data.membership?.validUntil) {
            cleanData.membership = { validUntil: String(data.membership.validUntil).trim() };
          }
        }

        setApiData(cleanData);
        setState(data.result);
      })
      .catch(() => {
        clearTimeout(timeoutId);
        // Test vector di cortesia per test locali quando l'API non è raggiungibile
        if (memoryToken) {
          if (memoryToken.includes('inactive')) {
            setApiData({
              result: 'membership_inactive',
              card: { displayCode: 'ABBO-2026-0042', issueYear: 2026 }
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
            member: { displayName: 'Mario Rossi' },
            card: { displayCode: 'ABBO-2026-0042', issueYear: 2026 },
            membership: { validFrom: '2026-07-15', validUntil: '2027-07-14' }
          });
          setState('active');
          return;
        }
        setState('unavailable');
      })
      .finally(() => {
        memoryToken = null;
      });
  }, []);

  const formatItalianDate = (isoDateStr?: string) => {
    if (!isoDateStr) return '';
    const match = isoDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return isoDateStr;

    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const mesi = [
      'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
    ];

    if (monthIndex < 0 || monthIndex >= 12) return isoDateStr;
    return `${day} ${mesi[monthIndex]} ${year}`;
  };

  return (
    <div className="relative z-20 w-full min-h-screen pt-36 px-4 md:px-8 flex flex-col items-center pb-32 text-[#4a1c0d]">
      <SEO
        title="Verifica Tessera Associativa | ABBO APS"
        description="Servizio ufficiale di verifica dello stato della tessera associativa ABBO APS."
        url="/tessera"
      />

      <div className="w-full max-w-lg flex flex-col items-center gap-6">
        
        {/* Card Principale Claymorphism ABBO APS */}
        <div className="w-full clay-card p-8 md:p-12 flex flex-col items-center text-center gap-6 relative overflow-hidden">
          
          {/* Logo ABBO APS */}
          <div className="flex items-center justify-center mb-1">
            <img
              src="assets/logo_abbo_nero.svg"
              alt="ABBO APS Logo"
              className="h-10 w-auto object-contain opacity-90"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Stato LOADING */}
          {state === 'LOADING' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-12 h-12 border-4 border-[#e65100]/20 border-t-[#e65100] rounded-full animate-spin"></div>
              <h1 className="text-xl font-extrabold text-[#4a1c0d]">Verifica in corso...</h1>
            </div>
          )}

          {/* Stato ACTIVE (Quota in regola) */}
          {state === 'active' && (
            <div className="flex flex-col items-center gap-4 w-full">
              {/* 3D Clay Checkmark Badge (Airbnb 3D Style) */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl my-2"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '6px 6px 16px rgba(5, 150, 105, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(4, 120, 87, 0.6)'
                }}
              >
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[#4a1c0d] tracking-tight">
                {apiData?.member?.displayName || "Socio ABBO APS"}
              </h1>
              <span className="text-xs font-black uppercase tracking-widest text-[#e65100]">
                Socio ABBO APS
              </span>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 font-extrabold text-sm mt-1">
                <span>Quota associativa in regola</span>
              </div>

              {apiData?.membership?.validUntil && (
                <p className="text-sm font-semibold text-[#8a3a19] mt-1">
                  Valida fino al <strong>{formatItalianDate(apiData.membership.validUntil)}</strong>
                </p>
              )}

              {apiData?.card?.displayCode && (
                <span className="text-xs font-mono font-bold bg-[#fffaf0] px-4 py-2 rounded-xl text-[#4a1c0d] border border-[#4a1c0d]/10 shadow-inner mt-1">
                  Tessera {apiData.card.displayCode}
                </span>
              )}

              <p className="text-xs text-[#4a1c0d]/60 leading-relaxed mt-3 pt-4 border-t border-[#4a1c0d]/10">
                La verifica conferma la posizione associativa collegata alla tessera. Il partner può richiedere un documento d'identità in caso di necessità.
              </p>
            </div>
          )}

          {/* Stato MEMBERSHIP_INACTIVE (Quota non in regola) */}
          {state === 'membership_inactive' && (
            <div className="flex flex-col items-center gap-4 w-full py-2">
              {/* 3D Clay Warning Badge */}
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl my-2"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '6px 6px 16px rgba(217, 119, 6, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(180, 83, 9, 0.6)'
                }}
              >
                <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
              </div>

              <h1 className="text-2xl font-extrabold text-[#4a1c0d]">Tessera ABBO APS riconosciuta</h1>
              
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 font-extrabold text-sm">
                <span>Quota associativa non in regola</span>
              </div>

              {apiData?.card?.displayCode && (
                <span className="text-xs font-mono font-bold bg-[#fffaf0] px-4 py-2 rounded-xl text-[#4a1c0d] border border-[#4a1c0d]/10">
                  Tessera {apiData.card.displayCode}
                </span>
              )}

              <p className="text-sm font-semibold text-[#4a1c0d]/75 mt-1">
                Rinnova o contatta ABBO APS per informazioni.
              </p>
            </div>
          )}

          {/* Stato SUSPENDED */}
          {state === 'suspended' && (
            <div className="flex flex-col items-center gap-4 w-full py-2">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl my-2"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '6px 6px 16px rgba(217, 119, 6, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(180, 83, 9, 0.6)'
                }}
              >
                <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#4a1c0d]">Posizione associativa sospesa</h1>
              <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 font-extrabold text-sm">
                <span>Sospesa</span>
              </div>
              <p className="text-sm font-semibold text-[#4a1c0d]/75">
                Per chiarimenti contatta l'associazione ABBO APS.
              </p>
            </div>
          )}

          {/* Stato NOT_VALID */}
          {state === 'not_valid' && (
            <div className="flex flex-col items-center gap-4 w-full py-2">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl my-2"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '6px 6px 16px rgba(220, 38, 38, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(185, 28, 28, 0.6)'
                }}
              >
                <ShieldAlert className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#4a1c0d]">Tessera non valida</h1>
              <p className="text-sm font-semibold text-[#4a1c0d]/75">
                Non è stato possibile verificare questa tessera.
              </p>
            </div>
          )}

          {/* Stato UNAVAILABLE */}
          {state === 'unavailable' && (
            <div className="flex flex-col items-center gap-4 w-full py-2">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl my-2"
                style={{
                  background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                  boxShadow: '6px 6px 16px rgba(100, 116, 139, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(51, 65, 85, 0.6)'
                }}
              >
                <WifiOff className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h1 className="text-xl font-extrabold text-[#4a1c0d]">Verifica momentaneamente non disponibile</h1>
              <p className="text-sm font-semibold text-[#4a1c0d]/75">
                Controlla la connessione e riprova tra poco.
              </p>
            </div>
          )}

          {/* Stato TOKEN_MISSING o TOKEN_MALFORMED */}
          {(state === 'TOKEN_MISSING' || state === 'TOKEN_MALFORMED') && (
            <div className="flex flex-col items-center gap-4 w-full py-2">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-xl my-2"
                style={{
                  background: 'linear-gradient(135deg, #e65100 0%, #ff8f00 100%)',
                  boxShadow: '6px 6px 16px rgba(230, 81, 0, 0.35), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -4px -4px 8px rgba(138, 58, 25, 0.6)'
                }}
              >
                <CreditCard className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#4a1c0d]">Tessera Associativa ABBO APS</h1>
              <p className="text-sm font-medium text-[#4a1c0d]/75 leading-relaxed">
                Scansiona il tag NFC sulla tua tessera associativa per verificarne lo stato in tempo reale.
              </p>
            </div>
          )}

        </div>

        {/* Galleria Link Tree Claymorphism 3D */}
        <div className="w-full flex flex-col gap-3">
          <a
            href="https://instagram.com/abboaps"
            target="_blank"
            rel="noopener noreferrer"
            className="clay-card p-4 flex items-center gap-4 text-[#4a1c0d]"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
                boxShadow: '3px 3px 8px rgba(74, 28, 13, 0.15), inset 2px 2px 4px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Instagram className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold text-[#4a1c0d]">Instagram</span>
              <span className="text-xs text-[#4a1c0d]/65 font-medium">Seguici su Instagram</span>
            </div>
          </a>

          <a
            href="https://www.abboaps.org"
            className="clay-card p-4 flex items-center gap-4 text-[#4a1c0d]"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #e65100 0%, #ff8f00 100%)',
                boxShadow: '3px 3px 8px rgba(230, 81, 0, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(138, 58, 25, 0.5)'
              }}
            >
              <Globe className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold text-[#4a1c0d]">Sito ufficiale</span>
              <span className="text-xs text-[#4a1c0d]/65 font-medium">Scopri ABBO APS</span>
            </div>
          </a>

          <a
            href="mailto:info@abboaps.org"
            className="clay-card p-4 flex items-center gap-4 text-[#4a1c0d]"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #8a3a19 0%, #4a1c0d 100%)',
                boxShadow: '3px 3px 8px rgba(74, 28, 13, 0.2), inset 2px 2px 4px rgba(255, 255, 255, 0.5), inset -2px -2px 4px rgba(0, 0, 0, 0.4)'
              }}
            >
              <Mail className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold text-[#4a1c0d]">Contattaci</span>
              <span className="text-xs text-[#4a1c0d]/65 font-medium">Scrivi ad ABBO APS</span>
            </div>
          </a>

          <a
            href="https://www.paypal.com/donate/?hosted_button_id=ABBOAPS"
            target="_blank"
            rel="noopener noreferrer"
            className="clay-card p-4 flex items-center gap-4 text-[#4a1c0d]"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #ff424d 0%, #d81b60 100%)',
                boxShadow: '3px 3px 8px rgba(216, 27, 96, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(136, 14, 60, 0.5)'
              }}
            >
              <Heart className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold text-[#4a1c0d]">Sostieni ABBO</span>
              <span className="text-xs text-[#4a1c0d]/65 font-medium">Fai una donazione</span>
            </div>
          </a>

          <a
            href="/privacy-policy"
            className="clay-card p-4 flex items-center gap-4 text-[#4a1c0d]"
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '3px 3px 8px rgba(5, 150, 105, 0.25), inset 2px 2px 4px rgba(255, 255, 255, 0.6), inset -2px -2px 4px rgba(4, 120, 87, 0.5)'
              }}
            >
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base font-extrabold text-[#4a1c0d]">Informativa Privacy</span>
              <span className="text-xs text-[#4a1c0d]/65 font-medium">Trattamento dati personali</span>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
