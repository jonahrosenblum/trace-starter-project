FROM node:12

WORKDIR /usr/src/foodfinder

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7500

CMD [ "npm", "start" ]