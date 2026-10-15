import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  conversations,
  favorites,
  listings,
  locations,
  messages,
  notifications,
  orders,
  profiles,
  projectMembers,
  projects,
  reports,
  reviews,
  users,
} from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { detectSearchIntent, haversineKm } from "@/lib/utils";

export async function getProfileByUserId(userId: string) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function getListingCards(opts?: {
  type?: "servicio" | "material" | "herramienta" | "recurso";
  featured?: boolean;
  categorySlug?: string;
  mode?: string;
  q?: string;
  limit?: number;
}) {
  await ensureSeeded();
  const conditions = [eq(listings.status, "active")];
  if (opts?.type) conditions.push(eq(listings.type, opts.type));
  if (opts?.featured) conditions.push(eq(listings.isFeatured, true));
  if (opts?.mode) {
    conditions.push(
      eq(
        listings.mode,
        opts.mode as "ofrecer" | "vender" | "alquilar" | "intercambiar",
      ),
    );
  }
  if (opts?.q) {
    const like = `%${opts.q}%`;
    conditions.push(
      or(
        ilike(listings.title, like),
        ilike(listings.description, like),
        sql`${listings.tags}::text ilike ${like}`,
      )!,
    );
  }

  const rows = await db
    .select({
      listing: listings,
      author: profiles,
      category: categories,
    })
    .from(listings)
    .innerJoin(profiles, eq(listings.authorId, profiles.userId))
    .leftJoin(categories, eq(listings.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(listings.isFeatured), desc(listings.createdAt))
    .limit(opts?.limit ?? 40);

  if (opts?.categorySlug) {
    return rows.filter((r) => r.category?.slug === opts.categorySlug);
  }
  return rows;
}

export async function getListingById(id: string) {
  await ensureSeeded();
  const rows = await db
    .select({
      listing: listings,
      author: profiles,
      category: categories,
      authorUser: users,
    })
    .from(listings)
    .innerJoin(profiles, eq(listings.authorId, profiles.userId))
    .innerJoin(users, eq(users.id, listings.authorId))
    .leftJoin(categories, eq(listings.categoryId, categories.id))
    .where(eq(listings.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProjects(opts?: { q?: string; area?: string }) {
  await ensureSeeded();
  const conditions = [eq(projects.status, "open")];
  if (opts?.q) {
    const like = `%${opts.q}%`;
    conditions.push(
      or(ilike(projects.title, like), ilike(projects.description, like))!,
    );
  }
  if (opts?.area && opts.area !== "Todos") {
    conditions.push(eq(projects.area, opts.area));
  }
  return db
    .select({ project: projects, author: profiles })
    .from(projects)
    .innerJoin(profiles, eq(projects.authorId, profiles.userId))
    .where(and(...conditions))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectById(id: string) {
  await ensureSeeded();
  const rows = await db
    .select({ project: projects, author: profiles })
    .from(projects)
    .innerJoin(profiles, eq(projects.authorId, profiles.userId))
    .where(eq(projects.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  const members = await db
    .select({ member: projectMembers, profile: profiles })
    .from(projectMembers)
    .innerJoin(profiles, eq(projectMembers.userId, profiles.userId))
    .where(eq(projectMembers.projectId, id));
  return { ...row, members };
}

export async function getTalent(limit = 8) {
  await ensureSeeded();
  return db
    .select()
    .from(profiles)
    .where(eq(profiles.isDemo, true))
    .orderBy(desc(profiles.ratingAvg), desc(profiles.jobsCompleted))
    .limit(limit);
}

export async function getReviewsForUser(userId: string) {
  await ensureSeeded();
  return db
    .select({ review: reviews, reviewer: profiles })
    .from(reviews)
    .innerJoin(profiles, eq(reviews.reviewerId, profiles.userId))
    .where(eq(reviews.revieweeId, userId))
    .orderBy(desc(reviews.createdAt));
}

export async function getNotifications(userId: string) {
  await ensureSeeded();
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(30);
}

export async function unreadCount(userId: string) {
  await ensureSeeded();
  const rows = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.read, false)),
    );
  return rows.length;
}

export async function getConversations(userId: string) {
  await ensureSeeded();
  const convos = await db
    .select()
    .from(conversations)
    .where(
      or(eq(conversations.userAId, userId), eq(conversations.userBId, userId)),
    )
    .orderBy(desc(conversations.lastMessageAt));

  const result = [];
  for (const c of convos) {
    const otherId = c.userAId === userId ? c.userBId : c.userAId;
    const [other] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, otherId))
      .limit(1);
    const last = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, c.id))
      .orderBy(desc(messages.createdAt))
      .limit(1);
    const unread = await db
      .select({ id: messages.id })
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, c.id),
          sql`${messages.senderId} <> ${userId}`,
          sql`${messages.readAt} is null`,
        ),
      );
    result.push({
      conversation: c,
      other,
      last: last[0] ?? null,
      unread: unread.length,
    });
  }
  return result;
}

export async function getConversation(id: string, userId: string) {
  await ensureSeeded();
  const [c] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  if (!c) return null;
  if (c.userAId !== userId && c.userBId !== userId) return null;
  const otherId = c.userAId === userId ? c.userBId : c.userAId;
  const [other] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, otherId))
    .limit(1);
  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);
  return { conversation: c, other, messages: msgs };
}

export async function smartSearch(q: string) {
  await ensureSeeded();
  const intent = detectSearchIntent(q);
  const like = `%${q}%`;
  const listingRows = await db
    .select({
      listing: listings,
      author: profiles,
      category: categories,
    })
    .from(listings)
    .innerJoin(profiles, eq(listings.authorId, profiles.userId))
    .leftJoin(categories, eq(listings.categoryId, categories.id))
    .where(
      and(
        eq(listings.status, "active"),
        or(
          ilike(listings.title, like),
          ilike(listings.description, like),
          sql`array_to_string(${listings.tags}, ',') ilike ${like}`,
          intent.categories.length
            ? ilike(categories.slug, `%${intent.categories[0]}%`)
            : sql`true`,
        ),
      ),
    )
    .limit(30);

  const people = await db
    .select()
    .from(profiles)
    .where(
      or(
        ilike(profiles.displayName, like),
        ilike(profiles.roleTitle, like),
        ilike(profiles.bio, like),
      ),
    )
    .limit(10);

  const projectRows = await db
    .select({ project: projects, author: profiles })
    .from(projects)
    .innerJoin(profiles, eq(projects.authorId, profiles.userId))
    .where(
      or(ilike(projects.title, like), ilike(projects.description, like)),
    )
    .limit(10);

  return { intent, listings: listingRows, people, projects: projectRows };
}

export async function getFavorites(userId: string) {
  await ensureSeeded();
  const favs = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
  const listingIds = favs
    .filter((f) => f.targetType === "listing")
    .map((f) => f.targetId);
  const profileIds = favs
    .filter((f) => f.targetType === "profile")
    .map((f) => f.targetId);
  const projectIds = favs
    .filter((f) => f.targetType === "project")
    .map((f) => f.targetId);

  const listingRows =
    listingIds.length === 0
      ? []
      : await db
          .select({ listing: listings, author: profiles, category: categories })
          .from(listings)
          .innerJoin(profiles, eq(listings.authorId, profiles.userId))
          .leftJoin(categories, eq(listings.categoryId, categories.id))
          .where(inArray(listings.id, listingIds));

  const people =
    profileIds.length === 0
      ? []
      : await db.select().from(profiles).where(inArray(profiles.userId, profileIds));

  const projectRows =
    projectIds.length === 0
      ? []
      : await db
          .select({ project: projects, author: profiles })
          .from(projects)
          .innerJoin(profiles, eq(projects.authorId, profiles.userId))
          .where(inArray(projects.id, projectIds));

  return { favs, listings: listingRows, people, projects: projectRows };
}

export async function isFavorited(
  userId: string,
  targetType: "listing" | "profile" | "project",
  targetId: string,
) {
  const rows = await db
    .select()
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.targetType, targetType),
        eq(favorites.targetId, targetId),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

export async function getMapData(origin = { lat: 2.4418, lng: -76.6063 }) {
  await ensureSeeded();
  const locs = await db.select().from(locations);
  const active = await db
    .select({ listing: listings, author: profiles, category: categories })
    .from(listings)
    .innerJoin(profiles, eq(listings.authorId, profiles.userId))
    .leftJoin(categories, eq(listings.categoryId, categories.id))
    .where(eq(listings.status, "active"));

  const pins = active.map((row) => ({
    id: row.listing.id,
    title: row.listing.title,
    type: row.listing.type,
    lat: row.listing.lat,
    lng: row.listing.lng,
    image: row.listing.imageUrls[0] ?? "/images/render-casa.jpg",
    price: row.listing.price,
    rating: row.author.ratingAvg,
    ratingCount: row.author.ratingCount,
    neighborhood: row.listing.neighborhood,
    href:
      row.listing.type === "servicio"
        ? `/servicios/${row.listing.id}`
        : row.listing.type === "recurso"
          ? `/recursos/${row.listing.id}`
          : `/materiales/${row.listing.id}`,
    km: haversineKm(origin.lat, origin.lng, row.listing.lat, row.listing.lng),
  }));

  return { locations: locs, pins };
}

export async function getAdminStats() {
  await ensureSeeded();
  const [u] = await db.select({ n: sql<number>`count(*)::int` }).from(users);
  const [l] = await db.select({ n: sql<number>`count(*)::int` }).from(listings);
  const [p] = await db.select({ n: sql<number>`count(*)::int` }).from(projects);
  const [o] = await db.select({ n: sql<number>`count(*)::int` }).from(orders);
  const [r] = await db.select({ n: sql<number>`count(*)::int` }).from(reports);
  const [inc] = await db
    .select({ n: sql<number>`coalesce(sum(commission),0)::int` })
    .from(orders);
  const userRows = await db
    .select({ user: users, profile: profiles })
    .from(users)
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .orderBy(desc(users.createdAt));
  const listingRows = await db
    .select({ listing: listings, author: profiles })
    .from(listings)
    .innerJoin(profiles, eq(listings.authorId, profiles.userId))
    .orderBy(desc(listings.createdAt));
  const reportRows = await db
    .select({ report: reports, reporter: profiles })
    .from(reports)
    .innerJoin(profiles, eq(reports.reporterId, profiles.userId))
    .orderBy(desc(reports.createdAt));
  const orderRows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
  const cats = await db.select().from(categories);
  return {
    users: u?.n ?? 0,
    listings: l?.n ?? 0,
    projects: p?.n ?? 0,
    orders: o?.n ?? 0,
    reports: r?.n ?? 0,
    income: inc?.n ?? 0,
    userRows,
    listingRows,
    reportRows,
    orderRows,
    cats,
  };
}

export async function getUserListings(userId: string) {
  await ensureSeeded();
  return db
    .select({ listing: listings, category: categories })
    .from(listings)
    .leftJoin(categories, eq(listings.categoryId, categories.id))
    .where(eq(listings.authorId, userId))
    .orderBy(desc(listings.createdAt));
}

export async function getUserProjects(userId: string) {
  await ensureSeeded();
  return db
    .select()
    .from(projects)
    .where(eq(projects.authorId, userId))
    .orderBy(desc(projects.createdAt));
}
