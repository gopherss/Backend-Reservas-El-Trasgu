# 1. Fase de Build (para compilar el código)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Copiar configs de Nest y Prisma
COPY nest-cli.json tsconfig.json ./ 
COPY prisma ./prisma/

RUN npm install

# Generar Prisma Client
RUN npx prisma generate

# Copiar resto del código
COPY . .

# Compilar
RUN npm run build 

# -------------------------------------------------------------------

# 2. Fase de Producción (para ejecutar el código compilado)
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]
