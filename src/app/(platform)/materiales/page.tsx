import { ListingCard } from "@/components/listing-card";
import { Chip, EmptyState } from "@/components/ui";
import { SearchBox } from "@/components/search-box";
import { getListingCards } from "@/lib/queries";

export const metadata = { title: "Materiales y herramientas" };

export default async function MaterialesPage({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string }>;
}) {
  const { modo } = await searchParams;
  const all = await getListingCards();
  const rows = all.filter((r) => {
    const t = r.listing.type;
    if (t !== "material" && t !== "herramienta") return false;
    if (!modo || modo === "todos") return true;
    return r.listing.mode === modo;
  });

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold">Materiales y herramientas</h1>
      <SearchBox />
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          ["todos", "Todos"],
          ["vender", "Comprar"],
          ["alquilar", "Alquilar"],
          ["intercambiar", "Intercambiar"],
        ].map(([id, label]) => (
          <Chip key={id} href={`/materiales?modo=${id}`} active={(modo ?? "todos") === id}>
            {label}
          </Chip>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="Sin publicaciones" text="Publica un material o herramienta." href="/publicar" cta="Publicar" />
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => (
            <ListingCard
              key={row.listing.id}
              listing={row.listing}
              author={row.author}
              category={row.category}
              compact
            />
          ))}
        </div>
      )}
    </div>
  );
}
