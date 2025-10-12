# Render deployment Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files first for better caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy backend application code
COPY backend/ .

# Create necessary directories
RUN mkdir -p uploads

# Expose port (Render will use the PORT environment variable)
EXPOSE 10000

# Start the application
CMD ["npm", "start"]
