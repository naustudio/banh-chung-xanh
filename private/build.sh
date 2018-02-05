#!/bin/bash

# build to directory
meteor build --directory ~/meteor/banh-chung-xanh/
# change dir to install npm
cd ~/meteor/banh-chung-xanh/bundle/programs/server/

npm install