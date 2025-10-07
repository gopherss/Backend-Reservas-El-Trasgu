# 1. Fase de Build: Usamos una imagen Node.js con herramientas de desarrollo
FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de dependencias
COPY package*.json ./
COPY nest-cli.json tsconfig.json ./

# Instala las dependencias y ejecuta la compilación de NestJS
RUN npm install
COPY . .
RUN npm run build 

# -------------------------------------------------------------------

# 2. Fase de Producción: Usamos una imagen más ligera solo para correr el JS
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de producción necesarios
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/

# Expone el puerto (Fly.io lo remapea)
EXPOSE 8080

# Comando de arranque: usa el script de producción que tienes definido
CMD ["npm", "run", "start:prod"]
