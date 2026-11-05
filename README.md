# Inkwell — Full-stack blog starter

A clean Next.js App Router blog with a MongoDB/Mongoose data layer, MVC-style API organization, JWT cookie authentication, nested discussions, reactions, and share links.

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas

## Setup
1. Extract the ZIP and open this folder in VS Code.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `MONGODB_URI`, a long random `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL`.
5. Run `npm run dev`, then open the local URL printed in your terminal (port 3000 by default).

## MVC organization
- `src/models`: Mongoose schemas and persistence models.
- `src/controllers`: request orchestration and business logic.
- `src/lib`: database connection, auth, API helpers and utilities.
- `src/app/api`: Next.js route handlers (the HTTP routing layer).
- `src/components`: reusable UI.
- `src/app`: pages and layouts.

Next.js Route Handlers are used as the backend transport layer; controllers contain the application logic. This is an MVC-inspired structure suited to a single Next.js codebase.

## Included
- Register, login, logout, current-user endpoint.
- Create, edit, delete, list, search and read posts; personal library for your own and liked stories.
- Author-only post mutations.
- Blog likes and nested comments/replies.
- Comment likes.
- WhatsApp, Facebook, X and native share/copy link actions.
- Dark/light theme persistence.
- Responsive layout and subtle Framer Motion transitions.

## Important production work
This is a clean, runnable starter, not a fully hardened production deployment. Before launch:
- Add email verification, password reset, rate limiting and CAPTCHA.
- Add an image storage provider (Cloudinary/S3); current post editor accepts an image URL.
- Add moderation/reporting, pagination limits and audit logging.
- Configure HTTPS, secure environment secrets, MongoDB backups and deployment settings.
- Add automated tests and a rich-text editor if needed.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/posts?q=&category=&page=`, `POST /api/posts`
- `GET /api/posts/:id`, `PATCH /api/posts/:id`, `DELETE /api/posts/:id`
- `POST /api/posts/:id/like`
- `GET /api/posts/:id/comments`, `POST /api/posts/:id/comments`
- `POST /api/comments/:commentId/like`
- `DELETE /api/comments/:commentId`

Comments are stored as flat documents with `parentId`; the UI renders them recursively. This avoids deeply embedded MongoDB arrays and makes moderation and indexing easier.
