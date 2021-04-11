FROM node:12.2.0
LABEL maintainer="GenXLS by drowlex96@gmail.com"

# Copio y doy permisos a este archivo de auto-ejecución
ADD start.sh /
RUN chmod +x /start.sh

# Declaro y Recibo variables de entorno para iniciar el proyecto
# ENV NODE_ENV start:build:pm2
ENV NODE_ENV start:pm2


# Instalo un el servicio de PM2 para reiniciar en caso de errores
RUN npm install pm2 -g


# Creo una carpeta temporal para replicar los archivos hacia afuera
WORKDIR /build-dir
# COPY package*.json ./
COPY package.json /build-dir

# Instalo dependencias
RUN npm install 

# Instalo dependencias para serverless
# RUN npm i -g serverless

# Create app directory origin
WORKDIR /code
RUN ln -s /build-dir/node_modules node_modules
COPY package.json /code


# I create folder for exported documents
# RUN mkdir -p /code/export


# Bundle app source
EXPOSE 8400
COPY . .

# CMD ["/bin/bash", "-c","/usr/local/bin/npm run build && /usr/local/bin/npm run $NODE_ENV"]
CMD ["/start.sh"]