import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ContactButtons,
  InviteForm,
  LoginGate,
  ReportMenu,
} from "@/components/interactive";
import { Avatar, Place, Stars } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getProjectById } from "@/lib/queries";
import { formatCOP } from "@/lib/utils";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getProjectById(id);
  if (!row) notFound();
  const me = await getCurrentUser();
  const { project, author, members } = row;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <article className="rounded-3xl bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-leaf">
          {project.kind === "ofrezco_equipo" ? "Equipo" : "Convocatoria"}
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold">{project.title}</h1>
        <p className="mt-3 leading-relaxed text-ink">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.skills.map((s) => (
            <span key={s} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
              {s}
            </span>
          ))}
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-mute">Área</dt>
            <dd className="font-semibold">{project.area}</dd>
          </div>
          <div>
            <dt className="text-mute">Personas</dt>
            <dd className="font-semibold">{project.neededPeople}</dd>
          </div>
          <div>
            <dt className="text-mute">Presupuesto</dt>
            <dd className="font-semibold">{formatCOP(project.budget)}</dd>
          </div>
          <div>
            <dt className="text-mute">Plazo</dt>
            <dd className="font-semibold">{project.deadline ?? "A convenir"}</dd>
          </div>
        </dl>
        <div className="mt-3">
          <Place extra={project.neighborhood} />
        </div>
      </article>

      <Link href={`/u/${author.userId}`} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card">
        <Avatar src={author.avatarUrl} alt="" size={48} />
        <div>
          <p className="font-semibold">{author.displayName}</p>
          <p className="text-sm text-mute">{author.roleTitle}</p>
        </div>
        <Stars value={author.ratingAvg} count={author.ratingCount} />
      </Link>

      {me ? (
        <ContactButtons otherUserId={author.userId} projectId={project.id} />
      ) : (
        <LoginGate />
      )}

      {me?.id === author.userId ? (
        <div className="rounded-3xl bg-white p-4 shadow-card">
          <p className="font-semibold">Crear equipo · Invitar</p>
          <p className="text-sm text-mute">Invita por @usuario (ej. daniela, laura, jhonatan).</p>
          <InviteForm projectId={project.id} />
        </div>
      ) : null}

      <div>
        <h2 className="font-display text-lg font-semibold">Interesados</h2>
        <div className="mt-3 space-y-2">
          {members.length === 0 ? (
            <p className="text-sm text-mute">Nadie se ha unido todavía.</p>
          ) : (
            members.map((m) => (
              <Link
                key={m.member.id}
                href={`/u/${m.profile.userId}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card"
              >
                <Avatar src={m.profile.avatarUrl} alt="" size={36} />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.profile.displayName}</p>
                  <p className="text-xs text-mute">{m.member.status}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
      {me ? <ReportMenu targetType="project" targetId={project.id} /> : null}
    </div>
  );
}
