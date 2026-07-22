-- =============================================================================
-- PostgreSQL Automated Initialization & Seed Script (Pet Entity)
-- =============================================================================
--
-- HOW THIS WORKS WITH DOCKER:
-- --------------------------
-- 1. Automatic Execution:
--    The host folder `./docker/init-db` is mounted to `/docker-entrypoint-initdb.d`
--    inside the container via `docker-compose.yml`.
--
-- 2. First-Run Only:
--    The official PostgreSQL entrypoint script scans `/docker-entrypoint-initdb.d`
--    and executes all `.sql`, `.sql.gz`, and `.sh` files IN ALPHABETICAL ORDER.
--    This happens ONLY ONCE when the database volume (`postgres_data`) is completely
--    empty/uninitialized.
--
-- 3. Subsequent Starts:
--    If `/var/lib/postgresql/data` already contains database files, PostgreSQL
--    skips this folder entirely ("Skipping initialization").
--
-- -----------------------------------------------------------------------------
-- HELPFUL COMMANDS:
-- -----------------------------------------------------------------------------
-- • Reset database & force scripts to re-run:
--     docker compose --env-file env/.env.docker down -v
--     docker compose --env-file env/.env.docker up -d
--
-- • Run this script manually without resetting volume:
--     docker compose --env-file env/.env.docker exec postgres sh -c \
--       'psql -U $POSTGRES_USER -d $POSTGRES_DB -f /docker-entrypoint-initdb.d/02-pet-init.sql'
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Schema Definition
-- ---------------------------------------------------------------------------
-- Using `IF NOT EXISTS` ensures safety if run manually on an existing schema.
CREATE TABLE IF NOT EXISTS "pet" (
    "id"   TEXT    NOT NULL,
    "name" VARCHAR NOT NULL,
    CONSTRAINT "PK_pet_id" PRIMARY KEY ("id")
);

-- ---------------------------------------------------------------------------
-- 2. Seed Data
-- ---------------------------------------------------------------------------
-- Using `ON CONFLICT DO NOTHING` prevents errors on re-execution.
INSERT INTO "pet" ("id", "name") VALUES
    ('pet-101', 'Buddy'),
    ('pet-102', 'Luna'),
    ('pet-103', 'Milo'),
    ('pet-104', 'Bella'),
    ('pet-105', 'Oliver')
ON CONFLICT ("id") DO NOTHING;