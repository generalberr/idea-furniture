# IDEA Furniture

The website for IDEA: a public shop (collection, piece pages, bespoke brief, workshop, contact) and a private admin at `/admin`.

Built with React (Create React App), React Router and Supabase. Hosted on Vercel.

## Run it on your computer

```
npm install
npm start
```

## Publish

Commit and push with GitHub Desktop. Vercel builds and publishes automatically.

## One-time database setup

1. Open supabase.com and your project. If it says the project is paused, press **Restore**.
2. Open `supabase/setup.sql`, replace `YOUR_EMAIL_HERE` with your own email, paste it into **SQL Editor** and press **Run**.
3. Go to **Authentication > Users > Add user** and create a user with that same email and a strong password. Tick "Auto confirm user".
4. Go to **Authentication > Sign In / Providers** and turn off "Allow new users to sign up".
5. Sign in at `yoursite/admin`, open **Settings** and add your WhatsApp number, phone, address and hours.

Until step 2 is done the public site still works, but quote requests are not stored and the admin cannot save.

## Where things are

| Path | What it is |
| --- | --- |
| `src/pages.jsx` | The public pages |
| `src/site.jsx` | Header, footer, quote form, shared parts |
| `src/admin.jsx` | The admin |
| `src/data.js` | Built-in catalogue (shown if the database is unreachable) and data loading |
| `src/styles.css` | All styling |
| `public/` | Photos and icons |
| `api/share.js` | Link previews for WhatsApp and social apps |
| `api/keepalive.js` | Daily ping so the free Supabase project is not paused |
| `supabase/setup.sql` | Database tables and security rules |

Pieces, photos, contact details and customer quotes are all edited in the admin, not in the code.
