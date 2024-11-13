FROM node:18

WORKDIR /app

COPY package*.json ./

WORKDIR /app/node_modules/@syncfusion/ej2-filemanager-node-filesystem

RUN npm install

WORKDIR /app

COPY . .

ENV NODE_ENV=production

EXPOSE 8090

CMD ["node", "./node_modules/@syncfusion/ej2-filemanager-node-filesystem/filesystem-server.js"]
