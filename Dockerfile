# Multi-stage build for optimized production image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Add package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactjs -u 1001

# Install serve to run the built app
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build --chown=reactjs:nodejs /app/dist ./build

# Expose port
EXPOSE 3000

# Switch to non-root user
USER reactjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]

# Metadata
LABEL maintainer="Watcher Team"
LABEL description="Watcher - Incident Reporting System"
LABEL version="1.0.0"
