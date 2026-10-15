import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions";
import { ListingCard } from "@/components/listing-card";
import { Avatar, Stars, VerifiedBadge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getReviewsForUser, getUserListings, getUserProjects } from "@/lib/queries";

export const metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const listings = await getUserListings(me.id);
  const projects = await getUserProjects(me.id);
  const reviews = await getReviewsForUser(me.id);
  const p = me.profile;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="overflow-hidden rounded-3xl bg-forest text-white shadow-card">
        <div className="h-28 bg-forest-mid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.coverUrl} alt="" className="h-full w-full object-cover opacity-60" />
        </div>
        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <Avatar src={p.avatarUrl} alt={p.displayName} size={88} />
            <div className="pb-1">
              <h1 className="font-display text-2xl font-semibold">{p.displayName}</h1>
              <p className="text-sm text-white/80">{p.roleTitle}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/85">
            <span>
              {p.neighborhood}, {p.city}
            </span>
            <Stars value={p.ratingAvg} count={p.ratingCount} />
          </div>
          <div className="mt-2">
            <VerifiedBadge type={p.verificationType} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xl font-bold">{listings.length}</p>
              <p className="text-[11px] text-white/70">Servicios</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xl font-bold">{projects.length}</p>
              <p className="text-[11px] text-white/70">Proyectos</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-xl font-bold">{p.ratingCount}</p>
              <p className="text-[11px] text-white/70">Valoraciones</p>
            </div>
          </div>
          <Link href="/perfil/editar" className="btn-ghost mt-4 block text-center text-forest">
            Editar perfil
          </Link>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h2 className="font-semibold">Sobre mí</h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          {p.bio || "Aún no has escrito una bio."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.skills.map((s) => (
            <span key={s} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Mi portafolio</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {p.portfolioUrls.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="h-28 w-full rounded-2xl object-cover" />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Publicaciones</h2>
        {listings.map((row) => (
          <ListingCard
            key={row.listing.id}
            listing={row.listing}
            author={p}
            category={row.category}
            compact
          />
        ))}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold">Opiniones</h2>
        <div className="mt-3 space-y-2">
          {reviews.map((r) => (
            <div key={r.review.id} className="rounded-2xl bg-white p-4 shadow-card">
              <p className="text-sm font-semibold">{r.reviewer.displayName}</p>
              <p className="text-sm text-mute">{r.review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/favoritos" className="font-semibold text-leaf">
          Mis favoritos
        </Link>
        {me.role === "admin" ? (
          <Link href="/admin" className="font-semibold text-leaf">
            Panel admin
          </Link>
        ) : null}
        <form action={logoutAction}>
          <button className="font-semibold text-mute">Cerrar sesión</button>
        </form>
      </div>
    </div>
  );
}
