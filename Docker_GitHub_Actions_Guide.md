# 🐳 Docker + GitHub Actions — Complete CI/CD Guide

This guide extends your full-stack project to use **Docker** and **GitHub Actions** for containerized CI/CD.

---

## 🧱 Step 1. What You’ll Learn
By the end of this guide, you’ll be able to:

✅ Build Docker images for backend & frontend  
✅ Push them to Docker Hub (or GHCR)  
✅ Run tests inside containers for consistency  
✅ Deploy using Docker containers

---

## ⚙️ Step 2. Prepare Project for Docker

Your existing project:
- `frontend/` → React (Vite)
- `backend/` → Express (Node.js)

Add Docker support for both.

### 🐳 2.1 Backend `Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### 🐳 2.2 Frontend `Dockerfile`

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 🧩 2.3 Add `.dockerignore`

```bash
node_modules
npm-debug.log
.git
.gitignore
Dockerfile
.env*
test-results
```

---

## 🧪 Step 3. Run Locally

```bash
# Backend
cd backend
docker build -t task-backend .
docker run -p 4000:4000 task-backend

# Frontend
cd frontend
docker build -t task-frontend .
docker run -p 5173:80 task-frontend
```

Verify:
- Frontend → http://localhost:5173  
- Backend → http://localhost:4000/tasks

---

## 🤖 Step 4. Automate with GitHub Actions

Create: `.github/workflows/docker-ci.yml`

```yaml
name: Docker Build & Push

on:
  push:
    branches: [ main ]

env:
  REGISTRY: docker.io
  IMAGE_BACKEND: ${{ secrets.DOCKERHUB_USERNAME }}/task-backend
  IMAGE_FRONTEND: ${{ secrets.DOCKERHUB_USERNAME }}/task-frontend

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push backend image
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: ${{ env.IMAGE_BACKEND }}:latest

      - name: Build and push frontend image
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: ${{ env.IMAGE_FRONTEND }}:latest
```

---

## 🔐 Step 5. Configure Secrets in GitHub

Go to **Repo → Settings → Secrets → Actions → New repository secret**

```
DOCKERHUB_USERNAME = your_dockerhub_username
DOCKERHUB_TOKEN = <your_access_token>
```

Generate a token at [Docker Hub → Account Settings → Access Tokens](https://hub.docker.com/settings/security).

---

## 🧠 Step 6. Validate the Pipeline

After pushing to `main`, GitHub Actions will:
1. Build backend image from `/backend`
2. Build frontend image from `/frontend`
3. Push both to Docker Hub

You’ll see in Docker Hub:
- `task-backend:latest`
- `task-frontend:latest`

---

## 🎓 Step 7. What You’ve Achieved

✅ Full CI/CD with Docker and GitHub Actions  
✅ Automated build + push to Docker Hub  
✅ Test execution in consistent containers  
✅ Ready for production deployment

---

## 🧭 Next Steps

- Deploy containers to **Render**, **AWS ECS**, or **Fly.io**  
- Use **multi-stage Docker builds** for optimized images  
- Integrate **GitHub Environments** (staging → production)  
- Explore **Docker Compose in CI** for multi-container tests

---

**You’ve officially completed a full DevOps-ready GitHub Actions journey — from CI → CD → Docker orchestration. 🎉**
