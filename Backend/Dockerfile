FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 3000 4000

CMD ["node", "src/index.js"]
