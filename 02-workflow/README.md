# Workflow

## Build a Docker Image and Run a Container Based on that Image

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

## Build and Run with Docker Compose

Another way to run the app is by using `Docker compose`. Inside the project root directory, there is a [`docker-compose.yml`](./docker-compose.yml) file that contains the config for runing and stopping the app with the following `Docker compose` commands

```powershell
# Start the app up
docker compose up

# Stop the app
docker compose down
```

## Run Tests

To run test cases,

**Method 1:** Use `docker run` command

```powershell
# Run tests against source code inside the container-internal /app directory
docker run -it --rm --name workflow workflow:v1.1 npm run test

# Run tests against source code in the local machine (use volumes bind mount)
# Note that, we need to run the command under the '02-workflow' directory.
# And 'workflow:v1.1' is supposed to be created by running
# 'docker compose up' in the previous section
docker run -it --rm -v /app/node_modules -v "$(pwd):/app" -e CHOKIDAR_USEPOLLING=true --name workflow workflow:v1.1 npm run test
```

**Method 2:** Run `docker compose up` to start a container up and then run `docker exec`

```powershell
# For the first time running Docker compose, run the following
# command to build a Docker image for the project before starting
# containers for that Docker image
docker compose up --build

# From the second time (when there is no changes added to project
# source code), start the app with Docker compose
docker compose up

# Run test by opening a different terminal and run this command
docker exec -it -e CHOKIDAR_USEPOLLING=true workflow_test npm run test
```

## Production Build and Run

```powershell
# Build a Docker image for running on Production Environment
# using the default Dockerfile config
docker build -t hoangtrx/workflow_prod:v1.0 .

# Run the image
# Note that the default port of Nginx inside the container is 80,
# so we map that internal port 80 to our local machine port 8080
docker run --rm -p 8080:80 --name workflow_prod hoangtrx/workflow_prod:v1.0
```

## Travis CI

A [.travis.yml](./.travis.yml) file was added to config [Travis CI](https://www.travis-ci.com/) as a `continuous integration` tool helping us to automate the build, tests and deployment of the app.
