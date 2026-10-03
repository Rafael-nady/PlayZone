# PlayZone publisher handoff

This project is provided as two packages:

- `playzone-publisher-source.zip` — editable source, workspace configuration, lockfile, the API server, shared libraries, and the Figma reference image.
- `playzone-site.zip` — the built static website files. Upload the contents of its `public/` folder to a static web host.

## Hosting requirements

The static website and API server are separate services. To save player names and use the admin page, configure the same host to forward `/api/*` requests to the API server. The website can display and run its games without the API, but registration and the admin player list need it.

Set `ADMIN_PASSWORD` as a server-side secret on the API host before using `/admin`. Admin access is disabled until this is set. Do not put this value in frontend build variables or share it with the publisher. Serve the site and API over HTTPS.

The API currently stores names in `artifacts/api-server/data/names.json`. The publisher source package includes an empty starter file, not the names currently saved in this workspace. On hosting providers with temporary filesystems, configure durable storage for this file or replace the file storage with a persistent database before collecting real player names.

## Build from source

Use Node.js 24 and pnpm. From the extracted source folder:

```sh
pnpm install
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/eduquest run build
```

The resulting static site is written to `artifacts/eduquest/dist/public/`.

To run the API server, set `PORT` and `ADMIN_PASSWORD` in the server environment, then run:

```sh
pnpm --filter @workspace/api-server run dev
```

The API server uses `/api` routes. Configure the host's reverse proxy so the website's `/api/*` requests reach that service.

## Included and excluded files

The source archive excludes installed dependencies, build caches, generated build folders, workspace-only Replit tooling, Unity executable binaries, and locally saved player names. These files are not required to build or run the browser game. The Figma reference image is included for context.