"use client";

import {
  adminAddCategory,
  adminDeleteDemoAction,
  adminDeleteListing,
  adminResolveReport,
  adminSetUserStatus,
  adminToggleFeatured,
} from "@/app/actions";

export function AdminButtons({
  listingId,
  userId,
  reportId,
}: {
  listingId?: string;
  userId?: string;
  reportId?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {listingId ? (
        <>
          <form action={adminToggleFeatured.bind(null, listingId)}>
            <button className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
              Destacar
            </button>
          </form>
          <form action={adminDeleteListing.bind(null, listingId)}>
            <button className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Eliminar
            </button>
          </form>
        </>
      ) : null}
      {userId ? (
        <>
          <form action={adminSetUserStatus.bind(null, userId, "suspended")}>
            <button className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              Suspender
            </button>
          </form>
          <form action={adminSetUserStatus.bind(null, userId, "blocked")}>
            <button className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Bloquear
            </button>
          </form>
          <form action={adminSetUserStatus.bind(null, userId, "active")}>
            <button className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
              Activar
            </button>
          </form>
        </>
      ) : null}
      {reportId ? (
        <form action={adminResolveReport.bind(null, reportId)}>
          <button className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
            Resolver
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function DeleteDemoButton() {
  return (
    <form action={adminDeleteDemoAction}>
      <button className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">
        Eliminar datos DEMO
      </button>
    </form>
  );
}

export function CategoryForm() {
  return (
    <form action={adminAddCategory} className="flex gap-2">
      <input name="name" placeholder="Nueva categoría" className="input" />
      <select name="type" className="input max-w-36">
        <option value="servicio">Servicio</option>
        <option value="material">Material</option>
        <option value="recurso">Recurso</option>
      </select>
      <button className="btn-primary">Añadir</button>
    </form>
  );
}
