import Link from "next/link";
import { SearchBox } from "@/components/search-box";
import { ListingCard, ProjectCard } from "@/components/listing-card";
import { Chip, SectionTitle } from "@/components/ui";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { getListingCards, getProjects } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Explorar" };

export default async function ExplorarPage() {
  const services = await getListingCards({ type: "servicio", limit: 8 });
  const materials = await getListingCards({ limit: 8 });
  const mats = materials.filter(
    (r) => r.listing.type === "material" || r.listing.type === "herramienta",
  );
  const resources = await getListingCards({ type: "recurso", limit: 8 });
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Explorar</h1>
        <p className="text-mute">Servicios, materiales, proyectos y recursos en Popayán.</p>
      </div>
      <SearchBox withFilter />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip href="/servicios" active>
          Servicios
        </Chip>
        <Chip href="/materiales">Materiales</Chip>
        <Chip href="/proyectos">Proyectos</Chip>
        <Chip href="/recursos">Compra mi trabajo</Chip>
        <Chip href="/mapa">Cerca de ti</Chip>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {SERVICE_CATEGORIES.slice(0, 10).map((c) => (
          <Chip key={c.slug} href={`/servicios?cat=${c.slug}`}>
            {c.name}
          </Chip>
        ))}
      </div>

      <section>
        <SectionTitle title="Servicios" href="/servicios" />
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
        <SectionTitle title="Materiales y herramientas" href="/materiales" />
        <div className="grid gap-3">
          {mats.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
              compact
            />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title="Proyectos" href="/proyectos" />
        <div className="grid gap-3">
          {projects.slice(0, 4).map((row) => (
            <ProjectCard
              key={row.project.id}
              id={row.project.id}
              title={row.project.title}
              description={row.project.description}
              skills={row.project.skills}
              authorName={row.author.displayName}
              authorAvatar={row.author.avatarUrl}
              time={timeAgo(row.project.createdAt)}
              kind={row.project.kind}
            />
          ))}
        </div>
      </section>
      <section>
        <SectionTitle title="Compra mi trabajo" href="/recursos" />
        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
            />
          ))}
        </div>
      </section>
      <p className="text-center text-sm">
        <Link href="/buscar" className="font-semibold text-leaf">
          Búsqueda inteligente →
        </Link>
      </p>
    </div>
  );
}
