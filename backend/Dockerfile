# Use the official Node.js image as the base image
FROM node:22-slim

# Install global dependencies
RUN npm install -g cross-env ts-node-dev tsconfig-paths tsc-alias prisma

# Set the working directory
WORKDIR /app

# Copy `package.json` and `package-lock.json`
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Define environment variable
ENV PORT=8080
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]