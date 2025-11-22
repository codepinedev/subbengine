import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import {
  bigint,
  boolean,
  integer,
  jsonb,
  serial,
  pgTable as table,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { ApiKeyStatus, enumToPgEnum, LeaderboardStatus } from "@/lib/utils";

export const verification = table("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const apiKeyStatusEnum = t.pgEnum(
  "apiKeyStatus",
  enumToPgEnum(ApiKeyStatus),
);
export const leaderboardStatusEnum = t.pgEnum(
  "leaderboardStatus",
  enumToPgEnum(LeaderboardStatus),
);

export const user = table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = table("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = table("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const games = table("games", {
  id: uuid("id").defaultRandom().primaryKey(),
  icon: text("icon").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const apiKeys = table("apiKeys", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: apiKeyStatusEnum().default(ApiKeyStatus.ENABLED),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expireAt: timestamp("expire_at").default(sql`NOW() + INTERVAL '10 days'`),
  lastUsedAt: timestamp("last_used_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const apiKeyLogs = table("api_key_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  apiKeyId: text("api_key_id")
    .notNull()
    .references(() => apiKeys.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").default(""),
  method: text("method").default(""),
  statusCode: integer().default(200),
  responseTime: integer().default(0),
  ipAddress: text("ip_address").default(""),
  userAgent: text("user_agent").default(""),
  errorMessage: text("error_message").default(""),
  createdAt: t.timestamp("recorded_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const leaderboards = table("leaderboards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar({ length: 256 }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  status: leaderboardStatusEnum().default(LeaderboardStatus.ACTIVE),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const players = table("players", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: text("username").notNull(),
  score: bigint("score", { mode: "number" }).notNull(),
  rank: integer("rank").notNull(),
  avatarUrl: text("avatar_url"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  leaderboardId: uuid("leaderboard_id")
    .notNull()
    .references(() => leaderboards.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export const leaderboardSnapshots = table("leaderboard_snapshots", {
  id: serial("id").primaryKey(),
  leaderboardId: uuid("leaderboard_id")
    .notNull()
    .references(() => leaderboards.id),
  playerId: uuid("player_id").references(() => players.id),
  score: bigint("score", { mode: "number" }).notNull(),
  rank: integer("rank").notNull(),
  metadata: jsonb("metadata"),
  season: text("season").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// ===== RELATIONS ====
export const gamesRelations = relations(games, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [games.userId],
    references: [user.id],
  }),
  apiKeys: many(apiKeys),
  leaderboards: many(leaderboards),
}));

export const leaderboardsRelations = relations(
  leaderboards,
  ({ one, many }) => ({
    createdBy: one(user, {
      fields: [leaderboards.userId],
      references: [user.id],
    }),
    game: one(games, {
      fields: [leaderboards.gameId],
      references: [games.id],
    }),
    players: many(players),
    snapshots: many(leaderboardSnapshots),
  }),
);

export const playersRelations = relations(players, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [players.userId],
    references: [user.id],
  }),
  leaderboard: one(leaderboards, {
    fields: [players.leaderboardId],
    references: [leaderboards.id],
  }),
  snapshots: many(leaderboardSnapshots),
}));

export const leaderboardSnapshotsRelations = relations(
  leaderboardSnapshots,
  ({ one }) => ({
    leaderboard: one(leaderboards, {
      fields: [leaderboardSnapshots.leaderboardId],
      references: [leaderboards.id],
    }),
    player: one(players, {
      fields: [leaderboardSnapshots.playerId],
      references: [players.id],
    }),
  }),
);
export const usersRelations = relations(user, ({ many }) => ({
  leaderboards: many(leaderboards),
  sessions: many(session),
  accounts: many(account),
  games: many(games),
}));
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  game: one(games, {
    fields: [apiKeys.gameId],
    references: [games.id],
  }),
  user: one(user, {
    fields: [apiKeys.userId],
    references: [user.id],
  }),
  apiKeyLogs: many(apiKeyLogs),
}));

// Leaderboards
export const selectLeaderboardsSchema = createSelectSchema(leaderboards);
export const insertLeaderboardsSchema = createInsertSchema(leaderboards).omit({
  userId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

// Players
export const selectPlayersSchema = createSelectSchema(players);
export const insertPlayersSchema = createInsertSchema(players).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});

export const updatePlayersSchema = createUpdateSchema(players).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});
export const updatePlayersRankingSchema = createInsertSchema(players)
  .omit({ createdAt: true, updatedAt: true })
  .pick({ score: true });

// Games
export const selectGamesSchema = createSelectSchema(games);
export const insertGamesSchema = createInsertSchema(games).omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
  id: true,
});
export const updateGamesSchema = createUpdateSchema(games).omit({
  id: true,
});

// API Keys
export const selectApiKeysSchema = createSelectSchema(apiKeys);
export const insertApiKeysSchema = createInsertSchema(apiKeys).omit({
  createdAt: true,
  updatedAt: true,
  expireAt: true,
  lastUsedAt: true,
  status: true,
  userId: true,
  id: true,
});
export const updateApiKeysSchema = createInsertSchema(apiKeys).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  gameId: true,
});

export const selectApiKeyLogsSchema = createSelectSchema(apiKeyLogs);
export const insertApiKeyLogSchema = createInsertSchema(apiKeyLogs).omit({
  createdAt: true,
  updatedAt: true,
  expireAt: true,
  id: true,
});
