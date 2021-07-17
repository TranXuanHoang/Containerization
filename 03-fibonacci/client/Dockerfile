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

# On local machine, this exposed port doesn't take any effects.
# However, for AWS Beanstalk the EXPOSE instruction does.
EXPOSE 3000

# Copy a new Nginx default config file to the container internal
# '/etc/nginx/conf.d/' directory to get our own route configs applied
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built resources (html, javascript, ...) generated in
# the previous stage to the '/usr/share/nginx/html' directory
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx will start running automatically, so there is no need
# to specify CMD
