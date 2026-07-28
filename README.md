# QuoteMe

QuoteMe is a client intake form for insurance requests.

It is designed to collect detailed quote information up front so the receiving licensed agent has enough information to prepare an accurate quote with fewer follow-up calls and emails.

## Project files

- `index.html` — public QuoteMe intake page
- `functions/api/submit.js` — Cloudflare Pages Functions endpoint
- `launch-guide.md` — high-level deployment and launch notes
- `deployment-notes.md` — secrets, routing, and production milestone notes

## Purpose

This project is intended to support lead intake for insurance requests such as auto, property, life, flood, and selected commercial lines.

QuoteMe intentionally does not request Social Security numbers or similar high-risk personal information through the web form. If additional protected information is needed, the quoting agent should obtain it directly by phone.

## Planned deployment

This repository is intended for deployment on Cloudflare Pages with Pages Functions.

## Next steps

- Connect the repository to Cloudflare Pages
- Add Turnstile keys and email secrets
- Route submissions to the correct receiving agent
- Add data storage for submitted leads
