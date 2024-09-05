This is a [Next.js](https://nextjs.org/) project bootstrapped with [
`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and
load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Ngrok

Create your [Ngrok](https://ngrok.com/) account, in your dashboard:

* Follow the instruction in [Setup & Installation](https://dashboard.ngrok.com/get-started/setup).
* Navigate to [Domains](https://dashboard.ngrok.com/cloud-edge/domains):
    1. Select "New Domain".
* In your CMD after `npm run dev`, run the ngrok command:
```bash
ngrok http --domain="Your Ngrok Domain URL" 3000
```

## Clerk

Create your [Clerk](https://clerk.com/) account and project, in your dashboard:

* Navigate to "API Keys" on the sidebar, copy your Publishable keys and Secret keys to
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
* Navigate to "Webhooks" on the sidebar:
    1. Select "Add Endpoint".
    2. Endpoint URL: https:// + Your Ngrok domain URL + /api/webhooks/clerk
    3. Events: user.created, user.deleted, user.updated
    4. Select "Create".
    5. Once created, copy your "Signing Secret" to `CLERK_WEBHOOK_SECRET`.

## LiveKit

Create your [LiveKit](https://livekit.io/) account and project, in your dashboard:

* Navigate to "Settings" on the sidebar:
    1. Select "KEYS" -> "Other Keys" -> "Create key" -> "GENERATE".
    2. Copy your "WEBSOCKET URL" to `NEXT_PUBLIC_LIVEKIT_URL`, "API KEY" to `LIVEKIT_API_KEY` and "SECRET KEY" to
       `LIVEKIT_API_SECRET`.
    3. Select "WEBHOOKS" -> "ADD NEW ENDPOINT".
    4. URL: https:// + Your Ngrok domain URL + /api/webhooks/livekit

## UploadThing

Create Your [UploadThing](https://uploadthing.com/) account and "Create a new app", in your dashboard:

1. Navigate to "API Keys" on the sidebar:
    * "Create key" if not created.
    * Copy your Secret key and App ID to `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`.