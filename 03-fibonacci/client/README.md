# Client App - Fibonacci

## Build and Run a Docker Image While Developing the App

```powershell
# Build an image
client:~$ docker build -f Dockerfile.dev -t hoangtrx/fibonacci_client .

# Run a container based on the image
docker run -it -p 3000:3000 --rm --name fibonacci_client hoangtrx/fibonacci_client
```
