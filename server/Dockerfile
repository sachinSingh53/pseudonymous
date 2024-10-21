# Use a Node.js image suitable for your Prisma and NestJS app
FROM node:21.7.1

# Set the working directory
WORKDIR /app

# Copy package.json and lock file for better caching
COPY package*.json ./

# Install dependencies globally and locally
RUN npm install -g @nestjs/cli \
    && npm install && npm i --save-dev @types/node

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app's code
COPY . .

# Expose the application's port
EXPOSE 4000

# Set the startup command
CMD ["npm", "run", "start:dev"]
