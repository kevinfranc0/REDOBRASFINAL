import { notFound } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import { ContactButtons, LoginGate, ReportMenu, ReviewForm } from "@/components/interactive";
import { Avatar, Stars, VerifiedBadge } from "@/components/ui";
import { FavoriteButton } from "@/components/favorite-button";
import { getCurrentUser } from "@/lib/auth";
import {
  getProfileByUserId,
  getReviewsForUser,
  getUserListings,
  isFavorited,
} from "@/lib/queries";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getProfileByUserId(id);
  if (!p) notFound();
  const listings = await getUserListings(id);
  const reviews = await getReviewsForUser(id);
  const me = await getCurrentUser();
  const fav = me ? await isFavorited(me.id, "profile", id) : false;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="rounded-3xl bg-white p-5 shadow-card">
        <div className="flex items-start gap-4">
          <Avatar src={p.avatarUrl} alt={p.displayName} size={80} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="font-display text-2xl font-semibold">{p.displayName}</h1>
                <p className="text-sm text-mute">{p.roleTitle}</p>
              </div>
              <FavoriteButton targetType="profile" targetId={id} initial={fav} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Stars value={p.ratingAvg} count={p.ratingCount} />
              <VerifiedBadge type={p.verificationType} />
            </div>
            <p className="mt-1 text-xs text-mute">
              {p.neighborhood}, {p.city} · {p.jobsCompleted} trabajos
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{p.bio}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.skills.map((s) => (
            <span key={s} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
              {s}
            </span>
          ))}
        </div>
      </div>

      {p.portfolioUrls.length ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {p.portfolioUrls.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-32 w-full rounded-2xl object-cover" />
          ))}
        </div>
      ) : null}

      {me ? (
        <ContactButtons otherUserId={id} listingId={listings[0]?.listing.id} />
      ) : (
        <LoginGate />
      )}

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Servicios</h2>
        {listings.map((row) => (
          <ListingCard
            key={row.listing.id}
            listing={row.listing}
            author={p}
            category={row.category}
            compact
          />
        ))}
      </div>

      {me && me.id !== id ? <ReviewForm revieweeId={id} /> : null}

      <div>
        <h2 className="font-display text-lg font-semibold">Opiniones</h2>
        <div className="mt-3 space-y-2">
          {reviews.map((r) => (
            <div key={r.review.id} className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-sm font-semibold">{r.reviewer.displayName}</p>
              <Stars value={r.review.overall} />
              <p className="text-sm text-mute">{r.review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      {me ? <ReportMenu targetType="user" targetId={id} blockId={id} /> : null}
    </div>
  );
}
