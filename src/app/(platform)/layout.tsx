import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { getConversations, unreadCount } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  let unread = 0;
  let chatUnread = 0;
  if (user) {
    unread = await unreadCount(user.id);
    const convos = await getConversations(user.id);
    chatUnread = convos.reduce((s, c) => s + c.unread, 0);
  }
  return (
    <AppShell user={user} unread={unread} chatUnread={chatUnread}>
      {children}
    </AppShell>
  );
}
