/* AHLTV: осенняя тема для всего сайта: падающие листья, дождь с брызгами, гирлянда из листьев, тыквы и грибы,
   тёплая палитра. Включается переключателем в админке (виден только админам) и действует у ВСЕХ посетителей.
   Подключается одной строкой в index.html ПОСЛЕ tournaments.js и ПЕРЕД i18n.js:
   <script src="autumn.js"></script>
   Состояние хранится в Firestore: cfg/autumn = {on:true/false}. Правило cfg/{doc} у вас уже есть,
   новых правил добавлять не нужно. Зимняя и осенняя темы взаимоисключающие: включение одной выключает другую. */
(function(){
  if(window.__ahAutumn)return;window.__ahAutumn=true;
  var B="https://www.gstatic.com/firebasejs/10.14.1/";
  var H=document.documentElement;
  function $(i){return document.getElementById(i)}

  /* ---------- тексты (RU / EN / DE) ---------- */
  var T={
    ru:{t:"Осенняя тема",s:"Листопад, дождь, тыквы и грибы на всём сайте. Включается сразу у всех посетителей. Зимняя тема при этом выключается.",on:"Включена",off:"Выключена",
      saved:"Сохранено. Тема изменится у всех.",denied:"Firebase запретил запись. Нужно правило для cfg/{doc} (запись админом).",fail:"Не удалось сохранить.",wait:"База ещё загружается, попробуйте через пару секунд."},
    en:{t:"Autumn theme",s:"Falling leaves, rain, pumpkins and mushrooms across the whole site. Applies to all visitors immediately. The winter theme is turned off.",on:"On",off:"Off",
      saved:"Saved. The theme changes for everyone.",denied:"Firebase denied the write. A rule for cfg/{doc} (admin write) is needed.",fail:"Could not save.",wait:"The database is still loading, try again in a couple of seconds."},
    de:{t:"Herbstmodus",s:"Fallendes Laub, Regen, Kürbisse und Pilze auf der ganzen Seite. Gilt sofort für alle Besucher. Der Wintermodus wird dabei ausgeschaltet.",on:"An",off:"Aus",
      saved:"Gespeichert. Das Design ändert sich für alle.",denied:"Firebase hat das Schreiben verweigert. Eine Regel für cfg/{doc} (Schreiben durch Admin) ist nötig.",fail:"Speichern fehlgeschlagen.",wait:"Die Datenbank lädt noch, versuche es in ein paar Sekunden erneut."}
  };
  function L(){return T[H.lang]||T.ru}

  /* ---------- осенняя палитра ---------- */
  var css=document.createElement("style");
  css.textContent=
   "html[data-autumn]{--or:#f2a33a;--or2:#d9701c;--bg:#150d07;--surface:#201409;--line:#47291a;--ink:#fbefe0;--muted:#b79c83}"
  +"html[data-autumn] body{background-image:radial-gradient(60% 40% at 50% -5%,rgba(242,163,58,.13),transparent 70%),linear-gradient(180deg,transparent 60%,rgba(120,60,20,.10))}"
  +"html[data-autumn] .btn.main,html[data-autumn] .dm-btn,html[data-autumn] .lang button.on{color:#1a0d04}"
  +"html[data-autumn] ::selection{background:#f2a33a;color:#1a0d04}"
  +"#wa-fx{position:fixed;inset:0;width:100%;height:100%;z-index:20;pointer-events:none}"
  /* гирлянда из листьев */
  +"#wa-garland{position:fixed;top:0;left:0;right:0;height:46px;z-index:21;pointer-events:none;overflow:hidden}"
  +"#wa-garland svg{display:block;width:100%;height:46px}"
  +"#wa-garland .lf{animation:waSw 3.4s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:50% 0}"
  +"#wa-garland .lf:nth-of-type(2n){animation-duration:4.2s;animation-delay:-1.3s}#wa-garland .lf:nth-of-type(3n){animation-duration:2.9s;animation-delay:-2.2s}"
  /* украшения внизу */
  +".wa-deco{position:fixed;bottom:0;z-index:19;pointer-events:none;display:flex;align-items:flex-end;gap:4px;opacity:.96}"
  +".wa-deco.l{left:8px}.wa-deco.r{right:8px}"
  +".wa-deco svg{display:block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.45))}"
  +"@media (max-width:640px){.wa-deco{transform:scale(.62);transform-origin:bottom}.wa-deco.l{left:0}.wa-deco.r{right:0}}"
  +"@media (max-width:420px){.wa-deco.r{display:none}}"
  /* переключатель в админке */
  +"#wa-admin{display:flex;align-items:center;justify-content:space-between;gap:1rem 1.4rem;flex-wrap:wrap;margin:0 0 1.2rem;padding:1rem 1.2rem;border:1px solid var(--line);border-radius:14px;background:var(--surface)}"
  +"#wa-admin b{display:block;font:800 1.1rem var(--head);color:var(--ink)}"
  +"#wa-admin small{display:block;margin-top:.2rem;font:500 .85rem/1.4 var(--head);color:var(--muted);max-width:34rem}"
  +"#wa-admin .wa-msg{flex-basis:100%;margin:0;min-height:1.2em;font:500 .85rem var(--head);color:var(--muted)}"
  +"#wa-sw{display:flex;align-items:center;gap:.7rem;min-height:44px;padding:.2rem .3rem;border:0;background:none;color:var(--ink);font:700 .85rem var(--mono);letter-spacing:.08em;text-transform:uppercase;cursor:pointer;touch-action:manipulation}"
  +"#wa-sw i{position:relative;flex:none;width:56px;height:30px;border-radius:999px;border:1px solid var(--line);background:var(--bg);transition:background-color .2s ease,border-color .2s ease}"
  +"#wa-sw i::after{content:'';position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:var(--muted);transition:transform .22s cubic-bezier(.22,.61,.36,1),background-color .2s ease}"
  +"#wa-sw[aria-checked=true] i{background:rgba(242,163,58,.18);border-color:var(--or)}"
  +"#wa-sw[aria-checked=true] i::after{transform:translateX(26px);background:var(--or)}"
  +"#wa-sw:focus-visible{outline:2px solid var(--or);outline-offset:3px;border-radius:10px}"
  +"@keyframes waSw{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}"
  +"@media (prefers-reduced-motion:reduce){#wa-garland .lf{animation:none}}";
  document.head.appendChild(css);

  /* ---------- украшения ---------- */
  var COLS=["#d9461f","#ee8a1c","#f2b630","#a8431c","#c9701f","#8a5a1e"];
  function leafPath(w,h){ // контур листа в рамке w×h, черешок снизу
    return "M"+w/2+" 0C"+w*1.05+" "+h*.25+" "+w*.95+" "+h*.78+" "+w/2+" "+h*.92+"C"+w*.05+" "+h*.78+" "+(-w*.05)+" "+h*.25+" "+w/2+" 0Z";
  }
  function leafSvg(w,h,c){
    return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true" focusable="false">'
      +'<path d="'+leafPath(w,h*.92)+'" fill="'+c+'"/><path d="M'+w/2+' '+h*.06+'V'+h*.98+'" stroke="rgba(0,0,0,.28)" stroke-width="1.4" fill="none"/></svg>';
  }
  function pumpkin(w,h){
    return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 80 66" aria-hidden="true" focusable="false">'
     +'<ellipse cx="40" cy="40" rx="37" ry="25" fill="#d9701c"/>'
     +'<ellipse cx="22" cy="40" rx="17" ry="25" fill="#e9862a"/><ellipse cx="58" cy="40" rx="17" ry="25" fill="#e9862a"/>'
     +'<ellipse cx="40" cy="40" rx="13" ry="26" fill="#f09a3a"/>'
     +'<path d="M40 15q-3-8 3-12" stroke="#5a3a14" stroke-width="5" fill="none" stroke-linecap="round"/>'
     +'<path d="M43 14q10-8 18-2-8 10-18 2z" fill="#4f8a3a"/></svg>';
  }
  function mushroom(w,h){
    return '<svg width="'+w+'" height="'+h+'" viewBox="0 0 60 64" aria-hidden="true" focusable="false">'
     +'<path d="M22 34h16l3 26H19z" fill="#efe3cf"/><path d="M19 60h22" stroke="#cdb89a" stroke-width="3"/>'
     +'<path d="M4 36C4 16 18 4 30 4s26 12 26 32z" fill="#c9372b"/>'
     +'<circle cx="18" cy="24" r="4.2" fill="#fff6e6"/><circle cx="34" cy="14" r="3.6" fill="#fff6e6"/><circle cx="44" cy="28" r="4.4" fill="#fff6e6"/><circle cx="30" cy="30" r="2.8" fill="#fff6e6"/></svg>';
  }
  function pile(w,h){
    var s='<svg width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true" focusable="false">',i,x,y,a,c;
    for(i=0;i<16;i++){
      x=6+(i*(w-20)/15);y=h-10-Math.sin(i/15*Math.PI)*(h*.5)*(0.55+(i%3)*.2);a=(i*47)%360;c=COLS[i%COLS.length];
      s+='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+a+')"><path d="'+leafPath(18,26)+'" fill="'+c+'"/></g>';
    }
    return s+'</svg>';
  }
  function garlandSvg(){
    var w=1600,step=100,s='<svg viewBox="0 0 '+w+' 46" preserveAspectRatio="none" aria-hidden="true" focusable="false">',path="M0 4",x,i=0;
    for(x=0;x<w;x+=step)path+=" Q"+(x+step/2)+" 18 "+(x+step)+" 4";
    s+='<path d="'+path+'" fill="none" stroke="#5a3a14" stroke-width="2"/>';
    for(x=0;x<w;x+=step){
      [0.2,0.5,0.8].forEach(function(t){
        var px=x+step*t,py=4+2*(1-t)*t*14,c=COLS[i++%COLS.length],h=16+(i%3)*4;
        s+='<g class="lf"><path d="M'+px.toFixed(1)+' '+py.toFixed(1)+'v4" stroke="#5a3a14" stroke-width="1.4"/>'
         +'<g transform="translate('+(px-6).toFixed(1)+' '+(py+4).toFixed(1)+')"><path d="'+leafPath(12,h)+'" fill="'+c+'"/><path d="M6 1V'+(h-2)+'" stroke="rgba(0,0,0,.28)" stroke-width="1" fill="none"/></g></g>';
      });
    }
    return s+'</svg>';
  }
  var deco=null;
  function buildDeco(){
    var l=document.createElement("div");l.className="wa-deco l";
    l.innerHTML=pumpkin(84,69)+mushroom(46,49)+pumpkin(52,43);
    var r=document.createElement("div");r.className="wa-deco r";
    r.innerHTML=mushroom(40,43)+pile(130,56)+pumpkin(66,54);
    return [l,r];
  }

  /* ---------- листопад и дождь (один canvas) ---------- */
  var cv=null,ctx=null,leaves=[],drops=[],splashes=[],raf=0,W=0,Hh=0,dpr=1,still=false,LEAF=null;
  try{still=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
  function nLeaves(){return Math.max(10,Math.min(38,Math.round(window.innerWidth/42)))}
  function nDrops(){return Math.max(40,Math.min(150,Math.round(window.innerWidth/(window.innerWidth<640?9:11))))}
  function mkLeaf(init){
    return {x:Math.random()*W,y:init?Math.random()*Hh:-30,r:Math.random()*7+7,v:Math.random()*.9+.55,s:Math.random()*6.28,sw:Math.random()*1.1+.5,a:Math.random()*6.28,va:(Math.random()-.5)*.05,f:Math.random()*6.28,c:COLS[(Math.random()*COLS.length)|0]};
  }
  function mkDrop(init){
    return {x:Math.random()*(W+120)-60,y:init?Math.random()*Hh:-20,l:Math.random()*10+10,v:Math.random()*7+15};
  }
  function size(){
    if(!cv)return;
    dpr=Math.min(window.devicePixelRatio||1,2);
    W=window.innerWidth;Hh=window.innerHeight;
    cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=nLeaves(),m=nDrops();
    while(leaves.length<n)leaves.push(mkLeaf(true));leaves.length=n;
    while(drops.length<m)drops.push(mkDrop(true));drops.length=m;
  }
  function drawLeaf(p){
    var sx=Math.cos(p.f),r=p.r;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.scale(sx<0?-sx*.9-.1:sx*.9+.1,1);
    ctx.fillStyle=p.c;ctx.globalAlpha=.92;
    ctx.beginPath();ctx.moveTo(0,-r);ctx.bezierCurveTo(r*.95,-r*.5,r*.8,r*.7,0,r);ctx.bezierCurveTo(-r*.8,r*.7,-r*.95,-r*.5,0,-r);ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,.3)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-r*.9);ctx.lineTo(0,r*1.25);ctx.stroke();
    ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,W,Hh);
    var i;
    if(!still){
      ctx.globalAlpha=.42;ctx.strokeStyle="#b9d0e6";ctx.lineWidth=1;ctx.beginPath();
      for(i=0;i<drops.length;i++){var d=drops[i];ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.l*.16,d.y-d.l)}
      ctx.stroke();
      ctx.lineWidth=1.2;
      for(i=0;i<splashes.length;i++){var sp=splashes[i],k=sp.t/14;
        ctx.globalAlpha=.5*(1-k);ctx.beginPath();ctx.ellipse(sp.x,Hh-2,3+k*9,1+k*2.2,0,0,6.2832);ctx.stroke()}
    }
    ctx.globalAlpha=1;
    for(i=0;i<leaves.length;i++)drawLeaf(leaves[i]);
  }
  function tick(){
    var i;
    for(i=0;i<leaves.length;i++){
      var p=leaves[i];
      p.y+=p.v;p.s+=.018;p.x+=Math.sin(p.s)*p.sw+.25;p.a+=p.va;p.f+=.035;
      if(p.y>Hh+30||p.x>W+40){leaves[i]=mkLeaf(false);leaves[i].x=Math.random()*W}
    }
    for(i=0;i<drops.length;i++){
      var d=drops[i];d.y+=d.v;d.x-=d.v*.16;
      if(d.y>Hh){
        if(splashes.length<40&&Math.random()<.35)splashes.push({x:d.x,t:0});
        drops[i]=mkDrop(false);
      }
    }
    for(i=splashes.length-1;i>=0;i--){splashes[i].t++;if(splashes[i].t>14)splashes.splice(i,1)}
    draw();raf=requestAnimationFrame(tick);
  }
  function startFx(){
    if(!cv){
      cv=document.createElement("canvas");cv.id="wa-fx";cv.setAttribute("aria-hidden","true");
      document.body.appendChild(cv);ctx=cv.getContext("2d");
    }
    size();cancelAnimationFrame(raf);
    if(still)draw();else raf=requestAnimationFrame(tick);
  }
  function stopFx(){cancelAnimationFrame(raf);raf=0;if(cv){cv.remove();cv=null;ctx=null;leaves=[];drops=[];splashes=[]}}
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
      H.setAttribute("data-autumn","");
      if(!deco){deco=buildDeco();deco.forEach(function(n){document.body.appendChild(n)})}
      startFx();
    }else{
      H.removeAttribute("data-autumn");
      if(deco){deco.forEach(function(n){n.remove()});deco=null}
      stopFx();
    }
    paintSw();
  }
  function cacheSet(on){try{localStorage.setItem("ah_autumn",on?"1":"0")}catch(e){}}
  try{if(localStorage.getItem("ah_autumn")==="1"&&localStorage.getItem("ah_winter")!=="1")apply(true)}catch(e){}

  /* ---------- хранилище: cfg/autumn = {on} ---------- */
  var FSX=null;
  function fsx(){
    if(!FSX)FSX=Promise.all([import(B+"firebase-app.js"),import(B+"firebase-firestore.js")]).then(function(m){return {F:m[1],db:m[1].getFirestore(m[0].getApp())}});
    return FSX;
  }
  function isLocal(){return !!(window.DB&&window.DB.local)}
  function readCfg(){
    if(isLocal()){try{return Promise.resolve(localStorage.getItem("ah_autumn_cfg")==="1")}catch(e){return Promise.resolve(false)}}
    return fsx().then(function(o){return o.F.getDoc(o.F.doc(o.db,"cfg","autumn")).then(function(d){return d.exists()&&d.data().on===true})});
  }
  function writeCfg(on){
    if(isLocal()){try{localStorage.setItem("ah_autumn_cfg",on?"1":"0")}catch(e){}return Promise.resolve()}
    return fsx().then(function(o){return o.F.setDoc(o.F.doc(o.db,"cfg","autumn"),{on:on})});
  }
  function sync(tries){
    if(!window.DB){if(tries>0)setTimeout(function(){sync(tries-1)},600);return}
    readCfg().then(function(on){
      if(on&&H.hasAttribute("data-winter"))return; // зима уже включена: не накладываем темы
      cacheSet(on);apply(on);
    }).catch(function(){});
  }
  sync(20);
  setInterval(function(){if(!document.hidden)sync(0)},5*60*1000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden)sync(0)});

  // зимняя тема вызывает это при своём включении
  window.ahAutumnOff=function(write){cacheSet(false);apply(false);return write?writeCfg(false):Promise.resolve()};

  /* ---------- переключатель в админке ---------- */
  var sw=null,msgEl=null,lbl=null,ttl=null,sub=null,busy=false;
  var tabs=$("ad-tabs");
  if(tabs&&tabs.parentNode){
    var box=document.createElement("div");box.id="wa-admin";
    box.innerHTML='<div><b id="wa-t"></b><small id="wa-s"></small></div>'
      +'<button id="wa-sw" type="button" role="switch" aria-checked="false"><i></i><span id="wa-l"></span></button>'
      +'<p class="wa-msg" id="wa-m" aria-live="polite"></p>';
    tabs.parentNode.insertBefore(box,tabs);
    sw=$("wa-sw");msgEl=$("wa-m");lbl=$("wa-l");ttl=$("wa-t");sub=$("wa-s");
    sw.addEventListener("click",function(){
      if(busy)return;
      if(!window.isAdmin||!window.isAdmin())return;
      if(!window.DB){setMsg(L().wait);return}
      var next=!ON;busy=true;sw.disabled=true;
      writeCfg(next).then(function(){
        if(next&&window.ahWinterOff)return window.ahWinterOff(true).catch(function(){});
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
