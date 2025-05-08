FROM node:20.17.0-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN mkdir -p src/public/files
RUN npm install -g npm@latest
RUN npm ci && npm run build


FROM node:20.17.0-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

# Ensure public/files directory exists
RUN mkdir -p /app/build/src/public/files
EXPOSE 3000
CMD [ "npm", "run", "start" ]
