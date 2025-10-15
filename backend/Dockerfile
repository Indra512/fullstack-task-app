# Use Node LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependencies first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Expose backend port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]