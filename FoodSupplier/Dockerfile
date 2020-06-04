FROM node:12

WORKDIR /usr/src/foodsupplier

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7501

CMD [ "npm", "start" ]