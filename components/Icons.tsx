export type IconName =
  | "heart"
  | "stethoscope"
  | "leaf"
  | "pill"
  | "pharmacy"
  | "flask"
  | "chat"
  | "brain"
  | "hospital"
  | "calendar"
  | "graduation"
  | "home"
  | "briefcase"
  | "network"
  | "building"
  | "check"
  | "clock"
  | "ear"
  | "hand"
  | "pin"
  | "whatsapp"
  | "instagram"
  | "mail";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const cls = className ? `${className} stroke-current` : "stroke-current";

  if (name === "whatsapp") {
    return <img src="/brand/whatsapp.svg" alt="" aria-hidden="true" className={className} />;
  }

  switch (name) {
    case "heart":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20s-6-4.35-8.5-7.5C1.5 9 3 6 6 6c2 0 3.5 1.5 4 2.5C10.5 7.5 12 6 14 6c3 0 4.5 3 2.5 6.5C18 15.65 12 20 12 20z" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v4a4 4 0 0 0 8 0V3" />
          <path d="M10 11v3a4 4 0 0 0 4 4h2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      );
    case "leaf":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 20c9-1 14-6 14-16-10 0-15 5-16 14" />
          <path d="M7 17c3-3 6-5 10-7" />
        </svg>
      );
    case "pill":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="12" height="12" rx="6" transform="rotate(-45 12 12)" />
          <path d="M9 15l6-6" />
        </svg>
      );
    case "pharmacy":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6" />
          <path d="M9 3v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3" />
          <rect x="7" y="8" width="10" height="13" rx="2" />
          <path d="M12 12v5" />
          <path d="M10 14h4" />
        </svg>
      );
    case "flask":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6" />
          <path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" />
          <path d="M8 14h8" />
        </svg>
      );
    case "chat":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16v8a3 3 0 0 1-3 3H9l-5 4v-4H7a3 3 0 0 1-3-3V6z" />
        </svg>
      );
    case "brain":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6a3 3 0 0 0 -3 3v2a3 3 0 0 0 3 3" />
          <path d="M15 6a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3" />
          <path d="M9 14a3 3 0 0 0 6 0" />
          <path d="M12 6v8" />
        </svg>
      );
    case "hospital":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
          <path d="M9 21v-6h6v6" />
          <path d="M12 7v4M10 9h4" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "graduation":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 9l10-4 10 4-10 4-10-4z" />
          <path d="M6 11v4a6 6 0 0 0 12 0v-4" />
          <path d="M22 9v5" />
        </svg>
      );
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10l8-6 8 6v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="7" width="16" height="11" rx="2" />
          <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          <path d="M4 12h16" />
        </svg>
      );
    case "network":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2" />
          <circle cx="5" cy="19" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M12 7v4M7 17l4-6M17 17l-4-6" />
        </svg>
      );
    case "building":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M4 9h16M8 20v-6M12 20v-6M16 20v-6" />
        </svg>
      );
    case "check":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l4 4L19 7" />
        </svg>
      );
    case "clock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case "ear":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6a5 5 0 0 1 5 5c0 3-2 4-2 6a3 3 0 0 1-3 3" />
          <path d="M9 14a2 2 0 0 0 4 0" />
          <path d="M9 10a3 3 0 0 1 6 0" />
        </svg>
      );
    case "hand":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 11V6a1 1 0 0 1 2 0v5" />
          <path d="M10 11V5a1 1 0 0 1 2 0v6" />
          <path d="M12 11V6a1 1 0 0 1 2 0v6" />
          <path d="M14 11V7a1 1 0 0 1 2 0v6" />
          <path d="M8 11v4a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-1" />
        </svg>
      );
    case "pin":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17" cy="7" r="1" />
        </svg>
      );
    case "mail":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    default:
      return null;
  }
}
