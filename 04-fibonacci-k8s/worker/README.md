# Worker App - Fibonacci

## Build and Run a Docker Image While Developing the App

```powershell
# Build an image
worker:~$ docker build -f Dockerfile.dev -t hoangtrx/fibonacci_worker .

# Run a container based on the image
docker run -it --rm --name fibonacci_worker hoangtrx/fibonacci_worker
```
