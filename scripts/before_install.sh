#!/bin/bash

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
npm install pm2 -g
#create our working directory if it doesnt exist
DIR="/var/www/staging.happy-season.com/html/HS-Back-office"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  mkdir ${DIR}
fi
sudo chmod -R 777 /var/www/staging.happy-season.com/html/HS-Back-office