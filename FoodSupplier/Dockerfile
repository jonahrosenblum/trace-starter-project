FROM node:10

RUN mkdir -p /usr/foodfsupplier
WORKDIR /usr/foodsupplier

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 7501

CMD [ "node", "foodsupplier.js" ]