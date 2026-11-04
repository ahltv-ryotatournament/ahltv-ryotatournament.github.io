/* AHLTV: рекламный баннер DMarket (главная и «Топ игроков»).
   Подключается одной строкой в index.html ПОСЛЕ i18n.js, перед </body>:
   <script src="dm-banner.js"></script>
   Текст баннера сам переключается RU / EN / DE вместе с переключателем языка сайта. */
(function(){
  if(window.__ahDmBanner)return;window.__ahDmBanner=true;

  var HREF="https://dmarket.com?ref=T53fdotOu3";
  var T={
    ru:{ad:"Реклама",t:"Продаёшь или меняешь скины CS2?",s:"DMarket: маркетплейс с разными способами вывода",b:"Перейти на DMarket",a:"Реклама: DMarket, маркетплейс скинов"},
    en:{ad:"Ad",t:"Selling or trading CS2 skins?",s:"DMarket: a marketplace with different withdrawal options",b:"Go to DMarket",a:"Ad: DMarket, a skin marketplace"},
    de:{ad:"Werbung",t:"Verkaufst oder tauschst du CS2-Skins?",s:"DMarket: Marktplatz mit verschiedenen Auszahlungsmethoden",b:"Zu DMarket",a:"Werbung: DMarket, Skin-Marktplatz"}
  };

  /* ---------- стили (цвета и шрифты берутся из переменных сайта) ---------- */
  var css=document.createElement("style");
  css.textContent=
   ".dm-ad{position:relative;display:flex;align-items:center;gap:1rem 1.6rem;margin-top:.8rem;padding:1.15rem 1.3rem;border:1px solid var(--line,#3a2217);border-radius:14px;background:var(--surface,#171010);color:var(--ink,#f6ede7);text-decoration:none;overflow:hidden;isolation:isolate;transition:border-color .25s ease,transform .25s ease,box-shadow .25s ease}"
  +"#top .dm-ad{margin-top:1.2rem}"
  /* мягкое оранжевое свечение, медленно дрейфует */
  +".dm-glow{position:absolute;inset:-50% -10%;z-index:-1;pointer-events:none;background:radial-gradient(38% 70% at 14% 50%,rgba(255,106,43,.20),transparent 70%),radial-gradient(32% 60% at 88% 40%,rgba(255,106,43,.11),transparent 70%);animation:dmDrift 9s ease-in-out infinite alternate}"
  /* блик, пробегающий по баннеру */
  +".dm-ad::after{content:'';position:absolute;top:0;bottom:0;left:-45%;width:30%;z-index:-1;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(255,255,255,.07),transparent);transform:skewX(-20deg);animation:dmShine 5.5s ease-in-out infinite}"
  /* декоративные «скины» */
  +".dm-sk{position:absolute;z-index:-1;pointer-events:none;border-radius:5px;background:var(--or,#ff6a2b);opacity:.16}"
  +".dm-sk.a{width:44px;height:12px;left:46%;top:20%;transform:rotate(-18deg);animation:dmFloat 6s ease-in-out infinite}"
  +".dm-sk.b{width:30px;height:9px;left:58%;top:68%;transform:rotate(14deg);animation:dmFloat 7.5s ease-in-out infinite reverse}"
  +".dm-body{display:flex;flex-direction:column;gap:.25rem;min-width:0;flex:1}"
  +".dm-t{font:800 1.2rem/1.2 var(--head,sans-serif);color:var(--ink,#f6ede7)}"
  +".dm-s{font:500 .92rem/1.35 var(--head,sans-serif);color:var(--muted,#a09088)}"
  +".dm-t::before,.dm-s::before,.dm-btn::before,.dm-tag::before{content:attr(data-t)}"
  +".dm-tag{position:absolute;top:.5rem;right:.8rem;font:700 .62rem var(--mono,monospace);letter-spacing:.16em;text-transform:uppercase;color:var(--muted,#a09088);opacity:.75}"
  +".dm-btn{flex:none;padding:.75rem 1.3rem;border-radius:10px;background:linear-gradient(180deg,var(--or,#ff6a2b),var(--or2,#f2501a));color:#fff;font:700 .95rem var(--head,sans-serif);white-space:nowrap;box-shadow:0 0 22px rgba(255,106,43,.35);animation:dmPulse 2.4s ease-in-out infinite}"
  +".dm-ad:focus-visible{outline:2px solid var(--or,#ff6a2b);outline-offset:3px}"
  +"@keyframes dmDrift{from{transform:translateX(-3%)}to{transform:translateX(3%)}}"
  +"@keyframes dmShine{0%{left:-45%}55%,100%{left:125%}}"
  +"@keyframes dmFloat{0%,100%{translate:0 0}50%{translate:0 -8px}}"
  +"@keyframes dmPulse{0%,100%{box-shadow:0 0 18px rgba(255,106,43,.3)}50%{box-shadow:0 0 30px rgba(255,106,43,.55)}}"
  +"@media (hover:hover){.dm-ad:hover{border-color:var(--or,#ff6a2b);transform:translateY(-2px);box-shadow:0 10px 26px rgba(0,0,0,.35)}}"
  +"@media (max-width:640px){"
  +".dm-ad{flex-direction:column;align-items:stretch;gap:.8rem;padding:1.1rem 1rem}"
  +".dm-tag{position:static;order:-1;align-self:flex-start}"
  +".dm-t{font-size:1.1rem}"
  +".dm-btn{display:flex;align-items:center;justify-content:center;min-height:48px;text-align:center;white-space:normal}"
  +"}"
  +"@media (prefers-reduced-motion:reduce){.dm-glow,.dm-ad::after,.dm-sk,.dm-btn{animation:none}}";
  document.head.appendChild(css);

  /* ---------- разметка ---------- */
  function make(){
    var a=document.createElement("a");
    a.className="dm-ad";a.href=HREF;a.target="_blank";a.rel="sponsored noopener noreferrer";
    a.innerHTML='<i class="dm-glow" aria-hidden="true"></i><i class="dm-sk a" aria-hidden="true"></i><i class="dm-sk b" aria-hidden="true"></i>'
      +'<span class="dm-tag" data-k="ad" aria-hidden="true"></span>'
      +'<span class="dm-body"><span class="dm-t" data-k="t"></span><span class="dm-s" data-k="s"></span></span>'
      +'<span class="dm-btn" data-k="b" aria-hidden="true"></span>';
    return a;
  }
  function put(sel){
    var anchor=document.querySelector(sel);
    if(anchor&&!anchor.parentNode.querySelector(".dm-ad"))anchor.insertAdjacentElement("afterend",make());
  }
  put("#home .stats");   // главная: под карточками «Режимы / Слоты / Допуск»
  put("#top .tw");       // «Топ игроков»: под таблицей рейтинга

  /* ---------- язык: следим за <html lang>, который ставит i18n.js ---------- */
  function lang(){var l=document.documentElement.lang;return T[l]?l:"ru"}
  function render(){
    var L=T[lang()];
    document.querySelectorAll(".dm-ad").forEach(function(a){
      a.setAttribute("aria-label",L.a);
      a.querySelectorAll("[data-k]").forEach(function(e){e.setAttribute("data-t",L[e.getAttribute("data-k")])});
    });
  }
  render();
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();
