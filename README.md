# QR Review Card — Admin System

What this does: every physical card has a number printed as a QR code
(like `yoursite.vercel.app/001`). Until you assign that number to a shop,
scanning it shows "not set up yet." The moment you assign it in your admin
page, it instantly redirects straight to that shop's Google review popup.

You never need to touch code again after deployment — everything below
happens once.

## What you need (all free to start)
- A GitHub account (github.com)
- A Vercel account (vercel.com) — sign up with GitHub, one click
- A Supabase account (supabase.com) — sign up with GitHub, one click

## 1. Create the database (Supabase)
1. supabase.com → New project → give it any name → wait ~2 minutes for it to spin up.
2. Left sidebar → **SQL Editor** → New query.
3. Open `sql/schema.sql` from this folder, copy everything, paste it in, click **Run**.
4. Left sidebar → **Project Settings → API**. You'll need two values from this page in step 3 below:
   - **Project URL**
   - **service_role key** (click "Reveal" — keep this secret, never share it)

## 2. Put this code on GitHub
1. github.com → New repository → name it anything (e.g. `qr-review-cards`) → Create.
2. On the empty repo page, click **"uploading an existing file"** and drag in every file/folder from this project.
3. Commit.

## 3. Deploy on Vercel
1. vercel.com → **Add New → Project** → Import the GitHub repo you just created.
2. Before clicking Deploy, open **Environment Variables** and add these three:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` → your Supabase service_role key
   - `ADMIN_PASSWORD` → any password you'll remember, this logs you into the admin page
3. Click **Deploy**. Wait ~1-2 minutes.
4. You'll get a live link like `qr-review-cards.vercel.app` — this is your permanent site.

## 4. Start using it
1. Go to `yoursite.vercel.app/admin/login`, enter your `ADMIN_PASSWORD`.
2. Click **Add card**, type a card number (e.g. `001`) — do this once for every physical card you printed.
3. When a shop says yes: find that card's row, type the shop name and paste their Google review link, click **Save**.
4. Generate the QR code for `yoursite.vercel.app/001` (or whatever number) — any free QR generator works — and that's what goes on the physical card before printing.

## Notes
- You can add card numbers in bulk before you've sold anything — the card
  works the moment you assign a review link, not before.
- "Scans" on each row counts how many times that card's been tapped —
  useful proof to show a shop owner their card is actually getting used.
- If you ever forget your password, change `ADMIN_PASSWORD` in Vercel's
  Environment Variables and redeploy.
