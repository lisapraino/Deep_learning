# Dockerfile frontend

# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production (creates the 'dist' or 'build' folder)
RUN npm run build

# Stage 2: Serve the application using a lightweight web server
# We use NGINX, which is very fast and efficient for static files (the built React app)
FROM nginx:alpine

# Copy the built application files from the 'build' stage to NGINX's static folder
COPY --from=build /app/dist /usr/share/nginx/html

# Default port for NGINX is 80
EXPOSE 80