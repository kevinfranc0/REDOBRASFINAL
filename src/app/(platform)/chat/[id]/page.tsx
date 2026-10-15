import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ChatClient } from "@/components/chat-client";
import { Avatar } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getConversation } from "@/lib/queries";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");
  const { id } = await params;
  const data = await getConversation(id, me.id);
  if (!data || !data.other) notFound();

  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(messages.conversationId, id),
        sql`${messages.senderId} <> ${me.id}`,
        isNull(messages.readAt),
      ),
    );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/chat" className="grid h-10 w-10 place-items-center rounded-full bg-white">
          <ArrowLeft size={18} />
        </Link>
        <Link href={`/u/${data.other.userId}`} className="flex items-center gap-2">
          <Avatar src={data.other.avatarUrl} alt="" size={40} />
          <div>
            <p className="font-semibold leading-tight">{data.other.displayName}</p>
            <p className="text-[11px] text-mute">
              {data.other.isOnline ? "En línea" : "Desconectado"} · {data.other.roleTitle}
            </p>
          </div>
        </Link>
      </div>
      <ChatClient
        conversationId={id}
        meId={me.id}
        other={data.other}
        initial={data.messages}
      />
    </div>
  );
}
