import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { profiles, sessions, users } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";

export const SESSION_COOKIE = "redobra_session";

export type SessionUser = {
  id: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "blocked";
  emailVerified: boolean;
  profile: typeof profiles.$inferSelect;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function newToken() {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await db.insert(sessions).values({ userId, token, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  jar.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  await ensureSeeded();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const now = new Date();
  const rows = await db
    .select({ user: users, profile: profiles, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  if (row.user.status === "blocked") return null;
  return {
    id: row.user.id,
    email: row.user.email,
    role: row.user.role,
    status: row.user.status,
    emailVerified: row.user.emailVerified,
    profile: row.profile,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  if (user.status === "suspended") {
    throw new Error("SUSPENDED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
