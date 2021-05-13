# Visits Counter

Build a counter counting the number of user visits to a website.

```powershell
# Build and run all containers using Docker compose.
# Run this command the first time to build new images or
# to update new source code to the docker containers.
01-visits-counter:~$ docker compose up --build

# Then after the first build, run the following command
# to start running containers without building them again.
01-visits-counter:~$ docker compose up

# Stop running containers
01-visits-counter:~$ docker compose down

# Check running containers
01-visits-counter:~$ docker compose ps
```
