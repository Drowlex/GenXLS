#!/bin/bash

# Delete folder dist (sometimes it gives problems if the folder is locked when created from the dockerfile)
sudo rm -r dist

# Compile project
npm run build

# Update version
sh version.sh

docker-compose build

# Show version current...
Fichero=version.txt
CurrentVersion=$(cat $Fichero)
echo "🎉 Last version: 0.0.$CurrentVersion 🎉"

docker-compose up