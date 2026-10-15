import Link from "next/link";
import {
  Briefcase,
  Boxes,
  FolderKanban,
  ShoppingBag,
} from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { ListingCard, TalentCard } from "@/components/listing-card";
import { SectionTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getListingCards, getTalent } from "@/lib/queries";
import { firstName } from "@/lib/utils";

export const metadata = { title: "Inicio" };

export default async function InicioPage() {
  const user = await getCurrentUser();
  const name = user ? firstName(user.profile.displayName) : "Popayán";
  const featured = await getListingCards({ featured: true, limit: 6 });
  const services = await getListingCards({ type: "servicio", limit: 6 });
  const talent = await getTalent(8);

  const quick = [
    { href: "/servicios", label: "Servicios", icon: Briefcase },
    { href: "/materiales", label: "Materiales y herramientas", icon: Boxes },
    { href: "/proyectos", label: "Proyectos", icon: FolderKanban },
    { href: "/recursos", label: "Compra mi trabajo", icon: ShoppingBag },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Hola, {name}</h1>
          <p className="text-mute">¿Qué necesitas hoy?</p>
        </div>
      </div>

      <SearchBox />

      <div className="grid grid-cols-4 gap-2">
        {quick.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-2 rounded-3xl bg-white px-1 py-4 text-center shadow-card"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-mint text-forest">
                <Icon size={20} />
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink">
                {q.label}
              </span>
            </Link>
          );
        })}
      </div>

      <section>
        <SectionTitle title="Anuncios destacados" href="/explorar" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Oportunidades cerca de ti" href="/mapa" action="Mapa" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Talento local" href="/explorar" />
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {talent.map((p) => (
            <TalentCard
              key={p.id}
              id={p.userId}
              name={p.displayName}
              role={p.roleTitle}
              avatar={p.avatarUrl}
              rating={p.ratingAvg}
              count={p.ratingCount}
            />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl bg-forest p-6 text-white">
        <p className="text-sm text-white/70">Tu talento también construye la ciudad</p>
        <p className="mt-2 max-w-xl text-lg font-medium">
          Ofrece tus servicios, comparte tus recursos y encuentra lo que necesitas
          en Popayán.
        </p>
        <Link
          href="/publicar"
          className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-bold text-forest"
        >
          Publicar ahora
        </Link>
      </section>
    </div>
  );
}
