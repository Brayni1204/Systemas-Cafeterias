# Usa una imagen oficial de Node.js como base. Alpine es una versión ligera.
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de manifiesto de paquetes y el lockfile
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de tu aplicación al directorio de trabajo
COPY . .

# Expone el puerto que Vite usa para que podamos acceder desde fuera del contenedor
EXPOSE 5173

# El comando que se ejecutará para iniciar la aplicación cuando el contenedor se inicie
# El script "dev" es creado por defecto por Vite
CMD ["npm", "run", "dev"]