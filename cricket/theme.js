/*
 * THEME: every brand value the game shows lives here. A reskin is a one-file change
 * (plus the logo files in assets/brand/ and any kit textures named below).
 * Loaded as a classic script before the game module; the game reads window.THEME.
 */
window.THEME = {
  name: "Gamify",                       // brand name shown on the title screen and in the stadium
  title: "Gamify Cricket",              // document title
  titleLine1: "Gamify",                 // small line above the big CRICKET title
  screenTitle: "GAMIFY CRICKET",        // big screen + boards text
  colors: {
    accent: "#1F82D0",                  // electric blue: replaces the old lime everywhere
    accentDeep: "#145A91",              // button shadow / darker accent
    accentLight: "#8CC4EE",             // highlights in sparks and confetti
    accentMid: "#1A6DB0",               // second accent shade (crowd scarves, flags)
    onAccent: "#FFFFFF",                // text and marks drawn on the accent
    dark: "#1A1A1A",                    // onyx panels
    light: "#F1F1F1",                   // ivory
    kit: "#2B2D31",                     // home kit: graphite
  },
  logos: {                              // white-on-transparent; tinted on demand
    wordmark: "assets/brand/wordmark.png",
    lockup: "assets/brand/lockup.png",
    logomark: "assets/brand/logomark.png",
  },
  markIsMulticolour: true,              // the seven-dot mark is drawn in its own colours, never tinted
  art: {
    intro: "assets/intro/title.webp",
    homeBatter: "assets/players/home-batter.glb",
    homeFielder: "assets/players/home-fielder.glb",
  },
};
(function (t) {
  var r = document.documentElement.style, c = t.colors;
  function rgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join(","); }
  r.setProperty("--gold", c.accent); r.setProperty("--you", c.accent); r.setProperty("--gold-deep", c.accentDeep);
  r.setProperty("--on-accent", c.onAccent); r.setProperty("--accent-rgb", rgb(c.accent));
  document.title = t.title;
})(window.THEME);
