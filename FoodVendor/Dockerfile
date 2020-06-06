FROM node:10

RUN mkdir -p /usr/foodvendor
WORKDIR /usr/foodvendor

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 7502

CMD [ "node", "foodvendor.js" ]