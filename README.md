# Test1

## Prepare Tomorrow's Definitions

The next puzzle is deterministic. To print tomorrow's exact words and a
Papiamento definition template, run:

```bash
pnpm preview:tomorrow
```

Fill in the empty values, paste them into `DEFINITIONS` in `public/index.html`,
then deploy with `pnpm deploy`.

Cloudflare also emails this template nightly at 8:00 PM Curaçao time.

## Password Reset Secret

Password-reset links are signed with a dedicated Worker secret and also become
invalid after use or when the account password changes. Before deploying, set
an independently generated value of at least 32 characters:

```bash
openssl rand -base64 48 | npx wrangler secret put PASSWORD_RESET_SECRET
```

The sender domain must also be enabled for Cloudflare Email Sending before
reset messages can be delivered:

```bash
npx wrangler email sending enable palabradikorsou.com
```