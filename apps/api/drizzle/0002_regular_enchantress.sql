CREATE TYPE "public"."account_status" AS ENUM('pending', 'registered');--> statement-breakpoint
CREATE TABLE "accounts" (
	"cognito_sub" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"status" "account_status" NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_cognitoSub_unique" UNIQUE("cognito_sub"),
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
