FROM node:16.9.0-alpine
WORKDIR /app
COPY package.json ./
RUN npm i 
COPY . .
EXPOSE 3000
CMD ["node","app.js"]
