# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend dependency definitions
# We copy to a 'backend' folder because the structure mimics the repo
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Return to app root
WORKDIR /app

# Copy source code
COPY backend ./backend
COPY form-absensi ./form-absensi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the server (from the /app directory so backend/server.js path works)
CMD ["node", "backend/server.js"]
