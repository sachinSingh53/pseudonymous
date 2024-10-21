# Dockerfile

# Use a Node.js base image compatible with your Prisma needs
FROM node:21.7.1

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching purposes
COPY package*.json ./

RUN npm install -g @nestjs/cli

# Install dependencies
RUN npm install 

# Copy Prisma schema files and run Prisma generate inside the container
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the project files
COPY . .

# Expose port (e.g., for NestJS app)
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:dev"]
