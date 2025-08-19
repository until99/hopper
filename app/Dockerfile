# Use Node.js 20 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally with SSL configuration
RUN npm install -g pnpm    

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with SSL configuration
RUN pnpm config set strict-ssl false && \
    pnpm install --frozen-lockfile && \
    pnpm config set strict-ssl true

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Command to run the development server
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
