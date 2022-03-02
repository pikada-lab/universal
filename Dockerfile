FROM node:16
WORKDIR /usr/src/app
COPY ./dist/ .
EXPOSE 4000 
CMD [ "node", "./server/main.js" ]