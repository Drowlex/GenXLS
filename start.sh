#!/bin/bash

# Versión actual...
Fichero=version.txt
CurrentVersion=$(cat $Fichero)
echo "Build version: 0.0.$CurrentVersion 🔥"

# Hay un detalle al correr en servidor ya que quiere hacer una copia del docker hacia el volumen de la maquina host, sin embargo en el servidor no se manejan volumenes ya que el docker es autosustentable

if [ ${BACKEND_SERVER} = "true" ]; then
    echo "Production Mode Starting"
    npm run $NODE_ENV
else
    echo "Development Mode Starting"
    cp -r /build-dir/node_modules/ /code && npm run ${NODE_ENV}
fi