#!/bin/bash

# Vamos a actualizar la versión jaja
# Obtenemos el valor que hay en el archivo
Fichero=version.txt

# Validamos si existe, de lo contrario se crea :)
if [ ! -f "$Fichero" ];
then
    echo "Se creará el archivo de versión"
    # Si no existe, se crea
    echo "0" > version.txt
    # code if not found
fi

# Lo asigamos a una variable
OldVersion=$(cat $Fichero)
# echo $OldVersion

# Eliminamos el archivo
rm $Fichero

# Actualizamos su contenido HACKERMAN :V
NewVersion=$(($OldVersion+1))

# Guardamos..
echo $NewVersion > $Fichero

# Creamos una copia para el publico ;)
cp $Fichero ../

# Versión desplegada...
# Fichero=version.txt
# CurrentVersion=$(cat $Fichero)
# echo "🎉 Last version: 0.0.$CurrentVersion 🎉"