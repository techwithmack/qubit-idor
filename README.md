# Apex Wealth Management — IDOR Lab

**Lab Environment: For Educational Use Only.**

A deliberately vulnerable investment banking dashboard for teaching **Insecure Direct Object Reference (IDOR)**. See [`cheatsheet.md`](cheatsheet.md) for exploit steps, demo accounts, and debrief notes.

## Live lab

**Hosted app:** [https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/101](https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/101)

- Sign in: [https://main.drajbhm4q3rrn.amplifyapp.com/login](https://main.drajbhm4q3rrn.amplifyapp.com/login)
- Demo login: `john@apex.lab` / `password101`

After login you are redirected to the dashboard above. Change the client id in the URL (e.g. `/dashboard/103`) to demonstrate URL-based IDOR.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/login`).

## Stack

Next.js (App Router), Tailwind CSS, Lucide React, Recharts. Mock data in [`data/wealth-lab.json`](data/wealth-lab.json).

## Intentional flaws (lab only)

1. **URL IDOR** — `/dashboard/[user_id]` loads any client profile without matching the session cookie.
2. **API IDOR** — `GET /api/download-statement?id=<statement_id>` returns statements with no ownership check.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- Full walkthrough: [`cheatsheet.md`](cheatsheet.md)
