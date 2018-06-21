docker kill world-cup-api-container
docker rm world-cup-api-container
docker build -t world-cup-api --build-arg WCA_MONGODB_CONNECTION_URI=${WCA_MONGODB_CONNECTION_URI} --build-arg WCA_MONGODB_CONNECTION_USERNAME=${WCA_MONGODB_CONNECTION_USERNAME} --build-arg WCA_MONGODB_CONNECTION_PASSWORD=${WCA_MONGODB_CONNECTION_PASSWORD} .
docker run -p 3000:3000 -d --name world-cup-api-container world-cup-api
docker logs -f world-cup-api-container
