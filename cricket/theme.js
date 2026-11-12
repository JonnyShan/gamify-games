/*
 * THEME: every brand value the game shows. Gamify is the core brand (below); every other brand, Livewire
 * included, is a pack in brands/<id>/theme.json laid over it (README, "Brand packs").
 * Which brand: ?brand=<id> in the address, else the site's own brand (HOST_BRANDS), else Gamify.
 * Loaded as a classic script before the game module; the game reads window.THEME.
 */
(function () {
  var CORE = {
    id: "gamify",
    name: "Gamify",                       // brand name shown on the title screen and in the stadium
    title: "Gamify Cricket",              // document title
    titleLine1: "Gamify",                 // small line above the big CRICKET title
    screenTitle: "GAMIFY CRICKET",        // big screen + boards text
    colors: {
      accent: "#1F82D0",                  // replaces the old lime everywhere
      accentDeep: "#145A91",              // button shadow / darker accent
      accentLight: "#8CC4EE",             // highlights in sparks, confetti and the ball trail
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
      intro: "assets/intro/title.webp",   // title picture; a pack without one shows the title on the live stadium
      homeBatter: "assets/players/home-batter.glb",
      homeFielder: "assets/players/home-fielder.glb",
    },
    // the player textures are made in this accent (lime); it is repainted in the brand accent at load
    kitSourceAccent: "#CCFF00",
  };
  // sites that show their own brand by default
  var HOST_BRANDS = { "livewire.cricket.gamify.com": "livewire" };

  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = isObj(b[k]) && isObj(a[k]) ? merge(a[k], b[k]) : b[k]; return o; }
  function hexToRgb(h) { h = h.replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function rgbToHex(c) { return "#" + c.map(function (v) { return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); }).join("").toUpperCase(); }
  function mix(h, to, t) { var a = hexToRgb(h), b = hexToRgb(to); return rgbToHex(a.map(function (v, i) { return v + (b[i] - v) * t; })); }
  function lum(h) { var c = hexToRgb(h); return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; }

  function pack(id) {
    if (id === 'draft') { try { var d = localStorage.getItem('gamify-draft:cricket'); if (d) return JSON.parse(d); } catch (e) {} }
    try {
      var x = new XMLHttpRequest();
      x.open("GET", "brands/" + id + "/theme.json", false);   // sync: the game module reads THEME as it starts
      x.send();
      return x.status >= 200 && x.status < 300 ? JSON.parse(x.responseText) : null;
    } catch (e) { return null; }
  }

  var q = new URLSearchParams(location.search).get("brand");
  var id = q && /^[a-z0-9][a-z0-9-]{0,39}$/.test(q) ? q : HOST_BRANDS[location.hostname] || CORE.id;
  var t = CORE;
  if (id !== CORE.id) {
    var p = pack(id);
    if (!p) { console.warn('brand "' + id + '" not found, showing ' + CORE.id); }
    else {
      var base = "brands/" + id + "/", c = p.colors || {}, a = c.accent || CORE.colors.accent, name = p.name || id;
      // derived from the pack's accent and name unless the pack sets them
      var derived = {
        name: name, title: name + " Cricket", titleLine1: name, screenTitle: (name + " Cricket").toUpperCase(),
        colors: { accent: a, accentDeep: mix(a, "#000000", 0.35), accentLight: mix(a, "#FFFFFF", 0.6), accentMid: mix(a, "#000000", 0.15),
          onAccent: lum(a) > 0.6 ? "#1A1A1A" : "#FFFFFF" },
        markIsMulticolour: false,
      };
      t = merge(merge(CORE, derived), p);
      // the pack's files live in its folder; logos it leaves out use its wordmark; no core title picture
      ["wordmark", "lockup", "logomark"].forEach(function (k) {
        var own = (p.logos || {})[k] || (p.logos || {}).wordmark;
        t.logos[k] = own ? base + own : CORE.logos[k];
      });
      t.art = merge(CORE.art, {});
      t.art.intro = p.art && p.art.intro ? base + p.art.intro : null;
      t.id = id;
    }
  }
  window.THEME = t;

  var r = document.documentElement.style, cc = t.colors;
  r.setProperty("--gold", cc.accent); r.setProperty("--you", cc.accent); r.setProperty("--gold-deep", cc.accentDeep);
  r.setProperty("--on-accent", cc.onAccent); r.setProperty("--accent-rgb", hexToRgb(cc.accent).join(","));
  r.setProperty("--lockup", "url(" + t.logos.lockup + ")");
  document.title = t.title;
})();
