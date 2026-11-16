# Gamify sports promo

`gamify-sports-promo-9x16.mp4`: 31.5 seconds, 1080x1920. Intro card, then 3.5 to 4.2 seconds of each of the 8 sports games with a label, then "Same game. Your brand. gamify.com". No audio yet.

How it was made:
- Football, cricket, basketball, American football, tennis and golf were cut from Jonny's phone screen recordings (16 Nov 2026). Grand Prix and Hot Lap come from `tools/record-clip.js` (game autopilot).
- `tools/picks-moments.txt` lists the start second used from each source.
- `tools/cards.js` renders the intro, outro and label overlays in the gamify.com/games hero style.
- `tools/build.py` trims, crops off the phone bars, overlays the labels and joins everything with short fades.

## All games promo

`gamify-all-games-promo-9x16.mp4`: about 33 seconds, 1080x1920. "One studio. Every kind of game." A fast sports montage (8 games, about 1.6 seconds each), then 8 branded arcade and story games at about 2.4 seconds each, each labelled with genre and client, ending on "Any game. Your brand. gamify.com".
- Branded clips come from the library hover clips (real gameplay from gamify.com). The Great Debate is the game's own stage video with the vote cards from a screenshot of greatdebategame.com (`tools/all/debate-play.mp4`).
- The puzzle games are left out (Jonny, 16 Nov).
- Net Zero Hero is left out: its clip is an ad, not gameplay. The Jackal is waiting on a phone recording and Sky's OK.
- `tools/all/moments.txt` lists each source and start second; `cards_all.js` and `build_all.py` make it.
