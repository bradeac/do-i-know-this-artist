# Do I Know This Artist? v2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild "Do I Know This Artist?" from scratch — search YouTube playlists by artist/track name, with a backend proxy for API key security.

**Architecture:** Two-container setup. Express backend proxies YouTube API calls (holds API key). React frontend handles Google auth and UI. MusicProvider interface makes adding Spotify/others easy later.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, Express, Vitest, Docker

---

### Task 1: Clean up old project

Remove old CRA files. Keep `.git`, `LICENSE`, `README.md`, `docs/`.

**Step 1:** Remove old files
```bash
cd /Users/bradeac/Personal/projects/do-i-know-this-artist
rm -rf src/ public/ package.json package-lock.json node_modules/
```

**Step 2:** Update .gitignore
```
node_modules
.env
dist
build
*.tar.gz
*.txt
```

**Step 3:** Commit
```bash
git add -A && git commit -m "remove old CRA project files"
```

---

### Task 2: Backend project setup

**Files:** `backend/package.json`, `backend/tsconfig.json`, `backend/src/index.ts`

**Step 1:** Init backend
```bash
mkdir -p backend/src
cd backend
npm init -y
npm i express cors dotenv
npm i -D typescript @types/express @types/cors @types/node vitest tsx
npx tsc --init --outDir dist --rootDir src --strict --esModuleInterop --module nodenext --moduleResolution nodenext
```

**Step 2:** Configure package.json scripts
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  }
}
```

**Step 3:** Create minimal `backend/src/index.ts` that starts Express on port 5000.

**Step 4:** Commit

---

### Task 3: Backend YouTube proxy (TDD)

**Files:**
- `backend/src/youtube.ts` — YouTube API proxy functions
- `backend/src/index.ts` — Routes
- `backend/src/__tests__/youtube.test.ts`

**Endpoints:**
- `GET /api/youtube/playlists?accessToken=...` — fetch user's playlists
- `GET /api/youtube/tracks?playlistId=...&accessToken=...` — fetch tracks from playlist (handles pagination via nextPageToken)
- `GET /api/youtube/search?q=...&accessToken=...` — search user's channel

**Step 1:** Write failing tests for each endpoint (mock fetch to YouTube API)

**Step 2:** Implement YouTube proxy functions:
- `getPlaylists(accessToken)` — calls `https://www.googleapis.com/youtube/v3/playlists?mine=true&part=snippet&maxResults=50`
- `getTracks(playlistId, accessToken)` — calls `https://www.googleapis.com/youtube/v3/playlistItems` with pagination
- `searchChannel(query, accessToken)` — calls `https://www.googleapis.com/youtube/v3/search`

All requests append `key=YOUTUBE_API_KEY` from env.

**Step 3:** Wire routes in index.ts

**Step 4:** Run tests, verify pass

**Step 5:** Commit

---

### Task 4: Frontend project setup

**Files:** `frontend/` (Vite scaffold)

**Step 1:** Scaffold with Vite
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm i
npm i -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Step 2:** Configure Tailwind via Vite plugin, add `@import "tailwindcss"` to CSS

**Step 3:** Configure vitest in `vite.config.ts`

**Step 4:** Verify dev server starts

**Step 5:** Commit

---

### Task 5: Frontend types + YouTube service (TDD)

**Files:**
- `frontend/src/services/types.ts` — MusicProvider, Playlist, Track interfaces
- `frontend/src/services/youtube.ts` — YouTube service implementation
- `frontend/src/services/__tests__/youtube.test.ts`

**Step 1:** Define types
```ts
interface Track {
  id: string
  title: string
  artist: string
  thumbnail: string
  url: string
  playlistName: string
}

interface Playlist {
  id: string
  title: string
  thumbnail: string
}

interface MusicProvider {
  name: string
  getPlaylists(accessToken: string): Promise<Playlist[]>
  getTracks(playlistId: string, accessToken: string): Promise<Track[]>
}
```

**Step 2:** Write failing tests for YouTubeProvider (mocking fetch to backend)

**Step 3:** Implement YouTubeProvider calling backend endpoints

**Step 4:** Run tests, verify pass

**Step 5:** Commit

---

### Task 6: Frontend auth (Google Identity Services)

**Files:**
- `frontend/src/auth/google.ts` — GIS initialization
- `frontend/src/context/AuthContext.tsx` — React context for auth state

**Step 1:** Create AuthContext with state: `{ isSignedIn, accessToken, userProfile }`

**Step 2:** GIS integration: load `accounts.google.com/gsi/client` script, init token client, handle callback

**Step 3:** Commit

---

### Task 7: Frontend components

**Files:**
- `frontend/src/components/App.tsx`
- `frontend/src/components/SearchBar.tsx`
- `frontend/src/components/TrackList.tsx`
- `frontend/src/components/TrackCard.tsx`
- `frontend/src/main.tsx`

**Step 1:** Build App.tsx — conditional render: sign-in or search UI

**Step 2:** Build SearchBar — input + onKeyDown Enter to search

**Step 3:** Build TrackList — groups tracks by playlist, renders TrackCards

**Step 4:** Build TrackCard — thumbnail, title, artist, YouTube link

**Step 5:** Style with Tailwind — clean, minimal

**Step 6:** Wire everything in main.tsx with AuthProvider

**Step 7:** Commit

---

### Task 8: Docker + deployment

**Files:**
- `backend/Dockerfile`, `backend/Dockerfile.prod`
- `frontend/Dockerfile`, `frontend/Dockerfile.prod`
- `docker-compose.yml`, `docker-compose.prod.yml`
- `deploy.sh`

**Step 1:** Backend Dockerfiles (dev: tsx watch, prod: tsc + node)

**Step 2:** Frontend Dockerfiles (dev: vite dev, prod: vite build + serve)

**Step 3:** docker-compose.yml for local dev

**Step 4:** docker-compose.prod.yml with resource limits + security (match dgi pattern)

**Step 5:** deploy.sh — build for linux/amd64, scp to VPS, docker load + up

**Step 6:** Commit

---

### Task 9: Final integration test

**Step 1:** `docker compose up` locally, verify both containers start

**Step 2:** Verify frontend loads, Google sign-in button renders

**Step 3:** Commit all, update README
