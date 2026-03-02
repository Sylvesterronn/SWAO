FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY prisma prisma
COPY src src
COPY data data
COPY .env .env

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3000
CMD ["npm", "run", "dev"]