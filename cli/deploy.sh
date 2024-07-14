#!/bin/bash
. ./../.env
echo "Uploading files to" $SERVER_HOST "as" $SERVER_USER"..."
rsync -av -e ssh --exclude='*.iml' --exclude='package-lock.json' --exclude='node_modules' --exclude='.idea' --exclude='.env' --exclude='.git' --exclude='.gitignore' --exclude='cli' ./.. $SERVER_USER@$SERVER_HOST:~
echo "Updading node packages..."
ssh -t $SERVER_USER@$SERVER_HOST "cd currencies && npm install && pm2 reload currencies"
