import { ListingCard } from "@/components/listing-card";
import { Chip, EmptyState, Notice } from "@/components/ui";
import { LEGAL_RESOURCES, RESOURCE_CATEGORIES } from "@/lib/constants";
import { getListingCards } from "@/lib/queries";

export const metadata = { title: "Compra mi trabajo" };

export default async function RecursosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const rows = await getListingCards({ type: "recurso", categorySlug: cat });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Compra mi trabajo</h1>
        <p className="text-sm text-mute">
          Recursos originales y licenciados: CAD, Revit, plantillas y más.
        </p>
      </div>
      <Notice>{LEGAL_RESOURCES}</Notice>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip href="/recursos" active={!cat}>
          Todos
        </Chip>
        {RESOURCE_CATEGORIES.map((c) => (
          <Chip key={c.slug} href={`/recursos?cat=${c.slug}`} active={cat === c.slug}>
            {c.name}
          </Chip>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="Sin recursos" text="Publica un recurso original." href="/publicar" cta="Publicar" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
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
