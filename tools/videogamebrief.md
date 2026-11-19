# videogamebrief.com: Livewire Grand Prix

`videogamebrief/racing/` is a Livewire-only copy of `racing/` for https://videogamebrief.com/racing/.
Livewire is the default brand (no query string); nothing Gamify ships (name, logos, Raceway voice lines,
gamify.com links, analytics, leaderboard). Regenerate with `node tools/make-videogamebrief.mjs` from the repo
root and commit; the script fails if any shipped file contains "gamify".

## Hosting
videogamebrief.com is the `videogamebrief` Cloudflare Worker (code in the Brain vault,
`03 - Gamify/Game Studio/videogamebrief.com/worker.js`). It proxies each path to the game's real home and keeps
the address bar on videogamebrief.com. This copy is served by GitHub Pages once merged to main, at
https://demos.gamify.com/videogamebrief/racing/, and the Worker line is:

    "racing": "https://demos.gamify.com/videogamebrief/racing/",

The files under `videogamebrief/` other than `racing/` (holding page, robots.txt, _headers) are not used by the
Worker, which serves its own.
