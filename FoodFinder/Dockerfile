FROM node:10

RUN mkdir -p /usr/foodfinder
WORKDIR /usr/foodfinder

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 7500

CMD [ "node", "foodfinder.js" ]