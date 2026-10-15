"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Home,
  Compass,
  MessageCircle,
  Plus,
  User,
  Search,
  Shield,
  LogOut,
  Heart,
  MapPinned,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui";
import { logoutAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import type { Profile } from "@/db/schema";

const tabs = [
  { href: "/inicio", label: "Inicio", icon: Home },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/publicar", label: "Publicar", icon: Plus, special: true },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function AppShell({
  children,
  user,
  unread = 0,
  chatUnread = 0,
}: {
  children: ReactNode;
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
    profile: Profile;
  } | null;
  unread?: number;
  chatUnread?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-mist">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-line bg-white lg:flex">
        <div className="px-6 py-6">
          <Link href="/inicio">
            <Logo />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {[
            { href: "/inicio", label: "Inicio", icon: Home },
            { href: "/explorar", label: "Explorar", icon: Compass },
            { href: "/servicios", label: "Servicios", icon: Compass },
            { href: "/mapa", label: "Cerca de ti", icon: MapPinned },
            { href: "/chat", label: "Chat", icon: MessageCircle, badge: chatUnread },
            { href: "/favoritos", label: "Favoritos", icon: Heart },
            { href: "/notificaciones", label: "Notificaciones", icon: Bell, badge: unread },
            { href: "/publicar", label: "Publicar", icon: Plus },
            { href: "/perfil", label: "Perfil", icon: User },
          ].map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-mute",
                  active && "bg-mint text-forest",
                )}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-leaf px-1 text-[10px] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
          {user?.role === "admin" ? (
            <Link
              href="/admin"
              className={cn(
                "mt-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-mute",
                pathname.startsWith("/admin") && "bg-mint text-forest",
              )}
            >
              <Shield size={18} />
              Administración
            </Link>
          ) : null}
        </nav>
        <div className="border-t border-line p-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar src={user.profile.avatarUrl} alt={user.profile.displayName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user.profile.displayName}
                </p>
                <p className="truncate text-[11px] text-mute">{user.email}</p>
              </div>
              <form action={logoutAction}>
                <button className="text-mute" aria-label="Salir">
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="btn-primary block text-center">
              Iniciar sesión
            </Link>
          )}
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/inicio" className="shrink-0">
            <Logo compact />
          </Link>
          <button
            type="button"
            onClick={() => router.push("/buscar")}
            className="flex flex-1 items-center gap-2 rounded-full bg-mist px-3 py-2 text-left text-sm text-mute"
          >
            <Search size={16} />
            Buscar en Popayán...
          </button>
          <Link href="/notificaciones" className="relative grid h-10 w-10 place-items-center">
            <Bell size={20} />
            {unread > 0 ? (
              <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-leaf" />
            ) : null}
          </Link>
          <Link href={user ? "/perfil" : "/login"}>
            <Avatar
              src={user?.profile.avatarUrl ?? "/images/kevin.jpg"}
              alt=""
              size={36}
            />
          </Link>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-4 lg:px-8 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-end justify-between">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active =
              t.href === "/inicio"
                ? pathname === "/inicio"
                : pathname === t.href || pathname.startsWith(t.href + "/");
            if (t.special) {
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="-mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-forest text-white shadow-float"
                  aria-label="Publicar"
                >
                  <Plus size={26} />
                </Link>
              );
            }
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex w-16 flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-mute",
                  active && "text-forest",
                )}
              >
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
                  {t.href === "/chat" && chatUnread > 0 ? (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-leaf" />
                  ) : null}
                </span>
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
