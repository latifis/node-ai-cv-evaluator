# AI CV Evaluator

## Overview

This backend service automates the initial screening of job applications.

It evaluates candidate CVs and project reports against a job description and case study brief, producing structured, AI-generated evaluation results.

### Key features:

* File upload and storage (CV & project report PDFs)
* Asynchronous AI evaluation pipeline with Redis queue
* Vector retrieval (RAG) and LLM chaining for scoring
* Structured, reproducible results with CV match rate, project score, and overall summary

---

## 🛠️ Tech Stack

* **Node.js + TypeScript**
* **Express.js** for REST API
* **Prisma** as ORM with PostgreSQL / SQLite
* **Redis** for job queue management
* **ioredis** for Redis client
* **pdf-parse** for PDF parsing
* **OpenAI / GPT-based LLM** for evaluation
* **Vector DB (Chroma / Qdrant)** for document embeddings

---

## 🚀 Installation

1.  **Clone repo:**
    ```bash
    git clone <repo-url>
    cd node-ai-cv-evaluator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup `.env` file:**
    Create a `.env` file in the root and add the following:
    ```env
    PORT=3000
    REDIS_URL=redis://localhost:6379
    DATABASE_URL="file:./dev.db" # or your PostgreSQL URL
    OPENAI_API_KEY=your_openai_key
    ```

4.  **Run Prisma migrations:**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Start Redis:**
    Start Redis (or Memurai) locally on `localhost:6379`.

6.  **Run the server:**
    ```bash
    npm run dev
    ```

7.  **Start background worker (in a separate terminal):**
    (This is needed to process evaluation jobs from the queue)
    ```bash
    ts-node-dev src/modules/evaluation/evaluation.worker.ts
    ```

---

## 🧭 API Endpoints

### 1. POST /api/upload

Upload candidate CV & project report PDFs.

* **Request:** `multipart/form-data`
    * `cv` → PDF file
    * `report` → PDF file

* **Response:**
    ```json
    {
      "success": true,
      "data": {
        "cv": { "id": "...", "filename": "...", "path": "...", "size": 12345 },
        "report": { "id": "...", "filename": "...", "path": "...", "size": 12345 }
      }
    }
    ```

### 2. POST /api/evaluate

Trigger asynchronous AI evaluation pipeline.

* **Request Body:** (JSON)
    ```json
    {
      "jobTitle": "Backend Developer",
      "cvId": "<cv-id-from-upload>",
      "reportId": "<report-id-from-upload>"
    }
    ```

* **Response:**
    ```json
    {
      "id": "5c11085c-8504-4abb-bfba-9c7e3bce8949",
      "status": "queued"
    }
    ```

### 3. GET /api/result/{id}

Retrieve evaluation status and results.

* **Response (While queued/processing):**
    ```json
    {
      "id": "5c11085c-8504-4abb-bfba-9c7e3bce8949",
      "status": "queued"
    }
    ```

* **Response (Once completed):**
    ```json
    {
      "id": "5c11085c-8504-4abb-bfba-9c7e3bce8949",
      "status": "completed",
      "result": {
        "cv_match_rate": 0.82,
        "cv_feedback": "Strong in backend and cloud, limited AI integration experience...",
        "project_score": 4.5,
        "project_feedback": "Meets prompt chaining requirements...",
        "overall_summary": "Good candidate fit, would benefit from deeper RAG knowledge..."
      }
    }
    ```

---

## 📜 Workflow

1.  Upload CV & project report $\to$ receive file IDs
2.  Trigger evaluation $\to$ get job ID (status: `queued`)
3.  Background worker picks job from Redis queue $\to$ parses PDFs $\to$ calls LLM $\to$ updates DB $\to$ sets status to `completed`
4.  Poll `/api/result/{id}` to retrieve evaluation scores & feedback

---

## 🧪 Testing

Example using `curl`:

```bash
# 1. Upload files
# (This response will give you the cvId and reportId)
curl -X POST http://localhost:3000/api/upload \
-F "cv=@C:/Dev/sample-cv.pdf" \
-F "report=@C:/Dev/sample-report.pdf"

# 2. Trigger evaluation
# (Replace <cv-id> and <report-id> with IDs from step 1)
# (This response will give you the <job-id>)
curl -X POST http://localhost:3000/api/evaluate \
-H "Content-Type: application/json" \
-d '{"jobTitle":"Backend Developer","cvId":"<cv-id>","reportId":"<report-id>"}'

# 3. Check result
# (Replace <job-id> with the ID from step 2. Poll this endpoint until status is "completed")
curl http://localhost:3000/api/result/<job-id>