FROM node:18

WORKDIR /app/node_modules/@syncfusion/ej2-filemanager-node-filesystem

COPY ./node_modules/@syncfusion/ej2-filemanager-node-filesystem/package*.json ./


RUN npm install

WORKDIR /app

COPY . .

ENV NODE_ENV=production

EXPOSE 8090

CMD ["node", "./node_modules/@syncfusion/ej2-filemanager-node-filesystem/filesystem-server.js"]
