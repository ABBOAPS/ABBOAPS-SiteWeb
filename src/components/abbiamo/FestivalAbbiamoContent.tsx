import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Accessibility,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  ChevronDown,
  Coffee,
  Clock3,
  DoorOpen,
  Hand,
  HeartHandshake,
  Mail,
  MapPin,
  MapPinned,
  Network,
  Ticket,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { abbiamoData, buildAbbiamoIcs, buildGoogleCalendarUrl } from "../../data/abbiamo";
import { FestivalClayIcon, FestivalFooterBridge, FestivalHeroScene } from "./FestivalGraphics";

function downloadAbbiamoCalendar(): void {
  const blob = new Blob([buildAbbiamoIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "festival-abbiamo-2026.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function CalendarChooser({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const googleCalendarUrl = buildGoogleCalendarUrl();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    focusable()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab") return;

      const items = focusable();
      if (!items.length) return;
      const current = document.activeElement;
      if (event.shiftKey && current === items[0]) {
        event.preventDefault();
        items.at(-1)?.focus();
      } else if (!event.shiftKey && current === items.at(-1)) {
        event.preventDefault();
        items[0]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="festival-dialog-backdrop" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <div ref={dialogRef} className="festival-dialog" role="dialog" aria-modal="true" aria-labelledby="abbiamo-calendar-title">
        <button type="button" className="festival-dialog-close" onClick={onClose} aria-label="Chiudi scelta calendario">
          <X size={20} aria-hidden="true" />
        </button>
        <h2 id="abbiamo-calendar-title">Salva l’evento</h2>
        <p>Scegli dove aggiungere Festival ABBIAMO. Il file .ics contiene i tre promemoria richiesti.</p>
        <div className="festival-dialog-actions">
          <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="festival-button festival-button--red">
            Google Calendar <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <button type="button" className="festival-button festival-button--ink" onClick={downloadAbbiamoCalendar}>
            Apple / altro calendario <CalendarDays size={17} aria-hidden="true" />
          </button>
        </div>
        <p className="festival-dialog-note">Google Calendar apre l’evento compilato; i promemoria personalizzati sono inclusi nel file .ics.</p>
      </div>
    </div>
  );
}

function ParticipantMarquee() {
  const list = (copy: number) => (
    <ul className="festival-marquee-list" aria-hidden={copy === 1}>
      {abbiamoData.participants.map((participant) => (
        <li key={`${copy}-${participant.name}`}>
          <div className={`festival-participant${participant.textOnly ? " festival-participant--text-only" : ""}`}>
            {participant.logoSrc && (
              <div className="festival-participant-logo" style={{ "--festival-participant-scale": participant.visualScale ?? 1 } as CSSProperties}>
                <img
                  src={participant.logoSrc}
                  alt={`Logo ${participant.name}`}
                  width={participant.logoWidth}
                  height={participant.logoHeight}
                  loading="eager"
                  decoding="async"
                  translate="no"
                />
              </div>
            )}
            <span className="festival-participant-name">{participant.name}</span>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="festival-marquee" aria-label="Realtà partecipanti">
      <div className="festival-marquee-viewport"><div className="festival-marquee-track">{list(0)}{list(1)}</div></div>
    </section>
  );
}

function InformationIcon({ kind }: { kind: string }) {
  if (kind === "ticket") return <Ticket aria-hidden="true" />;
  if (kind === "users") return <Users aria-hidden="true" />;
  if (kind === "accessibility") return <Accessibility aria-hidden="true" />;
  if (kind === "parking") return <CarFront aria-hidden="true" />;
  if (kind === "clock") return <Clock3 aria-hidden="true" />;
  if (kind === "indoor") return <DoorOpen aria-hidden="true" />;
  return <Coffee aria-hidden="true" />;
}

function SupporterLogo({ supporter, className = "", loading = "lazy" }: { supporter: (typeof abbiamoData.supporters)[number]; className?: string; loading?: "eager" | "lazy" }) {
  return <img className={className} src={supporter.logoSrc} alt={supporter.name} width={supporter.logoWidth} height={supporter.logoHeight} decoding="async" loading={loading} translate="no" />;
}

function FestivalHeroPatronage() {
  const csv = abbiamoData.supporters[0];

  return (
    <aside className="festival-hero-patronage" aria-label="Patrocinio">
      <p>Con il patrocinio di</p>
      <SupporterLogo supporter={csv} loading="eager" />
    </aside>
  );
}

function FestivalSupportSection() {
  const [csv, abcSport] = abbiamoData.supporters;

  return (
    <section className="festival-section festival-support" aria-labelledby="abbiamo-support-title">
      <div className="festival-shell festival-support-layout">
        <header className="festival-support-heading">
          <div>
            <h2 id="abbiamo-support-title">ABBIAMO si fa insieme.</h2>
            <p>Un festival di territorio nasce dalle collaborazioni che lo rendono possibile.</p>
          </div>
          <div className="festival-support-icon" aria-hidden="true"><HeartHandshake /></div>
        </header>
        <div className="festival-support-composition">
          <article className="festival-supporter festival-supporter--patronage">
            <p>Con il patrocinio di</p>
            <SupporterLogo supporter={csv} />
          </article>
          <article className="festival-supporter festival-supporter--logistics">
            <p>Con il supporto logistico di</p>
            <SupporterLogo supporter={abcSport} />
          </article>
        </div>
      </div>
    </section>
  );
}

function FestivalClosingPatronage() {
  const csv = abbiamoData.supporters[0];

  return (
    <section className="festival-closing-patronage" aria-label="Patrocinio">
      <div className="festival-shell">
        <p>Con il patrocinio di</p>
        <SupporterLogo supporter={csv} />
      </div>
    </section>
  );
}

export function FestivalAbbiamoContent() {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="festival-page">
      <section className="festival-hero" aria-labelledby="abbiamo-title">
        <FestivalHeroScene className="festival-hero-scene" />
          <div className="festival-shell festival-hero-layout">
          <div className="festival-hero-copy">
            <img className="festival-logo" src={abbiamoData.logoSrc} alt="Festival ABBIAMO" width="420" height="254" fetchPriority="high" />
            <h1 id="abbiamo-title" className="sr-only">ABBiamo</h1>
            <p className="festival-payoff">Non una fiera da guardare,<br />ma un territorio da vivere.</p>
            <div className="festival-event-meta" aria-label={`${abbiamoData.dateLabel}, dalle ${abbiamoData.startTime} alle ${abbiamoData.endTime}, ${abbiamoData.location}`}>
              <strong>{abbiamoData.dateLabel}</strong>
              <span>{abbiamoData.startTime} — {abbiamoData.endTime}</span>
              <span>{abbiamoData.location}</span>
            </div>
            <div className="festival-hero-actions">
              <button type="button" className="festival-button festival-button--cream" onClick={() => setCalendarOpen(true)}>Salva l’evento <CalendarDays size={18} aria-hidden="true" /></button>
              <a className="festival-button festival-button--line" href={abbiamoData.mapsUrl} target="_blank" rel="noopener noreferrer">Come arrivare <MapPin size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <FestivalHeroPatronage />
        </div>
      </section>

      <ParticipantMarquee />

      <main>
        <section className="festival-section festival-manifesto" aria-labelledby="abbiamo-intro-title">
          <div className="festival-shell festival-manifesto-grid">
            <div className="festival-manifesto-title"><h2 id="abbiamo-intro-title">{abbiamoData.intro.title}</h2></div>
            <div className="festival-manifesto-copy"><FestivalClayIcon><Network /></FestivalClayIcon><p>{abbiamoData.intro.body}</p></div>
          </div>
        </section>

        <section className="festival-section festival-experience" aria-labelledby="abbiamo-experience-title">
          <div className="festival-shell festival-experience-grid">
            <div className="festival-experience-copy">
              <h2 id="abbiamo-experience-title">{abbiamoData.experience.title}</h2>
              <p>Ogni stand propone <strong>giochi</strong>, <strong>quiz</strong> o <strong>attività interattive</strong> legate alla propria missione. Passa da uno stand all’altro, fai domande, conosci chi rende vivo il territorio e raccogli le firme sul tuo <strong>poster numerato in edizione limitata</strong>.</p>
            </div>
            <FestivalClayIcon className="festival-section-icon"><Hand /></FestivalClayIcon>
          </div>
        </section>

        <section className="festival-section festival-program" aria-labelledby="abbiamo-program-title">
          <div className="festival-shell">
            <header className="festival-program-heading"><h2 id="abbiamo-program-title">{abbiamoData.program.title}</h2><p>Quattro momenti, un pomeriggio aperto al territorio.</p></header>
            <ol className="festival-timeline">
              {abbiamoData.schedule.map((item) => (
                <li key={item.title}>
                  <time dateTime={item.dateTime}>{item.time}</time>
                  <span className="festival-timeline-dot" aria-hidden="true" />
                  <div><h3>{item.title}</h3><p>{item.description}</p>{item.note && <small>{item.note}</small>}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="festival-section festival-location" aria-labelledby="abbiamo-info-title">
          <div className="festival-shell festival-location-grid">
            <div className="festival-location-stage">
              <FestivalClayIcon className="festival-location-icon"><MapPinned /></FestivalClayIcon>
              <h2 id="abbiamo-info-title">{abbiamoData.information.title}</h2>
              <strong>{abbiamoData.location}</strong>
              <span>{abbiamoData.dateLabel}<br />{abbiamoData.startTime} — {abbiamoData.endTime}</span>
              <a className="festival-button festival-button--cream" href={abbiamoData.mapsUrl} target="_blank" rel="noopener noreferrer">Apri in Maps <ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <ul className="festival-practical-list">
              {abbiamoData.information.items.map((item) => <li key={item.text}><InformationIcon kind={item.icon} /><span>{item.text}</span></li>)}
            </ul>
          </div>
        </section>

        <FestivalSupportSection />

        <section className="festival-invitation" aria-labelledby="abbiamo-join-title">
          <div className="festival-shell festival-invitation-grid">
            <FestivalClayIcon className="festival-invitation-art"><UsersRound /></FestivalClayIcon>
            <div>
              <h2 id="abbiamo-join-title">{abbiamoData.participation.title}</h2>
              <p>Rappresenti un’associazione o una realtà no-profit del territorio e vuoi partecipare ad ABBIAMO?</p>
              <a className="festival-button festival-button--cream" href={`mailto:${abbiamoData.contactEmail}?subject=Partecipazione%20Festival%20ABBiamo`}>Scrivici <Mail size={18} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="festival-section festival-faq" aria-labelledby="abbiamo-faq-title">
          <div className="festival-shell festival-faq-grid">
            <h2 id="abbiamo-faq-title">Domande frequenti</h2>
            <div className="festival-faq-list">
              {abbiamoData.faqs.map((faq) => (
                <details key={faq.question}><summary><span>{faq.question}</span><ChevronDown aria-hidden="true" /></summary><p>{faq.answer}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FestivalClosingPatronage />
      <div className="festival-footer-bridge"><FestivalFooterBridge /></div>
      {calendarOpen && <CalendarChooser onClose={() => setCalendarOpen(false)} />}
    </div>
  );
}
