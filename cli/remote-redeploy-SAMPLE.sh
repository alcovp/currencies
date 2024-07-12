#!/bin/bash
echo "Uploading files to server..."
rsync -av -e ssh --exclude='*.iml' --exclude='package-lock.json' --exclude='node_modules' --exclude='.idea' --exclude='.env' --exclude='.git' --exclude='.gitignore' --exclude='cli' ./.. [USER]@[REMOTE_HOST]:~
echo "Updading node packages..."
ssh -t [USER]@[REMOTE_HOST] "cd currencies && npm install && pm2 reload currencies"
