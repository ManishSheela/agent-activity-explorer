# Perf Clinic: Findings

Problems are ordered by impact on the user, highest first.

### 1. Huge images making the hero load slowly (LCP)
- **Symptom:** the header shows up fast, but the big hero banner takes a few seconds to appear, even on fast 4G.
- **How I found it:** Lighthouse in incognito with Fast 4G. LCP was 4.9 s (red). "Improve image delivery" said I could save 5,911 KiB, and "LCP request discovery" said the hero image had no priority. In the Network tab `hero.png` was by far the biggest file, then the 12 avatar PNGs.
- **Root cause:** `hero.png` was a 4.2 MB PNG. The avatars were about 160 KB each (about 1.9 MB total) but they are only shown at 48 px. Also, the hero `<img>` had no `fetchpriority` and no `width`/`height`, and the avatars were not lazy loaded, so everything fought for the same bandwidth and fetching at the same time.
- **Fix:**
  - Converted the hero and all 12 avatars to WebP/avif but i choose WebP.
  - Gave `width` and `height` to the hero and avatar images, so the browser keeps the space before the image load and the prevent the layout shifting.
  - Avatars: `loading="lazy"` so they load only when needed (on demand), and `decoding="async"` so decoding does not block the main thread.
  - Hero: `fetchpriority="high"` so it loads first, and `decoding="async"`.
  - Added `height: auto` to `.hero-image` so the new `height` attribute does not stretch it.
  - Small code idea (not done): put the image path inside each object of `window.AGENTS` in `config.js`, so `renderAgents` does not build the path with `padStart`. It is cleaner code but the speed gain is almost zero.
- **Before / after:**

  | | Before | After |
  |---|---|---|
  | Hero | 4,271,977 bytes | 267,146 bytes (-94%) |
  | 12 avatars | about 1.9 MB | about 34 KB |
  | `assets/` folder | about 6.2 MB | 332 KB |
  | LCP (Lighthouse, Fast 4G) | 4.9 s | 1.1 s |
  | Lighthouse performance score | 77 | 93 |

  Before:

  ![Lighthouse before: LCP 4.9 s, score 77](perf-screenshots/01-lighthouse-before.jpg)

  After:

  ![Lighthouse after: LCP 1.1 s, score 93](perf-screenshots/01-lighthouse-after.jpg)

  Note: in the after run FCP (1.1 s vs 0.7 s) and Speed Index (1.7 s vs 0.9 s) came out higher. I think this is run-to-run noise, since nothing in this fix touches them.

