
CONTAINER_ID=my-node8-app

docker container stop $CONTAINER_ID
docker container rm $CONTAINER_ID
docker image rm $CONTAINER_ID

docker build -t $CONTAINER_ID . 
docker run -p 3000:3000 -d --name $CONTAINER_ID  $CONTAINER_ID:latest
docker exec -it $CONTAINER_ID /bin/bash -c "npm i && npm run start"
