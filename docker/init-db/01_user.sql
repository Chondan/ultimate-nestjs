-- =============================================================================
-- Seed script for the development PostgreSQL container.
-- Runs automatically on first container start via /docker-entrypoint-initdb.d/.
--
-- NOTE: This script both creates the schema and seeds initial data so that the
-- dev database is ready without having to run TypeORM migrations manually.
-- If you run migrations afterwards, use IF NOT EXISTS guards (already in place).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
    "id"        SERIAL       NOT NULL,
    "firstName" VARCHAR      NOT NULL,
    "lastName"  VARCHAR      NOT NULL,
    "isActive"  BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
);

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------
INSERT INTO "user" ("firstName", "lastName", "isActive") VALUES
    ('Alice',   'Anderson',  TRUE),
    ('Bob',     'Baker',     TRUE),
    ('Charlie', 'Clark',     TRUE),
    ('Diana',   'Davis',     FALSE),
    ('Eve',     'Evans',     TRUE)
ON CONFLICT DO NOTHING;
