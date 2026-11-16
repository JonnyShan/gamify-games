# Gamify sports promo

`gamify-sports-promo-9x16.mp4`: 30 seconds, 1080x1920. Intro card, then 3.5 seconds of each of the 8 sports games with a label, then "Same game. Your brand. gamify.com". No audio yet.

How it was made:
- Football, cricket, basketball, American football, tennis and golf were cut from Jonny's phone screen recordings (16 Nov 2026). Grand Prix and Hot Lap come from `tools/record-clip.js` (game autopilot).
- `tools/picks-moments.txt` lists the start second used from each source.
- `tools/cards.js` renders the intro, outro and label overlays in the gamify.com/games hero style.
- `tools/build.py` trims, crops off the phone bars, overlays the labels and joins everything with short fades.
