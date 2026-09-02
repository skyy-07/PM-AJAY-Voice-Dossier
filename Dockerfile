# Multi-stage Dockerfile for Node.js / Vite + Express

# Stage 1: Build application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy source code
COPY . .

# Build Vite frontend and bundled Express server (dist/)
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy built dist files from builder stage
COPY --from=builder /app/dist ./dist

# Expose default port (Render will override with process.env.PORT)
EXPOSE 3000

# Start production server
CMD ["npm", "start"]
