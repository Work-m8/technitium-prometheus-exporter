FROM node:18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

RUN npm run build

COPY --chown=node:node . .

EXPOSE 4001

CMD [ "node", "dist/server.js" ]