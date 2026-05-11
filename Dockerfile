# ── Base Image ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
ARG PORT=3001
ENV PORT=${PORT}

# ── 1. Dependencies (Production only) ─────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev

# ── 2. Builder (All deps + Compilation) ───────────────────────────────────────
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ── 3. Final Runner (Production-ready) ────────────────────────────────────────
FROM base AS runner
# Copy only what is strictly necessary
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

# Direct execution for better performance and signal handling
CMD ["node", "dist/src/main"]