import { redirect } from "next/navigation";
import { AdminButtons, CategoryForm, DeleteDemoButton } from "@/components/admin-actions";
import { formatCOP } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries";
import { DEMO_NOTICE } from "@/lib/constants";

export const metadata = { title: "Administración" };

export default async function AdminPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/inicio");
  const s = await getAdminStats();

  const cards = [
    ["Usuarios", s.users],
    ["Publicaciones", s.listings],
    ["Proyectos", s.projects],
    ["Órdenes", s.orders],
    ["Reportes", s.reports],
    ["Ingresos (comisión)", formatCOP(s.income)],
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Panel REDOBRA</h1>
          <p className="text-sm text-mute">{DEMO_NOTICE}</p>
        </div>
        <DeleteDemoButton />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([k, v]) => (
          <div key={String(k)} className="rounded-3xl bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-mute">{k}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-forest">{v}</p>
          </div>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h2 className="font-semibold">Usuarios</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-mute">
              <tr>
                <th className="py-2">Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {s.userRows.map((r) => (
                <tr key={r.user.id} className="border-t border-line">
                  <td className="py-2 font-medium">{r.profile.displayName}</td>
                  <td>{r.user.email}</td>
                  <td>{r.user.role}</td>
                  <td>{r.user.status}</td>
                  <td>
                    <AdminButtons userId={r.user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h2 className="font-semibold">Publicaciones</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-mute">
              <tr>
                <th className="py-2">Título</th>
                <th>Tipo</th>
                <th>Autor</th>
                <th>Destacada</th>
                <th>DEMO</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {s.listingRows.map((r) => (
                <tr key={r.listing.id} className="border-t border-line">
                  <td className="py-2">{r.listing.title}</td>
                  <td>{r.listing.type}</td>
                  <td>{r.author.displayName}</td>
                  <td>{r.listing.isFeatured ? "Sí" : "No"}</td>
                  <td>{r.listing.isDemo ? "Sí" : "No"}</td>
                  <td>
                    <AdminButtons listingId={r.listing.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h2 className="font-semibold">Transacciones</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {s.orderRows.map((o) => (
            <li key={o.id} className="flex justify-between border-b border-line py-2">
              <span>
                {o.status} · {formatCOP(o.amount)}
              </span>
              <span className="text-mute">comisión {formatCOP(o.commission)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h2 className="font-semibold">Reportes</h2>
        {s.reportRows.length === 0 ? (
          <p className="mt-2 text-sm text-mute">No hay reportes abiertos.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {s.reportRows.map((r) => (
              <li key={r.report.id} className="rounded-2xl bg-mist p-3 text-sm">
                <p className="font-semibold">
                  {r.report.targetType} · {r.report.reason} · {r.report.status}
                </p>
                <p className="text-mute">{r.report.details}</p>
                <p className="text-xs text-mute">por {r.reporter.displayName}</p>
                <AdminButtons reportId={r.report.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-card">
        <h2 className="mb-3 font-semibold">Categorías</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {s.cats.map((c) => (
            <span key={c.id} className="rounded-full bg-mist px-3 py-1 text-xs font-semibold">
              {c.name} · {c.type}
            </span>
          ))}
        </div>
        <CategoryForm />
      </section>
    </div>
  );
}
