/* AHLTV: Telegram в профиле + карточка игрока по клику на ник в сетке (TG, медали, K/D).
   Подключается одной строкой в index.html ПОСЛЕ tournaments.js и ПЕРЕД i18n.js:
   <script src="playercard.js"></script>
   Telegram хранится в Firestore, коллекция contacts/{uid}. Нужно правило (см. инструкцию):
     match /contacts/{uid} {
       allow read: if true;
       allow write: if request.auth != null && request.auth.uid == uid;
     }
   Тексты сами переключаются RU / EN / DE вместе с переключателем языка сайта. */
(function(){
  if(window.__ahPlayerCard)return;window.__ahPlayerCard=true;
  var B="https://www.gstatic.com/firebasejs/10.14.1/";
  function $(i){return document.getElementById(i)}
  function E(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

  /* ---------- тексты ---------- */
  var T={
    ru:{tgLabel:"Telegram (для связи)",tgHint:"Виден всем в карточке игрока в сетке. Можно оставить пустым.",
      tgBad:"Введите Telegram вида @username (латиница, цифры, _; от 5 символов).",tgSaved:"Telegram сохранён.",
      tgDenied:"Telegram не сохранён: Firebase запретил запись (нужно правило для contacts).",tgFail:"Не удалось сохранить Telegram.",
      title:"Профиль игрока",close:"Закрыть",player:"Игрок",none:"Не указан",awards:"Награды",noAwards:"Наград пока нет.",
      stats:"Статистика",matches:"Матчи",avgK:"Ср. убийства",avgD:"Ср. смерти",rankNone:"Пока без места в рейтинге",rank:"Место в рейтинге: ",
      loading:"Загрузка…",p1:"1 место",p2:"2 место",p3:"3 место"},
    en:{tgLabel:"Telegram (for contact)",tgHint:"Visible to everyone on your player card in the bracket. You can leave it empty.",
      tgBad:"Enter Telegram like @username (Latin letters, digits, _; at least 5 characters).",tgSaved:"Telegram saved.",
      tgDenied:"Telegram not saved: Firebase denied the write (a rule for contacts is needed).",tgFail:"Could not save Telegram.",
      title:"Player profile",close:"Close",player:"Player",none:"Not set",awards:"Awards",noAwards:"No awards yet.",
      stats:"Statistics",matches:"Matches",avgK:"Avg. kills",avgD:"Avg. deaths",rankNone:"Not ranked yet",rank:"Rank: ",
      loading:"Loading…",p1:"1st place",p2:"2nd place",p3:"3rd place"},
    de:{tgLabel:"Telegram (zur Kontaktaufnahme)",tgHint:"Für alle auf deiner Spielerkarte im Turnierbaum sichtbar. Kann leer bleiben.",
      tgBad:"Gib Telegram im Format @username ein (lateinische Buchstaben, Ziffern, _; mindestens 5 Zeichen).",tgSaved:"Telegram gespeichert.",
      tgDenied:"Telegram nicht gespeichert: Firebase hat das Schreiben verweigert (Regel für contacts nötig).",tgFail:"Telegram konnte nicht gespeichert werden.",
      title:"Spielerprofil",close:"Schließen",player:"Spieler",none:"Nicht angegeben",awards:"Auszeichnungen",noAwards:"Noch keine Auszeichnungen.",
      stats:"Statistik",matches:"Matches",avgK:"Ø Kills",avgD:"Ø Tode",rankNone:"Noch nicht platziert",rank:"Platz in der Rangliste: ",
      loading:"Lädt…",p1:"1. Platz",p2:"2. Platz",p3:"3. Platz"}
  };
  function L(){return T[document.documentElement.lang]||T.ru}

  /* ---------- стили ---------- */
  var css=document.createElement("style");
  css.textContent="#br-solo .m>span:not([draggable=true]),#br-duo .pr i{cursor:pointer}"
   +"@media (hover:hover){#br-solo .m>span:hover,#br-duo .pr i:hover{color:var(--or)}}"
   +"#pc-ov{position:fixed;inset:0;z-index:40;background:rgba(6,3,2,.72);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:calc(env(safe-area-inset-top,0px) + 1rem) 1rem calc(env(safe-area-inset-bottom,0px) + 1rem);animation:pcFade .18s ease both}"
   +".pc-p{width:min(460px,100%);max-height:100%;overflow:auto;background:var(--bg);border:1px solid var(--or);border-radius:18px;box-shadow:0 0 0 1px rgba(255,106,43,.15),0 24px 70px rgba(0,0,0,.7),0 0 40px rgba(255,106,43,.12);animation:pcPop .22s cubic-bezier(.22,.61,.36,1) both}"
   +".pc-h{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.8rem .8rem .8rem 1.2rem;border-bottom:1px solid var(--line)}"
   +".pc-l{display:block;font:700 .7rem var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}"
   +".pc-x{flex:none;width:44px;height:44px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font-size:1.2rem;cursor:pointer}"
   +".pc-x:hover{border-color:var(--or);color:var(--or)}"
   +".pc-body{padding:1.2rem;display:grid;gap:1.2rem}"
   +".pc-nick{display:block;margin-top:.4rem;font:800 clamp(1.8rem,7vw,2.5rem)/1.1 var(--head);color:var(--or);overflow-wrap:anywhere}"
   +".pc-rank{display:block;margin-top:.5rem;font:700 .78rem/1.5 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}"
   +".pc-sec .pc-l{margin-bottom:.6rem}"
   +".pc-tg{display:flex;align-items:center;min-height:3rem;padding:.55rem 1rem;border:1px solid var(--line);border-radius:12px;background:var(--surface);font:700 1.05rem var(--mono);overflow-wrap:anywhere}"
   +".pc-tg a{color:var(--or);text-decoration:none}.pc-tg a:hover{text-decoration:underline}"
   +".pc-none{color:var(--muted);font:500 .95rem var(--head)}"
   +".pc-meds{display:flex;flex-wrap:wrap;gap:.6rem}"
   +".pc-med{display:flex;align-items:center;gap:.5rem;padding:.4rem .9rem .4rem .5rem;border:1px solid var(--line);border-radius:12px;background:var(--surface);font:700 .85rem var(--head)}"
   +".pc-med svg{display:block;width:44px;height:44px;flex:none;filter:drop-shadow(0 3px 8px rgba(0,0,0,.4))}"
   +".pc-p .pstats{gap:.6rem}.pc-p .pstat{padding:.8rem 1rem}.pc-p .pstat b{font-size:clamp(1.6rem,7vw,2.2rem)}.pc-p .pstat span{font-size:.68rem}"
   +"@keyframes pcFade{from{opacity:0}to{opacity:1}}@keyframes pcPop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}";
  document.head.appendChild(css);

  /* ---------- хранилище: contacts/{uid} = {tg} ---------- */
  var TG_RE=/^[A-Za-z0-9_]{5,32}$/;
  function parseTg(v){   // "" — пусто, строка — ник без @, false — неверно
    v=String(v||"").trim();if(!v)return "";
    var m=v.match(/^(?:https?:\/\/)?(?:t(?:elegram)?\.me\/)?@?([A-Za-z0-9_]{5,32})\/?$/i);
    return m?m[1]:false;
  }
  var FSX=null;
  function fsx(){
    if(!FSX)FSX=Promise.all([import(B+"firebase-app.js"),import(B+"firebase-firestore.js")]).then(function(m){return {F:m[1],db:m[1].getFirestore(m[0].getApp())}});
    return FSX;
  }
  function lsGet(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
  function isLocal(){return !!(window.DB&&window.DB.local)}
  function getContact(uid){
    if(!uid||uid==="admin")return Promise.resolve("");
    if(isLocal())return Promise.resolve(lsGet("ah_contacts",{})[uid]||"");
    return fsx().then(function(o){return o.F.getDoc(o.F.doc(o.db,"contacts",uid)).then(function(d){var t=d.exists()?d.data().tg:"";return TG_RE.test(t||"")?t:""})});
  }
  function setContact(uid,tg){
    if(isLocal()){
      var s=lsGet("ah_contacts",{});if(tg)s[uid]=tg;else delete s[uid];
      try{localStorage.setItem("ah_contacts",JSON.stringify(s))}catch(e){}
      return Promise.resolve();
    }
    return fsx().then(function(o){var r=o.F.doc(o.db,"contacts",uid);return tg?o.F.setDoc(r,{tg:tg}):o.F.deleteDoc(r)});
  }

  /* ---------- профиль: поле Telegram ---------- */
  var tgMsg=null,steam=$("p-steam");
  if(steam&&steam.parentNode){
    var box=document.createElement("label");box.className="fld";
    box.innerHTML='<span data-pc="tgLabel"></span><input id="p-tg" maxlength="64" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="@username">';
    steam.parentNode.insertAdjacentElement("afterend",box);
    var hint=document.createElement("p");hint.className="note";hint.setAttribute("data-pc","tgHint");
    box.insertAdjacentElement("afterend",hint);
    tgMsg=document.createElement("p");tgMsg.className="note";tgMsg.id="p-tg-msg";
    hint.insertAdjacentElement("afterend",tgMsg);
    $("p-tg").addEventListener("input",function(){setMsg("")});
  }
  function setMsg(t,bad){if(!tgMsg)return;tgMsg.textContent=t||"";tgMsg.style.color=bad?"var(--or)":""}
  function applyLang(){
    var t=L();
    document.querySelectorAll("[data-pc]").forEach(function(e){var v=t[e.getAttribute("data-pc")];if(v!=null&&e.textContent!==v)e.textContent=v});
  }
  applyLang();
  new MutationObserver(applyLang).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});

  // проверка ДО штатного сохранения (capture на родителе): неверный TG не даёт сохранить профиль
  var left=$("a-left");
  if(left)left.addEventListener("click",function(e){
    if(!e.target.closest||!e.target.closest("#p-save"))return;
    if(parseTg($("p-tg").value)===false){setMsg(L().tgBad,1);e.stopPropagation()}
  },true);
  // сохранение TG после штатного сохранения ника и Steam
  var ps=$("p-save");
  if(ps)ps.addEventListener("click",function(){
    var me=window.ME;if(!me)return;
    var tg=parseTg($("p-tg").value);if(tg===false)return;
    var n=$("p-nick").value.trim(),u=$("p-steam").value.trim();
    if(!n||(u&&!/steamcommunity\.com\//i.test(u)))return;
    setContact(me.uid,tg).then(function(){$("p-tg").value=tg?"@"+tg:"";setMsg(L().tgSaved)})
      .catch(function(e){setMsg(e&&e.code==="permission-denied"?L().tgDenied:L().tgFail,1)});
  });

  function loadMyTg(){
    var me=window.ME,inp=$("p-tg");if(!me||!window.DB||!inp)return;
    var uid=me.uid;
    getContact(uid).then(function(tg){if(window.ME&&window.ME.uid===uid&&!inp.value)inp.value=tg?"@"+tg:""}).catch(function(){});
  }
  var origLP=window.loadProfile;
  if(typeof origLP==="function")window.loadProfile=function(){var r=origLP.apply(this,arguments);loadMyTg();return r};
  var origSM=window.setMe;
  if(typeof origSM==="function")window.setMe=function(u){
    var prev=window.ME&&window.ME.uid;
    if(!u||(u.uid!==prev)){var i=$("p-tg");if(i)i.value="";setMsg("")}
    return origSM.apply(this,arguments);
  };
  if(window.ME&&window.DB)loadMyTg();

  /* ---------- карточка игрока ---------- */
  var ov=null,tok=0,prevOv="";
  function closeCard(){
    if(!ov)return;
    ov.remove();ov=null;tok++;document.body.style.overflow=prevOv;
  }
  function kdOf(x){return x.deaths?x.kills/x.deaths:x.kills}
  function rankOf(list,id){
    if(!id)return 0;
    var l=list.filter(function(x){return x.matches>0}).map(function(x){return {id:x.id,kd:kdOf(x)}}).sort(function(a,b){return b.kd-a.kd});
    for(var i=0;i<l.length;i++)if(l[i].id===id)return i+1;
    return 0;
  }
  function findStat(list,uid,name){
    var i,n=String(name).toLowerCase();
    if(uid)for(i=0;i<list.length;i++)if(list[i].id===uid)return list[i];
    for(i=0;i<list.length;i++)if(String(list[i].nick||"").toLowerCase()===n)return list[i];
    return null;
  }
  // uid игрока по нику из сетки (если он сам регистрировался)
  function findUid(md,text){
    var A=window.ARR||{},low=text.toLowerCase(),uid=null;
    [md,md==="duo"?"solo":"duo"].forEach(function(m){
      (A[m]||[]).forEach(function(x){
        if(!uid&&x&&x.uid&&x.uid!=="admin"&&String(x.nick||"").toLowerCase()===low)uid=x.uid;
      });
    });
    return uid;
  }
  function render(body,name,stat,rank,tg){
    var t=L(),s=stat||{},m=+s.matches||0,k=+s.kills||0,d=+s.deaths||0;
    function r(v){return Math.round(v*100)/100}
    var meds=[["gold",s.gold,t.p1],["silver",s.silver,t.p2],["bronze",s.bronze,t.p3],["mvp",s.mvp,"MVP"]],mh="";
    if(window.ahBadge)meds.forEach(function(a){var n=(+a[1])|0;if(n>0)mh+='<div class="pc-med">'+window.ahBadge(a[0],44)+'<span>'+E(a[2])+(n>1?" ×"+n:"")+'</span></div>'});
    var tgh=tg?'<a href="https://t.me/'+E(tg)+'" target="_blank" rel="noopener noreferrer">@'+E(tg)+'</a>':'<span class="pc-none">'+t.none+'</span>';
    var cells=[[t.matches,m],[t.avgK,m?r(k/m):"—"],[t.avgD,m?r(d/m):"—"],["K/D",m?(d?r(k/d):k):"—"]];
    body.innerHTML='<div><span class="pc-l">'+t.player+'</span><b class="pc-nick">'+E(name)+'</b><span class="pc-rank">'+(rank?t.rank+rank:t.rankNone)+'</span></div>'
      +'<div class="pc-sec"><span class="pc-l">Telegram</span><div class="pc-tg">'+tgh+'</div></div>'
      +'<div class="pc-sec"><span class="pc-l">'+t.awards+'</span>'+(mh?'<div class="pc-meds">'+mh+'</div>':'<p class="note">'+t.noAwards+'</p>')+'</div>'
      +'<div class="pc-sec"><span class="pc-l">'+t.stats+'</span><div class="pstats">'+cells.map(function(x){return '<div class="pstat"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>'}).join("")+'</div></div>';
  }
  function openCard(md,text){
    closeCard();
    var my=++tok,t=L();
    ov=document.createElement("div");ov.id="pc-ov";
    ov.innerHTML='<div class="pc-p" role="dialog" aria-modal="true" aria-label="'+E(t.title)+'"><div class="pc-h"><span class="pc-l">'+E(t.title)+'</span><button class="pc-x" type="button" aria-label="'+E(t.close)+'">✕</button></div><div class="pc-body"></div></div>';
    var body=ov.querySelector(".pc-body");
    body.innerHTML='<div><span class="pc-l">'+t.player+'</span><b class="pc-nick">'+E(text)+'</b><span class="pc-rank">'+t.loading+'</span></div>';
    prevOv=document.body.style.overflow;document.body.style.overflow="hidden";
    document.body.appendChild(ov);
    ov.querySelector(".pc-x").addEventListener("click",closeCard);
    ov.addEventListener("click",function(e){if(e.target===ov)closeCard()});
    var uid=findUid(md,text);
    (window.DB?window.DB.topStats().catch(function(){return []}):Promise.resolve([])).then(function(list){
      if(my!==tok)return;
      list=list||[];
      var stat=findStat(list,uid,text),id=uid||(stat&&stat.id)||null;
      return getContact(id).catch(function(){return ""}).then(function(tg){
        if(my!==tok)return;
        render(body,text,stat,rankOf(list,id),tg);
      });
    });
  }
  document.addEventListener("click",function(e){
    var t=e.target;if(!t||!t.closest)return;
    var cell=t.closest(".m > span, .pr i");
    if(!cell||cell.classList.contains("pr"))return;
    var br=cell.closest("#br-solo,#br-duo");if(!br)return;
    var text=cell.textContent.trim();if(!text||text==="—")return;
    openCard(br.id==="br-duo"?"duo":"solo",text);
  });
  // Esc закрывает сначала карточку (и не трогает окно сетки под ней)
  window.addEventListener("keydown",function(e){
    if(e.key==="Escape"&&ov){closeCard();e.stopImmediatePropagation()}
  },true);
})();
