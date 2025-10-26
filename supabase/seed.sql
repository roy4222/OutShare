-- Create tables in public schema
CREATE TABLE "profiles" (
    "user_id" UUID NOT NULL,
    "username" TEXT,
    "display_name" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "social_links" JSONB DEFAULT '{}',
    "gear_dashboard_title" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "profiles_username_key" UNIQUE ("username")
);

CREATE TABLE "trip" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "duration" TEXT,
    "date" DATE,
    "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "slug" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "trip_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "trip_slug_key" UNIQUE ("slug")
);

CREATE TABLE "gear" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "specs" JSONB,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "gear_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "trip_gear" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "trip_id" UUID NOT NULL,
    "gear_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trip_gear_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "trip_gear_trip_id_gear_id_key" UNIQUE ("trip_id", "gear_id")
);

-- Foreign keys within public schema
ALTER TABLE "trip"
  ADD CONSTRAINT "trip_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "gear"
  ADD CONSTRAINT "gear_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("user_id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_gear"
  ADD CONSTRAINT "trip_gear_trip_id_fkey"
  FOREIGN KEY ("trip_id") REFERENCES "trip"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "trip_gear"
  ADD CONSTRAINT "trip_gear_gear_id_fkey"
  FOREIGN KEY ("gear_id") REFERENCES "gear"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Cross-schema foreign key to Supabase auth.users
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
