FROM node:20.17.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

# Expose the port the gateway runs on
EXPOSE 8080

CMD ["npm", "start"]