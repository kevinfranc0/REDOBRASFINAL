import { redirect } from "next/navigation";
import { ListingCard, ProjectCard, TalentCard } from "@/components/listing-card";
import { EmptyState, SectionTitle } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getFavorites } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Favoritos" };

export default async function FavoritosPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const data = await getFavorites(me.id);

  if (data.favs.length === 0) {
    return (
      <EmptyState
        title="Sin favoritos"
        text="Guarda servicios, personas y proyectos para volver a ellos."
        href="/explorar"
        cta="Explorar"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Mis favoritos</h1>
      {data.listings.length ? (
        <section className="grid gap-4 sm:grid-cols-2">
          {data.listings.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
              favorited
            />
          ))}
        </section>
      ) : null}
      {data.people.length ? (
        <section>
          <SectionTitle title="Profesionales" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {data.people.map((p) => (
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
      ) : null}
      {data.projects.length ? (
        <section className="space-y-3">
          <SectionTitle title="Proyectos" />
          {data.projects.map((row) => (
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
      ) : null}
    </div>
  );
}
