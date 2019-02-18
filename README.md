# ORXAPI-BUILDER

## Build 

```
docker-compose build
```

## Launch 

Launch the below command to pull/build the docker image et launch the docker builder

```
docker-compose up -d
```

## Debug

```
docker-compose build && docker run -u node -it --rm --name front-builder front-builder:latest /bin/bash
```
