FROM node:21
WORKDIR /nagaed
COPY package*.json .
RUN npm install
COPY . /nagaed
EXPOSE 3000
CMD ["node","app.js"]