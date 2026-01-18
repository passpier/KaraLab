FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm svelte-kit sync
RUN pnpm build
RUN pnpm prune --prod

FROM node:20-alpine

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port (Cloud Run sets PORT env var, default 3000)
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["node", "build"]
