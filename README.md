# Do I Know This Artist?

Search your YouTube playlists to find if you already know an artist or track.

See a name on a festival lineup that sounds familiar? Search across all your YouTube playlists instantly.

**[do-i-know-this-artist.bradeac.dev](https://do-i-know-this-artist.bradeac.dev)**

## How it works

1. Sign in with Google
2. The app caches all tracks from your YouTube playlists
3. Search by artist or track name — results are instant

You can choose which playlists to include via the settings panel.

## Running locally

```
cp backend/.env.example backend/.env  # add your YOUTUBE_API_KEY
cp frontend/.env.example frontend/.env  # add your VITE_GOOGLE_CLIENT_ID

docker compose up
```

Frontend: `localhost:5176` | Backend: `localhost:5177`

## Deploy

The deploy script uses `h` as the SSH host alias. Add it to your `~/.ssh/config`:

```
Host h
  HostName <your-vps-ip>
  User root
```

Then run:

```
bash deploy.sh
```

Builds for linux/amd64, uploads images to VPS, runs with docker compose.

## Privacy

No data is stored on the server. Auth tokens and preferences live in your browser's localStorage. [Privacy policy](https://do-i-know-this-artist.bradeac.dev/privacy).
