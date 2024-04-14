CREATE TABLE `feed` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`link` text NOT NULL,
	`updated` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feedEntry` (
	`id` text PRIMARY KEY NOT NULL,
	`entryId` text NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`description` text,
	`pubDate` integer NOT NULL,
	`feedId` text NOT NULL,
	`vectors` text,
	`ogImage` text,
	`processedAt` integer,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`feedId`) REFERENCES `feed`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `feedEntryAction` (
	`userId` text NOT NULL,
	`feedEntryId` text NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`feedEntryId`, `userId`),
	FOREIGN KEY (`feedEntryId`) REFERENCES `feedEntry`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feed_link_unique` ON `feed` (`link`);--> statement-breakpoint
CREATE UNIQUE INDEX `feed_entry_idx` ON `feedEntry` (`feedId`,`entryId`);