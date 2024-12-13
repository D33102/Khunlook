# Use the official Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy src code to /app/src
COPY src src

COPY package.json package.json
COPY package-lock.json package-lock.json

# Copy the SQL file into the container
COPY init.sql /docker-entrypoint-initdb.d/

RUN npm install

CMD ["node", "src/server.js"]
