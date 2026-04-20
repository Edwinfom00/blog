CREATE TYPE "public"."project_status" AS ENUM('live', 'new', 'wip');--> statement-breakpoint
CREATE TABLE "article_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"name_fr" text NOT NULL,
	"name_en" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"issue" integer NOT NULL,
	"date" date NOT NULL,
	"read_min" integer NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"title_fr" text NOT NULL,
	"title_en" text NOT NULL,
	"dek_fr" text NOT NULL,
	"dek_en" text NOT NULL,
	"body_fr" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"body_en" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"author_name" text NOT NULL,
	"author_email" text NOT NULL,
	"content" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"year" text NOT NULL,
	"url" text NOT NULL,
	"kind_fr" text NOT NULL,
	"kind_en" text NOT NULL,
	"desc_fr" text NOT NULL,
	"desc_en" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"status" "project_status" DEFAULT 'live' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "toc_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"anchor_id" text NOT NULL,
	"label_fr" text NOT NULL,
	"label_en" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "toc_items" ADD CONSTRAINT "toc_items_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;