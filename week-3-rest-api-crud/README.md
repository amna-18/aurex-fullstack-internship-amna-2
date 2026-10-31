# Taskly API – REST API + MongoDB CRUD

**AUREX Full-Stack Internship · Month 2 · Week 3**

A REST API built with **Node.js, Express and MongoDB (Mongoose)** that stores tasks permanently in MongoDB Atlas. Task fields match the React app from Week 1: `text`, `priority`, `dueDate`, `completed`.

🔗 **Live API (optional for Week 3):** _add your Render URL here_

## Folder structure

```
src/
├── config/
│   ├── env.js                 loads + validates .env (fails fast if something is missing)
│   └── db.js                  connects Mongoose to MongoDB Atlas
├── models/Task.js             Mongoose schema + model (the "shape" of a task)
├── controllers/task.controller.js   the logic of each endpoint (create, read, update, delete)
├── routes/task.routes.js      maps URL + HTTP method → controller function
├── middleware/
│   ├── validateObjectId.js    rejects malformed ids with 400
│   ├── notFound.js            404 for unknown routes
│   └── errorHandler.js        ONE place that turns errors into JSON responses
├── utils/                     HttpError, asyncHandler, taskInput (validation + whitelist)
├── app.js                     builds the Express app (middleware + routes)
└── server.js                  connects to the DB, then starts listening
postman/Taskly-Week3.postman_collection.json
```

**Request flow**

```
Client ─► Express app ─► middleware (helmet, cors, logger, JSON parser)
       ─► Route (/api/tasks/:id) ─► validateObjectId ─► Controller ─► Mongoose model ─► MongoDB Atlas
       ◄──────────────────────────── JSON response ◄───────────────┘   (errors → errorHandler)
```

## Setup

### 1. MongoDB Atlas (free tier)
1. Create an account at mongodb.com/atlas → **Create a free cluster (M0)**.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → add your IP (for Render later, add `0.0.0.0/0`).
4. **Database → Connect → Drivers** → copy the connection string.

### 2. Run the API
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# open .env and paste your MONGODB_URI (replace <db_user> and <db_password>)
npm run dev               # http://localhost:5000
```
Open `http://localhost:5000/api/health` – you should see `{"success":true,"status":"ok",...}`.

> 🔒 `.env` is listed in `.gitignore`. **Never commit it**, and never paste your real connection string into README or screenshots.

## Endpoints

Base URL: `http://localhost:5000` · All bodies are JSON.

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/api/health` | API + database status | 200 |
| POST | `/api/tasks` | Create a task | **201** |
| GET | `/api/tasks` | List tasks (newest first). Optional filters: `?completed=true\|false`, `?priority=low\|medium\|high`, `?search=text` | 200 |
| GET | `/api/tasks/:id` | Get one task | 200 |
| PUT | `/api/tasks/:id` | Update a task – send **only** the fields to change | 200 |
| DELETE | `/api/tasks/:id` | Delete a task | 200 |

### Example – create
```http
POST /api/tasks
{ "text": "Finish Week 3", "priority": "high", "dueDate": "2026-10-31" }
```
```json
{
  "success": true,
  "data": {
    "text": "Finish Week 3", "priority": "high", "dueDate": "2026-10-31T00:00:00.000Z",
    "completed": false, "createdAt": "…", "updatedAt": "…", "id": "6710c0f3a1b2c3d4e5f60718"
  }
}
```

### Validation rules
| Field | Rule |
|---|---|
| `text` | required (POST), non-empty after trimming, max 200 characters |
| `priority` | `low`, `medium` (default) or `high` |
| `dueDate` | valid date string like `2026-10-31`; `null` or `""` clears it |
| `completed` | boolean |

Unknown fields (e.g. `_id`) are ignored.

### Status codes & error format
| Code | When |
|---|---|
| 200 / 201 | success / created |
| 400 | validation failed, malformed id, bad query value, invalid JSON |
| 404 | task or route not found |
| 413 | body larger than 10 kb |
| 500 | unexpected server error (details hidden in production) |

```json
{ "success": false, "message": "Task text is required", "errors": ["Task text is required"] }
```

## Database / model

**Collection:** `tasks`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | created by MongoDB (sent to the client as `id`) |
| `text` | String | required, trimmed, ≤ 200 |
| `priority` | String | enum `low\|medium\|high`, default `medium` |
| `dueDate` | Date | optional, default `null` |
| `completed` | Boolean | default `false` |
| `createdAt`, `updatedAt` | Date | added by `timestamps: true` |

## Testing with Postman

1. Postman → **Import** → `postman/Taskly-Week3.postman_collection.json`.
2. Make sure the API is running; the collection variable `baseUrl` is `http://localhost:5000`.
3. Open the collection → **Run** → run all. 25 requests with ~40 automated checks (success cases *and* failing cases such as empty text, bad id, unknown id).
4. Take screenshots of the passing run and of a couple of individual requests for your submission.

## Technologies

Node.js · Express 4 · MongoDB Atlas · Mongoose 8 · dotenv · helmet · cors · morgan · Postman
