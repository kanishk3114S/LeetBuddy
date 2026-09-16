# LeetBuddy

LeetBuddy is a full-stack application with an Express/MongoDB authentication API and a React + Vite frontend.

## Project layout

- `Backend/` — Express API, Mongoose models, and JWT authentication.
- `Frontend/frontend/` — React frontend built with Vite and Tailwind CSS.
- `PRD.md` — product requirements document.

## Setup

Requirements: Node.js 20+ and a MongoDB database.

1. Install backend packages: `cd Backend; npm install`
2. Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URI` and `JWT_SECRET`.
3. Install frontend packages: `cd Frontend/frontend; npm install`
4. Run the frontend: `npm run dev`

The backend package currently expects a `server.js` entry point for `npm run dev`; add or restore that entry point before starting the API.

## Environment variables

`Backend/.env` is deliberately ignored by Git. Keep real credentials only in that local file or in your deployment provider's secret manager. `Backend/.env.example` is the shareable template.

## Git workflow

Before pushing future work, run `git status`, review changes, then use:

```powershell
git add <files>
git commit -m "Describe the change"
git push
```
