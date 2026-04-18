<<<<<<< HEAD
# tandoor-flame-web
Build a responsive website of a restaurant website
||||||| parent of ab15962 (Build Tandoor Flame restaurant website)
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Tandoor Flame — Indian Non-Veg Restaurant Website

A production-ready Next.js 14 website for an Indian non-vegetarian restaurant with:

- Public pages: Home, Menu, Reservations, Order Online, Catering, Gallery, About, Contact
- **Online table reservations** (zod-validated form + SQLite via Prisma)
- **Online food ordering** with a cart and **Razorpay (test mode)** checkout
- **Catering / events enquiry** form for weddings & corporate events
- **Admin dashboard** (NextAuth credentials-guarded) to manage reservations, orders and catering inquiries
- Tailwind CSS styling with a warm, restaurant-appropriate palette

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (+ custom `brand`/`charcoal` palettes, utility `.btn-primary`, `.card` etc.)
- **Prisma** + SQLite (swap to Postgres in production by changing `prisma/schema.prisma`)
- **NextAuth** (Credentials provider, JWT sessions) for the admin area
- **Razorpay** for payments (server-side order create + HMAC signature verification)
- **react-hook-form** + **zod** for form validation

## Getting started

```bash
# 1. Install deps (also runs `prisma generate`)
npm install

# 2. Create SQLite DB + run migrations + seed admin & menu
npm run db:migrate -- --name init   # only the first time
npm run db:seed

# 3. Start the dev server
npm run dev
# → http://localhost:3000
```

## Environment variables

Copy `.env.example` → `.env` and fill in the values.

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file (dev) / Postgres URL (prod) |
| `NEXTAUTH_URL` | Base URL (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `RAZORPAY_KEY_ID` | Razorpay test key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same key ID, exposed to the browser checkout widget |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed credentials for the first admin user |

The site degrades gracefully when Razorpay keys are missing — orders are still saved
to the DB with `paymentStatus="unpaid"` and the UI switches to a "Place order →
we&rsquo;ll call to confirm" message.

### Getting Razorpay test keys

1. Create an account at https://dashboard.razorpay.com
2. Switch to **Test Mode**
3. Settings → **API Keys** → **Generate Test Key**
4. Paste into `.env`

## Admin dashboard

- Log in at [`/admin/login`](http://localhost:3000/admin/login)
- Default seeded credentials (change in production!):
  - **Email:** `admin@tandoorflame.test`
  - **Password:** `admin1234`
- From the dashboard you can update the status of reservations (`pending / confirmed / cancelled`),
  orders (`pending / paid / fulfilled / cancelled`) and catering inquiries.

## Customizing brand content

Nearly all brand content lives in a single file: [`src/lib/brand.ts`](src/lib/brand.ts).
Update the restaurant name, tagline, address, phone, hours, tax rate, etc. there and the
entire site picks it up.

The sample menu lives in [`src/lib/menu-seed.ts`](src/lib/menu-seed.ts). Edit it and
re-run `npm run db:seed` (seeding is idempotent for the admin user, and only inserts
menu rows on a fresh DB — delete `prisma/dev.db` to reseed from scratch).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:push` | `prisma db push` (no migration files) |
| `npm run db:seed` | Seed admin + sample menu |
| `npm run db:setup` | Apply migrations + seed (use in CI / prod) |

## Production deployment (Vercel)

1. Switch `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`
2. Point `DATABASE_URL` at your Postgres instance (Vercel Postgres / Neon / Supabase)
3. Add all env vars from `.env.example` to Vercel project settings
4. On deploy, run `prisma migrate deploy && tsx prisma/seed.ts` as part of the build
5. Use Razorpay **live** keys (and set up a webhook for `payment.captured` for robustness)

## Project structure

```
src/
  app/
    (public pages) page.tsx, menu/, reservations/, order/, catering/, …
    admin/       login & protected dashboard (layout enforces auth)
    api/
      auth/[...nextauth]
      reservations
      orders           (POST creates order + Razorpay order)
      orders/verify    (POST verifies payment signature)
      catering
      admin/*          (PATCH endpoints for status updates)
  components/    UI building blocks (Header, Footer, forms, cart…)
  lib/
    brand.ts     ← edit to rebrand the site
    menu-seed.ts ← edit to change the sample menu
    prisma.ts, auth.ts, razorpay.ts, cart.tsx, validators.ts
prisma/
  schema.prisma, seed.ts
```

## License

MIT (placeholder — update to whatever license you want before going live).
>>>>>>> ab15962 (Build Tandoor Flame restaurant website)
