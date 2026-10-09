# Fountain-I Academy website

Static marketing site for Fountain-I Academy, No. 26 Tanke Iledu, Tanke, Ilorin, Kwara State.
Five pages, plain HTML/CSS/JS, no build step and no dependencies. Ready to deploy on Vercel.

## Pages

| File | URL (on Vercel) | Sections (anchor ids) |
|---|---|---|
| `index.html` | `/` | hero, About statement, Our Pillars, Our Programmes, Qur'an verse, FAQ, Visit CTA |
| `about.html` | `/about` | `#story`, `#vision`, `#values`, `#head` |
| `academics.html` | `/academics` | `#curriculum` (`#early`, `#primary`, `#secondary`, `#glance`) |
| `islamiyyah.html` | `/islamiyyah` | `#overview` (curriculum orbit), `#times`, `#register`, `#faq` |
| `admissions.html` | `/admissions` | `#apply` / `#steps`, `#enquire` (form + map), `#faq` |
| `404.html` | any unknown URL | |

## Folder structure

```
css/styles.css     all shared styles (design styles first, then production additions + breakpoints)
js/main.js         mobile menu, hero video toggle, WhatsApp form handler, portal placeholder
assets/img/        logo, favicon, hero still, programme photos
assets/video/      hero.mp4 (plays on hover / tap on the home hero)
vercel.json        clean URLs (/about instead of /about.html) and cache headers
robots.txt, sitemap.xml, 404.html
```

## Run locally

```
python3 -m http.server 8000      # or: npx serve .
```
Open http://localhost:8000. Links use relative `.html` paths, so pages also open straight from the file system.

## Deploy to Vercel

Option A, Git: push this folder to a GitHub repo, then in Vercel choose **Add New → Project → Import**.
Framework preset: **Other**. Build command: none. Output directory: `.` (the repo root).

Option B, CLI:
```
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```
Then add the school's domain under **Project → Settings → Domains** and update the domain in `sitemap.xml` and `robots.txt`.

## Sample content to confirm before launch

Every item below is showcase copy written for the prototype. Search for the text to find it.

- Email `info@fountainiacademy.com` (all footers) and the domain in `sitemap.xml`
- Head of School name **Mrs. Aisha Abdulsalam**, her welcome message, and the photo placeholder (`about.html#head`)
- Founding story, Vision and Mission (`about.html`)
- Weekend Islamiyyah times (Sat & Sun 9:00am–12:00pm), fee (₦25,000 per term), age bands (5–8, 9–12)
- Islamiyyah FAQ answers (hifz tracking, what to bring, holidays)
- Admissions: assessment details, documents list, transport answer, 10% sibling discount
- Home FAQ: WAEC/NECO mention for Secondary
- Academics "Subjects at a glance" table (Early Years Qur'an/Arabic entries, Secondary Global Perspectives)
- Age ranges on Home programme cards (2–5, 5–11) and Crèche / Nursery naming
- Social links (Facebook, Instagram, YouTube) are `#`
- Portal Login and Admin login are placeholders (`data-portal` shows a "coming soon" alert). Replace `href="#portal"` with the portal URL.

## Things a developer needs to wire up

1. **Forms.** There is no backend. `js/main.js` turns each form submission into a pre-filled WhatsApp message to 0810 011 9066. To send to email or a CRM instead, replace the submit handler, for example with Formspree, Web3Forms, or a Vercel serverless function (`/api/enquiry`). Both forms carry `data-whatsapp`.
2. **Map.** The Admissions map is a styled placeholder. Swap the box in `admissions.html#enquire` for a Google Maps embed iframe of Tanke Iledu.
3. **Head of School photo.** Replace the placeholder inside the arch frame on `about.html#head` with an `<img>` (object-fit: cover). The arch is a CSS mask, so any portrait is cut to the shape.
4. **Hero video.** `hero.mp4` is compressed to ~1.4 MB (1280px, H.264) and is not downloaded with the page: it loads on first hover/tap, or quietly after load on fast desktop connections. The still image (`hero.webp`) shows until then.
5. **Images.** All photos and the logo are WebP (20–75 KB each); below-the-fold images lazy-load. An SVG logo from the designer would be smaller still.
6. **Analytics** if wanted (Vercel Analytics is one switch in the project settings).

## Design tokens

| Token | Value | Use |
|---|---|---|
| Maroon | `#8A1F3D` | heading accents, eyebrows, Arabic |
| Button maroon | `#8E1538` (hover `#6E0F2B`) | primary pills |
| Wine / footer | `#4B1022` / `#3A0A1A` | footer, mobile menu |
| Gold | `#F4C343` | announcement strip, active nav, quote marks |
| Deep gold | `#C9962A` | ornaments, outlines, ticks |
| Blush background | `#F9F6F7` | alternating sections, cards |
| CTA yellow | `#F2E5C4` | closing call-to-action card |
| Text | `#2A0A14` / body `#5A4A4F` | |
| Programme tints | `#FBF0D6`, `#E2EDF6`, `#F6E2E7`, `#DDEFE5` | Early Years, Primary, Secondary, Islamiyyah |

Fonts (Google Fonts): **Cinzel** (hero titles), **Lora** (headings), **DM Sans** (body/UI), **Amiri** (Arabic).
Section rhythm: 112px vertical padding (72px on mobile), content max width 1600px with `clamp(24px, 5vw, 80px)` gutters.
Breakpoints: 1100px (tighter nav), 980px (hamburger menu), 760px (mobile type and spacing), 520px (orbit labels).

## Notes for the developer

- Most styling is inline because the pages were exported from the design tool. Shared rules live in `css/styles.css`. If you move to a framework (Next.js, Astro), the header, footer, CTA card, FAQ and programme card are the obvious components.
- The Islamiyyah "orbit" uses CSS container queries and `:has()` for the hover descriptions (Chrome 105+, Safari 16+, Firefox 121+). Older browsers still show the orbit; only the hover descriptions are skipped.
- Motion respects `prefers-reduced-motion` (orbit stops, hero video doesn't autoplay).
- The Moroccan lattice and arch shapes are inline SVG, so they scale cleanly and need no image files.
