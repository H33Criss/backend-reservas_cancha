# Usa una imagen base de Node.js (ajusta la versión según tu necesidad)
FROM node:22-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo yarn.lock y package.json para instalar las dependencias antes
# Esto permite que Docker use el cache si estos archivos no cambian
COPY yarn.lock package.json ./

# Instala las dependencias de la aplicación usando Yarn
RUN yarn install --frozen-lockfile

# Copia el resto de la aplicación
COPY . .

# Rebuild dependencies with native addons for the correct architecture
RUN yarn install --force --build-from-source

# Construye la aplicación para producción
RUN yarn build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["yarn", "start:prod"]
