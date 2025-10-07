# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y lockfile
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Construir la app
RUN npm run build


# Etapa 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar solo node_modules necesarios para producción
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código compilado
COPY --from=builder /app/dist ./dist

# Copiar package.json
COPY package*.json ./

# Exponer el puerto (Fly.io inyecta $PORT)
EXPOSE 3000

CMD ["node", "dist/main.js"]
