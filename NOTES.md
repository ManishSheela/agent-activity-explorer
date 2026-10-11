# Notes

## What I built

**Part A (`app/`)**

I built the Agent Activity Explorer with an event table, infinite scroll, search, agent and status filters, and a detail panel. Search, filters, and the selected event are stored in the URL, so refresh, browser back/forward, and shared links work as expected.

I also handled loading, empty, error, retry, and slow-network states for the event table, detail panel, and agent filter.

**Part B (`perf-clinic/`)**

I fixed 8 performance issues and documented them in `PERF.md`, including how I found each issue, the fix, before-and-after measurements, and the final Lighthouse score.

## Optional items

I built a virtualized list from scratch without using a virtualization library. Since the dataset contains 50,000 events, rendering every row at once would be wasteful.

I also added dark mode based on the system setting, `prefers-reduced-motion` support, and a tablet layout where the detail panel opens over the table below 1024px. Keyboard users can open and close the panel using Tab, Enter, Space, and Esc, with focus management when opening and closing it.

I skipped live mode, the histogram chart, and automated tests. I preferred to get the core features working properly rather than rush through the optional ones.

## Why Vite instead of Next.js

This is a client-side dashboard that calls an existing API with CORS enabled. I didn't need server-side rendering or API routes, so Vite was the simpler choice with less setup.

## Tradeoffs

- **TanStack Query:** Handles loading, errors, retries, pagination, and cancellation of outdated requests. It adds a dependency but avoids writing and maintaining that logic myself.
- **URL state:** I used React Router to keep the search, filters, and selected event in the URL. This makes refresh, browser navigation, and sharing a specific view work naturally.
- **Virtualization:** The list uses a fixed row height of 48px. This keeps rendering and scrolling simple, but rows cannot have different heights.
- **UI components:** I used shadcn/ui and Tailwind for menus, popovers, and selects rather than building everything from scratch.
- **Performance:** I followed best practices to keep the Lighthouse score close to perfect.

## Known issues and incomplete work

- Arrow-key navigation through the list isn't implemented. Rows can still be reached using Tab.
- If the selected row has scrolled out of view, pressing Esc closes the panel, but focus cannot return to that row.
- I haven't checked contrast with an accessibility testing tool. The table is also missing `aria-rowcount` and `aria-rowindex`.
- The total event count isn't shown in the UI.
- There is no date-range filter, although the API supports `from` and `to`. Sorting is also not implemented because the API doesn't provide it.
- Automated tests are not included.
- Other Part B improvements I didn't get to are listed under **Further improvements** in `PERF.md`.

With more time, I'd add arrow-key navigation, tests for URL filter handling and the scroll hook, a date-range filter, and the histogram chart.

## How I used AI tools

I used Claude Code (Anthropic) as a coding assistant for both parts of the assignment. I used it to speed up implementation and documentation while staying involved in the technical decisions and reviewing the changes.

**Part A:** I planned the folder structure, decided how data should flow through the application, and chose to separate business logic from UI components using custom hooks. For example, I designed the `useInfiniteScroll` hook to handle both infinite scrolling and list virtualization. I used Claude Code to help implement this approach rather than letting it decide the architecture for me. I reviewed the generated code and tested the application against the mock API, along with running the build and lint checks.

**Part B:** I identified the performance bottlenecks myself by inspecting the code and investigating the page in DevTools. I used Claude Code to help fix the `updateOnScroll` function and document my findings in `PERF.md`. It also helped me prepare `NOTES.md`. I ran the performance checks and collected the before-and-after measurements myself, using those results to document the impact of the fixes.
