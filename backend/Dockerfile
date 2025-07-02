# Usa la misma imagen base para consistencia
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de manifiesto de paquetes
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el resto del código de la API
COPY . .

# Expone el puerto en el que correrá tu API
EXPOSE 4000

# El comando para iniciar el servidor. Necesitaremos agregar este script.
CMD ["npm", "start"]