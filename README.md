# JEE AI Toolkit

A public MVP for JEE aspirants with a dashboard-first Next.js interface and Razorpay Standard Checkout integration.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

On PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd install
npm.cmd run dev
```

## Razorpay

Required environment variables:

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=replace_with_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=replace_after_creating_webhook
```

Endpoints:

- `POST /api/create-order`
- `POST /api/verify-payment`
- `POST /api/webhooks/razorpay`
- `GET /api/credits/balance?guestId=...`

The current integration creates Razorpay orders, opens Standard Checkout, handles failed/cancelled payments, verifies the HMAC-SHA256 payment signature server-side, and credits the current guest session.

Without Supabase env vars, credits use in-memory development storage. This is fine for local testing but resets when the server restarts and is not enough for real paid production.

## Supabase Free Tier

For persistent credits and payment records:

1. Create a free Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor.
3. Add these Vercel environment variables:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

Never expose the service role key in frontend code.

## Free Deployment

Use Vercel Hobby/free:

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add all env vars in Vercel Project Settings.
4. Deploy.
5. Use the free `https://your-project.vercel.app` URL.

You do not need to buy a domain for the MVP. Use the Vercel URL for public testing, Razorpay review, and early users. Buy a domain later only if the project shows traction.

## Product APIs

- `POST /api/ai/simplify`
- `POST /api/planner/generate`
- `POST /api/pyq/analyze`
- `POST /api/predict-rank`
