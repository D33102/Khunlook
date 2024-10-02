# Use the official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy the SQL file into the container
COPY init.sql /docker-entrypoint-initdb.d/
