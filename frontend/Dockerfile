# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the app in development mode
CMD ["npm", "run", "dev"]