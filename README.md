# DocumentEditor (Notepad)

Minimal black-and-white notepad-style editor.

## Stack

- Server: Express + Mongoose (TypeScript)
- Client: React + Vite (TypeScript)

## Setup

1) Server
- Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your friend's URI
- Install deps: `npm --prefix server install`
- Run dev: `npm --prefix server run dev`
- Server default: http://localhost:4010

2) Client
- Install deps: `npm --prefix client install`
- Run dev: `npm --prefix client run dev`
- Client default: http://localhost:5185
- The client uses `VITE_API_URL` if set; otherwise it calls `http://localhost:4010`

## API
- GET    /api/notes
- POST   /api/notes  { title, content }
- GET    /api/notes/:id
- PUT    /api/notes/:id  { title, content }
- DELETE /api/notes/:id

