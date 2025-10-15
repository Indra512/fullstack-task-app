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
| Deployment | Render (Frontend & Backend) |

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
        ├── deploy-frontend.yml
        └── deploy-backend.yml
```

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/fullstack-task-app.git
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

### 🧩 Frontend Deployment Workflow: `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy-Frontend

on:
  workflow_run:
    workflows: ["Unit And E2E Tests"]
    types: [completed]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    env:
      VITE_API_URL: https://your-backend.onrender.com

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm ci
      - run: npm run build

      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1
        with:
          service-id: ${{ secrets.RENDER_FRONTEND_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

---

### 🧩 Backend Deployment Workflow: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy-Backend

on:
  workflow_run:
    workflows: ["Unit And E2E Tests"]
    types: [completed]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy Backend to Render
        uses: johnbeynon/render-deploy-action@v1
        with:
          service-id: ${{ secrets.RENDER_BACKEND_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

---

## 🔒 Secrets in GitHub
Set these under:  
**Repo → Settings → Secrets and variables → Actions**

| Secret Name | Description |
|--------------|-------------|
| `RENDER_API_KEY` | Render API key |
| `RENDER_BACKEND_SERVICE_ID` | Backend service ID from Render |
| `RENDER_FRONTEND_SERVICE_ID` | Frontend service ID from Render |

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

- 🐳 Add **Docker Compose** for unified local setup  
- ☁️ Add database (MongoDB / PostgreSQL)  
- 🧩 Add GitHub Pages deployment for static frontend  
- 🧪 Add visual regression tests (Playwright + Percy)  
- 🔔 Add Slack notifications for build/deploy status  

---

## 📜 License
MIT License © 2025 — [Indra Prajapati]
