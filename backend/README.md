# DocuMind Backend API & Ingestion Engine

High-performance, event-driven Node.js & Express 5 backend for DocuMind. Handles authentication, secure document ingestion, asynchronous parsing, vector indexing with Pinecone, and real-time streaming RAG responses.

---

## 🏗️ Architecture & Core Services

The backend is built around a decoupled, event-driven micro-service pattern within a clean modular structure:

```
backend/src/
├── app/
│   ├── configs/              # Database, Cloudinary, Pinecone, OpenRouter configs
│   ├── controllers/          # Request handling (Document, Chat, Conversation)
│   ├── middlewares/          # Auth guard (requireAuth), Multer file upload
│   ├── models/               # Mongoose schemas (Document, Conversation, Message)
│   ├── routes/               # API route definitions
│   ├── services/             # Core business logic
│   │   ├── ai/               # RAG stream & non-stream pipelines (OpenRouter)
│   │   ├── pinecone/         # Vector indexer & similarity search
│   │   ├── cloudinary.service.ts
│   │   ├── document-chunking.service.ts
│   │   ├── document-download.service.ts
│   │   └── document-extraction.service.ts
│   └── utils/                # ApiError, ApiResponse, GlobalErrorHandler, titleGenerator
├── common/
│   └── envSanitization.ts    # Zod-validated environment schema
├── inngest/                  # Background durable function definitions
│   ├── client.ts
│   ├── functions/processDocument.ts
│   └── index.ts
├── lib/
│   └── auth.ts               # BetterAuth server engine & MongoDB adapter
└── index.ts                  # Server entrypoint (0.0.0.0 binding)
```

---

## 📡 API Endpoint Catalog

### Authentication (`/api/auth/*`)
Handled natively by BetterAuth with session cookie propagation:
- `POST /api/auth/sign-up/email`: Register with email, name, password
- `POST /api/auth/sign-in/email`: Login with email & password
- `POST /api/auth/sign-in/social`: Initiate Google OAuth flow
- `POST /api/auth/sign-out`: Invalidate active session cookie
- `GET /api/auth/get-session`: Retrieve current user profile and session token

### Document Management (`/api/documents`)
*All endpoints require authenticated session cookie (`requireAuth`)*
- `GET /api/documents`: List all uploaded documents for the active user.
- `GET /api/documents/:id`: Fetch document metadata by ID.
- `DELETE /api/documents/:id`: Delete document from MongoDB, purge asset from Cloudinary, and delete associated vector chunks from Pinecone.

### File Upload (`/api/file-upload`)
*Requires authenticated session cookie*
- `POST /api/file-upload`: Multipart upload with Multer (`memoryStorage`). Uploads binary directly to Cloudinary, creates MongoDB document record (`status: PENDING`), and dispatches `documind/document.uploaded` event to Inngest for asynchronous processing.

### Chat & Grounded RAG (`/api/chat`)
*Requires authenticated session cookie*
- `POST /api/chat`: Non-streaming question answering.
- `POST /api/chat/stream`: Real-time streaming response using Server-Sent Events (`text/event-stream`). Retrieves top-$K$ semantic chunks from Pinecone, constructs grounded prompt, and streams LLM tokens back with source citations.

### Conversations & History (`/api/conversations`)
*Requires authenticated session cookie*
- `GET /api/conversations`: List user conversation threads with message previews.
- `GET /api/conversations/:id`: Retrieve conversation detail with message history.
- `DELETE /api/conversations/:id`: Cascade-delete conversation and all related messages.

### Background Tasks (`/api/inngest`)
- `ALL /api/inngest`: Served via `inngest/express`. Handles event dispatching, step executions, and worker heartbeats.

---

## ⚡ Background Processing with Inngest

When a document is uploaded, the HTTP handler returns immediately in under **250ms**. Inngest executes the heavy background processing workflow across durable steps:

1. **`step.run("download-document")`**: Fetches the uploaded document buffer from Cloudinary.
2. **`step.run("extract-text")`**: Parses raw text using `pdf-parse` (for PDF) or `mammoth` (for DOCX).
3. **`step.run("chunk-document")`**: Splits text into 1,000-character semantic chunks with 200-character overlap using LangChain's `RecursiveCharacterTextSplitter`.
4. **`step.run("index-to-pinecone")`**: Generates high-dimensional vector embeddings and upserts them to Pinecone with document metadata (`documentId`, `userId`, `chunkIndex`, `pageNumber`).
5. **`step.run("update-status")`**: Updates MongoDB document status to `INDEXED` (or `FAILED` with error log).

---

## 🛠️ Local Development

```bash
# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Run development server with live reload
pnpm dev

# In a separate terminal, launch Inngest Dev Server
pnpm inngest:dev
```

Inngest Dashboard: [http://localhost:8288](http://localhost:8288)

---

## 🚀 Render Deployment Guide

1. Create a **New Web Service** on [Render](https://render.com).
2. Connect your repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install`
   - **Start Command**: `pnpm start`
4. Set Environment Variables from `backend/.env.example`.
5. Ensure `FRONTEND_URL` is set to your Vercel URL (e.g. `https://documind-ai.vercel.app`) so CORS allows cross-origin browser communication.
