# Docker Cheatsheet

## Basics

### Build a project

```powershell
# If the Docker file is the default Dockerfile file
docker build [-t <user_name>/<tag_name>:<tag>] .

# If the Docker file name is Dockerfile.dev
docker build -f Dockerfile.dev [-t <user_name>/<tag_name>:<tag>] .
# Example:
docker build -f Dockerfile.dev -t hoangtrx/workflow:v1.0 .
```

### List images

```powershell
# Either
docker image ls

# Or
docker images
```

### Run containers

```powershell
docker run [-d --rm -p <HOST_PORT>:<CONTAINER_PORT> --name <container_name>] <user_name>/<image_name>:<tag>
# -d        Run in detached mode (not show a log console)
# --rm      Automatically remove the container when it exists
# -p        Map a port on local machine HOST_PORT to another port on the container <CONTAINER_PORT>
# --name    Assign a name to the container
# Example:
docker run -p 4000:3000 --rm --name workflow hoangtrx/workflow:v1.0
```

### Delete resources

```powershell
# Delete everything
docker system prune -a
```

### Volumes

Run the following commands from inside of the root directory of the project you want to mount to the `/app` directory inside the container. Doing so will help the program inside the container's `/app` directory to access files in your local host machine's mounted project root directory.

```powershell
docker run [-d --rm -p <HOST_PORT>:<CONTAINER_PORT>] -v "absolute/path/to/your/project/directory:/app" [-v /app/<unmounted_dir>] [-e CHOKIDAR_USEPOLLING=true] [--name <container_name>] <user_name>/<image_name>:<tag>
# -d        Run in detached mode (not show a log console)
# --rm      Automatically remove the container when it exists
# -p        Map a port on local machine HOST_PORT to another port on the container <CONTAINER_PORT>
# -v        Bind mount a volume
#           -v "absolute/path/to/project:app"
#             means the '/app' directory inside the container is mounted to
#             the 'absolute/path/to/project' directory of the host local machine
#           -v /app/<unmounted_dir>
#             means avoid mounting the '/app/<unmounted_dir>' directory inside
#             the container to any outside directories of the local host machine
# --name    Assign a name to the container

# To avoid having to manually specify the "absolute/path/to/your/project/directory"
# we can use the following shortcuts:
# macOS / Linux: -v $(pwd):/app
# Windows:
-v "%cd%:/app"        # CMD
-v "$(PWD):/app"      # PowerShell
-v "$(pwd):/app"      # PowerShell

# Example:

# macOS
docker run -p 4000:3000 --rm -v $(pwd):/app -v /app/node_modules --name workflow hoangtrx/workflow:v1.0

# Windows
# Method 1: Use absolute path
docker run -p 4000:3000 --rm -v "absolute/path/to/your/project/directory:/app" -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name workflow hoangtrx/workflow:v1.0

# Method 2: Use PWD or cd command to calculate directory path
# PowerShell
docker run -p 4000:3000 --rm -v "$(pwd):/app" -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name workflow hoangtrx/workflow:v1.0

# CMD Prompt
docker run -p 4000:3000 --rm -v "%cd%:/app" -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name workflow hoangtrx/workflow:v1.0
```

## Networking

### Connect from container to local machine

```javascript
// From inside a container, to connect to a service running on the local host machine
// use the following domain that specifically can be understood by Docker
host.docker.internal

// E.g., connect to a MongoDB running on the local host machine
mongoose.connect(
  'mongodb://host.docker.internal:27017/db_name',
  { useNewUrlParser: true },
  (err) => { ... }
);
```

### Connect containers with containers

```powershell
# Create a new network
docker network create <network_name>

# Then we can just use the name (--name <container_nme>) of the
# containers running inside the same network to communicate with them

# Run a container in a network
docker run --network <network_name> --name <container_name> <image_name>

# E.g.,
docker create network my-net
docker run --network my-net --name mongodb-server mongo
docker run --network my-net --name container2 image2
```

```javascript
// Then the following code of a Node.js app running inside
// the 'container2' can connect to the mongodb as below
mongoose.connect(
  'mongodb://mongodb-server:27017/db_name',
  { useNewUrlParser: true },
  (err) => { ... }
);
```

## Run Tests

To run unit test cases for a `Node.js` project, use the following commands (see [workflow readme file](./02-workflow/README.md) for an example of how to use these commands in a real `Node.js` project)

```powershell
# Run tests against source code inside the container-internal /app directory
docker run -it --rm --name workflow workflow:v1.1 npm run test

# Run tests against source code in the local machine (use volumes bind mount)
docker run -it --rm -v /app/node_modules -v "$(pwd):/app" --name workflow workflow:v1.1 npm run test
```

## Environment Variables

### Specify environment variables in `Docker run` command

```powershell
doker run -e <VARIABLE_1>=<VALUE_1> -e <VARIABLE_2>=<VALUE_2> ...
```

### Define environment variables in the Dockerfile

```dockerfile
# In a Dockerfile specify an environment variable like below
ENV <VARIABLE_NAME> <default_value>

# Then use it with the $<VARIABLE_NAME>
EXPOSE $VARIABLE_NAME

# Or access it inside the source code
# For Node.js app, we can access env vars with
process.env.VARIABLE_NAME
```

### Put environment variables in a .env file

```powershell
# Create a file named .env in the root project dir and specify
# variables name and values
VARIABLE_1=VALUE_1
VARIABLE_2=VALUE_2
...

# Specify location of the .env file when running a container
docker run --env-file ./.env
```

### Notes on security when using environment variables

Shouldn't include the secure data directly in your `Dockerfile`. Instead, go for a separate `environment variables file` which is then only used at runtime (i.e. when running a container with `docker run`). Otherwise, the values are "baked into the image" and everyone can read these values via

```powershell
# Inspect env variables configured for the image
docker history <image>

# Or
docker inspect <image>
```

Make sure you don't commit that separate `environment variables file` as part of your source control repository, if you're using source control.

### Build time arguments

```dockerfile
# Specify arguments inside a Dockerfile
ARG <ARGUMENT_NAME_1>=<DEFAULT_VALUE_1>
ARG <ARGUMENT_NAME_2>=<DEFAULT_VALUE_2>

# Then use them except the CMD command
# For example, use them as the default value for an environment variable
ENV <ENVIRONMENT_VAR_1> $ARGUMENT_NAME_1

# We can override the default values specified for each argument variables
# when running the docker build command
docker build --build-arg ENVIRONMENT_VAR_1=NEW_DEFAULT_VALUE_1 \
  --build-arg ENVIRONMENT_VAR_2=NEW_DEFAULT_VALUE_2 ...
```
