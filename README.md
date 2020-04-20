# README

## Work with local version of tarot-core
cd ../tarot-core && yarn link
cd ../tarot-server && yarn link "tarot-core"
yarn start

## Build production docker image
docker build -f Dockerfile.prod -t tarot-server:master --build-arg SSH_PRIVATE_KEY="$(cat ~/.ssh/id_rsa)" --force-rm .

## Remove intermediate containers (should be unnecessary since --force-rm is used)
docker rmi -f $(docker images -q --filter label=stage=build)

## Get interactive shell
docker run -p 49160:8080 -d tarot-server:master