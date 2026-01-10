import { ReactNode } from "react";

type PortalCardProps = {
  title: string;
  description: string;
  badge?: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function PortalCard({
  title,
  description,
  badge,
  imageUrl,
  imageAlt,
  meta,
  children,
  className,
}: PortalCardProps) {
  const badgeNode =
    badge && (typeof badge === "string" || typeof badge === "number") ? (
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">{badge}</div>
    ) : (
      badge
    );

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#1f6dd1]/35 hover:shadow-2xl hover:shadow-[#1f6dd1]/20 ${
        className ?? ""
      }`}
    >
      {imageUrl && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-white/70 bg-white/80">
          <div className="relative">
            <img
              src={imageUrl}
              alt={imageAlt ?? "Imagem"}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2732]/35 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </div>
      )}
      {badgeNode}
      <h3 className="mt-3 text-xl font-bold text-[#1a2732]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#5b6b78]">{description}</p>
      {meta && <div className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#8a98a5]">{meta}</div>}
      {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}
