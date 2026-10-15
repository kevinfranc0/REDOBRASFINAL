"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  blocks,
  categories,
  conversations,
  emailVerifications,
  favorites,
  listings,
  messages,
  notifications,
  orders,
  passwordResets,
  profiles,
  projectMembers,
  projects,
  reports,
  reviews,
  users,
} from "@/db/schema";
import {
  createSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  newToken,
  requireAdmin,
  requireUser,
  verifyPassword,
} from "@/lib/auth";
import { deleteDemoData, ensureSeeded } from "@/lib/seed";

function fail(message: string) {
  return { ok: false as const, error: message };
}
function ok() {
  return { ok: true as const };
}

export async function loginAction(formData: FormData) {
  await ensureSeeded();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return fail("Escribe tu correo y contraseña.");
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user) return fail("No encontramos esa cuenta.");
  if (user.status === "blocked") return fail("Esta cuenta está bloqueada.");
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return fail("Contraseña incorrecta.");
  await createSession(user.id);
  redirect("/inicio");
}

export async function registerAction(formData: FormData) {
  await ensureSeeded();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  const userType = String(formData.get("userType") ?? "estudiante") as
    | "estudiante"
    | "profesional"
    | "tecnico"
    | "empresa";
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  if (!email || !password || !displayName) {
    return fail("Completa nombre, correo y contraseña.");
  }
  if (password.length < 6) return fail("La contraseña debe tener 6+ caracteres.");
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length) return fail("Ese correo ya está registrado.");

  const titles: Record<string, string> = {
    estudiante: "Estudiante",
    profesional: "Profesional",
    tecnico: "Técnico / trabajador",
    empresa: "Empresa / contratista",
  };
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash: await hashPassword(password),
      emailVerified: false,
    })
    .returning();
  const handle =
    displayName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 16) + Math.floor(Math.random() * 90 + 10);
  await db.insert(profiles).values({
    userId: user.id,
    displayName,
    firstName: displayName.split(" ")[0] ?? displayName,
    handle,
    userType,
    roleTitle: roleTitle || titles[userType] || "Miembro REDOBRA",
    bio: "",
    city: "Popayán",
    region: "Cauca",
  });
  const token = newToken();
  await db.insert(emailVerifications).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
  });
  await createSession(user.id);
  redirect("/onboarding");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function forgotAction(formData: FormData) {
  await ensureSeeded();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!user) {
    return {
      ok: true as const,
      message: "Si el correo existe, te enviaremos un enlace.",
    };
  }
  const token = newToken();
  await db.insert(passwordResets).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
  });
  return {
    ok: true as const,
    message: "Enlace de recuperación generado (DEMO, sin correo real).",
    demoLink: `/recuperar?token=${token}`,
  };
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) return fail("La contraseña debe tener 6+ caracteres.");
  const [row] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.token, token))
    .limit(1);
  if (!row || row.expiresAt < new Date()) return fail("El enlace ya no es válido.");
  await db
    .update(users)
    .set({ passwordHash: await hashPassword(password) })
    .where(eq(users.id, row.userId));
  await db.delete(passwordResets).where(eq(passwordResets.id, row.id));
  return { ok: true as const, message: "Contraseña actualizada. Inicia sesión." };
}

export async function verifyEmailAction(token: string) {
  const [row] = await db
    .select()
    .from(emailVerifications)
    .where(eq(emailVerifications.token, token))
    .limit(1);
  if (!row) return fail("Token inválido.");
  await db
    .update(users)
    .set({ emailVerified: true })
    .where(eq(users.id, row.userId));
  await db.delete(emailVerifications).where(eq(emailVerifications.id, row.id));
  return ok();
}

export async function updateProfileAction(formData: FormData) {
  const me = await requireUser();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const userType = String(formData.get("userType") ?? me.profile.userType) as
    | "estudiante"
    | "profesional"
    | "tecnico"
    | "empresa";
  await db
    .update(profiles)
    .set({
      displayName: displayName || me.profile.displayName,
      firstName: (displayName || me.profile.displayName).split(" ")[0],
      roleTitle: roleTitle || me.profile.roleTitle,
      bio,
      phone: phone || null,
      neighborhood: neighborhood || me.profile.neighborhood,
      userType,
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, me.id));
  revalidatePath("/perfil");
  redirect("/perfil");
}

export async function publishListingAction(formData: FormData) {
  const me = await requireUser();
  const type = String(formData.get("type") ?? "servicio") as
    | "servicio"
    | "material"
    | "herramienta"
    | "recurso";
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").replace(/\D/g, "");
  const categorySlug = String(formData.get("category") ?? "");
  const mode = String(formData.get("mode") ?? "ofrecer") as
    | "ofrecer"
    | "vender"
    | "alquilar"
    | "intercambiar";
  const neighborhood = String(formData.get("neighborhood") ?? "Centro");
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const availability = String(formData.get("availability") ?? "Disponible");
  const image = String(formData.get("image") ?? "").trim();
  const condition = String(formData.get("condition") ?? "");
  if (!title || !description) return fail("Título y descripción son obligatorios.");

  let categoryId: string | null = null;
  if (categorySlug) {
    const [c] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    categoryId = c?.id ?? null;
  }

  const fallback: Record<string, string> = {
    servicio: "/images/render-casa.jpg",
    material: "/images/madera.jpg",
    herramienta: "/images/mezcladora.jpg",
    recurso: "/images/planos-cad.jpg",
  };

  const [created] = await db
    .insert(listings)
    .values({
      authorId: me.id,
      categoryId,
      type,
      mode: type === "servicio" ? "ofrecer" : mode,
      title,
      description,
      price: priceRaw ? Number(priceRaw) : null,
      neighborhood,
      tags,
      availability,
      condition: condition || null,
      imageUrls: [image || fallback[type]],
      lat: me.profile.lat,
      lng: me.profile.lng,
      isDemo: false,
    })
    .returning();

  revalidatePath("/inicio");
  const href =
    type === "servicio"
      ? `/servicios/${created.id}`
      : type === "recurso"
        ? `/recursos/${created.id}`
        : `/materiales/${created.id}`;
  redirect(href);
}

export async function publishProjectAction(formData: FormData) {
  const me = await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const area = String(formData.get("area") ?? "Arquitectura");
  const neededPeople = Number(formData.get("neededPeople") ?? 1) || 1;
  const budgetRaw = String(formData.get("budget") ?? "").replace(/\D/g, "");
  const skills = String(formData.get("skills") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const deadline = String(formData.get("deadline") ?? "");
  const kind = String(formData.get("kind") ?? "busco_equipo");
  if (!title || !description) return fail("Título y descripción son obligatorios.");
  const [created] = await db
    .insert(projects)
    .values({
      authorId: me.id,
      title,
      description,
      area,
      neededPeople,
      budget: budgetRaw ? Number(budgetRaw) : null,
      skills,
      deadline: deadline || null,
      kind,
      lat: me.profile.lat,
      lng: me.profile.lng,
    })
    .returning();
  revalidatePath("/proyectos");
  redirect(`/proyectos/${created.id}`);
}

export async function toggleFavoriteAction(
  targetType: "listing" | "profile" | "project",
  targetId: string,
) {
  const me = await requireUser();
  const existing = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, me.id),
        eq(favorites.targetType, targetType),
        eq(favorites.targetId, targetId),
      ),
    )
    .limit(1);
  if (existing[0]) {
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
  } else {
    await db.insert(favorites).values({
      userId: me.id,
      targetType,
      targetId,
    });
    if (targetType === "listing") {
      const [l] = await db
        .select()
        .from(listings)
        .where(eq(listings.id, targetId))
        .limit(1);
      if (l && l.authorId !== me.id) {
        await db.insert(notifications).values({
          userId: l.authorId,
          type: "favorite",
          title: "Alguien guardó tu publicación",
          body: `${me.profile.displayName} guardó “${l.title}”.`,
          href: "/notificaciones",
        });
      }
    }
  }
  revalidatePath("/favoritos");
  return ok();
}

export async function startConversationAction(opts: {
  otherUserId: string;
  listingId?: string;
  projectId?: string;
  preset?: string;
}) {
  const me = await requireUser();
  if (me.id === opts.otherUserId) return fail("No puedes chatear contigo.");
  const blocked = await db
    .select()
    .from(blocks)
    .where(
      and(eq(blocks.blockerId, opts.otherUserId), eq(blocks.blockedId, me.id)),
    )
    .limit(1);
  if (blocked[0]) return fail("No es posible contactar a esta persona.");

  const existing = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.userAId, me.id < opts.otherUserId ? me.id : opts.otherUserId),
        eq(conversations.userBId, me.id < opts.otherUserId ? opts.otherUserId : me.id),
      ),
    )
    .limit(1);

  let convId = existing[0]?.id;
  if (!convId) {
    const [c] = await db
      .insert(conversations)
      .values({
        userAId: me.id < opts.otherUserId ? me.id : opts.otherUserId,
        userBId: me.id < opts.otherUserId ? opts.otherUserId : me.id,
        listingId: opts.listingId,
        projectId: opts.projectId,
      })
      .returning();
    convId = c.id;
  }
  if (opts.preset) {
    await db.insert(messages).values({
      conversationId: convId,
      senderId: me.id,
      content: opts.preset,
    });
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, convId));
  }
  redirect(`/chat/${convId}`);
}

export async function sendMessageAction(formData: FormData) {
  const me = await requireUser();
  const conversationId = String(formData.get("conversationId") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const fileName = String(formData.get("fileName") ?? "") || null;
  if (!content && !fileName) return fail("Escribe un mensaje.");
  const [c] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (!c) return fail("Conversación no encontrada.");
  if (c.userAId !== me.id && c.userBId !== me.id) return fail("Sin acceso.");
  await db.insert(messages).values({
    conversationId,
    senderId: me.id,
    content: content || "📎 Archivo",
    fileName,
  });
  await db
    .update(conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(conversations.id, conversationId));
  const other = c.userAId === me.id ? c.userBId : c.userAId;
  await db.insert(notifications).values({
    userId: other,
    type: "message",
    title: `${me.profile.displayName} te escribió`,
    body: content || "Te envió un archivo.",
    href: `/chat/${conversationId}`,
  });
  revalidatePath(`/chat/${conversationId}`);
  return ok();
}

export async function requestServiceAction(listingId: string) {
  const me = await requireUser();
  const [l] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);
  if (!l) return fail("Publicación no encontrada.");
  await db.insert(orders).values({
    buyerId: me.id,
    sellerId: l.authorId,
    listingId,
    amount: l.price ?? 0,
    commission: Math.round((l.price ?? 0) * 0.05),
    status: "requested",
  });
  await db.insert(notifications).values({
    userId: l.authorId,
    type: "order",
    title: "Tu servicio recibió una solicitud",
    body: `${me.profile.displayName} solicitó “${l.title}”.`,
    href: "/notificaciones",
  });
  return startConversationAction({
    otherUserId: l.authorId,
    listingId,
    preset: `Hola, quiero solicitar el servicio “${l.title}”.`,
  });
}

export async function interestProjectAction(projectId: string) {
  const me = await requireUser();
  const [p] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  if (!p) return fail("Proyecto no encontrado.");
  const existing = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, me.id),
      ),
    )
    .limit(1);
  if (!existing[0]) {
    await db.insert(projectMembers).values({
      projectId,
      userId: me.id,
      status: "interested",
    });
  }
  await db.insert(notifications).values({
    userId: p.authorId,
    type: "project",
    title: "Alguien respondió a tu publicación",
    body: `${me.profile.displayName} está interesado en “${p.title}”.`,
    href: `/proyectos/${projectId}`,
  });
  return startConversationAction({
    otherUserId: p.authorId,
    projectId,
    preset: `Hola, me interesa el proyecto “${p.title}”.`,
  });
}

export async function inviteToProjectAction(formData: FormData) {
  const me = await requireUser();
  const projectId = String(formData.get("projectId") ?? "");
  const handle = String(formData.get("handle") ?? "")
    .trim()
    .replace(/^@/, "");
  const [p] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  if (!p || p.authorId !== me.id) return fail("No puedes invitar en este proyecto.");
  const [person] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.handle, handle))
    .limit(1);
  if (!person) return fail("No encontramos ese usuario.");
  const existing = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, person.userId),
      ),
    )
    .limit(1);
  if (!existing[0]) {
    await db.insert(projectMembers).values({
      projectId,
      userId: person.userId,
      status: "invited",
    });
  }
  await db.insert(notifications).values({
    userId: person.userId,
    type: "project",
    title: "Te invitaron a un proyecto",
    body: `${me.profile.displayName} te invitó a “${p.title}”.`,
    href: `/proyectos/${projectId}`,
  });
  revalidatePath(`/proyectos/${projectId}`);
  return { ok: true as const, message: `Invitación enviada a @${handle}` };
}

export async function createReviewAction(formData: FormData) {
  const me = await requireUser();
  const revieweeId = String(formData.get("revieweeId") ?? "");
  const listingId = String(formData.get("listingId") ?? "") || null;
  const quality = Number(formData.get("quality") ?? 5);
  const punctuality = Number(formData.get("punctuality") ?? 5);
  const communication = Number(formData.get("communication") ?? 5);
  const value = Number(formData.get("value") ?? 5);
  const comment = String(formData.get("comment") ?? "").trim();
  const overall = (quality + punctuality + communication + value) / 4;
  await db.insert(reviews).values({
    reviewerId: me.id,
    revieweeId,
    listingId,
    quality,
    punctuality,
    communication,
    value,
    overall,
    comment,
  });
  const all = await db
    .select()
    .from(reviews)
    .where(eq(reviews.revieweeId, revieweeId));
  const avg = all.reduce((s, r) => s + r.overall, 0) / all.length;
  await db
    .update(profiles)
    .set({ ratingAvg: avg, ratingCount: all.length })
    .where(eq(profiles.userId, revieweeId));
  await db.insert(notifications).values({
    userId: revieweeId,
    type: "review",
    title: "Tu publicación tiene una nueva valoración",
    body: `${me.profile.displayName} te calificó con ${avg.toFixed(1)}.`,
    href: `/u/${revieweeId}`,
  });
  revalidatePath(`/u/${revieweeId}`);
  return ok();
}

export async function reportAction(formData: FormData) {
  const me = await requireUser();
  await db.insert(reports).values({
    reporterId: me.id,
    targetType: String(formData.get("targetType") ?? "listing") as
      | "user"
      | "listing"
      | "project"
      | "message",
    targetId: String(formData.get("targetId") ?? ""),
    reason: String(formData.get("reason") ?? "Otro"),
    details: String(formData.get("details") ?? ""),
  });
  return { ok: true as const, message: "Reporte enviado. Lo revisaremos." };
}

export async function blockUserAction(userId: string) {
  const me = await requireUser();
  const existing = await db
    .select()
    .from(blocks)
    .where(and(eq(blocks.blockerId, me.id), eq(blocks.blockedId, userId)))
    .limit(1);
  if (!existing[0]) {
    await db.insert(blocks).values({ blockerId: me.id, blockedId: userId });
  }
  revalidatePath("/inicio");
  return ok();
}

export async function markNotificationsReadAction() {
  const me = await requireUser();
  await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, me.id));
  revalidatePath("/notificaciones");
  return ok();
}

export async function completeOrderAction(orderId: string) {
  const me = await requireUser();
  const [o] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!o || o.sellerId !== me.id) return fail("No autorizado.");
  await db
    .update(orders)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(orders.id, orderId));
  await db
    .update(profiles)
    .set({ jobsCompleted: sql`${profiles.jobsCompleted} + 1` })
    .where(eq(profiles.userId, me.id));
  revalidatePath("/admin");
  return ok();
}

export async function adminDeleteListing(id: string) {
  await requireAdmin();
  await db.delete(listings).where(eq(listings.id, id));
  revalidatePath("/admin");
}

export async function adminToggleFeatured(id: string) {
  await requireAdmin();
  const [l] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
  if (!l) return;
  await db
    .update(listings)
    .set({ isFeatured: !l.isFeatured })
    .where(eq(listings.id, id));
  revalidatePath("/admin");
}

export async function adminSetUserStatus(
  userId: string,
  status: "active" | "suspended" | "blocked",
) {
  await requireAdmin();
  await db.update(users).set({ status }).where(eq(users.id, userId));
  revalidatePath("/admin");
}

export async function adminResolveReport(id: string) {
  await requireAdmin();
  await db
    .update(reports)
    .set({ status: "resolved" })
    .where(eq(reports.id, id));
  revalidatePath("/admin");
}

export async function adminDeleteDemoAction() {
  await requireAdmin();
  await deleteDemoData();
  await destroySession();
  redirect("/");
}

export async function adminAddCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "servicio");
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
  if (!name) return;
  await db.insert(categories).values({ slug, name, type });
  revalidatePath("/admin");
}

export async function getCurrentUserSafe() {
  return getCurrentUser();
}
