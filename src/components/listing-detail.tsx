import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import {
  ContactButtons,
  LoginGate,
  ReportMenu,
  ReviewForm,
} from "@/components/interactive";
import {
  Avatar,
  DemoBadge,
  Place,
  Price,
  Stars,
  VerifiedBadge,
} from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getListingById, getReviewsForUser, isFavorited } from "@/lib/queries";
import { LEGAL_RESOURCES } from "@/lib/constants";
import { formatKm, haversineKm, POPAYAN } from "@/lib/utils";

export async function ListingDetail({ id }: { id: string }) {
  const row = await getListingById(id);
  if (!row) notFound();
  const { listing, author, category } = row;
  const me = await getCurrentUser();
  const reviews = await getReviewsForUser(author.userId);
  const fav = me ? await isFavorited(me.id, "listing", listing.id) : false;
  const km = haversineKm(POPAYAN.lat, POPAYAN.lng, listing.lat, listing.lng);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="relative aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.imageUrls[0] ?? "/images/render-casa.jpg"}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute right-3 top-3">
            <FavoriteButton targetType="listing" targetId={listing.id} initial={fav} />
          </div>
        </div>
        {listing.imageUrls.length > 1 ? (
          <div className="flex gap-2 p-3">
            {listing.imageUrls.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="h-16 w-20 rounded-xl object-cover"
              />
            ))}
          </div>
        ) : null}
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-semibold">{listing.title}</h1>
                {listing.isDemo ? <DemoBadge /> : null}
              </div>
              <p className="text-sm text-mute">
                {category?.name ?? listing.type} · {listing.tags.join(" · ")}
              </p>
            </div>
            <Price value={listing.price} extra={listing.priceLabel} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Stars value={author.ratingAvg} count={author.ratingCount} />
            <Place extra={listing.neighborhood} />
            <span className="text-xs text-mute">A {formatKm(km)}</span>
          </div>
          {listing.condition ? (
            <p className="text-sm">
              Estado: <span className="font-semibold">{listing.condition}</span>
            </p>
          ) : null}
          <p className="text-[15px] leading-relaxed text-ink">{listing.description}</p>
          {listing.type === "recurso" ? (
            <p className="rounded-2xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
              {LEGAL_RESOURCES}
            </p>
          ) : null}
          <p className="text-xs text-mute">Disponibilidad: {listing.availability}</p>
        </div>
      </div>

      <Link
        href={`/u/${author.userId}`}
        className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card"
      >
        <Avatar src={author.avatarUrl} alt={author.displayName} size={52} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{author.displayName}</p>
          <p className="text-sm text-mute">{author.roleTitle}</p>
          <VerifiedBadge type={author.verificationType} />
        </div>
        <Stars value={author.ratingAvg} count={author.ratingCount} />
      </Link>

      {me ? (
        <ContactButtons otherUserId={author.userId} listingId={listing.id} />
      ) : (
        <LoginGate />
      )}

      {me && me.id !== author.userId ? (
        <ReviewForm revieweeId={author.userId} listingId={listing.id} />
      ) : null}

      <div>
        <h2 className="font-display text-lg font-semibold">Opiniones</h2>
        <div className="mt-3 space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-mute">Aún no hay reseñas.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.review.id} className="rounded-3xl bg-white p-4 shadow-card">
                <div className="flex items-center gap-2">
                  <Avatar src={r.reviewer.avatarUrl} alt="" size={32} />
                  <p className="text-sm font-semibold">{r.reviewer.displayName}</p>
                  <Stars value={r.review.overall} />
                </div>
                <p className="mt-2 text-sm text-mute">{r.review.comment}</p>
                <p className="mt-1 text-[11px] text-mute">
                  Calidad {r.review.quality} · Cumplimiento {r.review.punctuality} ·
                  Comunicación {r.review.communication} · Precio {r.review.value}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {me ? (
        <ReportMenu
          targetType="listing"
          targetId={listing.id}
          blockId={author.userId}
        />
      ) : null}
    </div>
  );
}
