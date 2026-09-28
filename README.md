# Model Interiors — Website

Static, multi-page website for **Model Interiors**, a luxury residential interior design studio.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Work (portfolio + before/after) | `work.html` |
| Services | `services.html` |
| About | `about.html` |
| Process | `process.html` |
| Contact (form + WhatsApp enquiry) | `contact.html` |

Shared styles live in `site.css` and behaviour in `site.js`. Images are in `img/` (WebP) and the hero and walkthrough films are in `video/` (MP4).

## Run locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Works on any static host (GitHub Pages, Vercel, Netlify). For GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Before going live

Replace the placeholder contact details (search the HTML files for these values):

- Phone / WhatsApp: `+91 00000 00000`, `910000000000`, `+910000000000`
- Email: `studio@example.com`
- Instagram: `https://www.instagram.com/` and `@modelinteriors`
- YouTube: `https://www.youtube.com/`

The contact form validates input and can send the enquiry as a pre-filled WhatsApp message. To receive form submissions by email or in a CRM, connect it to a form service or backend.

## Imagery

All current images and videos are AI-generated concept visualisations and are labelled as such on the site. Replace them with real project photography as it becomes available.
