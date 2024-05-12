#!/bin/bash
set -e

# Go to app directory
cd /home/ubuntu/AquilaCMS

# Install packages
yarn install

# Run pm2 app
pm2 start npm --name "Aquila_TEST" -- run start:pm2
