# Goals

This project works on building a web app containing multiple containers that interract with each other to process, save and retrieve app data as well as presenting the data to the front-end GUI.

The project demonstrates how to dockerize a `MongoDB`, a `React` front-end app, and a `Node.js` back-end server. It also shows how to utilize `Docker Volumes` to persist the database data and logs data output by the back-end server.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v5.0.1](https://github.com/TranXuanHoang/Containerization/releases/tag/v5.0.1) | [diff](https://github.com/TranXuanHoang/Containerization/compare/v5.0.0...v5.0.1) | Create a `multiple-container` web app with `Docker Compose` |

## Build and Run App

```powershell
# Build app the first time, and then run it
docker compose up --build

# Or run in detached mode
docker compose up --build -d

# From the second time, we can ommit the --build flag
docker compose up
docker compose up -d     # run in detached mode

# Shutdown app (without deleting database data)
docker compose down

# Shutdown app and delete database data (saved in a named volume)
docker compose down -v
```
