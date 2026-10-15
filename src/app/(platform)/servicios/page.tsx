import { SearchBox } from "@/components/search-box";
import { ListingCard } from "@/components/listing-card";
import { Chip, EmptyState } from "@/components/ui";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { getListingCards } from "@/lib/queries";

export const metadata = { title: "Servicios" };

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat, q } = await searchParams;
  const rows = await getListingCards({
    type: "servicio",
    categorySlug: cat,
    q,
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold">Servicios</h1>
      </div>
      <SearchBox initial={q} withFilter />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip href="/servicios" active={!cat}>
          Todos
        </Chip>
        {SERVICE_CATEGORIES.map((c) => (
          <Chip key={c.slug} href={`/servicios?cat=${c.slug}`} active={cat === c.slug}>
            {c.name}
          </Chip>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState
          title="Nada por aquí todavía"
          text="Sé el primero en ofrecer este servicio en Popayán."
          href="/publicar"
          cta="Publicar"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
