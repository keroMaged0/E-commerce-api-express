FROM node:20.18.3

WORKDIR /app

COPY package*.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only=production; \
    else npm install; \
    fi

COPY . .      
RUN npm run build

EXPOSE 3000

CMD ["npm", "start" ]