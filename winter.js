/* AHLTV Winter Theme 2.0
   Replaces winter.js; no changes to index.html, Firestore rules or the other scripts.
   Admin controls cfg/winter.on; everyone else sees the same live setting. */
(function () {
  "use strict";
  if (window.__ahWinter) return;
  window.__ahWinter = true;

  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var firebaseBase = "https://www.gstatic.com/firebasejs/10.14.1/";
  var text = {
    ru: {
      title: "Зимняя тема", description: "Мягкий снег, зимняя подсветка, гирлянды и праздничные детали на всём сайте.",
      on: "Включена", off: "Выключена", saved: "Сохранено. Тема обновлена для посетителей.",
      denied: "Нет доступа на запись cfg/winter в Firebase.", error: "Не удалось сохранить.",
      wait: "База данных ещё загружается."
    },
    en: {
      title: "Winter theme", description: "Gentle snow, icy highlights, holiday lights and festive details across the site.",
      on: "On", off: "Off", saved: "Saved. The theme was updated for visitors.",
      denied: "No permission to write cfg/winter in Firebase.", error: "Could not save.",
      wait: "The database is still loading."
    },
    de: {
      title: "Wintermodus", description: "Sanfter Schnee, winterliches Licht, Lichterketten und festliche Details auf der Website.",
      on: "An", off: "Aus", saved: "Gespeichert. Das Design wurde für Besucher aktualisiert.",
      denied: "Keine Schreibberechtigung für cfg/winter in Firebase.", error: "Speichern fehlgeschlagen.",
      wait: "Die Datenbank wird noch geladen."
    }
  };
  function tr() { return text[root.lang] || text.ru; }

  var style = document.createElement("style");
  style.id = "wt-styles";
  style.textContent = `
html[data-winter]{--or:#64cdff;--or2:#318bd1;--bg:#07121d;--surface:#0d1d2c;--line:#22425a;--ink:#eef7ff;--muted:#94b4cd;--blue:#89cfff;color-scheme:dark}
html[data-winter] body{background-color:#07121d;background-image:radial-gradient(ellipse 65% 40% at 50% -12%,rgba(78,162,219,.21),transparent 76%),linear-gradient(180deg,#07121d,#081824 60%,#07121d)}
html[data-winter] header{background:rgba(7,19,31,.88);border-bottom-color:rgba(123,205,255,.25);box-shadow:0 5px 28px rgba(0,5,14,.28)}
html[data-winter] .logo svg{filter:hue-rotate(158deg) saturate(.8) brightness(1.12) drop-shadow(0 0 10px rgba(109,201,255,.2))}
html[data-winter] .logo:hover svg{filter:hue-rotate(158deg) saturate(.9) brightness(1.22) drop-shadow(0 0 14px rgba(109,201,255,.4))}
html[data-winter] nav .cta{border-color:rgba(105,201,255,.44)}
html[data-winter] nav .cta:hover{color:#031727;background:linear-gradient(135deg,#83dbff,#399de6);box-shadow:0 0 20px rgba(78,180,245,.24)}
html[data-winter] .btn.main,html[data-winter] .seg button.on,html[data-winter] .dm-btn{color:#031827;background:linear-gradient(140deg,#83d9ff 0%,#39a8e9 80%,#2b8fe0 100%);box-shadow:0 5px 22px rgba(42,152,221,.22)}
html[data-winter] .btn.main:hover{box-shadow:0 7px 26px rgba(71,178,246,.34)}
html[data-winter] .lang button.on{color:#031827}
html[data-winter] .stat,html[data-winter] .pstat,html[data-winter] .timer,html[data-winter] .tcard,html[data-winter] .rule,html[data-winter] .field,html[data-winter] .m,html[data-winter] .tw,html[data-winter] .profile-panel,html[data-winter] .res{box-shadow:inset 0 1px 0 rgba(177,223,255,.045),0 9px 28px rgba(0,8,20,.14)}
html[data-winter] .timer{isolation:isolate}
html[data-winter] .timer::before{content:"";position:absolute;inset:0 0 auto;height:55%;pointer-events:none;z-index:0;background:radial-gradient(ellipse at 85% 0%,rgba(87,175,240,.1),transparent 70%)}
html[data-winter] .ad-box{border-color:#438bb8;background-color:#102638;box-shadow:inset 0 0 0 1px rgba(125,203,255,.08)}
html[data-winter] .ad-box::placeholder{color:#94b4cd}
html[data-winter] .ad-box:hover{border-color:#74c9ed}
html[data-winter] .ad-box:focus{background:#112b40;border-color:#9ae4ff;box-shadow:0 0 0 3px rgba(97,197,255,.18)}
html[data-winter] .pick.on{border-color:var(--or);background:rgba(92,200,255,.12);color:var(--or)}
html[data-winter] .dd-menu button:hover,html[data-winter] .dd-menu button:focus-visible{background:rgba(92,200,255,.1)}
html[data-winter] .tbl tr:hover td{background:rgba(92,200,255,.045)}
@media (hover:hover){html[data-winter] .stat:hover,html[data-winter] .pstat:hover,html[data-winter] .tcard:hover{border-color:#376888}}
html[data-winter] ::selection{background:#64cdff;color:#031827}
#wt-aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:.8;background:radial-gradient(ellipse 55% 28% at 12% 18%,rgba(47,141,186,.08),transparent 75%),radial-gradient(ellipse 44% 28% at 90% 8%,rgba(66,112,206,.09),transparent 75%);animation:wtAurora 22s ease-in-out infinite alternate}
#wt-aurora::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 48% 30% at 55% 78%,rgba(16,103,156,.05),transparent 80%)}
html[data-winter] main,html[data-winter] footer{position:relative;z-index:1}
#wt-snow{position:fixed;inset:0;width:100%;height:100%;z-index:20;pointer-events:none}
#wt-garland{position:fixed;top:0;left:0;right:0;height:34px;z-index:21;pointer-events:none;overflow:hidden;filter:drop-shadow(0 2px 7px rgba(95,193,255,.26));opacity:.94}
#wt-garland svg{display:block;width:100%;height:34px}
#wt-garland .wt-bulb{animation:wtGlow 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
#wt-garland .wt-bulb:nth-of-type(3n+1){animation-delay:-.7s}
#wt-garland .wt-bulb:nth-of-type(3n+2){animation-delay:-1.8s}
.wt-deco{position:fixed;bottom:0;z-index:19;pointer-events:none;display:flex;align-items:flex-end;gap:2px;opacity:.9}
.wt-deco.l{left:8px}.wt-deco.r{right:8px}
.wt-deco svg{display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.45))}
.wt-deco::before{content:"";position:absolute;left:-18px;right:-18px;bottom:-12px;height:39px;z-index:-1;background:radial-gradient(ellipse at 50% 70%,rgba(197,235,255,.28),transparent 74%);filter:blur(7px)}
.wt-star{animation:wtGlow 2.2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
#wt-admin{position:relative;display:flex;align-items:center;justify-content:space-between;gap:1rem 1.4rem;flex-wrap:wrap;overflow:hidden;margin:0 0 1.2rem;padding:1rem 1.2rem;border:1px solid rgba(104,175,219,.36);border-radius:14px;background:linear-gradient(125deg,rgba(40,103,141,.12),var(--surface) 70%);box-shadow:0 8px 22px rgba(0,0,0,.12)}
#wt-admin::before{content:"";position:absolute;inset:0 0 auto;height:1px;background:linear-gradient(90deg,transparent,rgba(139,215,255,.54),transparent);pointer-events:none}
#wt-admin b{display:block;font:800 1.1rem var(--head);color:var(--ink)}
#wt-admin b::before{content:"❄";display:inline-block;margin-right:.5rem;color:#7fd8ff;font-size:1.1rem}
#wt-admin small{display:block;margin-top:.2rem;font:500 .85rem/1.4 var(--head);color:var(--muted);max-width:34rem}
#wt-admin .wt-msg{flex-basis:100%;margin:0;min-height:1.2em;font:500 .85rem var(--head);color:var(--muted)}
#wt-sw{display:flex;align-items:center;gap:.7rem;min-height:44px;padding:.2rem .3rem;border:0;background:none;color:var(--ink);font:700 .85rem var(--mono);letter-spacing:.08em;text-transform:uppercase;cursor:pointer;touch-action:manipulation}
#wt-sw i{position:relative;flex:none;width:56px;height:30px;border-radius:999px;border:1px solid var(--line);background:var(--bg);transition:background-color .2s,border-color .2s,box-shadow .2s}
#wt-sw i::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:var(--muted);transition:transform .22s cubic-bezier(.22,.61,.36,1),background-color .2s}
#wt-sw[aria-checked="true"] i{background:rgba(92,200,255,.18);border-color:var(--or);box-shadow:0 0 16px rgba(79,173,233,.2)}
#wt-sw[aria-checked="true"] i::after{transform:translateX(26px);background:var(--or)}
#wt-sw:hover i{border-color:var(--or);box-shadow:0 0 0 3px rgba(98,194,255,.07)}
#wt-sw:focus-visible{outline:2px solid var(--or);outline-offset:3px;border-radius:10px}
#wt-sw:disabled{opacity:.6;cursor:wait}
@keyframes wtAurora{0%{opacity:.56;transform:translate3d(-1%,0,0)}100%{opacity:.95;transform:translate3d(1%,1%,0)}}
@keyframes wtGlow{0%,100%{opacity:1}50%{opacity:.48}}
@media(max-width:640px){.wt-deco{transform:scale(.62);transform-origin:bottom}.wt-deco.l{left:0}.wt-deco.r{right:0}#wt-garland,#wt-garland svg{height:28px}#wt-aurora{opacity:.5}#wt-admin{padding:.9rem}}
@media(max-width:420px){.wt-deco.r{display:none}}
@media(prefers-reduced-motion:reduce){#wt-aurora,#wt-garland .wt-bulb,.wt-star{animation:none!important}#wt-aurora{transform:none!important}}
`;
  document.head.appendChild(style);

  function starPts(cx, cy, outer, inner) {
    var coords = [];
    for (var i = 0; i < 10; i++) {
      var angle = -Math.PI / 2 + i * Math.PI / 5;
      var radius = i % 2 ? inner : outer;
      coords.push((cx + radius * Math.cos(angle)).toFixed(1) + "," + (cy + radius * Math.sin(angle)).toFixed(1));
    }
    return coords.join(" ");
  }
  function tree(w, h) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 80 110" aria-hidden="true" focusable="false">'
      + '<rect x="34" y="92" width="12" height="16" rx="2" fill="#6b3d1e"/>'
      + '<polygon points="40,22 12,62 68,62" fill="#1f7a45"/><polygon points="40,38 6,82 74,82" fill="#17653a"/>'
      + '<polygon points="40,54 2,100 78,100" fill="#10512e"/>'
      + '<polygon points="40,22 12,62 40,62" fill="rgba(255,255,255,.07)"/>'
      + '<path d="M20 62q20 8 40 0M14 82q26 10 52 0" fill="none" stroke="#eaf6ff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'
      + '<circle cx="30" cy="74" r="3.2" fill="#ff5a5a"/><circle cx="52" cy="70" r="3.2" fill="#ffd34d"/>'
      + '<circle cx="24" cy="92" r="3.2" fill="#5cc8ff"/><circle cx="46" cy="90" r="3.2" fill="#ff5a5a"/>'
      + '<circle cx="58" cy="94" r="3.2" fill="#ffd34d"/><circle cx="38" cy="50" r="2.8" fill="#5cc8ff"/>'
      + '<polygon class="wt-star" points="' + starPts(40, 15, 9, 4) + '" fill="#ffd34d"/></svg>';
  }
  function gift(w, h, primary, ribbon) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 40 40" aria-hidden="true" focusable="false">'
      + '<rect x="3" y="14" width="34" height="24" rx="2" fill="' + primary + '"/>'
      + '<rect x="1" y="9" width="38" height="8" rx="2" fill="' + primary + '"/>'
      + '<rect x="1" y="9" width="38" height="8" rx="2" fill="rgba(255,255,255,.18)"/>'
      + '<rect x="17.5" y="9" width="5" height="29" fill="' + ribbon + '"/>'
      + '<rect x="1" y="11.5" width="38" height="3.4" fill="' + ribbon + '" opacity=".9"/>'
      + '<path d="M20 9c-3-7-11-6-9-2 1 3 7 2 9 2zM20 9c3-7 11-6 9-2-1 3-7 2-9 2z" fill="' + ribbon + '"/></svg>';
  }
  function garlandSvg() {
    var width = 1600, step = 80;
    var colors = ["#ff7070", "#ffda74", "#71ceff", "#84dfb8", "#efb6f8"];
    var p = "M0 4", svg = '<svg viewBox="0 0 ' + width + ' 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">';
    for (var x = 0; x < width; x += step) p += " Q" + (x + step / 2) + " 20 " + (x + step) + " 4";
    svg += '<path d="' + p + '" fill="none" stroke="#1d3840" stroke-width="2"/>';
    var i = 0;
    for (var bx = 0; bx < width; bx += step) {
      [0.25, 0.5, 0.75].forEach(function (part) {
        var px = bx + step * part, py = 4 + 32 * part * (1 - part), color = colors[i++ % colors.length];
        svg += '<g class="wt-bulb"><circle cx="' + px + '" cy="' + (py + 4) + '" r="8" fill="' + color + '" opacity=".24"/>'
          + '<circle cx="' + px + '" cy="' + (py + 4) + '" r="4.1" fill="' + color + '"/></g>';
      });
    }
    return svg + "</svg>";
  }

  var decorations = null;
  function makeDecorations() {
    var aurora = document.createElement("div");
    aurora.id = "wt-aurora"; aurora.setAttribute("aria-hidden", "true");
    var garland = document.createElement("div");
    garland.id = "wt-garland"; garland.innerHTML = garlandSvg();
    var left = document.createElement("div"); left.className = "wt-deco l";
    left.innerHTML = gift(36,36,"#ce4652","#ffd26f") + tree(78,107) + gift(30,30,"#348cce","#eaf6ff");
    var right = document.createElement("div"); right.className = "wt-deco r";
    right.innerHTML = gift(32,32,"#7664cb","#ffd26f") + tree(66,91) + gift(40,40,"#218c74","#ff7070");
    return [aurora, garland, left, right];
  }

  var canvas = null, context = null, flakes = [], frame = 0;
  var width = 0, height = 0, pixelRatio = 1, previousFrame = 0, previousDraw = 0;
  var motionQuery = null, reducedMotion = false;
  try {
    motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = motionQuery.matches;
  } catch (e) {}

  function flakeCount() {
    var screenWidth = window.innerWidth;
    return Math.min(screenWidth < 640 ? 46 : 106, Math.max(22, Math.round(screenWidth / (screenWidth < 640 ? 10 : 17))));
  }
  function newFlake(initial) {
    var depth = 0.5 + Math.random() * 1.1;
    return {
      x: Math.random() * width, y: initial ? Math.random() * height : -14,
      radius: (0.65 + Math.random() * 1.1) * depth,
      velocity: (16 + Math.random() * 23) * depth,
      phase: Math.random() * Math.PI * 2, sway: (4 + Math.random() * 8) * depth,
      opacity: (0.35 + Math.random() * 0.35) * Math.min(depth, 1.3),
      depth: depth
    };
  }
  function drawSnow() {
    if (!context) return;
    context.clearRect(0,0,width,height);
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      context.globalAlpha = f.opacity;
      context.fillStyle = f.depth > 1.15 ? "#f2fbff" : "#cdeaff";
      context.beginPath(); context.arc(f.x,f.y,f.radius,0,Math.PI * 2); context.fill();
    }
    context.globalAlpha = 1;
  }
  function resizeSnow() {
    if (!canvas || !context) return;
    width = window.innerWidth; height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 1.8);
    canvas.width = Math.max(1,Math.round(width * pixelRatio));
    canvas.height = Math.max(1,Math.round(height * pixelRatio));
    context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    var amount = flakeCount();
    while (flakes.length < amount) flakes.push(newFlake(true));
    flakes.length = amount;
    drawSnow();
  }
  function snowFrame(time) {
    frame = 0;
    if (!canvas || reducedMotion || document.hidden) return;
    if (!previousFrame) previousFrame = time;
    var dt = Math.min((time - previousFrame) / 1000, 0.05); previousFrame = time;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.velocity * dt; f.phase += dt * 0.6; f.x += Math.sin(f.phase) * f.sway * dt;
      if (f.y > height + 14 || f.x < -24 || f.x > width + 24) flakes[i] = newFlake(false);
    }
    if (time - previousDraw > 27) { drawSnow(); previousDraw = time; }
    frame = requestAnimationFrame(snowFrame);
  }
  function startSnow() {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "wt-snow"; canvas.setAttribute("aria-hidden", "true");
      document.body.appendChild(canvas);
      context = canvas.getContext("2d");
      if (!context) { canvas.remove(); canvas = null; return; }
    }
    cancelAnimationFrame(frame); frame = 0; previousFrame = 0; previousDraw = 0;
    resizeSnow();
    if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(snowFrame);
  }
  function stopSnow() {
    cancelAnimationFrame(frame); frame = 0; previousFrame = 0; previousDraw = 0;
    if (canvas) { canvas.remove(); canvas = null; context = null; flakes = []; }
  }
  window.addEventListener("resize",function(){ if(canvas) resizeSnow(); },{passive:true});
  document.addEventListener("visibilitychange", function() {
    if (!canvas || reducedMotion) return;
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousFrame = 0; }
    else if (!frame) { previousFrame = 0; frame = requestAnimationFrame(snowFrame); }
  });
  if (motionQuery) {
    var onMotionChange = function(event) {
      reducedMotion = event.matches;
      if (!canvas) return;
      cancelAnimationFrame(frame); frame = 0; previousFrame = 0; drawSnow();
      if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(snowFrame);
    };
    if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);
    else if (motionQuery.addListener) motionQuery.addListener(onMotionChange);
  }

  var enabled = false, switchButton = null, switchLabel = null, title = null, subtitle = null, message = null, busy = false;
  function updateSwitch() {
    if (switchButton) switchButton.setAttribute("aria-checked", enabled ? "true" : "false");
    if (switchLabel) switchLabel.textContent = enabled ? tr().on : tr().off;
  }
  function apply(enabledNow) {
    enabledNow = !!enabledNow;
    if (enabledNow === enabled && (!enabledNow || decorations)) return;
    enabled = enabledNow;
    if (enabled) {
      root.setAttribute("data-winter","");
      if (!decorations) {
        decorations = makeDecorations();
        decorations.forEach(function(node){ document.body.appendChild(node); });
      }
      startSnow();
    } else {
      root.removeAttribute("data-winter");
      if (decorations) { decorations.forEach(function(node){node.remove();}); decorations = null; }
      stopSnow();
    }
    updateSwitch();
  }
  function cache(on) {
    try { localStorage.setItem("ah_winter",on ? "1" : "0"); } catch(e) {}
  }
  try { if (localStorage.getItem("ah_winter") === "1") apply(true); } catch(e) {}

  var firePromise = null;
  function firestore() {
    if (!firePromise) firePromise = Promise.all([
      import(firebaseBase + "firebase-app.js"),
      import(firebaseBase + "firebase-firestore.js")
    ]).then(function(modules) {
      return {api:modules[1],db:modules[1].getFirestore(modules[0].getApp())};
    });
    return firePromise;
  }
  function localMode() { return !!(window.DB && window.DB.local); }
  function readSetting() {
    if (localMode()) {
      try { return Promise.resolve(localStorage.getItem("ah_winter_cfg") === "1"); }
      catch(e) { return Promise.resolve(false); }
    }
    return firestore().then(function(db) {
      return db.api.getDoc(db.api.doc(db.db,"cfg","winter")).then(function(doc) {
        return doc.exists() && doc.data().on === true;
      });
    });
  }
  function writeSetting(on) {
    if (localMode()) {
      try { localStorage.setItem("ah_winter_cfg",on ? "1" : "0"); } catch(e) {}
      return Promise.resolve();
    }
    return firestore().then(function(db) {
      return db.api.setDoc(db.api.doc(db.db,"cfg","winter"),{on:on});
    });
  }
  function sync() {
    if (!window.DB) return;
    readSetting().then(function(value) { cache(value); apply(value); }).catch(function(){});
  }
  var live = false, fallbackTimer = 0;
  function usePollingFallback() {
    live = false;
    if (fallbackTimer) return;
    sync();
    fallbackTimer = setInterval(function(){ if (!document.hidden) sync(); },300000);
  }
  function beginWatch(retries) {
    if (!window.DB) {
      if (retries > 0) setTimeout(function(){ beginWatch(retries-1); },600);
      return;
    }
    if (localMode()) {
      sync();
      window.addEventListener("storage",function(event) {
        if (event.key === "ah_winter_cfg") sync();
      });
      return;
    }
    firestore().then(function(db) {
      db.api.onSnapshot(db.api.doc(db.db,"cfg","winter"),function(snapshot) {
        live = true;
        var on = snapshot.exists() && snapshot.data().on === true;
        cache(on); apply(on);
      },usePollingFallback);
    }).catch(usePollingFallback);
  }
  beginWatch(20);
  document.addEventListener("visibilitychange",function(){ if (!document.hidden && !live) sync(); });

  function setMessage(value) { if(message) message.textContent = value || ""; }
  function translateAdmin() {
    if(title) title.textContent = tr().title;
    if(subtitle) subtitle.textContent = tr().description;
    updateSwitch();
  }
  var tabs = $("ad-tabs");
  if (tabs && tabs.parentNode) {
    var box = document.createElement("div");
    box.id = "wt-admin";
    box.innerHTML = '<div><b id="wt-t"></b><small id="wt-s"></small></div>'
      + '<button id="wt-sw" type="button" role="switch" aria-checked="false"><i></i><span id="wt-l"></span></button>'
      + '<p class="wt-msg" id="wt-m" aria-live="polite"></p>';
    tabs.parentNode.insertBefore(box,tabs);
    switchButton=$("wt-sw"); switchLabel=$("wt-l"); title=$("wt-t"); subtitle=$("wt-s"); message=$("wt-m");
    switchButton.addEventListener("click",function() {
      if (busy || !window.isAdmin || !window.isAdmin()) return;
      if (!window.DB) {setMessage(tr().wait);return;}
      var next = !enabled; busy = true; switchButton.disabled = true;
      writeSetting(next).then(function() {
        cache(next); apply(next); setMessage(tr().saved);
      }).catch(function(error) {
        setMessage(error && error.code === "permission-denied" ? tr().denied : tr().error);
      }).finally(function() {
        busy = false; switchButton.disabled = false;
      });
    });
  }
  translateAdmin();
  new MutationObserver(translateAdmin).observe(root,{attributes:true,attributeFilter:["lang"]});
})();
