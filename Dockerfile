# 1. Fase de Build (para compilar el código)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

# Asegúrate de copiar tus archivos de configuración
COPY nest-cli.json tsconfig.json ./
RUN npm install
COPY . .

# ESTE PASO FALLARÁ SI HAY UN PROBLEMA DE COMPILACIÓN
RUN npm run build 

# -------------------------------------------------------------------

# 2. Fase de Producción (para ejecutar el código compilado)
FROM node:20-alpine
WORKDIR /app

# Copia solo los archivos necesarios para producción (mucho más ligero)
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

# Usamos el script start:prod de tu package.json
CMD ["npm", "run", "start:prod"]
