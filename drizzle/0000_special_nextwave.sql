CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`featured_image` text,
	`content` text NOT NULL,
	`seo_description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text NOT NULL,
	`published_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `cv_downloads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`downloaded_at` text NOT NULL,
	`ip_address` text NOT NULL,
	`user_agent` text NOT NULL,
	`referrer` text
);
