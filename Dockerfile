FROM node:18-alpine


WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

COPY --chown=node:node . .

EXPOSE 4001

CMD [ "node", "dist/server.js" ]
