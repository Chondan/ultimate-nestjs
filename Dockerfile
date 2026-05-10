FROM node:20-alpine AS base
WORKDIR /app
ARG PORT=3001
ENV PORT=${PORT}

# ── 1. Development, Staging, Production Dependencies Stage ──────────────────────────────────────────
# We do this separately so we can copy clean modules to the final image
FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev

# ── 2. Builder Stage ──────────────────────────────────────────────────────────
FROM base AS builder
COPY package*.json ./
# DON'T use --omit=dev here. We need nest, tsc, etc. to build.
RUN npm install 
COPY . .
RUN npm run build

# ── 3. Docker Stage (Using Builder modules for dev/internal) ──────────────────
FROM base AS docker
ENV NODE_ENV=docker
# We copy node_modules from builder because it includes devDeps needed for some docker tasks
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}
CMD ["node", "dist/src/main"]

# ── 4. Development Stage (Lean & Secure) ───────────────────────────────────────
FROM base AS development
ENV NODE_ENV=development
# We copy node_modules from the 'deps' stage (no dev dependencies)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}
CMD ["node", "dist/src/main"]

# ── 5. Staging Stage (Lean & Secure) ───────────────────────────────────────
FROM base AS staging
ENV NODE_ENV=staging
# We copy node_modules from the 'deps' stage (no dev dependencies)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}
CMD ["node", "dist/src/main"]

# ── 6. Production Stage (Lean & Secure) ───────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production
# We copy node_modules from the 'deps' stage (no dev dependencies)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}
CMD ["node", "dist/src/main"]