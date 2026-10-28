/* AHLTV: награды (кубок, медали, MVP). Подключается одной строкой в index.html:
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
   +".aw-i svg{width:22px;height:22px;vertical-align:-6px;margin-right:.4rem}"
   +".aw-m{margin-left:.55rem;white-space:nowrap;color:var(--muted,#a09088);font-size:.8rem}"
   +".aw-m svg{width:20px;height:20px;vertical-align:-5px;margin-right:.25rem}"
   +"@media (max-width:640px){.aw-b svg{width:48px;height:48px}.aw-b{padding:.45rem .9rem .45rem .5rem}}";
  document.head.appendChild(st);
  var sp=document.createElement("div");sp.innerHTML=SPRITE;document.body.appendChild(sp.firstChild);

  /* ---------- данные ---------- */
  var FSX=null;
  function fsx(){
    if(!FSX)FSX=Promise.all([import(B+"firebase-app.js"),import(B+"firebase-firestore.js")]).then(function(m){return {F:m[1],db:m[1].getFirestore(m[0].getApp())}});
    return FSX;
  }
  function lsGet(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
  function changeMvp(uid,nick,delta){
    if(window.DB&&window.DB.local){
      var s=lsGet("ah_stats",{}),x=s[uid]||{matches:0,kills:0,deaths:0};
      x.mvp=Math.max(0,(x.mvp||0)+delta);if(nick)x.nick=nick;s[uid]=x;
      try{localStorage.setItem("ah_stats",JSON.stringify(s))}catch(e){}
      return Promise.resolve();
    }
    return fsx().then(function(o){
      var ref=o.F.doc(o.db,"stats",uid);
      return o.F.getDoc(ref).then(function(d){
        var cur=d.exists()&&d.data().mvp||0,p={mvp:Math.max(0,cur+delta)};if(nick)p.nick=nick;
        return o.F.setDoc(ref,p,{merge:true});
      });
    });
  }

  /* ---------- аккаунт ---------- */
  var MVP=0,row=null;
  function ensureRow(){
    if(row&&row.isConnected)return row;
    var r=$("p-rank");if(!r)return null;
    row=document.createElement("div");row.className="aw-row";row.id="aw-row";
    r.insertAdjacentElement("afterend",row);return row;
  }
  function renderAwards(){
    var r=ensureRow();if(!r)return;
    var m=($("p-rank").textContent||"").match(/:\s*(\d+)/),rank=m?+m[1]:0,h="";
    if(rank===1)h+='<div class="aw-b">'+badge("gold")+'<div><small>Рейтинг</small><b>Топ 1</b></div></div>';
    if(rank===2)h+='<div class="aw-b">'+badge("silver")+'<div><small>Рейтинг</small><b>2 место</b></div></div>';
    if(rank===3)h+='<div class="aw-b">'+badge("bronze")+'<div><small>Рейтинг</small><b>3 место</b></div></div>';
    if(MVP>0)h+='<div class="aw-b">'+badge("mvp")+'<div><small>Награда</small><b>MVP'+(MVP>1?' ×'+MVP:'')+'</b></div></div>';
    r.innerHTML=h;
  }
  function loadMvp(){
    if(!window.DB||!window.ME)return;
    window.DB.getStats().then(function(s){MVP=(s&&s.mvp)||0;renderAwards()}).catch(function(){});
  }
  var pr=$("p-rank");
  if(pr)new MutationObserver(renderAwards).observe(pr,{childList:true,characterData:true,subtree:true});
  var origLP=window.loadProfile;
  if(typeof origLP==="function")window.loadProfile=function(){var r=origLP.apply(this,arguments);loadMvp();return r};

  /* ---------- «Топ игроков» ---------- */
  var topObs=null;
  function decorateTop(){
    var t=$("top-t");if(!t||!window.DB)return;
    window.DB.topStats().then(function(l){
      l=l.filter(function(x){return x.matches>0}).map(function(x){x.kd=x.deaths?x.kills/x.deaths:x.kills;return x}).sort(function(a,b){return b.kd-a.kd}).slice(0,20);
      if(topObs)topObs.disconnect();
      var rows=t.querySelectorAll("tr");
      for(var i=1;i<rows.length;i++){
        var x=l[i-1],td=rows[i].children;if(!x||td.length<2)break;
        if(i<=3&&td[0].querySelector("svg")==null)td[0].innerHTML='<span class="aw-i">'+badge(["","gold","silver","bronze"][i],22)+'</span>'+i;
        if(x.mvp>0&&!td[1].querySelector(".aw-m"))td[1].insertAdjacentHTML("beforeend",'<span class="aw-m">'+badge("mvp",20)+(x.mvp>1?'×'+x.mvp:'')+'</span>');
      }
      if(topObs)topObs.observe(t,{childList:true});
    }).catch(function(){});
  }
  var tt=$("top-t");
  if(tt){topObs=new MutationObserver(decorateTop);topObs.observe(tt,{childList:true})}

  /* ---------- админка: кнопки MVP ---------- */
  var add=$("st-add");
  if(add&&add.parentNode){
    var b1=document.createElement("button"),b2=document.createElement("button");
    b1.className="btn";b1.type="button";b1.textContent="Выдать MVP";
    b2.className="btn";b2.type="button";b2.textContent="Снять MVP";
    add.parentNode.appendChild(b1);add.parentNode.appendChild(b2);
    function run(delta){
      var sel=$("st-p"),msg=$("st-msg");
      if(!sel||!sel.value||!window.isAdmin||!window.isAdmin()){if(msg)msg.textContent="Выберите игрока.";return}
      var nick=sel.selectedOptions[0]?sel.selectedOptions[0].dataset.n:"";
      changeMvp(sel.value,nick,delta).then(function(){if(msg)msg.textContent=delta>0?"MVP выдан.":"MVP снят."}).catch(function(){if(msg)msg.textContent="Не удалось сохранить MVP."});
    }
    b1.addEventListener("click",function(){run(1)});
    b2.addEventListener("click",function(){run(-1)});
  }

  if(window.ME&&window.DB)loadMvp();
  if(window.DB&&$("top-t")&&$("top-t").children.length)decorateTop();
})();
