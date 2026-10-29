/* AHLTV: награды (кубок, медали за турниры, MVP). Подключается одной строкой в index.html:
   <script src="awards.js"></script>  (перед </body>) */
(function(){
  if(window.__ahAwards)return;window.__ahAwards=true;
  var B="https://www.gstatic.com/firebasejs/10.14.1/";
  function $(i){return document.getElementById(i)}
  function star(cx,cy,R,r){var p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;p.push((cx+q*Math.cos(a)).toFixed(1)+","+(cy+q*Math.sin(a)).toFixed(1))}return p.join(" ")}

  /* ---------- картинки ---------- */
  var SPRITE='<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>'
   +'<linearGradient id="awGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset="1" stop-color="#E0900F"/></linearGradient>'
   +'<linearGradient id="awGoldD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9A82A"/><stop offset="1" stop-color="#9C6208"/></linearGradient>'
   +'<linearGradient id="awSilver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6F9"/><stop offset="1" stop-color="#8E98A6"/></linearGradient>'
   +'<linearGradient id="awBronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3BE8A"/><stop offset="1" stop-color="#9A5524"/></linearGradient>'
   +'<linearGradient id="awMvp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A3D"/><stop offset="1" stop-color="#B8400E"/></linearGradient>'
   +'<linearGradient id="awStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C2"/><stop offset="1" stop-color="#F5B21B"/></linearGradient>'
   +'</defs></svg>';
  function svg(inner,size,label){return '<svg viewBox="0 0 64 64" width="'+size+'" height="'+size+'" role="img" aria-label="'+label+'">'+inner+'</svg>'}
  function medal(fill,rib1,rib2,num,numColor,label,size){
    return svg('<path d="M15 2h13l9 27H24z" fill="'+rib1+'"/><path d="M49 2H36l-9 27h13z" fill="'+rib2+'"/>'
      +'<circle cx="32" cy="43" r="18" fill="url(#'+fill+')" stroke="rgba(0,0,0,.28)" stroke-width="1"/>'
      +'<circle cx="32" cy="43" r="13" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.6"/>'
      +'<text x="32" y="49.5" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="18" fill="'+numColor+'">'+num+'</text>',size,label);
  }
  function badge(kind,size){
    size=size||56;
    if(kind==="gold")return svg('<path d="M17 11H8c0 9 5 15 12 16" fill="none" stroke="url(#awGoldD)" stroke-width="3.2" stroke-linecap="round"/>'
      +'<path d="M47 11h9c0 9-5 15-12 16" fill="none" stroke="url(#awGoldD)" stroke-width="3.2" stroke-linecap="round"/>'
      +'<path d="M17 6h30v16c0 10-7 16-15 16S17 32 17 22z" fill="url(#awGold)"/>'
      +'<polygon points="'+star(32,21,7,3)+'" fill="#FFF8D6" opacity=".95"/>'
      +'<rect x="29" y="38" width="6" height="9" fill="url(#awGoldD)"/>'
      +'<path d="M22 47h20l2 6H20z" fill="url(#awGold)"/>'
      +'<rect x="17" y="53" width="30" height="5" rx="1.6" fill="url(#awGoldD)"/>',size,"Кубок, 1 место");
    if(kind==="silver")return medal("awSilver","#4F78B8","#3E6199","2","#4A505A","Серебряная медаль, 2 место",size);
    if(kind==="bronze")return medal("awBronze","#B5532A","#8E3F1E","3","#6B3814","Бронзовая медаль, 3 место",size);
    return svg('<path d="M32 3 55 11v19c0 14-9 24-23 30C18 54 9 44 9 30V11z" fill="url(#awMvp)" stroke="rgba(255,196,143,.7)" stroke-width="1.2"/>'
      +'<polygon points="'+star(32,26,13,5.6)+'" fill="url(#awStar)" stroke="rgba(120,70,0,.35)" stroke-width=".6"/>'
      +'<text x="32" y="51" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="12" letter-spacing=".6" fill="#fff">MVP</text>',size,"MVP");
  }
  window.ahBadge=badge;

  /* ---------- стили ---------- */
  var st=document.createElement("style");
  st.textContent=".aw-row{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.4rem}"
   +".aw-b{display:flex;align-items:center;gap:.8rem;padding:.55rem 1.1rem .55rem .65rem;border:1px solid var(--line,#3a2217);border-radius:14px;background:var(--surface,#171010)}"
   +".aw-b svg{display:block;width:60px;height:60px;flex:none;filter:drop-shadow(0 4px 10px rgba(0,0,0,.4))}"
   +".aw-b small{display:block;font:700 .68rem var(--mono,monospace);letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#a09088)}"
   +".aw-b b{display:block;font:800 1.15rem var(--head,sans-serif);color:var(--ink,#f6ede7);margin-top:.1rem}"
   +".aw-m{margin-left:.55rem;white-space:nowrap;color:var(--muted,#a09088);font-size:.8rem}"
   +".aw-m svg{width:20px;height:20px;vertical-align:-5px;margin-right:.25rem}"
   +"@media (max-width:640px){.aw-b svg{width:48px;height:48px}.aw-b{padding:.45rem .9rem .45rem .5rem}}";
  document.head.appendChild(st);
  var sp=document.createElement("div");sp.innerHTML=SPRITE;document.body.appendChild(sp.firstChild);

  /* ---------- данные ---------- */
  // Поля в stats/{uid}: gold, silver, bronze (места в турнирах) и mvp
  var FSX=null;
  function fsx(){
    if(!FSX)FSX=Promise.all([import(B+"firebase-app.js"),import(B+"firebase-firestore.js")]).then(function(m){return {F:m[1],db:m[1].getFirestore(m[0].getApp())}});
    return FSX;
  }
  function lsGet(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
  function changeAw(uid,nick,field,delta){
    if(window.DB&&window.DB.local){
      var s=lsGet("ah_stats",{}),x=s[uid]||{matches:0,kills:0,deaths:0};
      x[field]=Math.max(0,(x[field]||0)+delta);if(nick)x.nick=nick;s[uid]=x;
      try{localStorage.setItem("ah_stats",JSON.stringify(s))}catch(e){}
      return Promise.resolve();
    }
    return fsx().then(function(o){
      var ref=o.F.doc(o.db,"stats",uid);
      return o.F.getDoc(ref).then(function(d){
        var cur=d.exists()&&d.data()[field]||0,p={};p[field]=Math.max(0,cur+delta);if(nick)p.nick=nick;
        return o.F.setDoc(ref,p,{merge:true});
      });
    });
  }

  /* ---------- профиль ---------- */
  var AW={gold:0,silver:0,bronze:0,mvp:0},row=null;
  var PLACES=[["gold","1 место"],["silver","2 место"],["bronze","3 место"]];
  function ensureRow(){
    if(row&&row.isConnected)return row;
    var r=$("p-rank");if(!r)return null;
    row=document.createElement("div");row.className="aw-row";row.id="aw-row";
    r.insertAdjacentElement("afterend",row);return row;
  }
  function renderAwards(){
    var r=ensureRow();if(!r)return;
    var h="";
    PLACES.forEach(function(p){var n=AW[p[0]];
      if(n>0)h+='<div class="aw-b">'+badge(p[0])+'<div><small>Турнир</small><b>'+p[1]+(n>1?' ×'+n:'')+'</b></div></div>'});
    if(AW.mvp>0)h+='<div class="aw-b">'+badge("mvp")+'<div><small>Награда</small><b>MVP'+(AW.mvp>1?' ×'+AW.mvp:'')+'</b></div></div>';
    r.innerHTML=h;
  }
  function loadAw(){
    if(!window.DB||!window.ME)return;
    window.DB.getStats().then(function(s){s=s||{};
      AW={gold:s.gold||0,silver:s.silver||0,bronze:s.bronze||0,mvp:s.mvp||0};renderAwards()}).catch(function(){});
  }
  var origLP=window.loadProfile;
  if(typeof origLP==="function")window.loadProfile=function(){var r=origLP.apply(this,arguments);loadAw();return r};

  /* ---------- «Топ игроков»: награды рядом с ником ---------- */
  var topObs=null;
  function decorateTop(){
    var t=$("top-t");if(!t||!window.DB)return;
    window.DB.topStats().then(function(l){
      l=l.filter(function(x){return x.matches>0}).map(function(x){x.kd=x.deaths?x.kills/x.deaths:x.kills;return x}).sort(function(a,b){return b.kd-a.kd}).slice(0,20);
      if(topObs)topObs.disconnect();
      var rows=t.querySelectorAll("tr");
      for(var i=1;i<rows.length;i++){
        var x=l[i-1],td=rows[i].children;if(!x||td.length<2)break;
        if(td[1].querySelector(".aw-m"))continue;
        var h="";
        [["gold",x.gold],["silver",x.silver],["bronze",x.bronze],["mvp",x.mvp]].forEach(function(a){
          if(a[1]>0)h+=badge(a[0],20)+(a[1]>1?'×'+a[1]+' ':' ')});
        if(h)td[1].insertAdjacentHTML("beforeend",'<span class="aw-m">'+h+'</span>');
      }
      if(topObs)topObs.observe(t,{childList:true});
    }).catch(function(){});
  }
  var tt=$("top-t");
  if(tt){topObs=new MutationObserver(decorateTop);topObs.observe(tt,{childList:true})}

  /* ---------- админка: награды за турниры и MVP ---------- */
  var add=$("st-add");
  if(add&&add.parentNode){
    var box=add.parentNode;
    var fl=document.createElement("label");fl.className="fld";
    fl.innerHTML='<span>Награда за турнир</span><select id="aw-place"><option value="gold">1 место (кубок)</option><option value="silver">2 место (серебро)</option><option value="bronze">3 место (бронза)</option></select>';
    box.parentNode.insertBefore(fl,box);
    function mk(t){var b=document.createElement("button");b.className="btn";b.type="button";b.textContent=t;box.appendChild(b);return b}
    var g1=mk("Выдать награду"),g2=mk("Снять награду"),b1=mk("Выдать MVP"),b2=mk("Снять MVP");
    function run(field,delta,okText){
      var sel=$("st-p"),msg=$("st-msg");
      if(!sel||!sel.value||!window.isAdmin||!window.isAdmin()){if(msg)msg.textContent="Выберите игрока.";return}
      var nick=sel.selectedOptions[0]?sel.selectedOptions[0].dataset.n:"";
      changeAw(sel.value,nick,field,delta).then(function(){if(msg)msg.textContent=okText}).catch(function(){if(msg)msg.textContent="Не удалось сохранить награду."});
    }
    g1.addEventListener("click",function(){run($("aw-place").value,1,"Награда выдана.")});
    g2.addEventListener("click",function(){run($("aw-place").value,-1,"Награда снята.")});
    b1.addEventListener("click",function(){run("mvp",1,"MVP выдан.")});
    b2.addEventListener("click",function(){run("mvp",-1,"MVP снят.")});
  }

  if(window.ME&&window.DB)loadAw();
  if(window.DB&&$("top-t")&&$("top-t").children.length)decorateTop();
})();
