# Specification

## Summary
**Goal:** Ensure the Contact page Google Map reliably shows the exact Rajdhani Beej Bhandar location and polish the map/location section UI for a more professional look.

**Planned changes:**
- Update `frontend/src/constants/contact.ts` to keep `CONTACT_INFO.googleMapsLink` exactly as provided and replace `CONTACT_INFO.googleMapsEmbedUrl` with a valid Google Maps embed URL that points to the same correct location.
- Adjust the Contact page (`frontend/src/pages/ContactPage.tsx`) so the iframe and the “Open in Google Maps” button consistently reference the same location, with the button opening in a new tab.
- Add lightweight resilience so if the map embed fails to load, the Contact page remains stable and the “Open in Google Maps” link still works.
- Improve visual polish of the map/location section UI (spacing, card/frame styling, typography hierarchy, responsive aspect ratio, subtle border/shadow, consistent rounding) without changing core content, adding heavy animations, or introducing non-English hardcoded text.

**User-visible outcome:** The Contact page displays a correctly pinned Rajdhani Beej Bhandar map embed, the “Open in Google Maps” button opens the same exact location, and the map section looks cleaner and more professional while remaining fast and stable.
