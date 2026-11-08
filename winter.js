/* AHLTV: зимняя тема для всего сайта: снег, гирлянда, ёлки, подарки, ледяная палитра.
   Включается и выключается переключателем в админке (виден только админам), действует у ВСЕХ посетителей.
   Подключается одной строкой в index.html ПОСЛЕ tournaments.js и ПЕРЕД i18n.js:
   <script src="winter.js"></script>
   Состояние хранится в Firestore: cfg/winter = {on:true/false}. Правило cfg/{doc} у вас уже есть
   (читают все, пишет админ), новых правил добавлять не нужно. */
(function(){
  if(window.__ahWinter)return;window.__ahWinter=true;
  var B="https://www.gstatic.com/firebasejs/10.14.1/";
  var H=document.documentElement;
  function $(i){return document.getElementById(i)}

  /* ---------- тексты (RU / EN / DE) ---------- */
  var T={
    ru:{t:"Зимняя тема",s:"Снег, гирлянда, ёлки и подарки на всём сайте. Включается сразу у всех посетителей.",on:"Включена",off:"Выключена",
      saved:"Сохранено. Тема изменится у всех.",denied:"Firebase запретил запись. Нужно правило для cfg/{doc} (запись админом).",fail:"Не удалось сохранить.",wait:"База ещё загружается, попробуйте через пару секунд."},
    en:{t:"Winter theme",s:"Snow, garland, trees and gifts across the whole site. Applies to all visitors immediately.",on:"On",off:"Off",
      saved:"Saved. The theme changes for everyone.",denied:"Firebase denied the write. A rule for cfg/{doc} (admin write) is needed.",fail:"Could not save.",wait:"The database is still loading, try again in a couple of seconds."},
    de:{t:"Wintermodus",s:"Schnee, Lichterkette, Tannenbäume und Geschenke auf der ganzen Seite. Gilt sofort für alle Besucher.",on:"An",off:"Aus",
      saved:"Gespeichert. Das Design ändert sich für alle.",denied:"Firebase hat das Schreiben verweigert. Eine Regel für cfg/{doc} (Schreiben durch Admin) ist nötig.",fail:"Speichern fehlgeschlagen.",wait:"Die Datenbank lädt noch, versuche es in ein paar Sekunden erneut."}
  };
  function L(){return T[H.lang]||T.ru}

  /* ---------- зимняя палитра: переопределяем переменные сайта ---------- */
  var css=document.createElement("style");
  css.textContent=
   "html[data-winter]{--or:#5cc8ff;--or2:#2b8fe0;--bg:#07121d;--surface:#0d1d2c;--line:#1d3a54;--ink:#eef7ff;--muted:#8fb2cc}"
  +"html[data-winter] body{background-image:radial-gradient(60% 40% at 50% -5%,rgba(92,200,255,.14),transparent 70%)}"
  +"html[data-winter] .btn.main,html[data-winter] .dm-btn,html[data-winter] .lang button.on{color:#04111c}"
  +"html[data-winter] ::selection{background:#5cc8ff;color:#04111c}"
  /* снег */
  +"#wt-snow{position:fixed;inset:0;width:100%;height:100%;z-index:20;pointer-events:none}"
  /* гирлянда */
  +"#wt-garland{position:fixed;top:0;left:0;right:0;height:30px;z-index:21;pointer-events:none;overflow:hidden}"
  +"#wt-garland svg{display:block;width:100%;height:30px}"
  +"#wt-garland .bl{animation:wtTw 1.6s ease-in-out infinite}"
  +"#wt-garland .bl:nth-of-type(3n+1){animation-delay:-.5s}#wt-garland .bl:nth-of-type(3n+2){animation-delay:-1.1s}"
  /* ёлки и подарки по нижним углам */
  +".wt-deco{position:fixed;bottom:0;z-index:19;pointer-events:none;display:flex;align-items:flex-end;gap:2px;opacity:.95}"
  +".wt-deco.l{left:8px}.wt-deco.r{right:8px}"
  +".wt-deco svg{display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.45))}"
  +".wt-star{animation:wtTw 2.2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}"
  +"@media (max-width:640px){.wt-deco{transform:scale(.62);transform-origin:bottom}.wt-deco.l{left:0}.wt-deco.r{right:0}}"
  +"@media (max-width:420px){.wt-deco.r{display:none}}"
  /* переключатель в админке */
  +"#wt-admin{display:flex;align-items:center;justify-content:space-between;gap:1rem 1.4rem;flex-wrap:wrap;margin:0 0 1.2rem;padding:1rem 1.2rem;border:1px solid var(--line);border-radius:14px;background:var(--surface)}"
  +"#wt-admin b{display:block;font:800 1.1rem var(--head);color:var(--ink)}"
  +"#wt-admin small{display:block;margin-top:.2rem;font:500 .85rem/1.4 var(--head);color:var(--muted);max-width:34rem}"
  +"#wt-admin .wt-msg{flex-basis:100%;margin:0;min-height:1.2em;font:500 .85rem var(--head);color:var(--muted)}"
  +"#wt-sw{display:flex;align-items:center;gap:.7rem;min-height:44px;padding:.2rem .3rem;border:0;background:none;color:var(--ink);font:700 .85rem var(--mono);letter-spacing:.08em;text-transform:uppercase;cursor:pointer;touch-action:manipulation}"
  +"#wt-sw i{position:relative;flex:none;width:56px;height:30px;border-radius:999px;border:1px solid var(--line);background:var(--bg);transition:background-color .2s ease,border-color .2s ease}"
  +"#wt-sw i::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:var(--muted);transition:transform .22s cubic-bezier(.22,.61,.36,1),background-color .2s ease}"
  +"#wt-sw[aria-checked=true] i{background:rgba(92,200,255,.18);border-color:var(--or)}"
  +"#wt-sw[aria-checked=true] i::after{transform:translateX(26px);background:var(--or)}"
  +"#wt-sw:focus-visible{outline:2px solid var(--or);outline-offset:3px;border-radius:10px}"
  +"@keyframes wtTw{0%,100%{opacity:1}50%{opacity:.35}}"
  +"@media (prefers-reduced-motion:reduce){#wt-garland .bl,.wt-star{animation:none}}";
  document.head.appendChild(css);

  /* ---------- украшения ---------- */
  function tree(w,h,id){
    return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 80 110" aria-hidden="true" focusable="false">'
     +'<rect x="34" y="92" width="12" height="16" rx="2" fill="#6b3d1e"/>'
     +'<polygon points="40,22 12,62 68,62" fill="#1f7a45"/><polygon points="40,38 6,82 74,82" fill="#17653a"/><polygon points="40,54 2,100 78,100" fill="#10512e"/>'
     +'<polygon points="40,22 12,62 40,62" fill="rgba(255,255,255,.07)"/>'
     +'<path d="M20 62q20 8 40 0M14 82q26 10 52 0" fill="none" stroke="#eaf6ff" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>'
     +'<circle cx="30" cy="74" r="3.2" fill="#ff5a5a"/><circle cx="52" cy="70" r="3.2" fill="#ffd34d"/><circle cx="24" cy="92" r="3.2" fill="#5cc8ff"/><circle cx="46" cy="90" r="3.2" fill="#ff5a5a"/><circle cx="58" cy="94" r="3.2" fill="#ffd34d"/><circle cx="38" cy="50" r="2.8" fill="#5cc8ff"/>'
     +'<polygon class="wt-star" points="'+starPts(40,15,9,4)+'" fill="#ffd34d"/></svg>';
  }
  function starPts(cx,cy,R,r){var p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;p.push((cx+q*Math.cos(a)).toFixed(1)+","+(cy+q*Math.sin(a)).toFixed(1))}return p.join(" ")}
  function gift(w,h,c1,c2){
    return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 40 40" aria-hidden="true" focusable="false">'
     +'<rect x="3" y="14" width="34" height="24" rx="2" fill="'+c1+'"/><rect x="1" y="9" width="38" height="8" rx="2" fill="'+c1+'"/>'
     +'<rect x="1" y="9" width="38" height="8" rx="2" fill="rgba(255,255,255,.18)"/>'
     +'<rect x="17.5" y="9" width="5" height="29" fill="'+c2+'"/><rect x="1" y="11.5" width="38" height="3.4" fill="'+c2+'" opacity=".9"/>'
     +'<path d="M20 9c-3-7-11-6-9-2 1 3 7 2 9 2zM20 9c3-7 11-6 9-2-1 3-7 2-9 2z" fill="'+c2+'"/></svg>';
  }
  function garlandSvg(){
    var w=1600,cols=["#ff5a5a","#ffd34d","#5cc8ff","#7be07b","#ff9bd2"],s='<svg viewBox="0 0 '+w+' 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">';
    var step=80,path="M0 4";
    for(var x=0;x<w;x+=step)path+=" Q"+(x+step/2)+" 20 "+(x+step)+" 4";
    s+='<path d="'+path+'" fill="none" stroke="#10351f" stroke-width="2"/>';
    var i=0;
    for(var x2=0;x2<w;x2+=step){
      [0.25,0.5,0.75].forEach(function(f){
        var t=f,px=x2+step*t,py=4+2*(1-t)*t*16;
        var c=cols[i++%cols.length];
        s+='<g class="bl"><circle cx="'+px.toFixed(1)+'" cy="'+(py+4).toFixed(1)+'" r="4.2" fill="'+c+'"/><circle cx="'+px.toFixed(1)+'" cy="'+(py+4).toFixed(1)+'" r="8" fill="'+c+'" opacity=".22"/></g>';
      });
    }
    return s+'</svg>';
  }
  var deco=null;
  function buildDeco(){
    var g=document.createElement("div");g.id="wt-garland";g.innerHTML=garlandSvg();
    var l=document.createElement("div");l.className="wt-deco l";
    l.innerHTML=gift(36,36,"#d63b3b","#ffd34d")+tree(78,107)+gift(30,30,"#2f7fe0","#eaf6ff");
    var r=document.createElement("div");r.className="wt-deco r";
    r.innerHTML=gift(32,32,"#7b4fd6","#ffd34d")+tree(66,91)+gift(40,40,"#1f9a58","#ff5a5a");
    return [g,l,r];
  }

  /* ---------- снег ---------- */
  var cv=null,ctx=null,flakes=[],raf=0,W=0,Hh=0,dpr=1,still=false;
  try{still=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
  function count(){return Math.max(30,Math.min(130,Math.round(window.innerWidth/(window.innerWidth<640?11:14))))}
  function mk(init){
    return {x:Math.random()*W,y:init?Math.random()*Hh:-10,r:Math.random()*2.4+.8,v:Math.random()*.9+.4,s:Math.random()*Math.PI*2,sw:Math.random()*.9+.3,o:Math.random()*.5+.45};
  }
  function size(){
    if(!cv)return;
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth;Hh=window.innerHeight;
    cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=count();while(flakes.length<n)flakes.push(mk(true));flakes.length=n;
  }
  function draw(){
    ctx.clearRect(0,0,W,Hh);
    ctx.fillStyle="#fff";
    for(var i=0;i<flakes.length;i++){
      var f=flakes[i];
      ctx.globalAlpha=f.o;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,6.2832);ctx.fill();
    }
    ctx.globalAlpha=1;
  }
  function tick(){
    for(var i=0;i<flakes.length;i++){
      var f=flakes[i];
      f.y+=f.v;f.s+=.012;f.x+=Math.sin(f.s)*f.sw*.6;
      if(f.y>Hh+10||f.x<-20||f.x>W+20){flakes[i]=mk(false);flakes[i].x=Math.random()*W}
    }
    draw();raf=requestAnimationFrame(tick);
  }
  function startSnow(){
    if(!cv){
      cv=document.createElement("canvas");cv.id="wt-snow";cv.setAttribute("aria-hidden","true");
      document.body.appendChild(cv);ctx=cv.getContext("2d");
    }
    size();cancelAnimationFrame(raf);
    if(still)draw();else raf=requestAnimationFrame(tick);
  }
  function stopSnow(){cancelAnimationFrame(raf);raf=0;if(cv){cv.remove();cv=null;ctx=null;flakes=[]}}
  window.addEventListener("resize",function(){if(cv){size();if(still)draw()}});
  document.addEventListener("visibilitychange",function(){
    if(!cv||still)return;
    if(document.hidden){cancelAnimationFrame(raf);raf=0}else if(!raf)raf=requestAnimationFrame(tick);
  });

  /* ---------- включение / выключение ---------- */
  var ON=false;
  function apply(on){
    on=!!on;
    if(on===ON&&(!on||deco))return;
    ON=on;
    if(on){
      H.setAttribute("data-winter","");
      if(!deco){deco=buildDeco();deco.forEach(function(n){document.body.appendChild(n)})}
      startSnow();
    }else{
      H.removeAttribute("data-winter");
      if(deco){deco.forEach(function(n){n.remove()});deco=null}
      stopSnow();
    }
    paintSw();
  }
  function cacheSet(on){try{localStorage.setItem("ah_winter",on?"1":"0")}catch(e){}}
  // без «мигания»: сразу применяем последнее известное состояние, потом сверяем с базой
  try{if(localStorage.getItem("ah_winter")==="1")apply(true)}catch(e){}

  /* ---------- хранилище: cfg/winter = {on} ---------- */
  var FSX=null;
  function fsx(){
    if(!FSX)FSX=Promise.all([import(B+"firebase-app.js"),import(B+"firebase-firestore.js")]).then(function(m){return {F:m[1],db:m[1].getFirestore(m[0].getApp())}});
    return FSX;
  }
  function isLocal(){return !!(window.DB&&window.DB.local)}
  function readCfg(){
    if(isLocal()){try{return Promise.resolve(localStorage.getItem("ah_winter_cfg")==="1")}catch(e){return Promise.resolve(false)}}
    return fsx().then(function(o){return o.F.getDoc(o.F.doc(o.db,"cfg","winter")).then(function(d){return d.exists()&&d.data().on===true})});
  }
  function writeCfg(on){
    if(isLocal()){try{localStorage.setItem("ah_winter_cfg",on?"1":"0")}catch(e){}return Promise.resolve()}
    return fsx().then(function(o){return o.F.setDoc(o.F.doc(o.db,"cfg","winter"),{on:on})});
  }
  function sync(tries){
    if(!window.DB){if(tries>0)setTimeout(function(){sync(tries-1)},600);return}
    readCfg().then(function(on){cacheSet(on);apply(on)}).catch(function(){});
  }
  sync(20);
  // тем, кто долго сидит на сайте, тема обновляется сама
  setInterval(function(){if(!document.hidden)sync(0)},5*60*1000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)sync(0)});

  // осенняя тема вызывает это при своём включении
  window.ahWinterOff=function(write){cacheSet(false);apply(false);return write?writeCfg(false):Promise.resolve()};

  /* ---------- переключатель в админке ---------- */
  var sw=null,msgEl=null,lbl=null,ttl=null,sub=null,busy=false;
  var tabs=$("ad-tabs");
  if(tabs&&tabs.parentNode){
    var box=document.createElement("div");box.id="wt-admin";
    box.innerHTML='<div><b id="wt-t"></b><small id="wt-s"></small></div>'
      +'<button id="wt-sw" type="button" role="switch" aria-checked="false"><i></i><span id="wt-l"></span></button>'
      +'<p class="wt-msg" id="wt-m" aria-live="polite"></p>';
    tabs.parentNode.insertBefore(box,tabs);
    sw=$("wt-sw");msgEl=$("wt-m");lbl=$("wt-l");ttl=$("wt-t");sub=$("wt-s");
    sw.addEventListener("click",function(){
      if(busy)return;
      if(!window.isAdmin||!window.isAdmin())return;
      if(!window.DB){setMsg(L().wait);return}
      var next=!ON;busy=true;sw.disabled=true;
      writeCfg(next).then(function(){
        if(next&&window.ahAutumnOff)return window.ahAutumnOff(true).catch(function(){});
      }).then(function(){cacheSet(next);apply(next);setMsg(L().saved)})
        .catch(function(e){setMsg(e&&e.code==="permission-denied"?L().denied:L().fail)})
        .then(function(){busy=false;sw.disabled=false});
    });
  }
  function setMsg(t){if(msgEl)msgEl.textContent=t||""}
  function paintSw(){
    if(!sw)return;
    sw.setAttribute("aria-checked",ON?"true":"false");
    if(lbl)lbl.textContent=ON?L().on:L().off;
  }
  function applyLang(){
    if(ttl)ttl.textContent=L().t;
    if(sub)sub.textContent=L().s;
    paintSw();
  }
  applyLang();
  new MutationObserver(applyLang).observe(H,{attributes:true,attributeFilter:["lang"]});
})();
