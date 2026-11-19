# videogamebrief.com

Neutral host for pitch-deck demos (no Gamify name, logo or links anywhere a client can see).

- `/` holding page (noindex)
- `/racing/` Livewire Grand Prix, Livewire branding by default, no query string

`videogamebrief/racing/` is generated from `racing/` by `node tools/make-videogamebrief.mjs` (run from the repo root, then commit).
The script fails if any shipped file contains "gamify". Leaderboard is off (kept on each device), analytics off.

## Cloudflare Pages settings
- Repository: this repo; production branch: `videogamebrief`
- Build command: none; build output directory: `videogamebrief`
- Custom domain: `videogamebrief.com`
- `_headers` sends `X-Robots-Tag: noindex, nofollow` on every path; `robots.txt` disallows all.
