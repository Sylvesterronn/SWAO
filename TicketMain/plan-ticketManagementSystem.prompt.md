# Plan: Set Up Node/TypeScript Ticket Management System

Mirror the structure and toolchain of `excercises/01` in the `SWAO` workspace. The domain is **event/cinema ticket management** — selling and tracking tickets for events like cinema screenings, concerts, theatre shows, and sports matches.

## Steps

1. Create [`package.json`](package.json) matching the exercise — `express`, `mongoose` as dependencies; `typescript`, `tsx`, `eslint`, `typescript-eslint`, `@tsconfig/node24`, `@types/express`, `@types/node`, `vitest` as devDependencies; same `scripts` (`dev`, `build`, `start`, `lint`, `test`).

2. Create [`tsconfig.json`](tsconfig.json) extending `@tsconfig/node24`, compiling `src/**/*` to `dist/`, with `NodeNext` module resolution (identical to exercise).

3. Create [`eslint.config.mjs`](eslint.config.mjs) with the same `@eslint/js` + `typescript-eslint` flat config and `globals.node`.

4. Create `src/schema/ticketSchema.ts` with a `Ticket` interface and Mongoose schema — fields:
   - `eventName` (string)
   - `category` (`cinema` | `concert` | `theatre` | `sport` | `other`)
   - `venue` (string)
   - `eventDate` (string/ISO)
   - `price` (number)
   - `currency` (string, default `DKK`)
   - `seat` (string)
   - `status` (`available` | `reserved` | `sold` | `cancelled`)
   - `purchasedBy` (string | null)

5. Create `src/dataAccess/mongoose.ts` with a `mongoose.createConnection` to `MONGO_URL` env var (fallback localhost) and export a `ticketModel`.

6. Create `src/routes/ticketRoutes.ts` with full CRUD routes:
   - `GET /tickets` — supports `?category=`, `?status=`, `?venue=` filters
   - `POST /tickets` — create a new ticket
   - `POST /tickets/seed` — seed from JSON file
   - `GET /tickets/:id`
   - `PUT /tickets/:id` — full replace
   - `PATCH /tickets/:id` — partial update (e.g. mark as `sold`, set `purchasedBy`)
   - `DELETE /tickets/:id`

7. Create `src/server.ts` wiring everything with Express error-handling middleware.

8. Create `data/MOCK_DATA_TICKETS.json` with 10 realistic event tickets across all categories and statuses (venues in Denmark).

9. Create `docker-compose.yml` to spin up MongoDB 7 on port 27017.

10. Create `.gitignore` ignoring `node_modules/`, `dist/`, `.env`.

## Further Considerations

1. **`vitest`** — added explicitly as a devDependency; `test:ui` script also included.
2. **Docker / MongoDB** — `docker-compose.yml` included for local development.
3. **`.gitignore`** — standard Node.js `.gitignore` created.

