# Run Fibonacci Client App with Kubernetes

This directory contains `K8s` `Pod Deployment` and `Networking Service` config files that are to run the [client](../client) app as a container inside a `K8s Pod` while exposing port `31515` to the outside world (the local browsers can use this port to open the app)

```powershell
# Load and apply config specified in two files
simplek8s:~$ kubectl apply -f client-pod.yaml
simplek8s:~$ kubectl apply -f client-node-port.yaml

# Check if pod was created
kubectl get pods

# Check if service was created
kubectl get services

# Check logs of the pod created
kubectl logs <pod-name>
# E.g. kubectl logs client-pod

# Then open the client app
http://localhost:31515/
```
