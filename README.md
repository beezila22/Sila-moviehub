# MovieHub (Starter)

This repository contains a small React + Tailwind frontend (`client/`) and a lightweight Express backend (`server/`) using lowdb (JSON file) for storage.

## Quick steps to run locally

1. Install root dependencies for server:
```bash
cd server
npm install
```

2. Install client dependencies:
```bash
cd ../client
npm install
```

3. Build client:
```bash
npm run build
```

4. Start server (serves built client and API):
```bash
cd ../server
ADMIN_KEY=your-secret-admin-key node server.js
```

The server will run on port 4000 by default. Set `ADMIN_KEY` to a strong secret before deploying.

For Heroku/Render: push this repo, set `ADMIN_KEY` as env var, and the `Procfile` in `server/` will run the server.

