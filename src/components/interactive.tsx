"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  blockUserAction,
  createReviewAction,
  inviteToProjectAction,
  interestProjectAction,
  markNotificationsReadAction,
  reportAction,
  requestServiceAction,
  startConversationAction,
} from "@/app/actions";

export function ContactButtons({
  otherUserId,
  listingId,
  projectId,
}: {
  otherUserId: string;
  listingId?: string;
  projectId?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      <button
        className="btn-ghost flex-1"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await startConversationAction({
              otherUserId,
              listingId,
              projectId,
              preset: "Hola, ¿sigue disponible?",
            });
          })
        }
      >
        Contactar
      </button>
      {listingId ? (
        <button
          className="btn-primary flex-1"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await requestServiceAction(listingId);
            })
          }
        >
          Solicitar servicio
        </button>
      ) : null}
      {projectId ? (
        <button
          className="btn-primary flex-1"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await interestProjectAction(projectId);
            })
          }
        >
          Me interesa
        </button>
      ) : null}
    </div>
  );
}

export function ReviewForm({
  revieweeId,
  listingId,
}: {
  revieweeId: string;
  listingId?: string;
}) {
  const [done, setDone] = useState(false);
  return done ? (
    <p className="rounded-2xl bg-mint p-3 text-sm text-forest">
      Gracias. Tu valoración ya suma al perfil.
    </p>
  ) : (
    <form
      className="space-y-2 rounded-3xl bg-white p-4 shadow-card"
      action={async (fd) => {
        await createReviewAction(fd);
        setDone(true);
      }}
    >
      <p className="font-semibold">Calificar después del servicio</p>
      <input type="hidden" name="revieweeId" value={revieweeId} />
      {listingId ? <input type="hidden" name="listingId" value={listingId} /> : null}
      {[
        ["quality", "Calidad"],
        ["punctuality", "Cumplimiento"],
        ["communication", "Comunicación"],
        ["value", "Relación calidad/precio"],
      ].map(([name, label]) => (
        <label key={name} className="flex items-center justify-between text-sm">
          {label}
          <select name={name} defaultValue="5" className="rounded-lg border border-line px-2 py-1">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </label>
      ))}
      <textarea name="comment" placeholder="Comentario" className="input" rows={3} />
      <button className="btn-primary w-full">Enviar valoración</button>
    </form>
  );
}

export function ReportMenu({
  targetType,
  targetId,
  blockId,
}: {
  targetType: "user" | "listing" | "project";
  targetId: string;
  blockId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div>
      <button type="button" className="text-xs font-semibold text-mute" onClick={() => setOpen((v) => !v)}>
        Reportar
      </button>
      {open ? (
        <form
          className="mt-2 space-y-2 rounded-2xl bg-white p-3 shadow-card"
          action={async (fd) => {
            const res = await reportAction(fd);
            setMsg(res.message);
            setOpen(false);
          }}
        >
          <input type="hidden" name="targetType" value={targetType} />
          <input type="hidden" name="targetId" value={targetId} />
          <select name="reason" className="input">
            <option>Contenido engañoso</option>
            <option>Trabajo académico prohibido</option>
            <option>Spam</option>
            <option>Acoso</option>
            <option>Otro</option>
          </select>
          <textarea name="details" placeholder="Detalles" className="input" rows={2} />
          <button className="btn-primary w-full text-sm">Enviar reporte</button>
          {blockId ? (
            <button
              type="button"
              className="btn-ghost w-full text-sm"
              onClick={() => blockUserAction(blockId)}
            >
              Bloquear usuario
            </button>
          ) : null}
        </form>
      ) : null}
      {msg ? <p className="mt-2 text-xs text-forest">{msg}</p> : null}
    </div>
  );
}

export function InviteForm({ projectId }: { projectId: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      className="mt-3 flex gap-2"
      action={async (fd) => {
        const res = await inviteToProjectAction(fd);
        if ("error" in res) setErr(res.error);
        else {
          setErr(null);
          setMsg(res.message ?? "Listo");
        }
      }}
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input name="handle" placeholder="@usuario" className="input" />
      <button className="btn-primary shrink-0">Invitar</button>
      {err ? <p className="text-xs text-red-600">{err}</p> : null}
      {msg ? <p className="text-xs text-forest">{msg}</p> : null}
    </form>
  );
}

export function MarkRead() {
  const router = useRouter();
  return (
    <button
      className="text-sm font-semibold text-leaf"
      onClick={async () => {
        await markNotificationsReadAction();
        router.refresh();
      }}
    >
      Marcar leídas
    </button>
  );
}

export function LoginGate({ href = "/login" }: { href?: string }) {
  const router = useRouter();
  return (
    <button className="btn-primary w-full" onClick={() => router.push(href)}>
      Inicia sesión para continuar
    </button>
  );
}
