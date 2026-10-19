# Speak Friend and Enter

A chat application for Dungeons & Dragons campaigns, built around a 3D dungeon interface. Players log in to a first-person 3D room, click objects (such as a book) to open 2D menus for their chats, groups, and campaigns, and enter dedicated rooms for each campaign.

## Status

**Early development.** The foundation is in place and working: registration, login, persistent sessions, and an authenticated real-time socket connection, backed by a PostgreSQL schema. Friends and private messaging are in progress. Groups, campaigns, and the full 3D hub are planned.

See the [roadmap](docs/ROADMAP.md) for details.

## Features
**Working now**
- Account registration and login with JWT authentication and bcrypt password hashing
- Protected routes with session persistence across page refreshes, including token expiry checks
- Socket.IO connection authenticated with the user's token
- A first-person 3D entrance scene prototype built with Three.js and React Three Fiber
- Normalized PostgreSQL schema covering users, friends, private/group/campaign messages, campaigns, and more
- Unit tests (Vitest) for the JWT utilities, bcrypt utilities, and auth middleware, run in GitHub Actions

**In progress**
- Friend requests and private messaging

**Planned**
- Groups and campaign chat with role-based permissions (member/admin, player/DM)
- Interactive 3D hub and campaign rooms that open 2D menus
- Dice rolling and character sheets

## Tech stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, React Router, Zustand, Three.js, React Three Fiber |
| Backend | Node.js, Express, Socket.IO |
| Database | PostgreSQL |
| Testing and CI | Vitest, GitHub Actions |

## Architecture

```
React client  <-- REST (axios) + Socket.IO -->  Express server  <-->  PostgreSQL
 (pages, features, 3D scenes)                    (routes -> controllers -> models)
```

- **Frontend:** the 3D scene is a presentation layer only. Chat, friends, and campaigns are ordinary React features rendered as 2D overlays, so the app stays usable without the 3D view.
- **Backend:** a layered Express API. Routes map URLs to controllers, controllers hold the logic, models run the SQL, and middleware handles authentication, validation, and errors. Socket handlers provide real-time events.
- **Database:** a dedicated `speak_friend_app` schema, with constraints enforcing data rules (for example, friendships are stored with the lower user ID first, so each pair exists only once).

## Getting started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL 16 or newer

### 1. Database

Create a database and apply the schema:

```bash
createdb -U postgres speak_friend_db
psql -U postgres -d speak_friend_db -v ON_ERROR_STOP=1 --single-transaction \
  -f backend/db/migrations/001_initial_schema.sql
```

If your PostgreSQL runs on a non-default port, add `-p <port>` to both commands. On Windows PowerShell, put each command on one line instead of using `\`.

### 2. Backend

```bash
cd backend
cp .env.example .env     # then edit .env with your values
npm install
npm run dev
```

The server starts on `http://localhost:3000` and logs a message when it connects to PostgreSQL.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`, create an account, and log in.

## Environment variables

**Backend (`backend/.env`)**

| Variable | Purpose | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `speak_friend_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `change_me` |
| `DB_SCHEMA` | Schema containing the tables | `speak_friend_app` |
| `JWT_SECRET` | Secret used to sign tokens (use a long random string) | `change_me` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend origin, for CORS | `http://localhost:5173` |

**Frontend (`frontend/.env`)**

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_URL` | Backend base URL (no trailing `/api`) | `http://localhost:3000` |

## Running tests

```bash
cd backend && npm test
cd frontend && npm test
```

Tests run automatically in GitHub Actions on every push.

## Project structure

```
SpeakFriend/
├── .github/workflows/       # CI
├── docs/                    # roadmap and supporting documentation
├── backend/
│   ├── db/migrations/       # versioned SQL schema
│   └── src/
│       ├── config/          # database and socket configuration
│       ├── routes/          # URL -> controller mapping
│       ├── controllers/     # request handling and business rules
│       ├── models/          # database queries
│       ├── middleware/      # auth, validation, error handling
│       ├── sockets/         # real-time event handlers
│       └── utils/           # JWT and bcrypt helpers
└── frontend/
    └── src/
        ├── pages/           # one file per route
        ├── features/        # 2D UI grouped by domain (auth, friends, messaging, ...)
        ├── scenes/          # 3D scenes rendered inside the canvas
        ├── actions/         # React Router form actions
        ├── services/        # API calls
        ├── stores/          # global state (Zustand)
        └── utils/           # socket client and helpers
```

## Design decisions

- **Monorepo.** Frontend and backend live in one repository, so a change that spans both is a single commit, and CI covers both.
- **3D as a presentation layer.** The 3D rooms are a front door to normal 2D features. This keeps the features testable and accessible, and lets the app fall back to a 2D mode on weaker devices.
- **JWT stored in `localStorage`.** This is simple and common for single-page apps, but it is readable by any injected script. An httpOnly cookie is safer and is a possible future change.
- **Server-side permissions.** Access rules (who can read a campaign channel, who can act as DM) are enforced in the API, never only in the UI.
- **Soft deletes on messages.** Messages carry `is_deleted` and `edited_at` flags instead of being removed, which preserves conversation history.

## Known limitations

- No refresh tokens or server-side token revocation. A token stays valid until it expires.
- After a page refresh, the full user profile (email, date of birth) is not reloaded; only the data stored in the token is available.
- Several tables in the schema (maps, tokens, calls, live sessions) are ahead of the application code and are not used yet.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).

## License

MIT. See [LICENSE](LICENSE).