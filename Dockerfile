FROM node:20.18.3

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install 

COPY . .    
RUN npm run build

CMD ["npm", "start"]