import type { SVGProps } from "react";
import { MessageCircle } from "lucide-react";
import { OFFICIAL_SOCIALS, type SocialPlatform } from "../config/socials";
import "../styles/social-links.css";

type SocialIconProps = SVGProps<SVGSVGElement> & { platform: SocialPlatform };

function SocialIcon({ platform, ...props }: SocialIconProps) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...props,
  };

  if (platform === "instagram") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect width="19" height="19" x="2.5" y="2.5" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M5 8.5V19" />
        <path d="M5 5.1v.1" strokeWidth="2.6" />
        <path d="M10 19v-5.8a3.2 3.2 0 0 1 6.4 0V19" />
        <path d="M10 11v8" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M15.2 4.2c.4 2.2 1.7 3.5 3.8 3.7v2.7a8 8 0 0 1-3.8-1.1v5.1a5 5 0 1 1-4.3-5v2.8a2.3 2.3 0 1 0 1.6 2.2V4.2h2.7Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "whatsapp") {
    return <MessageCircle {...props} aria-hidden="true" strokeWidth={1.8} />;
  }

  return (
    <svg {...commonProps} fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M20.3 4.37a19.8 19.8 0 0 0-4.89-1.52.08.08 0 0 0-.08.04c-.21.38-.45.87-.61 1.25a18.8 18.8 0 0 0-5.49 0c-.16-.39-.4-.87-.62-1.25a.08.08 0 0 0-.08-.04 19.7 19.7 0 0 0-4.88 1.51.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06c2.05 1.51 4.04 2.42 5.99 3.03a.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-1.99a.08.08 0 0 0-.04-.11c-.65-.25-1.27-.55-1.87-.89a.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1-.01.13c-.6.34-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.23 1.99a.08.08 0 0 0 .08.03c1.96-.61 3.95-1.52 6-3.03a.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42 2.18 1.1 2.16 2.42c0 1.33-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.16-1.09-2.16-2.42s.96-2.42 2.16-2.42 2.18 1.1 2.16 2.42c0 1.33-.95 2.42-2.16 2.42Z" />
    </svg>
  );
}

export function SocialLinks({
  variant = "icons",
  className = "",
}: {
  variant?: "icons" | "header" | "footer" | "limited" | "tessera";
  className?: string;
}) {
  return (
    <nav className={`social-links social-links--${variant} ${className}`.trim()} aria-label="Canali social ABBO APS">
      {OFFICIAL_SOCIALS.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-links__link social-links__link--${social.platform}`}
          aria-label={social.ariaLabel}
        >
          <SocialIcon platform={social.platform} width={20} height={20} />
          <span className="social-links__label">{social.label}</span>
        </a>
      ))}
    </nav>
  );
}
