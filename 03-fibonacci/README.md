# Fibonacci Calculator

This project builds a `multi-container` web application that provides a simple UI allowing users to calculate arbitrary [fibonacci numbers](https://en.wikipedia.org/wiki/Fibonacci_number). The purpose of building such simple calculator with a way more complicated `multi-container` architecture is to learn how to create complex web apps with multiple service components that are wrapped inside different `Docker containers`.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v3.0.0](https://github.com/TranXuanHoang/Containerization/releases/tag/v3.0.0) | [diff](https://github.com/TranXuanHoang/Containerization/compare/v2.0.0...v3.0.0) | Build a `multiple-container` web app |

## Run App

Under the `03-fibonacci` project root directory, run the following `Docker Compose` command to build and bootstrap all services

```powershell
# Build and start up all apps including
# api server, redis, postgres, client web app and nginx
docker compose up --build
```

Then open [localhost:3050] using a web browser. The port `3050` was configured inside the [docker-compose.yml](./docker-compose.yml) file

```yml
  nginx: # can use any other name
    ...
    ports:
      - '3050:80' # map port 3050 on local machine to port 80 inside container
```

## Stop App

```powershell
docker compose down
```

## Check Data inside Databases

### Postgres

Open [http://localhost:8080/](http://localhost:8080/) and select to log in to the `Postgres` database. Credential information is inside the [docker-compose.yml](./docker-compose.yml) file.

```yml
  api:
    ...
    environment:
      - PGUSER=postgres
      - PGHOST=postgres # name of the service configured above
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password # same password set for the env POSTGRES_PASSWORD above
      - PGPORT=5432 # default port of postgres is 5432
```

### Redis

Open a `Redis CLI` using the following commands:

```powershell
# Open a shell in interactive mode associated with the `fibonacci_redis` container
docker exec -it fibonacci_redis sh

# After the shell is opened, tart up a Redis CLI
redis-cli
```

Then use `Redis commands` to retrieve data from `Redis` database running inside that container.
