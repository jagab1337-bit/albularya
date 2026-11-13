# Albularya Café

A luxury website concept for a Filipino herbal café, island pantry and restorative lounge in Siargao. **Design preview for review.**

## Run locally

No dependencies or build step required. With Python 3:

```sh
python3 -m http.server 3000 --directory dist
```

Open http://localhost:3000. Run `npm run build` to check the application JavaScript.

## Design

The complete Albularya logo is prepared from the user-supplied artwork reference and used consistently in every header, footer and browser icon. The original phone screenshot is not included in the repository.

Cormorant Garamond display typography with the deck's Lexend supporting text. Fonts are self-hosted, with OFL licenses in `dist/assets/fonts/`. The original pitch deck's palette is preserved:

| Color | Hex |
| --- | --- |
| Forest | `#1c2b24` |
| Ivory | `#f5efe3` |
| Sand | `#eae1d0` |
| Terracotta | `#a4532a` |
| Ochre | `#d9a542` |

The 11 original illustrative concept images were cropped from the supplied deck and optimized as WebP. The featured TCM tea photograph is by [Ivan S on Pexels](https://www.pexels.com/photo/teacups-and-teapots-on-wooden-table-8952396/) under the [Pexels License](https://www.pexels.com/license/); the source and processing details are recorded in `dist/assets/tcm-tea-source.json`. The private investor PDF and financial projections are excluded.

## Interactions

- Six menu tabs, including keyboard navigation.
- Mobile navigation, image lightboxes and lounge details.
- Interest form with validation and browser-only persistence, including deletion of saved details.
- Generous animated botanical backgrounds across every page, including café/lounge copy and article margins.
- A gently unfolding brand leaf and stars that spin steadily at rest, accelerate with scroll speed in either direction, then ease back to their idle pace.
- Subtle scroll parallax, image zoom, scrolling ribbon, and section reveals.
- A dedicated back-to-top action that reaches document position zero on every page.
- A sticky Blog link and `/blogs/` journal with four complete sample stories and a highlighted TCM tea feature.
- Reduced-motion support, named dialogs, focus handling and a skip link.

## Vercel

Import `jagab1337-bit/albularya` from GitHub. Use **Other** for the framework, the repository root for Root Directory, `npm run build` for Build Command, and `dist` for Output Directory. No installation or environment variables are required. These settings are provided in `vercel.json`.

Deploy to the **Preview** environment for design review. Production release should follow review of the design, copy and operating details.

## Preview boundaries

Venue, menu and services are planned concepts. This static preview does not send emails, create bookings or process payments. The form explicitly explains that details stay in the visitor's browser. Opening date, exact address, final prices and contact channels still need confirmation. Raya Clinic controls clinical screening and booking for its services.

## Journal routes

- `/blogs/`
- `/blogs/tcm-tea-traditions/`
- `/blogs/filipino-botanical-pantry/`
- `/blogs/a-slower-island-morning/`
- `/blogs/the-art-of-a-daily-ritual/`

Stories are original sample editorial written for the mockup, using the deck imagery and the credited Pexels tea photograph. All decorative motion respects reduced-motion preferences; offscreen leaf animation is paused.
