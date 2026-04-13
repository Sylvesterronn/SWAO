FROM node:24
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY prisma.config.ts ./
COPY tsconfig.json ./
COPY prisma prisma
COPY src src
COPY data data

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]