# Kubernetes Cheatsheet

## Object Types

| Object Type | Purpose |
|-------------|---------|
| `Pod` | Runs one or more closely related containers |
| `Service` | Sets up networking in a `K8s Cluster`. 4 types of service: `ClusterIP` (exposes a set of pods to other objects in the cluster), `NodePort` (exposes a set of pods to outside world - only good for dev purposes), `LoadBalancer` (legacy way of getting network traffic into a cluster), `Ingress` (exposes a set of services to the outside world) |
| `Deployment` | Maintains a set of identical pods, ensuring that they have the correct config and that the right number exists |
| `Secrets` | Securely stores a pice of information in the cluster, such as a database password |

## Basics

### Apply configuration files

```powershell
# Apply a configuration file
kubectl apply -f <config-file>

# Apply all configuration files inside a directory
kubectl apply -f <directory_path>
```

### Update running object with the `K8s set` command line

```powershell
kubectl set <property> <object_type>/<object_name> <container_name>=<new_value>

# Where
# <property> is the name of the property to which we want
#     to change its value
# <object_type> is the type of the K8s object
#     (same value as specified in the '.kind' property.
#     E.g., 'kind: Deployment', 'kind: Service', ...)
# <object_name> is the name of the K8s object (same value as defined
#     in the '.metadata.name' property)
# <container_name> is the name of the container we are updating
#     (get this from config file
#     e.g., '.spec.template.spec.containers.name')
# <new_value> is the new value we want to set for the <property>

# Example: updating Docker image of a running Pod that has container running inside
kubectl set image deployment/<object_name> <container_name>=<new_image_to_use>
kubectl set image deployment/client-deployment client=hoangtrx/fibonacci_client:v1
```

### Fetch a list of objects

```powershell
# Get a list of running pods
kubectl get pods

kubectl get pods -o wide

# Get a list of running deployments
kubectl get deployments

# Get a list of running services
kubectl get services
```

### Get logs inside pods

```powershell
kubectl logs <pod-name>
```

### Get detailed information about an object

```powershell
kubectl describe <object type> <object name>
# <object type> specifies the type of K8s object we want to get information about
# <object name> is the name of the object we want to get information
```

### Delete running objects

```powershell
# Delete K8s objects based on config files e.g., pod.yaml, deployment.yaml, service.yaml
kubectl delete -f <config file>

# Delete all K8s objects defined in config files that are placed in a directory
kubectl delete -f <path of dir containing config files>

# Delete object directly via commands
kubectl delete <object type/kind> <object name>
# E.g., kubectl delete pod client-pod
```

### Open a shell inside a Docker running inside a pod

```powershell
kubectl exec -it <pod_name> -- sh
```

## Volume in Kubernetes

| Type/Kind | Description |
|-----------|-------------|
| Volume | **Not exactly the same thing as a Docker volume**. Common file system inside a `K8s Pod`. Survives and can be used as a common storage among `Container`s inside the same `Pod` but will be deleted whenever the `Pod` is terminated/restarted. So not ideal for storing databases' data |
| Persistent Volume | Common file system storage in the `host local machine` and are separate from the `K8s Pod`s. Ideal for persisting data even when `Pod`s or `Container`s are terminated/restarted |
| Persistent Volume Claim | A *billboard* advertising different `Persistent Volume` options that `Pod`s can use |

```powershell
# To list all Persistent Volumes
kubectl get pv

# To list all Persisten Volume Claims
kubectl get pvc

# To get all options that `K8s` can have and use it to create `Persistent Volume`s
kubectl get storageclass

# Get basic information about the storageclass option
kubectl describe storageclass
```

See [database-persistent-volume-claim.yaml](./04-fibonacci-k8s/k8s/database-persistent-volume-claim.yaml) for an example of `K8s Persistent Volume Claim` config. And see [postgres-deployment.yaml](./04-fibonacci-k8s/k8s/postgres-deployment.yaml) for an example of how the `K8s Persistent Volume` is configed for a `Deployment` running `Postgres` DB.

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      component: postgres
  template:
    metadata:
      labels:
        component: postgres
    spec:
+     volumes:
+       - name: postgres-storage
+         persistentVolumeClaim:
+           # claimName is defined in database-persistent-volume-claim.yaml file
+           claimName: database-persistent-volume-claim
      containers:
        - name: postgres
          image: postgres
          ports:
            - containerPort: 5432 # default port of postgres is 5432
+         volumeMounts:
+           - name: postgres-storage # same name as the above spec.volumes[0].name
+             # the location PostgresSQL saves its data will be
+             # mounted to the persistent volume
+             mountPath: /var/lib/postgresql/data
+             # all data saved in mountPath is saved in 'postgres'
+             # inside the Persistent Volume
+             subPath: postgres
```

## Environment Variables

### Normal environment variables

To define environment variables, add an `env` entry under `.spec.template.spec.containers[index]` like below

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
          image: hoangtrx/fibonacci_server
          ports:
            - containerPort: 5000
+         env:
+           - name: REDIS_HOST
+             value: redis-cluster-ip-service
+           - name: REDIS_PORT
+             value: 6379
+           - name: PGUSER
+             value: postgres
+           - name: PGHOST
+             value: postgres-cluster-ip-service
+           - name: PGPORT
+             value: 5432
+           - name: PGDATABASE
+             value: postgres
```

### Secret environment variables

Sometimes we need to provide a secret `password`, or an `API key` that will be used inside the app logic. We don't want to write down the `password` or `API key` to a config file. Instead, we use a `K8s create secret` command to create secret environment variables and pass them to different pods:

```powershell
kubectl create secret generic <scret_name> --from-literal key=value
# where
#   'create' is an imperative command to create a new object
#   'secret' type of object we are going to create
#   'generic' type of secret
#       (other secret types include 'docker-registry', 'tls' (https setup))
#   '<scret_name>' name of secret for later reference in pod config
#   '--from-literal' we are going to add the secret information
#       into this command, as opposed to from file
#   'key=value' key-value pair of the secret information

# Example
# Create a secret containing the password that will be used to connect to the PostgreSQL DB
kubectl create secret generic pgpassword --from-literal PGPASSWORD=1234asdf
```

```powershell
# List out secrets created
kubectl get secrets
```

Then referce to that secret inside a `K8s Deployment` like below

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
+           - name: PGPASSWORD
+             valueFrom:
+               secretKeyRef:
+                 name: pgpassword
+                 key: PGPASSWORD
```

## Ingress

To handle traffic comming from the world outside `K8s Cluster`, we use `Ingress service` with an `Ingress controller` called [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx). There is also another `Ingress controller` with the same name and uses the same `Nginx` - its source code repose can be found [here](https://github.com/nginxinc/kubernetes-ingress).

To set up an [`NGINX Ingress Controller`](https://kubernetes.github.io/ingress-nginx/) using the following command

```powershell
# Note that the version 'v0.48.1' changes over time.
# Check https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop
# for the latest version
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.48.1/deploy/static/provider/cloud/deploy.yaml

# Then view the list of running NGINX ingress services
kubectl get svc -n ingress-nginx
kubectl get pods -n ingress-nginx
```

## Kubernetes Dashboard

[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) is a web-based GUI for `K8s Cluster`s. `K8s Dashboard` can help us check the status and logs of all `Pods`, `Services`, `Ingress`, ... running inside our K8s Cluster with a web-based GUI. See the [Github link](https://github.com/kubernetes/dashboard#install) for instructions on how to install a `K8s Dashboard`.

To skip the authentication when accessing the K8s Dashboard:

* Download the Dashboard config file locally so we can edit it. The URL for downloading the config file is in the K8s apply command in the ['Install' section](https://github.com/kubernetes/dashboard#install).

* Open up the downloaded file in a code editor and use CMD+F or CTL+F to find the args. Add the following two lines underneath `--auto-generate-certificates`:

    ```yml
    args:
      - --auto-generate-certificates
      - --enable-skip-login
      - --disable-settings-authorizer
    ```

* Apply the config file

    ```powershell
    kubectl apply -f kubernetes-dashboard.yaml
    ```

* Start the server by running the following command

    ```powershell
    kubectl proxy
    ```

* Access the dashboard by visiting

    ```powershell
    http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
    ```

* Click the `SKIP` link next to the `SIGN IN` button to bypass the authentication step

* NOTE: The only reason we are bypassing RBAC Authorization to access the `Kubernetes Dashboard` is that we are running our cluster locally. Never do this on a public-facing server like Digital Ocean and should refer to the official docs to get the dashboard set up.
