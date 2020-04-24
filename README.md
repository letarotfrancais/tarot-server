# README

## Work with local version of tarot-core
cd ../tarot-core && yarn link
cd ../tarot-server && yarn link "tarot-core"
yarn start

## Build production docker image
DOCKER_BUILDKIT=1 docker build --ssh default -t tarot-server:master .

## Serve app
docker run -p 49160:80 \
  -e JWT_SECRET=somesecretkey \
  -e DB_HOST=dbhost \
  -e DB_DATABASE=dbname \
  -e DB_PASSWORD=dbpassword \
  tarot-server:master