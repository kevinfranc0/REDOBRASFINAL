import Link from "next/link";
import { redirect } from "next/navigation";
import { MarkRead } from "@/components/interactive";
import { getCurrentUser } from "@/lib/auth";
import { getNotifications } from "@/lib/queries";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Notificaciones" };

export default async function NotificacionesPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const items = await getNotifications(me.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Notificaciones</h1>
        <MarkRead />
      </div>
      <div className="divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-card">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-mute">No hay notificaciones.</p>
        ) : (
          items.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className={`block px-4 py-3 ${n.read ? "" : "bg-mint/40"}`}
            >
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="text-sm text-mute">{n.body}</p>
              <p className="text-[11px] text-mute">{timeAgo(n.createdAt)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
