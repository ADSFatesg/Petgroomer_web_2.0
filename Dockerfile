FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install @angular/cli

COPY . .

EXPOSE 4200

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
