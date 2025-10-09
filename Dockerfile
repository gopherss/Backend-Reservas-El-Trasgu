# 1. Fase de Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY nest-cli.json tsconfig.json ./ 
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build 

# 2. Producción
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["npm", "run", "start:prod"]
