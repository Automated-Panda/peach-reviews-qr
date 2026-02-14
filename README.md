# Peach Reviews QR

QR-based review delivery pages. Providers display a poster with a QR code; end-users scan it to see a pre-written review, copy it, and paste it on Google (more platforms coming).

## Quick Start

```bash
# Install dependencies
npm install

# Copy env and configure
cp .env.example .env

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Sample URLs (local data)

| Route | URL |
|---|---|
| Provider poster | [/p/abc123](http://localhost:3000/p/abc123) |
| Public review page | [/r/abc123](http://localhost:3000/r/abc123) |
| Inactive token | [/r/inactive01](http://localhost:3000/r/inactive01) |

## Project Structure

```
app/
  p/[token]/page.tsx          # Provider QR poster page
  r/[token]/page.tsx          # Public review page (server)
  r/[token]/ReviewPageClient  # Public review page (client interactivity)
  api/scan/route.ts           # POST endpoint to log scans
  not-found.tsx               # Friendly 404
  layout.tsx                  # Root layout (Roboto font)
  globals.css                 # Tailwind + print styles

components/
  poster/google/              # Google-style poster components
  ui/                         # Shared UI (Button, Card, Toast)
  QrCode.tsx                  # Server-side QR code generator

lib/
  repos/
    types.ts                  # Repo interface
    scheduledReviewsRepo.ts   # Factory (local vs airtable)
    ...local.ts               # In-memory JSON implementation
    ...airtable.ts            # Stub with TODO notes
  types.ts                    # ScheduledReviewPublic type
  maps.ts                     # Google Maps URL builder
  rateLimit.ts                # In-memory rate limiter

data/
  scheduledReviews.sample.json  # Sample review records
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `APP_BASE_URL` | `http://localhost:3000` | Base URL for building QR links |
| `DATA_SOURCE` | `local` | `local` or `airtable` |
| `AIRTABLE_API_KEY` | — | Airtable API key (future) |
| `AIRTABLE_BASE_ID` | — | Airtable base ID (future) |
| `AIRTABLE_TABLE_SCHEDULED_REVIEWS` | `Scheduled Reviews` | Airtable table name (future) |

## Data Source

The app uses a repository pattern. Set `DATA_SOURCE` in `.env`:

- **`local`** (default): Reads from `data/scheduledReviews.sample.json`. Scan counts increment in memory only (reset on restart).
- **`airtable`** (future): Will read/write from Airtable. The stub file has field mappings and TODOs ready to implement.

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `APP_BASE_URL` = your production domain (e.g. `https://qr.peachreviews.com`)
   - `DATA_SOURCE` = `airtable` (when ready)
   - Airtable credentials (when ready)
4. Deploy

## Adding a New Platform

1. Create `components/poster/<platform>/` with poster components
2. Add a branch in `app/p/[token]/page.tsx` keyed on `review.platform`
3. Optionally create platform-specific review page components in `app/r/[token]/`
