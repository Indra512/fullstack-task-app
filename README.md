# 🧩 Full-Stack Task App — CI/CD with GitHub Actions

## 📘 Overview

This project is a **learning-focused full-stack application** built to understand **GitHub Actions CI/CD pipelines** from scratch — including unit, integration, and end-to-end (E2E) testing with automated deployment.

### 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Testing | Jest, React Testing Library, Supertest, Playwright |
| CI/CD | GitHub Actions |
| Deployment Frontend | Github Pages |
| Deployment Backend | Render |

---

## ⚙️ Project Structure

```
fullstack-task-app/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── tests/
│   └── test-results/
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── config.js
│   └── tests/
│
├── e2e/
│   ├── playwright.config.js
│   ├── tests/
│   └── test-results/
│
└── .github/
    └── workflows/
        ├── unit-e2e-ci.yml
        ├── frontend-cd.yml
        └── backend-cd.yml
```

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/Indra512/fullstack-task-app.git
cd fullstack-task-app
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

#### Run locally:
```bash
npm run dev
```

Backend runs by default on:  
📡 `http://localhost:4000`

#### Environment variables (`.env`)
```
PORT=4000
RESET_DB=true
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

#### Environment files
- `.env.development`
  ```
  VITE_API_URL=http://localhost:4000
  ```

- `.env.production`
  ```
  VITE_API_URL=https://your-backend.onrender.com
  ```

#### Run locally:
```bash
npm run dev
```

Frontend runs on:  
🌐 `http://localhost:5173`

---

## 🧪 Testing Strategy

### 1. Backend Unit & Integration Tests
- Framework: **Jest + Supertest**
- Tests API endpoints (`/tasks` CRUD)

Run:
```bash
cd backend
npm test
```

---

### 2. Frontend Unit Tests
- Framework: **Jest + React Testing Library**
- Tests UI components and user interactions

Run:
```bash
cd frontend
npm test
```

---

### 3. End-to-End (E2E) Tests
- Framework: **Playwright**
- Tests full app workflow from UI to API

Run:
```bash
cd e2e
npx playwright test
```

🧹 To ensure a clean DB for E2E tests:
```bash
RESET_DB=true npm run dev
```

---

## ⚙️ Continuous Integration (CI)

### CI Workflow: `.github/workflows/unit-e2e-ci.yml`
Runs **backend**, **frontend**, and **E2E** tests automatically.

#### Trigger:
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

#### Jobs:
1. **Backend Tests**
2. **Frontend Tests**
3. **E2E Tests** (runs only after both backend + frontend pass)

#### Key Features:
- Uploads test artifacts (Jest + Playwright results)
- Waits for local servers (`wait-on`)
- Sets environment vars for Playwright (`VITE_API_URL`)
- Uses `RESET_DB=true` to start with empty DB

✅ **Artifacts stored:**  
- `backend/test-results/**`  
- `frontend/test-results/**`  
- `e2e/test-results/playwright/**`

---

## 🚢 Continuous Deployment (CD)

### Goal
Deploy automatically **only after all CI jobs pass successfully**.

This is done via the `workflow_run` event.

---

### 🧩 Frontend Deployment Workflow: `.github/workflows/frontend-cd.yml`

```yaml
name: Deploy Frontend to Github Pages

on:
  workflow_run:
    workflows: ["Unit And E2E Tests"]
    types:
      - completed

env:
    VITE_API_URL: https://fullstack-task-app.onrender.com
    VITE_DEPLOY_ENV: gh-pages

jobs:
  deploy-frontend:
    if: ${{ github.event.workflow_run.conclusion == 'success' }} # ✅ only if CI succeeded
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build

      - name: Deploy to Github Pages
        uses: peaceiris/actions-gh-pages@v4
        with: 
          github_token: ${{ secrets.TOKEN }}
          publish_dir: frontend/dist
```

---

### 🧩 Backend Deployment Workflow: `.github/workflows/backend-cd.yml`

```yaml
name: Deploy Backend to Render

on:
  workflow_run:
    workflows: ["Unit And E2E Tests"]
    types:
      - completed

jobs:
  deploy-backend:
    if: ${{ github.event.workflow_run.conclusion == 'success' }} # ✅ only if CI succeeded
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render deploy
        run: |
          echo "Triggering Render deploy for backend..."
          curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
            -H "Content-Type: application/json"
```

---

## 🔒 Secrets in GitHub
Set these under:  
**Repo → Settings → Secrets and variables → Actions**

| Secret Name | Description |
|--------------|-------------|
| `RENDER_API_KEY` | Render API key |

---

## 🔍 Troubleshooting Log

| Issue | Cause | Fix |
|-------|--------|-----|
| **CORS error (localhost)** | Backend missing headers | Added `app.use(cors())` |
| **E2E artifact upload failed** | Wrong path in upload step | Fixed with correct `e2e/test-results/playwright/**` |
| **CI failing (missing env)** | `VITE_API_URL` not set | Added `env:` section in workflow |
| **workflow_run not triggered** | Special chars in workflow name | Renamed to simple `CI-Pipeline-Unit-E2E` |
| **YAML syntax error** | Colon `:` in unquoted string | Quoted names properly |
| **White screen on deploy** | Using local `.env` values | Added correct Render API URL in `.env.production` |

---

## 🧭 Future Enhancements
  
- ☁️ Add database (MongoDB / PostgreSQL)  
- 🧪 Add visual regression tests (Playwright + Percy)  
- 🔔 Add Slack notifications for build/deploy status  

---

## 📜 License
MIT License © 2025 — [Indra Prajapati]
