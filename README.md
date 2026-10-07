# Lumière Keepsakes Catalog

A responsive Vite + React product catalog with instant search/category filters, product details, and an admin workspace for product and category management. It intentionally has no cart, checkout, ordering, payment, shipping, quantity, or customer-account flows.

## Run locally

```bash
npm install
npm run dev
```

Without environment variables, the app runs in preview mode using local browser storage. Admin preview credentials are `admin@lumiere.ph` / `admin123`.

## Connect Supabase for production

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Create the owner account in Authentication > Users.
3. Insert that user's UUID into `public.profiles` using the final statement shown in the schema.
4. Copy `.env.example` to `.env` and add the project URL and anon key.
5. Restart Vite. The catalog will now read and write products, categories, and images through Supabase with row-level security.

The local preview image picker uses an in-memory preview; production image persistence is enabled when Supabase is configured.
