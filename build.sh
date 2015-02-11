#!bin/bash

# Update latest code
git pull

# Build to a directory outside source tree
meteor build ../bcx --directory --server=http://banhchungxanh.naustud.io:80

# Install node packages
cd ../bcx/bundle/programs/server/
nvm use 0.10
npm install

# Start server command is omitted since this is a public repo