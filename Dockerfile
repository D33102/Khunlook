# Use the official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the SQL file into the container
COPY init.sql /docker-entrypoint-initdb.d/

# Copy the rest of the app files
COPY . .

# Expose the port Fastify will run on
EXPOSE 3002

# Command to run the app
CMD ["npm", "run", "dev"]

