# Build images while tagging them with 'latest' and '$SHA' commit hash as version
docker build -t hoangtrx/fibonacci_client:latest -t hoangtrx/fibonacci_client:$SHA -f ./client/Dockerfile ./client
docker build -t hoangtrx/fibonacci_server:latest -t hoangtrx/fibonacci_server:$SHA -f ./server/Dockerfile ./server
docker build -t hoangtrx/fibonacci_worker:latest -t hoangtrx/fibonacci_worker:$SHA -f ./worker/Dockerfile ./worker

# Push the images that have been build to Docker Hub
docker push hoangtrx/fibonacci_client:latest
docker push hoangtrx/fibonacci_server:latest
docker push hoangtrx/fibonacci_worker:latest

docker push hoangtrx/fibonacci_client:$SHA
docker push hoangtrx/fibonacci_server:$SHA
docker push hoangtrx/fibonacci_worker:$SHA

# Apply all K8s configs files inside the 'k8s' directory
kubectl apply -f k8s

# Update the new image version for containers that are being managed by each deployment.
# This is to make sure that new changes inside the source code (are now inside the image with SHA tag)
# are released to running pods.
kubectl set image deployments/server-deployment server=hoangtrx/fibonacci_server:$SHA
kubectl set image deployments/client-deployment client=hoangtrx/fibonacci_client:$SHA
kubectl set image deployments/worker-deployment worker=hoangtrx/fibonacci_worker:$SHA
