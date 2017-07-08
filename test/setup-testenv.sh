#!/bin/bash
docker run --name db -d mongo:3.0 --smallfiles
docker run -p 3000:3000 --env ROOT_URL=http://127.0.0.1 --env ADMIN_PASS=123456 --env ADMIN_USERNAME=qeesung --name rocketchat --link db -d rocket.chat:0.57

declare -i max=0
until [ $(curl --output /dev/null --silent --head --fail "http://localhost:3000/api/v1/info") ] || [ "$max" -gt 30 ]; do
    printf '.'
    max=$(( max + 1 ))
    sleep 1
done
