# RTM Portal — Next.js Frontend

Next.js 15 application for the RTM (Radio Televisyen Malaysia) public portal.

## Features

- Server-side rendering (SSR)
- Static generation (SSG)
- Incremental Static Regeneration (ISR)
- Image optimization
- SEO-friendly

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env.local` and update values:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/frontend
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
```

## Building

```bash
npm run build
npm run start
```

## Project Structure

```
app/
├── layout.js          — Root layout
├── page.js            — Home page
└── api/               — API routes
```

## Integration

- Fetches data from Laravel REST API (`api/`)
- Separate from React admin panel (`backend/`)
