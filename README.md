# Chedupathy & Shandhiya — Wedding Invitation

A complete, responsive Tamil–English wedding website built from the supplied invitation and photographs. The design uses maroon invitation ink, silk ivory, antique gold, locally bundled fonts, and gentle CSS motion.

## Run locally

Requires Node.js 22.18 or later and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Next.js, normally http://localhost:3000.

## Production build

```bash
npm run typecheck
npm test
npm run build
npm start
```

The `out/` folder is a ready-to-upload static website. It is also included in the downloadable project ZIP. Upload the **contents of `out/`** to any static web host, or use `npm start` to inspect it. An ordinary WordPress HTML widget cannot run the React/Next.js source directly.

## Confirmed invitation details

| Detail                 | Content                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| Groom                  | C. Chedupathy, B.Com., MBA., S.Rly.                                                                       |
| Bride                  | N. Shandhiya, B.Com.                                                                                      |
| Groom’s parents        | Mr. N.D. Cholan & Mrs. C. Rajeswari                                                                       |
| Bride’s parents        | Mr. A. Nanthagopal & Mrs. N. Vasanthi                                                                     |
| Date                   | Monday, 16 November 2026                                                                                  |
| Muhurtham              | 6:00–7:30 AM, India time                                                                                  |
| Wedding venue          | Thiruthani Murugan Kovil Mayil Mandapam, Thiruthani                                                       |
| Reception              | Same date, 7:00 PM onwards                                                                                |
| Reception venue        | I.C.F. Thiruvalluvar Thirumana Mandapam, No. 11, West Colony, 3rd Main Road, Anna Nagar, Chennai – 600038 |
| Groom’s family contact | +91 98414 34030                                                                                           |
| Bride’s family contact | +91 94448 85274                                                                                           |

English names follow the English printed invitation; Tamil names follow the Tamil invitation. All three original invitation pages remain accessible in the site, including extended family details.

## Features

- Personalized photographic hero, couple profiles, and family accordions.
- Opening invitation letter and a three-page viewer for the original invitation scans.
- Tamil–English language switch with remembered preference and matching document language.
- Live countdown using the explicit Asia/Kolkata UTC offset.
- Separate ceremony and reception directions and calendar downloads.
- A five-photo gallery with full-screen viewing, keyboard arrows, Escape, and an optional slideshow.
- A photographic wedding-day story, from Thiruthani in the morning to Chennai in the evening.
- A static family welcome letter, with the invitation’s Thirukkural and parents’ signatures.
- Call links for both families.
- Mobile layout, keyboard focus states, native dialog focus trapping, and reduced-motion support.

## Static closing sections

The guestbook and RSVP form have been replaced by two static editorial sections: **A day to remember. A lifetime to share.** and **Your presence makes the celebration complete.** Both are available in English and Tamil. The website collects no guestbook entries or RSVP responses. The navigation and invitation dialog now link to the closing family letter.

## Editing

- `src/lib/content.ts`: names, qualifications, families, dates, venues, contact numbers, photo paths, and invitation pages.
- `src/lib/translations.ts`: English and Tamil interface text.
- `src/components/WeddingExperience.tsx`: page sections and interactions.
- `src/app/globals.css`: layout, responsive rules, typography, palette, and motion.
- `src/lib/calendar.ts`: correctly escaped and UTF-8-folded iCalendar export.
- `src/app/layout.tsx`: title, description, social image, icon, and the deployed `metadataBase` origin. Update that origin if changing hosts.
- `public/photos/`: the five supplied personal photographs.
- `public/invitations/`: the three supplied invitation pages.

The former client’s photos, Ganesha asset, icons, petals, gallery, and audio are not included. No generated or stock photograph is used. Original uploaded image bytes are preserved.

Optional music is supported but disabled. To enable it, add your chosen licensed track to `public/audio/background.mp3`, then set `music` in the content file. Playback starts only when the visitor presses its control.

## Deploying

Use the included `out/` folder for a static host, or run the production build again after changing source. There is no server-side API route or guest-response database to configure. The hosted preview keeps a `.openai/hosting.json` file. That host-specific file is excluded from the portable project ZIP.

The source ZIP excludes installed dependencies, local caches, Git history, and preview credentials. Run `npm ci` to reinstall from the included lockfile.
