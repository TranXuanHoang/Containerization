## Dockerfile used in Production Deployment

# Stage 1: Build the app
FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the app
FROM nginx

# Copy built resources (html, javascript, ...) generated in
# the previous stage to the '/usr/share/nginx/html' directory
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx will start running automatically, so there is no need
# to specify CMD
