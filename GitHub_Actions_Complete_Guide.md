# 🧭 GitHub Actions Complete Guide for Test Automation Engineers

This guide takes you from zero to advanced in **GitHub Actions**, using your **Full‑Stack Task App** (Node.js + React + Playwright) as the core project example.  
You’ll learn how to automate CI/CD, integrate Docker, manage environments, and master every YAML keyword in Actions.

---

## 1. 🧭 Introduction

### Why GitHub Actions?
GitHub Actions is a CI/CD platform built directly into GitHub that allows you to automate your testing, integration, and deployment pipelines whenever code changes occur.

As a **Test Automation Engineer**, mastering GitHub Actions means you can:
- Automatically run your **unit, integration, and end‑to‑end tests** on every commit.
- Build consistent **CI/CD pipelines** for web apps, APIs, and test suites.
- Deploy your apps automatically after successful test runs.
- Run tests in Dockerized environments to simulate production conditions.

---

## 2. 🧩 Core Concepts of GitHub Actions

### Workflow
A **workflow** is an automated process defined by a `.yml` file in the `.github/workflows/` directory.

### Job
A **job** is a set of steps that run in the same runner. Jobs run in parallel by default, but can depend on others via `needs:`.

### Step
A **step** is a single task within a job. It can either:
- Use a predefined **action** (`uses:`)
- Or execute shell commands (`run:`).

### Runner
A **runner** is a machine (hosted or self‑hosted) that executes your workflow jobs.

### Event (Trigger)
Defines **when** a workflow runs — for example, `push`, `pull_request`, or `workflow_run`.

### Contexts & Expressions
Provide metadata and variables, accessed via `${{ }}` syntax, like `${{ github.actor }}` or `${{ secrets.MY_TOKEN }}`.

---

## 3. ⚙️ YAML Keywords & Syntax Reference

| Keyword | Description | Example |
|----------|--------------|----------|
| `name` | Name of the workflow or job | `name: CI Pipeline` |
| `on` | Defines the trigger event(s) | `on: [push, pull_request]` |
| `workflow_dispatch` | Manual trigger | `on: workflow_dispatch` |
| `workflow_run` | Triggered after another workflow | `on: workflow_run: workflows: ["CI"] types: [completed]` |
| `schedule` | CRON scheduling | `on: schedule: - cron: '0 3 * * *'` |
| `jobs` | Defines job(s) inside a workflow | `jobs: build: runs-on: ubuntu-latest` |
| `needs` | Creates job dependency | `needs: [test]` |
| `if` | Conditional execution | `if: ${{ success() }}` |
| `runs-on` | Runner type | `runs-on: ubuntu-latest` |
| `steps` | Steps to run in a job | — |
| `uses` | Use a GitHub Action | `uses: actions/checkout@v4` |
| `run` | Run shell commands | `run: npm test` |
| `env` | Define environment variables | `env: NODE_ENV: test` |
| `with` | Pass inputs to actions | `with: node-version: 18` |
| `continue-on-error` | Prevent workflow from failing | `continue-on-error: true` |
| `timeout-minutes` | Max job runtime | `timeout-minutes: 15` |
| `strategy` | Define build/test matrix | `strategy: matrix: node: [16,18,20]` |
| `matrix` | Used for multiple OS/node versions | — |
| `permissions` | Define token access scope | `permissions: contents: read` |
| `concurrency` | Cancel previous runs | `concurrency: ci-${{ github.ref }}` |
| `secrets` | Access secure variables | `${{ secrets.RENDER_TOKEN }}` |
| `services` | Run side containers (e.g., DB) | `services: db: image: postgres:latest` |
| `container` | Run job inside container | `container: node:18` |
| `actions/cache` | Cache dependencies | `uses: actions/cache@v4` |
| `actions/upload-artifact` | Upload test results | `uses: actions/upload-artifact@v4` |
| `actions/download-artifact` | Retrieve artifacts | — |

---

## 4. 🧱 Full‑Stack Project Overview

**Backend:** Node.js + Express + Jest + Supertest  
**Frontend:** React (Vite) + Jest + React Testing Library  
**E2E:** Playwright  

You structured it as:
```
fullstack-task-app/
├── backend/
├── frontend/
├── e2e/
└── .github/workflows/
```

---

## 5. 🧪 Continuous Integration (CI)

### Full CI Pipeline
Below is your main CI workflow file — simplified and annotated.

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  CI: true

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npm test
      - uses: actions/upload-artifact@v4
        with:
          name: backend-results
          path: backend/test-results/**
```

(Frontend + E2E jobs continue as before...)

---

## 6. 🚀 Continuous Deployment (CD)

Triggered after CI passes successfully using `workflow_run`.

```yaml
name: CD Pipeline

on:
  workflow_run:
    workflows: ["CI Pipeline"]
    types: [completed]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        env:
          RENDER_TOKEN: ${{ secrets.RENDER_TOKEN }}
        run: echo "Triggering Render deploy..."
```

---

## 7. 🐳 Docker + GitHub Actions

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### Docker CI Workflow
```yaml
name: Docker Build & Push
on: [push]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USER }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.DOCKERHUB_USER }}/task-app:latest
```

---

## 8. 🔐 Secrets, Artifacts, & Environment Variables

Store secrets in your repo → **Settings → Secrets → Actions**.  
Access via `${{ secrets.NAME }}` in YAML.  
Upload artifacts for debugging and logs.

---

## 9. 🧰 Debugging & Best Practices

- Use `ACTIONS_STEP_DEBUG=true` for detailed logs.  
- Always cache dependencies for speed.  
- Separate CI/CD into distinct workflows.  
- Use `if: always()` for artifact uploads.  
- Keep workflows readable and modular.

---

## 10. 📊 CI/CD Flow Diagram

```text
Push → Backend Tests → Frontend Tests → E2E → CD Deploy
```

---

## 11. 🧾 Glossary of Key Terms

| Term | Meaning |
|------|----------|
| Workflow | Automated process in GitHub Actions |
| Job | A group of steps executed on a runner |
| Step | A single command or action |
| Runner | The machine executing jobs |
| Artifact | Stored test results or files |
| Secret | Encrypted environment variable |
| Cache | Dependency reuse for speed |
| Matrix | Parallel strategy |
| Context | Metadata available in `${{ }}` |
| Event | Trigger like push or PR |

---

## ✅ Conclusion

You now have mastered GitHub Actions from **CI to CD to Docker** — with all YAML concepts, triggers, and best practices.  
Perfect for test automation pipelines integrating Playwright, Jest, or Cucumber frameworks.

---

**Author:** Indra Prajapati
