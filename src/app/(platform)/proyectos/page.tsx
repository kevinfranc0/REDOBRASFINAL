import Link from "next/link";
import { ProjectCard } from "@/components/listing-card";
import { Chip, EmptyState } from "@/components/ui";
import { getProjects } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Proyectos" };

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const rows = await getProjects();
  const filtered =
    tab === "ofrezco"
      ? rows.filter((r) => r.project.kind === "ofrezco_equipo")
      : tab === "busco"
        ? rows.filter((r) => r.project.kind === "busco_equipo")
        : rows;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Proyectos</h1>
        <Link href="/publicar" className="text-sm font-semibold text-leaf">
          Crear equipo
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <Chip href="/proyectos" active={!tab}>
          Todos
        </Chip>
        <Chip href="/proyectos?tab=busco" active={tab === "busco"}>
          Busco equipo
        </Chip>
        <Chip href="/proyectos?tab=ofrezco" active={tab === "ofrezco"}>
          Ofrezco equipo
        </Chip>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="No hay proyectos"
          text="Publica una convocatoria o crea un equipo."
          href="/publicar"
          cta="Publicar"
        />
      ) : (
        <div className="grid gap-3">
          {filtered.map((row) => (
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
      )}
    </div>
  );
}
