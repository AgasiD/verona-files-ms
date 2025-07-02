# Etapa 1: build
FROM node:20-alpine as builder
WORKDIR /app

# Copiamos solo lo necesario para instalar dependencias y compilar
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY .env .env

RUN npm install
RUN npm run build

# Etapa 2: runtime
FROM node:20-alpine
WORKDIR /app

# Copiamos solo lo necesario para correr la app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./env
COPY package*.json ./

RUN npm install --only=production

CMD ["node", "dist/main.js"]