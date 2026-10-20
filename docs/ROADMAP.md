# Roadmap

Speak Friend and Enter is a DND chat app with a 3D dungeon interface. This roadmap tracks what is built and what comes next.

**Guiding principles**

1. The 3D scene is a presentation layer. Chat, friends, groups, and campaigns are normal React features that work without it.
2. Permissions are enforced on the server, never only in the UI.
3. Private, group, and campaign messages share one shape, so the chat components and models are generic and take a `scope`.

Legend: `[x]` done, `[ ]` planned.

## Phase 0: Foundation

**Frontend**
- [x] Clean up placeholder files and rename pages
- [x] Central `router.jsx` using `react-router`
- [x] Auth fixes: store owns token persistence, expiry validation, socket reconnect on refresh, separate login and network error handling, global 401 handling
- [x] Logout action and route
- [x] Move `ProtectedRoute` and profile components into `features/`
- [x] Reload the full user profile after a page refresh

**Backend**
- [x] Layered structure (routes, controllers, models, middleware, sockets, utils)
- [x] Unit tests for JWT, bcrypt, and auth middleware, run in CI
- [x] Split `app.js` from `server.js`
- [x] Central error-handling middleware
- [x] ESLint and Prettier

**Database**
- [x] Initial schema (`backend/db/migrations/001_initial_schema.sql`)
- [x] Schema applied and connected to the backend
- [ ] Seed script with demo data
- [ ] Additional lookup indexes

## Phase 1: Auth, friends, and private messaging

- [x] Registration and login with JWT and bcrypt
- [ ] Input validation and rate limiting on auth routes
- [ ] Integration tests for register and login
- [ ] Friend requests: send, accept, decline, block, remove
- [ ] Friends list with online status
- [ ] Real-time private messaging with history, read state, and typing indicator
- [ ] Tests for friend and message flows

## Phase 2: Groups

- [ ] Group CRUD with member and admin roles
- [ ] Membership and role middleware
- [ ] Group messaging in real time, with history
- [ ] Generic chat components shared by private, group, and campaign chat
- [ ] Permission tests

## Phase 3: Campaigns

- [ ] Campaigns attached to groups, with player and DM roles
- [ ] DM-only actions enforced on the server
- [ ] Campaign messaging in real time
- [ ] Message reactions and attachments, shared across all message types

## Phase 4: Scene architecture

- [ ] Shared canvas, room shell, and reusable interactable component
- [ ] UI store connecting 3D clicks to 2D overlays
- [ ] Pointer lock released when menus open and restored when they close
- [ ] Tabbed overlay menu

## Phase 5: 3D hub room

- [ ] Hub room with an interactive book that opens the menu
- [ ] Tabs for chats, groups, campaigns, and friends
- [ ] Door leading into campaign rooms

## Phase 6: Campaign rooms

- [ ] Campaign room scene with a notice board and chat access
- [ ] Real-time presence (who is in the room)
- [ ] Optional avatars for other members

## Phase 7: DND features

- [ ] Server-side dice rolling with shared results
- [ ] Character sheets
- [ ] Dice history in campaign chat

## Phase 8: Polish and performance

- [ ] Real 3D models with compression, loading screen, and performance tuning
- [ ] Touch controls and responsive layouts
- [ ] 2D fallback mode
- [ ] Accessibility pass

## Phase 9: Deployment

- [ ] Docker Compose for local setup
- [ ] Hosted frontend, backend, and database
- [ ] Frontend tests and migration checks in CI
- [ ] Live demo link

## Future: virtual tabletop

The schema already includes tables for these features. Each is substantial, so they come after the core app works.

- [ ] Campaign notes and files with public/private visibility
- [ ] Maps with tokens and annotations, synchronized in real time
- [ ] Live sessions with DM-controlled map order
- [ ] Voice and video calls
