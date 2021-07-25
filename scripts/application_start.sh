#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /var/www/staging.happy-season.com/html/HS-Back-office

#navigate into our working directory where we have all our github files
cd /var/www/staging.happy-season.com/html/HS-Back-office

#install node modules
npm install
# start building next js project 
npm run build 
# delete pm2 process.
pm2 delete "HS-Back-office"
# start pm2 process
pm2 start npm --name "HS-Back-office" -- start