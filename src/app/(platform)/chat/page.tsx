import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getConversations } from "@/lib/queries";
import { Avatar, EmptyState } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import { Chip } from "@/components/ui";

export const metadata = { title: "Chat" };

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const me = await getCurrentUser();
  const { tab } = await searchParams;
  if (!me) {
    return (
      <EmptyState
        title="Inicia sesión para chatear"
        text="El chat interno te permite coordinar antes de contratar."
        href="/login"
        cta="Iniciar sesión"
      />
    );
  }
  const convos = await getConversations(me.id);
  const filtered = tab === "unread" ? convos.filter((c) => c.unread > 0) : convos;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Chat</h1>
      <div className="flex gap-2">
        <Chip href="/chat" active={!tab}>
          Todos
        </Chip>
        <Chip href="/chat?tab=unread" active={tab === "unread"}>
          No leídos
        </Chip>
      </div>
      <div className="divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-card">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-mute">No hay conversaciones.</p>
        ) : (
          filtered.map((c) => (
            <Link
              key={c.conversation.id}
              href={`/chat/${c.conversation.id}`}
              className="flex items-center gap-3 px-4 py-3"
            >
              <Avatar
                src={c.other?.avatarUrl ?? "/images/kevin.jpg"}
                alt=""
                size={48}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold">
                    {c.other?.displayName ?? "Usuario"}
                  </p>
                  <span className="text-[11px] text-mute">
                    {c.last ? timeAgo(c.last.createdAt) : ""}
                  </span>
                </div>
                <p className="truncate text-sm text-mute">
                  {c.last?.content ?? "Sin mensajes"}
                </p>
              </div>
              {c.unread > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-leaf text-[10px] text-white">
                  {c.unread}
                </span>
              ) : null}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
