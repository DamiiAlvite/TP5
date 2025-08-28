# Utiliza una imagen oficial de Node.js como base
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json /app/
COPY package-lock.json /app/

# Instala las dependencias
RUN npm install --production

# Copia el resto del código fuente
COPY . /app/

# Construye la aplicación para producción
RUN npm run build

# Sirve la aplicación con un servidor estático simple
RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
