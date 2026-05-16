# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy source code and build the project
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled files from the builder stage
COPY --from=builder /app/dist ./dist

# Use the built-in 'node' user for better security
USER node

EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]