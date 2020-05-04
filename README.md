# README

## Work with local version of tarot-core
```
cd ../tarot-core && yarn link \
cd ../tarot-server && yarn link "tarot-core" \
yarn start
```

## Build production docker image
```
DOCKER_BUILD_KIT=1 DOCKER_CLI_EXPERIMENTAL=enabled \
docker buildx build --ssh default -t tarot-server:master .
```

Notes:
- Env vars can be ignored if docker daemon config (`/etc/docker/daemon.json`) AND docker cli config (`~/.docker/config.json`) have `experimental` flag set to `true`/`"enabled"` respectively.
- Running `docker buildx install` makes `buildx` the default build command, aliasing `docker buildx build` to `docker build`. The build command becomes `docker build --ssh default -t tarot-server .`

## Create and push a docker image to Google Cloud Container Registry
Based on [official documentation](https://cloud.google.com/container-registry/docs/pushing-and-pulling?hl=fr)

```
docker tag tarot-server eu.gcr.io/letarotfrancais/tarot-server
docker push eu.gcr.io/letarotfrancais/tarot-server
```

## Serve app
```
docker run -p 49160:80 \
  -e JWT_SECRET=somesecretkey \
  -e DB_HOST=dbhost \
  -e DB_DATABASE=dbname \
  -e DB_PASSWORD=dbpassword \
  tarot-server:master
```

Note: Other env vars, such as `DB_USERNAME`, have default values set in the [Dockerfile](Dockerfile) itself. They can still be overriden in the command above if needed.