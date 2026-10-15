import { MapNear } from "@/components/map-near";
import { SearchBox } from "@/components/search-box";
import { getMapData } from "@/lib/queries";
import { DEMO_NOTICE } from "@/lib/constants";
import { Notice } from "@/components/ui";

export const metadata = { title: "Cerca de ti" };

export default async function MapaPage() {
  const { pins } = await getMapData();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Cerca de ti</h1>
      <SearchBox placeholder="Popayán, Cauca" />
      <Notice>
        Marcadores DEMO de publicaciones de la plataforma. No representan negocios
        reales no verificados. {DEMO_NOTICE}
      </Notice>
      <MapNear pins={pins} />
    </div>
  );
}
