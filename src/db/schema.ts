import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "blocked",
]);
export const userTypeEnum = pgEnum("user_type", [
  "estudiante",
  "profesional",
  "tecnico",
  "empresa",
]);
export const verificationEnum = pgEnum("verification_type", [
  "usuario",
  "profesional",
  "empresa",
]);
export const listingTypeEnum = pgEnum("listing_type", [
  "servicio",
  "material",
  "herramienta",
  "recurso",
]);
export const listingModeEnum = pgEnum("listing_mode", [
  "ofrecer",
  "vender",
  "alquilar",
  "intercambiar",
]);
export const listingStatusEnum = pgEnum("listing_status", [
  "active",
  "paused",
  "sold",
  "removed",
]);
export const projectStatusEnum = pgEnum("project_status", [
  "open",
  "closed",
  "completed",
]);
export const memberStatusEnum = pgEnum("member_status", [
  "interested",
  "invited",
  "accepted",
  "declined",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "requested",
  "accepted",
  "completed",
  "cancelled",
]);
export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "reviewed",
  "resolved",
]);
export const reportTargetEnum = pgEnum("report_target", [
  "user",
  "listing",
  "project",
  "message",
]);
export const favoriteTargetEnum = pgEnum("favorite_target", [
  "listing",
  "profile",
  "project",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    status: userStatusEnum("status").notNull().default("active"),
    emailVerified: boolean("email_verified").notNull().default(false),
    isDemo: boolean("is_demo").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_email_idx").on(t.email),
    index("users_status_idx").on(t.status),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("sessions_token_idx").on(t.token),
    index("sessions_user_idx").on(t.userId),
  ],
);

export const passwordResets = pgTable("password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const emailVerifications = pgTable("email_verifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    firstName: text("first_name").notNull(),
    handle: text("handle").notNull(),
    userType: userTypeEnum("user_type").notNull().default("estudiante"),
    roleTitle: text("role_title").notNull(),
    bio: text("bio").notNull().default(""),
    city: text("city").notNull().default("Popayán"),
    region: text("region").notNull().default("Cauca"),
    neighborhood: text("neighborhood").notNull().default("Centro"),
    lat: real("lat").notNull().default(2.4418),
    lng: real("lng").notNull().default(-76.6063),
    avatarUrl: text("avatar_url").notNull().default("/images/kevin.jpg"),
    coverUrl: text("cover_url").notNull().default("/images/hero-popayan.jpg"),
    phone: text("phone"),
    ratingAvg: real("rating_avg").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    jobsCompleted: integer("jobs_completed").notNull().default(0),
    isVerified: boolean("is_verified").notNull().default(false),
    verificationType: verificationEnum("verification_type"),
    portfolioUrls: text("portfolio_urls")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    skills: text("skills")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    isOnline: boolean("is_online").notNull().default(false),
    isDemo: boolean("is_demo").notNull().default(false),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("profiles_user_idx").on(t.userId),
    uniqueIndex("profiles_handle_idx").on(t.handle),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    icon: text("icon").notNull().default("layers"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

export const listings = pgTable(
  "listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    type: listingTypeEnum("type").notNull(),
    mode: listingModeEnum("mode").notNull().default("ofrecer"),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price"),
    priceLabel: text("price_label"),
    condition: text("condition"),
    city: text("city").notNull().default("Popayán"),
    neighborhood: text("neighborhood").notNull().default("Centro"),
    lat: real("lat").notNull().default(2.4418),
    lng: real("lng").notNull().default(-76.6063),
    imageUrls: text("image_urls")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    availability: text("availability").notNull().default("Disponible"),
    status: listingStatusEnum("status").notNull().default("active"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isDemo: boolean("is_demo").notNull().default(false),
    views: integer("views").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("listings_type_idx").on(t.type),
    index("listings_author_idx").on(t.authorId),
    index("listings_status_idx").on(t.status),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    area: text("area").notNull(),
    skills: text("skills")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    budget: integer("budget"),
    neededPeople: integer("needed_people").notNull().default(1),
    deadline: text("deadline"),
    city: text("city").notNull().default("Popayán"),
    neighborhood: text("neighborhood").notNull().default("Centro"),
    lat: real("lat").notNull().default(2.4418),
    lng: real("lng").notNull().default(-76.6063),
    imageUrls: text("image_urls")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    status: projectStatusEnum("status").notNull().default("open"),
    kind: text("kind").notNull().default("busco_equipo"),
    isDemo: boolean("is_demo").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("projects_author_idx").on(t.authorId)],
);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: memberStatusEnum("status").notNull().default("interested"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("project_members_unique").on(t.projectId, t.userId),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userAId: uuid("user_a_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userBId: uuid("user_b_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id").references(() => listings.id, {
      onDelete: "set null",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("conversations_users_idx").on(t.userAId, t.userBId)],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull().default(""),
    imageUrl: text("image_url"),
    fileName: text("file_name"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("messages_conv_idx").on(t.conversationId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    revieweeId: uuid("reviewee_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id").references(() => listings.id, {
      onDelete: "set null",
    }),
    orderId: uuid("order_id"),
    quality: integer("quality").notNull(),
    punctuality: integer("punctuality").notNull(),
    communication: integer("communication").notNull(),
    value: integer("value").notNull(),
    overall: real("overall").notNull(),
    comment: text("comment").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("reviews_reviewee_idx").on(t.revieweeId)],
);

export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: favoriteTargetEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("favorites_unique").on(t.userId, t.targetType, t.targetId),
  ],
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    href: text("href").notNull().default("/inicio"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId)],
);

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  reporterId: uuid("reporter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  targetType: reportTargetEnum("target_type").notNull(),
  targetId: uuid("target_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details").notNull().default(""),
  status: reportStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: uuid("buyer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  amount: integer("amount").notNull().default(0),
  commission: integer("commission").notNull().default(0),
  status: orderStatusEnum("status").notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const blocks = pgTable(
  "blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    blockerId: uuid("blocker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    blockedId: uuid("blocked_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("blocks_unique").on(t.blockerId, t.blockedId)],
);

export const locations = pgTable("locations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull(),
  city: text("city").notNull().default("Popayán"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  listingId: uuid("listing_id").references(() => listings.id, {
    onDelete: "set null",
  }),
  isDemo: boolean("is_demo").notNull().default(true),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Report = typeof reports.$inferSelect;
