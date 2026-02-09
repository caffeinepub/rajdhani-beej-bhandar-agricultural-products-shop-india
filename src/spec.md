# Specification

## Summary
**Goal:** Let admins save a single “Reference Website” URL and optional notes so future UI work can intentionally match a provided reference site.

**Planned changes:**
- Add an admin-only “Reference Website” page reachable from the Admin Dashboard/admin navigation.
- Provide a required URL input, optional multi-line notes field, and Save/Cancel actions.
- Persist the saved URL/notes in the backend canister, enforcing admin-only writes and rejecting non-admin callers.
- Display the saved URL/notes after reload with a safe “Open link” action that opens in a new tab.
- Add a read-only reminder display in the existing admin area (e.g., Admin Dashboard card/section), showing the saved URL with “Open link”, or a placeholder if not set.
- Include clear loading and error states on the page and avoid crashing on backend failures.

**User-visible outcome:** Admins can store and review a reference website link (and notes) in the admin area, open it safely in a new tab, and see a reminder of the saved reference link elsewhere in the admin UI.
