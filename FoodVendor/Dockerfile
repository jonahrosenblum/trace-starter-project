FROM node:12

WORKDIR /usr/src/foodvendor

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7502

CMD [ "npm", "start" ]