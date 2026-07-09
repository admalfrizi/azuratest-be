# AzuraTest Backend

A REST API for the AzuraTest library management system, built with **Node.js**, **Express 5**, and **TypeScript**, talking directly to **PostgreSQL** via the `pg` driver (no ORM). It powers the books/categories CRUD and pagination consumed by the [azuratest-fe](https://github.com/admalfrizi/azuratest-fe) frontend.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 (see `Dockerfile`) |
| Language | TypeScript |
| Web framework | Express 5 |
| Database | PostgreSQL (via `pg` — raw SQL, no ORM/query builder) |
| Migrations | `node-pg-migrate` |
| Dev reload | Nodemon + ts-node |
| Containerization | Docker (multi-stage) + Docker Compose |

## Architecture

The codebase is organized as a thin, two-layer backend: **routes → controllers → repositories**, with cross-cutting concerns (errors, response shape, validation) factored out. There is no separate service layer today — controllers call repositories directly.

```
src/
├── index.ts                 # Process entrypoint: connects DB, starts HTTP server, handles graceful shutdown
├── server.ts                 # Express app factory: middleware, /api/health, mounts /api/v1 router
├── config.ts                  # Reads env vars into a typed config object
├── database.ts                 # pg Pool + query()/queryOne()/transaction() helpers
├── utils.ts                    # additional function for specific case
├── routes/v1/
│   ├── index.ts                  # Mounts /books and /categories routers
│   ├── books/
│   │   ├── index.ts                # Route → controller wiring
│   │   └── controller.ts            # Request handling, calls validators + bookRepository
│   └── categories/
│       ├── index.ts
│       └── controller.ts
├── validators/
│   ├── book.validator.ts          # Manual validation (no schema library), throws ValidationError
│   └── category.validator.ts
├── data/
│   ├── entities/
│   │   ├── Book.ts                  # Book row shape
│   │   └── SqlQuery.ts               # Shared BOOKS_QUERY (books JOIN categories)
│   └── repository/
│       ├── base_repository.ts        # createBaseRepository<T>(): generic CRUD + pagination factory
│       ├── book.repository.ts         # createBookRepository(): extends base with filters, publication dates
│       └── category.repository.ts      # createCategoriesRepository(): extends base with findByName, reassign-and-delete
├── errors/
│   ├── CaseError.ts                  # Base error class (message, statusCode, details)
│   ├── NotFoundError.ts               # 404
│   └── ValidationError.ts             # 400 + details[]
└── middleware/
    ├── response-handler.ts           # sendSuccessResponse()/sendErrorResponse() — consistent JSON envelope
    ├── error-handler.ts                # Central error middleware: maps CaseError subclasses → JSON
    └── notfound-handler.ts             # Catches unmatched routes → NotFoundError
```

**Request lifecycle:**

1. `server.ts` wires global middleware (`morgan`, JSON/urlencoded body parsing, `cors`), a `/api/health` check, and mounts the versioned API at `/api/v1`.
2. A route file (e.g. `routes/v1/books/index.ts`) maps HTTP verbs/paths straight to controller functions — no route-level middleware beyond that.
3. Controllers parse query params/body, call a **validator** (which throws `ValidationError` on bad input), then call the relevant **repository** method, and finally shape the response via `sendSuccessResponse`/`sendErrorResponse`.
4. Repositories are plain **factory functions** (no classes): `createBaseRepository<T>(tableName)` returns generic `findAll/findById/findPaginated/create/update/delete` methods backed by hand-written parameterized SQL. `createBookRepository()`/`createCategoriesRepository()` spread the base repository and add domain-specific methods (filtering, joins, publication-date lookups, transactional category deletion).
5. Because the project uses **Express 5**, controllers can be plain `async` functions — rejected promises are automatically forwarded to the error middleware, so there's no `asyncHandler` wrapper anywhere in the codebase.
6. `error-handler.ts` catches anything thrown up the chain: `ValidationError` → 400 with a `details` array of messages, `NotFoundError`/other `CaseError` subclasses → their own `statusCode`, anything else → 500. **Exception:** if `APP_DEBUG=true`, the handler skips all of this and calls `next(error)`, letting Express's default (stack-trace-dumping) handler take over — useful locally, should stay `false` in any shared/production environment.
7. Every success and error response shares the same envelope shape (see [API Routes](#api-routes) below).

## Database Schema

Three migrations (in `migrations/`, run via `node-pg-migrate`) build the schema:

| Table | Columns | Notes |
|---|---|---|
| `categories` | `id`, `name (varchar(100), unique, not null)`, `created_at`, `updated_at` | |
| `books` | `id`, `title`, `author`, `publisher`, `publication_date (date)`, `number_of_pages`, `category_id (FK → categories.id)`, `created_at`, `updated_at` | Indexed on `category_id` |

`books.category_id` has a foreign key back to `categories.id`. The final migration (`add-fk-categories-schema`) tightens this to `ON DELETE RESTRICT` — meaning **the database will reject deleting a category that still has books attached to it**, which is why the frontend's delete-confirmation dialog warns that books need to be reassigned first (see [Notes](#notes--known-gaps)).

## API Routes

Base URL: `http://<host>:<port>/api`. All responses share this envelope:

```json
// Success
{ "success": true, "code": 200, "message": "...", "data": { }, "meta": { } }

// Error
{ "success": false, "code": 400, "message": "...", "details": [ ] }
```

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check — returns `{ ok: true, environment }` |

### Books — `/api/v1/books`

| Method | Path | Description | Query / Body |
|---|---|---|---|
| GET | `/` | Paginated, filterable book list (joined with category name) | Query: `page`, `perPage`, `category_id`, `publication_date`, `search` (matches title/author/publisher) |
| GET | `/publication-dates` | Distinct publication dates available, honoring the same `category_id`/`search` filters | Query: `category_id`, `search` |
| GET | `/:id` | Get one book by id | — |
| POST | `/` | Create a book | Body: `title`, `author`, `publisher`, `publication_date (YYYY-MM-DD, not in the future)`, `number_of_pages`, `category_id` |
| PUT | `/:id` | Update a book (same validation as create) | Body: same as create |
| DELETE | `/:id` | Delete a book | — |

Example — `GET /api/v1/books/?page=1&perPage=10&search=fiction`:

```json
{
  "success": true,
  "code": 200,
  "message": "Successfully retrieved books",
  "data": [
    {
      "id": 1,
      "title": "Dune",
      "author": "Frank Herbert",
      "category_id": 2,
      "category": "Science Fiction",
      "publication_date": "1965-08-01",
      "publisher": "Chilton Books",
      "number_of_pages": 412,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "meta": { "page": 1, "perPage": 10, "totalPages": 3, "totalCount": 27 }
}
```

### Categories — `/api/v1/categories`

| Method | Path | Description | Query / Body |
|---|---|---|---|
| GET | `/` | Paginated category list | Query: `page`, `perPage` |
| GET | `/option` | Full, unpaginated category list — for populating select/filter dropdowns | — |
| GET | `/:id` | Get one category by id | — |
| POST | `/` | Create a category | Body: `name` |
| PUT | `/:id` | Update a category | Body: `name` |
| DELETE | `/:id` | Delete a category | — (currently blocked at the DB level if books reference it — see [Notes](#notes--known-gaps)) |

Validation errors (both resources) return `code: 400` with a `details` array, e.g.:

```json
{
  "success": false,
  "code": 400,
  "message": "Invalid book data",
  "details": [
    "title is required and must be a non-empty string",
    "publication_date must be in YYYY-MM-DD format"
  ]
}
```

## Getting Started

### Prerequisites

- Docker & Docker Compose (recommended path), **or**
- Node.js 22.x + a local PostgreSQL instance (if running without Docker)

### Environment Variables

No `.env.example` is currently committed, so create your own `.env` in the project root with the following:

| Variable | Used by | Description | Example |
|---|---|---|---|
| `PORT` | app | HTTP port the API listens on | `3000` |
| `NODE_ENV` | app | Environment name | `development` |
| `APP_DEBUG` | app | When `true`, bypasses the JSON error handler and lets Express dump raw stack traces — **keep `false` outside local debugging** | `false` |
| `DEFAULT_PAGE_SIZE` | app | Fallback `perPage` when a request omits it | `5` |
| `DB_HOST` | app | Postgres host — `db` when using the provided `docker-compose.yml` (Compose service name), `localhost` when running the app outside Docker | `db` |
| `DB_PORT` | app | Postgres port | `5432` |
| `DB_USER` | app + db container | Postgres username | `postgres` |
| `DB_PASSWORD` | app + db container | Postgres password | `postgres` |
| `DB_NAME` | app + db container | Postgres database name | `azuratest` |

`docker-compose.yml` loads this same `.env` for **both** the `app` and `db` services (`DB_USER`/`DB_PASSWORD`/`DB_NAME` seed the Postgres container itself), so one file covers everything in the Docker path.

### Option A — Docker (recommended)

The `Dockerfile` is multi-stage (`development` / `build` / `production`); `docker-compose.yml` targets the **`development`** stage and bind-mounts the project directory, so you get hot-reload via Nodemon inside the container.

```bash
git clone https://github.com/admalfrizi/azuratest-be.git
cd azuratest-be

# create .env with the variables listed above (remember DB_HOST=db)
touch .env

# build and start the API + Postgres containers
docker-compose up --build
```

What happens on startup: `entrypoint.sh` runs `npm run migrate:up` (applying any pending migrations against the `db` service, which Compose waits to be healthy first via its `pg_isready` healthcheck) and then execs the container's `CMD` — `npm run dev` for the development target.

The API will be available at `http://localhost:3000/api`, and Postgres is exposed on `localhost:5432` if you want to connect a DB client directly.

```bash
# stop and remove containers (data persists in the postgres_data volume)
docker-compose down
```

To build/run the **production** image stage directly (bypassing Compose), e.g. for testing the production Dockerfile target:

```bash
docker build --target production -t azuratest-be:prod .
docker run --env-file .env -p 3000:3000 azuratest-be:prod
```

### Option B — Running locally without Docker

```bash
git clone https://github.com/admalfrizi/azuratest-be.git
cd azuratest-be
npm install

# create .env (remember DB_HOST=localhost or your Postgres host)
touch .env

# make sure a PostgreSQL server is running and DB_NAME exists, then:
npm run migrate:up

npm run dev
```

For a production-style run without Docker:

```bash
npm run build          # tsc -> dist/
node dist/server.js    # package.json has no "start" script, so run the compiled entry directly
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with Nodemon + ts-node, watching `src/` for changes |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run migrate:create` | Scaffold a new migration file in `migrations/` |
| `npm run migrate:up` | Apply all pending migrations |
| `npm run migrate:down` | Roll back the most recent migration |
| `npm test` | Not implemented yet (placeholder script) |

## Notes & Known Gaps

A few things worth being aware of when working on this codebase:

- **No service layer yet.** Controllers call repositories directly; if business logic grows, that's the natural seam to introduce a `services/` layer between them.
- **Category deletion isn't fully wired up.** `categoriesRepository.deleteAndReassignBooks()` (which reassigns a category's books to a fallback category inside a transaction before deleting it) exists but isn't called from `deleteCategory` in the controller — that handler just calls `.delete(id)` directly. Since the FK constraint is `ON DELETE RESTRICT`, deleting a category that still has books will currently fail at the database level rather than reassigning them.
- **No `start` script.** The production Docker stage runs `node dist/server.js` directly rather than via an npm script.
- **`APP_DEBUG=true` changes error handling, not just verbosity** — it disables the custom JSON error responses entirely in favor of Express's default handler. Worth knowing before enabling it anywhere other than your own machine.