# Stage 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Install Expo CLI
RUN npm install -g expo-cli

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the app (for production, you would run expo build:android or expo build:ios)
# For development, we just need the Expo dev server

# Stage 2: Run the dev server
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app /app

# Expose the dev server port
EXPOSE 19006

# Start the Expo dev server
CMD ["expo", "start", "--dev-client"]
