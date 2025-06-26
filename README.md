# User Feedback System

Simple feedback app with React frontend and Node/Express backend.

## Features
- Submit feedback (Bug, Feature, Suggestion, General)
- Admin dashboard to view, filter, and update feedback
- REST API with search, filter, sort, pagination
- Stats and status update for each feedback

## Tech Stack
- Frontend: React + Tailwind + TypeScript
- Backend: Node.js + Express + MongoDB/PostgreSQL

## Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## API (Backend)
- POST /api/feedback → submit feedback
- GET /api/feedback → get all (with filters)
- GET /api/feedback/:id → get by ID
- PUT /api/feedback/:id/status → update status
- DELETE /api/feedback/:id → delete
- GET /api/feedback/stats → get stats

## .env (backend)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/feedback-system
CORS_ORIGIN=http://localhost:5173
```
