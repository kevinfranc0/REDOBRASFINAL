import Link from "next/link";
import { Heart } from "lucide-react";
import type { Category, Listing, Profile } from "@/db/schema";
import { DemoBadge, Place, Price, Stars } from "@/components/ui";
import { FavoriteButton } from "@/components/favorite-button";
import { cn } from "@/lib/utils";

export function listingHref(listing: Listing) {
  if (listing.type === "servicio") return `/servicios/${listing.id}`;
  if (listing.type === "recurso") return `/recursos/${listing.id}`;
  return `/materiales/${listing.id}`;
}

export function ListingCard({
  listing,
  author,
  category,
  favorited = false,
  compact = false,
}: {
  listing: Listing;
  author: Profile;
  category?: Category | null;
  favorited?: boolean;
  compact?: boolean;
}) {
  const href = listingHref(listing);
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white shadow-card",
        compact ? "flex gap-3 p-2.5" : "",
      )}
    >
      <Link
        href={href}
        className={cn(
          "block overflow-hidden bg-mist",
          compact ? "h-24 w-24 shrink-0 rounded-2xl" : "aspect-[16/10] w-full",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.imageUrls[0] ?? "/images/render-casa.jpg"}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className={cn(compact ? "min-w-0 flex-1 py-1 pr-8" : "p-3.5")}>
        <div className="flex items-start justify-between gap-2">
          <Link href={href} className="min-w-0">
            <h3 className="truncate font-semibold leading-tight text-ink">
              {listing.title}
            </h3>
            <p className="mt-0.5 truncate text-[12px] text-mute">
              {category?.name ?? listing.tags[0] ?? listing.type}{" "}
              {listing.tags[1] ? `· ${listing.tags[1]}` : ""}
            </p>
          </Link>
          {!compact ? (
            <FavoriteButton
              targetType="listing"
              targetId={listing.id}
              initial={favorited}
            />
          ) : (
            <Heart className="absolute right-3 top-3 text-mute" size={18} />
          )}
        </div>
        <div
          className={cn(
            "flex items-end justify-between gap-2",
            compact ? "mt-2" : "mt-3",
          )}
        >
          <Price value={listing.price} extra={listing.priceLabel} />
          <div className="flex flex-col items-end gap-1">
            <Stars value={author.ratingAvg} count={author.ratingCount} />
            {compact ? <Place extra={listing.neighborhood} /> : null}
          </div>
        </div>
        {!compact ? (
          <div className="mt-2 flex items-center justify-between">
            <Place extra={listing.neighborhood} />
            {listing.isDemo ? <DemoBadge /> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ProjectCard({
  id,
  title,
  description,
  skills,
  authorName,
  authorAvatar,
  time,
  kind,
}: {
  id: string;
  title: string;
  description: string;
  skills: string[];
  authorName: string;
  authorAvatar: string;
  time: string;
  kind?: string;
}) {
  return (
    <Link
      href={`/proyectos/${id}`}
      className="block rounded-3xl bg-white p-4 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-mute">
            {description}
          </p>
        </div>
        <Heart size={18} className="shrink-0 text-mute" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-semibold text-forest"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[12px] text-mute">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorAvatar}
          alt=""
          className="h-6 w-6 rounded-full object-cover"
        />
        <span>{authorName}</span>
        <span>·</span>
        <span>{time}</span>
        {kind === "ofrezco_equipo" ? (
          <span className="ml-auto rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold uppercase text-forest">
            Equipo
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export function TalentCard({
  id,
  name,
  role,
  avatar,
  rating,
  count,
}: {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  count: number;
}) {
  return (
    <Link
      href={`/u/${id}`}
      className="flex w-36 shrink-0 flex-col items-center rounded-3xl bg-white p-4 text-center shadow-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatar}
        alt={name}
        className="h-16 w-16 rounded-full object-cover"
      />
      <p className="mt-2 line-clamp-1 text-sm font-semibold">{name}</p>
      <p className="line-clamp-2 text-[11px] text-mute">{role}</p>
      <div className="mt-2">
        <Stars value={rating} count={count} />
      </div>
    </Link>
  );
}
