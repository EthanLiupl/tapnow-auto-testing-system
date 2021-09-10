FROM node:14.16-buster-slim

WORKDIR /home/node/app

COPY package.json dist ./ 

RUN npm i --registry https://registry.npm.taobao.org --production

ENV PORT=3000 
    
EXPOSE 3000

CMD ["node", "main.js"]

