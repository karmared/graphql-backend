#!/bin/sh
cd /app
yarn migrate
exec "yarn serve"
