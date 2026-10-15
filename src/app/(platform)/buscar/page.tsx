import { ListingCard, ProjectCard, TalentCard } from "@/components/listing-card";
import { SearchBox } from "@/components/search-box";
import { EmptyState, SectionTitle } from "@/components/ui";
import { smartSearch } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Buscar" };

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const result = q ? await smartSearch(q) : null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Búsqueda</h1>
      <SearchBox
        initial={q}
        placeholder='Ej: “Necesito alguien que haga un render de una casa”'
      />
      {!q ? (
        <EmptyState
          title="Escribe lo que necesitas"
          text="Prueba: render de una casa, mezcladora, bloques CAD, estudiante de civil."
        />
      ) : result ? (
        <>
          <div className="rounded-2xl bg-mint px-4 py-3 text-sm text-forest">
            Entendimos:{" "}
            <strong>{result.intent.type ?? "todo"}</strong>
            {result.intent.categories.length
              ? ` · ${result.intent.categories.join(", ")}`
              : ""}
            {result.intent.city ? ` · ${result.intent.city}` : " · Popayán"}
          </div>
          <section>
            <SectionTitle title="Publicaciones" />
            <div className="grid gap-4 sm:grid-cols-2">
              {result.listings.map((row) => (
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
            <SectionTitle title="Personas" />
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {result.people.map((p) => (
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
          <section className="space-y-3">
            <SectionTitle title="Proyectos" />
            {result.projects.map((row) => (
              <ProjectCard
                key={row.project.id}
                id={row.project.id}
                title={row.project.title}
                description={row.project.description}
                skills={row.project.skills}
                authorName={row.author.displayName}
                authorAvatar={row.author.avatarUrl}
                time={timeAgo(row.project.createdAt)}
              />
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}
