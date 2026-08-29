import type { ReactNode } from "react";

type GraphicProps = { className?: string };

export function FestivalClayIcon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`festival-clay-icon ${className}`} aria-hidden="true"><span>{children}</span></div>;
}

export function FestivalHeroScene({ className }: GraphicProps) {
  return (
    <svg className={className} viewBox="0 0 1440 920" aria-hidden="true" focusable="false">
      <path className="festival-shape-coral" d="M1020-116c228-56 452 52 492 237 44 200-116 327-323 339-205 12-402-84-425-249-18-128 82-293 256-327Z" />
      <path className="festival-shape-cream" d="M-70 576c126-172 359-198 497-59 127 128 68 323-92 395H-70V576Z" />
      <path className="festival-shape-red" d="M1190 575c109-81 259-58 312 51 54 112-58 213-187 208-129-5-235-140-125-259Z" />
    </svg>
  );
}

export function FestivalFooterBridge({ className }: GraphicProps) {
  return (
    <svg className={className} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="festival-shape-red" d="M0 70C158 198 328 204 510 100c187-107 315-92 460 10 176 124 329 109 470-9v119H0V70Z" />
      <path className="festival-line-light" d="M1024 51c66 39 144 47 233 24M212 161c72-45 147-50 226-16" />
    </svg>
  );
}
