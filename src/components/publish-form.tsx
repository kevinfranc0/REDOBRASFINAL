"use client";

import { useState } from "react";
import {
  Briefcase,
  Boxes,
  Wrench,
  FolderKanban,
  ShoppingBag,
} from "lucide-react";
import { publishListingAction, publishProjectAction } from "@/app/actions";
import {
  MATERIAL_CATEGORIES,
  RESOURCE_CATEGORIES,
  SERVICE_CATEGORIES,
  LEGAL_RESOURCES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const kinds = [
  { id: "servicio", label: "Servicio", icon: Briefcase },
  { id: "material", label: "Material", icon: Boxes },
  { id: "herramienta", label: "Herramienta", icon: Wrench },
  { id: "proyecto", label: "Proyecto", icon: FolderKanban },
  { id: "recurso", label: "Recurso digital", icon: ShoppingBag },
] as const;

const images = [
  "/images/render-casa.jpg",
  "/images/topografia.jpg",
  "/images/planos-cad.jpg",
  "/images/madera.jpg",
  "/images/mezcladora.jpg",
  "/images/cemento.jpg",
  "/images/listings/impresora3d.jpg",
  "/images/listings/bim.jpg",
  "/images/listings/taladro.jpg",
  "/images/listings/maqueta.jpg",
];

export function PublishForm() {
  const [kind, setKind] = useState<(typeof kinds)[number]["id"] | null>(null);
  const [image, setImage] = useState(images[0]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!kind) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold">Crear publicación</h1>
        <p className="mt-1 text-sm text-mute">¿Qué quieres publicar?</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {kinds.map((k) => {
            const Icon = k.icon;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => setKind(k.id)}
                className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest">
                  <Icon size={22} />
                </span>
                <span className="text-sm font-semibold">{k.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const cats =
    kind === "servicio"
      ? SERVICE_CATEGORIES
      : kind === "recurso"
        ? RESOURCE_CATEGORIES
        : MATERIAL_CATEGORIES;

  if (kind === "proyecto") {
    return (
      <form
        className="space-y-3"
        action={async (fd) => {
          setPending(true);
          const res = await publishProjectAction(fd);
          if (res && "error" in res) {
            setError(res.error);
            setPending(false);
          }
        }}
      >
        <button type="button" className="text-sm text-leaf" onClick={() => setKind(null)}>
          ← Cambiar tipo
        </button>
        <h1 className="font-display text-2xl font-semibold">Nuevo proyecto</h1>
        <select name="kind" className="input">
          <option value="busco_equipo">Busco equipo</option>
          <option value="ofrezco_equipo">Crear equipo / ofrezco cupos</option>
        </select>
        <input name="title" required placeholder="Título *" className="input" />
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Describe lo que necesitas u ofreces *"
          className="input"
        />
        <input name="area" placeholder="Área (Arquitectura, Civil...)" className="input" />
        <input name="skills" placeholder="Habilidades, separadas por coma" className="input" />
        <div className="grid grid-cols-2 gap-2">
          <input name="neededPeople" type="number" min={1} defaultValue={1} className="input" />
          <input name="budget" placeholder="Presupuesto (opcional)" className="input" />
        </div>
        <input name="deadline" placeholder="Fecha / plazo" className="input" />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary w-full py-3.5" disabled={pending}>
          {pending ? "Publicando..." : "Publicar"}
        </button>
      </form>
    );
  }

  return (
    <form
      className="space-y-3"
      action={async (fd) => {
        setPending(true);
        fd.set("type", kind);
        fd.set("image", image);
        const res = await publishListingAction(fd);
        if (res && "error" in res) {
          setError(res.error);
          setPending(false);
        }
      }}
    >
      <button type="button" className="text-sm text-leaf" onClick={() => setKind(null)}>
        ← Cambiar tipo
      </button>
      <h1 className="font-display text-2xl font-semibold">Nueva publicación</h1>
      {kind === "recurso" ? (
        <p className="rounded-2xl bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
          {LEGAL_RESOURCES}
        </p>
      ) : null}
      <p className="text-sm font-medium">Foto</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {images.map((src) => (
          <button
            type="button"
            key={src}
            onClick={() => setImage(src)}
            className={cn(
              "h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2",
              image === src ? "border-leaf" : "border-transparent",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <input name="title" required placeholder="Título *" className="input" />
      <textarea
        name="description"
        required
        rows={4}
        placeholder="Descripción *"
        className="input"
      />
      <div className="grid grid-cols-2 gap-2">
        <input name="price" placeholder="Precio (opcional)" className="input" />
        <select name="category" className="input">
          {cats.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {kind !== "servicio" ? (
        <select name="mode" className="input" defaultValue="vender">
          <option value="vender">Vender</option>
          <option value="alquilar">Alquilar</option>
          <option value="intercambiar">Intercambiar</option>
        </select>
      ) : null}
      <input name="neighborhood" placeholder="Ubicación (barrio)" className="input" />
      <input name="availability" placeholder="Disponibilidad" className="input" />
      <input name="tags" placeholder="Etiquetas (render, 3D...)" className="input" />
      {kind !== "servicio" && kind !== "recurso" ? (
        <input name="condition" placeholder="Estado (nuevo, usado, sobrante)" className="input" />
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button className="btn-primary w-full py-3.5" disabled={pending}>
        {pending ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
