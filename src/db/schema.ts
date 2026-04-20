import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/* ─── Enums ─── */
export const projectStatusEnum = pgEnum('project_status', ['live', 'new', 'wip'])

/* ─── Types ─── */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: { fr: string; en: string } }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; lang: string; code: string }

/* ═══════════════════════════════════════════════
   BETTER AUTH TABLES
   ═══════════════════════════════════════════════ */
export const authUsers = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const authSessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
})

export const authAccounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const authVerifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

/* ─── Articles ─── */
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  issue: integer('issue').notNull(),
  date: date('date').notNull(),
  readMin: integer('read_min').notNull(),
  featured: boolean('featured').notNull().default(false),
  titleFr: text('title_fr').notNull(),
  titleEn: text('title_en').notNull(),
  dekFr: text('dek_fr').notNull(),
  dekEn: text('dek_en').notNull(),
  bodyFr: jsonb('body_fr').$type<Block[]>().notNull().default([]),
  bodyEn: jsonb('body_en').$type<Block[]>().notNull().default([]),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

/* ─── TOC Items ─── */
export const tocItems = pgTable('toc_items', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  anchorId: text('anchor_id').notNull(),
  labelFr: text('label_fr').notNull(),
  labelEn: text('label_en').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

/* ─── Article Tags ─── */
export const articleTags = pgTable('article_tags', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  nameFr: text('name_fr').notNull(),
  nameEn: text('name_en').notNull(),
})

/* ─── Projects ─── */
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  year: text('year').notNull(),
  url: text('url').notNull(),
  kindFr: text('kind_fr').notNull(),
  kindEn: text('kind_en').notNull(),
  descFr: text('desc_fr').notNull(),
  descEn: text('desc_en').notNull(),
  tags: text('tags').array().notNull().default([]),
  status: projectStatusEnum('status').notNull().default('live'),
  sortOrder: integer('sort_order').notNull().default(0),
})

/* ─── Comments ─── */
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  content: text('content').notNull(),
  approved: boolean('approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

/* ─── Relations ─── */
export const articlesRelations = relations(articles, ({ many }) => ({
  toc: many(tocItems),
  tags: many(articleTags),
  comments: many(comments),
}))

export const tocItemsRelations = relations(tocItems, ({ one }) => ({
  article: one(articles, { fields: [tocItems.articleId], references: [articles.id] }),
}))

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, { fields: [articleTags.articleId], references: [articles.id] }),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  article: one(articles, { fields: [comments.articleId], references: [articles.id] }),
}))

/* ─── Inferred types ─── */
export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert
export type TocItem = typeof tocItems.$inferSelect
export type ArticleTag = typeof articleTags.$inferSelect
export type Project = typeof projects.$inferSelect
export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
