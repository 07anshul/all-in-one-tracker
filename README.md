# Plan Better

A running log of restaurants, places, and activities worth doing again — with
reviews, ratings, and a lightweight relations graph ("near", "pairs well
with", "similar to"...) connecting entries to each other.

There is no database. All data lives in [`data/graph.json`](data/graph.json),
committed straight to this repo. Locally, saving an entry writes the file and
makes a git commit for you. Once deployed, saving an entry commits directly
to GitHub via the API — every add/review/relation is a real, versioned commit.

## Local development

```bash
nvm use        # this repo pins Node 22 via .nvmrc
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are required locally —
reads and writes go straight to `data/graph.json` on disk, and each write
is auto-committed to git for you.

## Deploying to Vercel

This repo already lives at
[github.com/07anshul/all-in-one-tracker](https://github.com/07anshul/all-in-one-tracker).

1. Import that repo into [Vercel](https://vercel.com/new).
2. Add these environment variables in the Vercel project settings:

   | Variable | Value |
   |---|---|
   | `GITHUB_OWNER` | `07anshul` |
   | `GITHUB_REPO` | `all-in-one-tracker` |
   | `GITHUB_BRANCH` | `main` |
   | `GITHUB_TOKEN` | a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) scoped to just this repo, with **Contents: Read and write** permission |
   | `WRITE_KEY` | *(optional)* a passphrase — see below |

4. Deploy. Reads happen over `raw.githubusercontent.com` (no token needed
   since the repo is public); writes go through the GitHub Contents API using
   `GITHUB_TOKEN` and land as commits on your repo.

Because the app reads live from GitHub on every request (not from the build),
new entries show up immediately after saving — no redeploy needed.

### Optional: a passphrase for writes

This app has no login system. If it's deployed publicly, *anyone* with the
URL can add entries, reviews, or relations — which means anyone could commit
to your GitHub repo. If you only want yourself (or people you share a
passphrase with) to be able to add things:

- Set the `WRITE_KEY` environment variable to any secret string.
- The first time you try to save something, the site will prompt for it and
  remember it in your browser after that.
- Leave `WRITE_KEY` unset (the default) to skip this entirely — reads and the
  passphrase prompt are both no-ops if it's not configured.

Browsing and reading are always open either way; the passphrase only gates
writes.

## Data model

- **Entries** — a restaurant, place, or activity. Has a name, location, a
  "speciality" (what's actually good there), tags, and a list of reviews.
- **Reviews** — a rating (0.5–5) and a note, attached to one entry.
- **Relations** — a typed edge between two entries (`near`,
  `pairs-well-with`, `similar-to`, `reminds-me-of`, `better-than`), with an
  optional note. This is the "knowledge graph" part.
- **Plans** — a planned/visited/skipped status attached to an entry, with an
  optional date. No date means "someday" — a wishlist item with no day
  picked yet — shown in its own section on the calendar page.

See [`src/lib/types.ts`](src/lib/types.ts) for the exact shape.

## Pages

- **`/`** — the feed: filter by type, search, a stats strip, and a
  "surprise me" picker weighted toward unvisited/highly-rated entries.
- **`/entry/[id]`** — an entry's reviews, its Google Maps link, its plan
  history, and its connections to other entries. Editable in place (name,
  type, location, speciality, tags), and deletable.
- **`/graph`** — a force-directed visualization of every entry and relation
  (hand-rolled, no charting library), with an optional layer showing entries
  that share a tag.
- **`/plan`** — a month calendar plus an agenda of upcoming/past plans; mark
  a plan visited, skipped, or delete it.
- **`/itinerary`** — string entries into an ordered day plan, get
  relation-based suggestions for what to add next, copy a shareable link, or
  open the whole route in Google Maps directions.
- **`/stats`** — totals, entries by type, top tags, entries added over time.
- **`/add`** — create a new entry.

Google Maps links are built as plain search/directions URLs from an entry's
name and location — no Maps API key needed.
