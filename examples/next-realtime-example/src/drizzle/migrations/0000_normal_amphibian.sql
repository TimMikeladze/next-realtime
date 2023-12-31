CREATE TABLE IF NOT EXISTS "todo" (
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"text" varchar,
	"completed" boolean DEFAULT false,
	"userId" varchar
);
