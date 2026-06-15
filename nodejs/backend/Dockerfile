# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install dependencies (only production)
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8081

# Command to run application
CMD ["npm", "start"]
