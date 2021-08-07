# Fibonacci Calculator with Kubernetes

> This project create the same app as developed in the [03-fibonacci](../03-fibonacci) project except that here `Kubernetes` is used to orchestrate a set of containers forming the web app.

This project builds a `multi-container` web application that provides a simple UI allowing users to calculate arbitrary [fibonacci numbers](https://en.wikipedia.org/wiki/Fibonacci_number). The purpose of building such simple calculator with a way more complicated `multi-container` architecture is to learn how to create complex web apps with multiple service components using `Docker` and `Kubernetes`.

## Source Code

Switch the source code to the version described below to view its implementation.

| Git Tag | Git Diff | Implementation |
|---------|----------|----------------|
| [v4.0.0](https://github.com/TranXuanHoang/Containerization/releases/tag/v4.0.0) | [diff](https://github.com/TranXuanHoang/Containerization/compare/v3.0.0...v4.0.0) | Build a `multiple-container` web app with `Kubernetes` |

## Run App

### Create secrets

```powershell
# Create a secret containing the password that will be used to connect to the PostgreSQL DB
kubectl create secret generic pgpassword --from-literal PGPASSWORD=1234asdf

# List out secrets created
kubectl get secrets
```

Note that we reference to that secret inside a `K8s Deployment` like below

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: server-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      component: server
  template:
    metadata:
      labels:
        component: server
    spec:
      containers:
        - name: server
          image: image_name
          ports:
            - containerPort: 5000
          env:
            - ... OTHER ENV VARS ...
+           - name: PGPASSWORD # env var name used inside the app logic
+             valueFrom:
+               secretKeyRef:
+                 name: pgpassword # secret name
+                 key: PGPASSWORD # secret key in the 'key=value' pair
```

### Apply `K8s` config files

```powershell
kubectl apply -f ./k8s
```

Then open the web app at [https://localhost](https://localhost) (type `thisisunsafe` when Chrome browser warns untrusted site due to the SSL certificate is not real on the `local` Docker Desktop's Kubernetes environment)

## Stop App

Run the following command to shutdown the entire `K8s` infrastructure built with the `K8s apply` command

```powershell
kubectl delete -f ./k8s
```

## Kubernetes Dashboard

Setup a [Kubernetes Dashboard](https://github.com/kubernetes/dashboard) to help us check the status and logs of all `Pods`, `Services`, `Ingress`, ... running inside our K8s Cluster with a web-based GUI.

```powershell
# Apply config files inside the k8s-dashboard directory to
# - setup a Kubernetes Dashboard (kubernetes-dashboard.yaml)
# - and create a user to login to the Dashboard (dashboard-adminuser.yaml)
kubectl apply -f ./k8s-dashboard
```
