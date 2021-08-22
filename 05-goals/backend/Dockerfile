FROM node:alpine

ENV MONGODB_USERNAME=default_user_name
ENV MONGODB_PASSWORD=default_password

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
