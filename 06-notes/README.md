# Notes

This project shows how to use `Kubernetes Volumes` to persiste app data. It also provides a [docker-compose.yml](docker-compose.yml) allowing us to start up the app by just using `Docker Compose`.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v6.0.1](https://github.com/TranXuanHoang/Containerization/releases/tag/v6.0.1) | [diff](https://github.com/TranXuanHoang/Containerization/compare/v6.0.0...v6.0.1) | Make a backend API server and deploy it with `Kubernetes` (using `K8s Volumes` to persist app data) |

## Start the app up with Docker Compose

```powershell
# Build and start the app up
docker compose up --build

# Take the app down without deleting Docker Volume used to save app data
docker compose down

# Take the app down and at the same time delete Docker Volume used to save app data
docker compose down -v
```

## Deploy the app locally with Kubernetes

```powershell
# Start the app up, or apply new configs to the K8s Deployment and Service objects
kubectl apply -f deployment.yaml -f service.yaml

# Then open app on local machine at
localhost:4000

# Take the app down
kubectl delete -f deployment.yaml -f service.yaml
```

## Interact with the app

After the app is started up and running, use Postman to call the following APIs

```powershell
# Fetch notes
GET  http://localhost:4000/notes

# Add a new notes
POST http://localhost:4000/notes
{
  "text": "My notes"
}

# Cause the container running inside the pod crash
# -> If app was started with Docker Compose:
#    the app will be stopped (notes-app exited with code 1)
# -> If app was started with K8s:
#    pod will be restarted
GET http://localhost:4000/error
```
