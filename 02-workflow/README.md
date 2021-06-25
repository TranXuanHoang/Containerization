# Workflow

```powershell
# To build this project with a Dockerfile whose name is Dockerfile.dev
docker build -f Dockerfile.dev -t hoangtrx/workflow .

# To run the Docker image built in the previous step
# macOS
docker run -p 4000:3000 --rm -v $(pwd):/app -v /app/node_modules --name workflow hoangtrx/workflow:v1.0

# Windows
# Method 1: Use absolute path
docker run -p 4000:3000 --rm -v "absolute/path/to/your/project/directory:/app" -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name workflow hoangtrx/workflow:v1.0

# Method 2: Use pwd or cd command to calculate directory path
# PowerShell
docker run -p 4000:3000 --rm -v "$(pwd):/app" -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name workflow hoangtrx/workflow:v1.0

# CMD Prompt
docker run -p 4000:3000 --rm -v "%cd%:/app" -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name workflow hoangtrx/workflow:v1.0
```

Another way to run the app is by using `Docker compose`. Inside the project root directory, there is a [`docker-compose.yml`](./docker-compose.yml) file that contains the config for runing and stopping the app with the following `Docker compose` commands

```powershell
# Start the app up
docker compose up

# Stop the app
docker compose down
```
