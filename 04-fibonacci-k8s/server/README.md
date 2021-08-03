# Server App - Fibonacci

## Build and Run a Docker Image While Developing the App

```powershell
# Build an image
server:~$ docker build -f Dockerfile.dev -t hoangtrx/fibonacci_server .

# Run a container based on the image
docker run -it -p 5000:5000 --rm --name fibonacci_server hoangtrx/fibonacci_server
```
