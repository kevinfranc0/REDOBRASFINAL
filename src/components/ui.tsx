import type { ReactNode } from "react";
import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { cn, formatCOP, starsLabel } from "@/lib/utils";

export function Stars({
  value,
  count,
  size = 14,
}: {
  value: number;
  count?: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink">
      <Star
        size={size}
        className="fill-gold text-gold"
        strokeWidth={0}
      />
      <span>{starsLabel(value)}</span>
      {typeof count === "number" ? (
        <span className="font-medium text-mute">({count})</span>
      ) : null}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
      DEMO
    </span>
  );
}

export function VerifiedBadge({
  type,
}: {
  type?: "usuario" | "profesional" | "empresa" | null;
}) {
  if (!type) return null;
  const label =
    type === "empresa"
      ? "Empresa verificada"
      : type === "profesional"
        ? "Profesional verificado"
        : "Usuario verificado";
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[11px] font-semibold text-leaf">
      <BadgeCheck size={13} />
      {label}
    </span>
  );
}

export function Price({
  value,
  extra,
}: {
  value: number | null | undefined;
  extra?: string | null;
}) {
  return (
    <div>
      <p className="text-[15px] font-bold text-forest">{formatCOP(value)}</p>
      {extra ? <p className="text-[11px] text-mute">{extra}</p> : null}
    </div>
  );
}

export function Place({
  city = "Popayán",
  extra,
}: {
  city?: string;
  extra?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-mute">
      <MapPin size={12} />
      {extra ? `${extra} · ${city}` : city}
    </span>
  );
}

export function Avatar({
  src,
  alt,
  size = 40,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export function SectionTitle({
  title,
  href,
  action = "Ver todo",
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {href ? (
        <Link href={href} className="text-sm font-semibold text-leaf">
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white p-8 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-mute">{text}</p>
      {href && cta ? (
        <Link href={href} className="btn-primary mt-4 inline-flex">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export function Chip({
  active,
  children,
  href,
}: {
  active?: boolean;
  children: ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className={cn("chip", active && "chip-active")}>
      {children}
    </Link>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-mint px-4 py-3 text-[13px] leading-relaxed text-forest">
      {children}
    </div>
  );
}
