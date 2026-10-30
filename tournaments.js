/* AHLTV: список турниров (1×1 / 2×2, 8x / 16x / 32x) и их создание в админке.
   Подключение в index.html: <script src="tournaments.js?v=4"></script>
   (после awards.js, ПЕРЕД i18n.js) */
(function(){
  if(window.__ahTours)return;window.__ahTours=true;
  var B="https://www.gstatic.com/firebasejs/10.14.1/";
  function $(i){return document.getElementById(i)}
  function E(s){return window.esc?window.esc(s):String(s==null?"":s)}
  function ml(m){return m==="duo"?"2×2":"1×1"}
  var STS={open:"Набор открыт",live:"Идёт",done:"Завершён"};
  var SIZES=[8,16,32];

  /* ---------- стили ---------- */
  var css=document.createElement("style");
  css.textContent="#tour>.tcard,#tour>.empty{display:none}"
   +"#tt-list .tcard{max-width:46rem}"
   +"#tt-list .art b{font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.05;word-break:break-word}"
   +".tt-desc{color:var(--muted);margin:0 0 1.2rem;white-space:pre-wrap}"
   +".fld textarea{width:100%;min-height:90px;padding:.8rem 1rem;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font:inherit;resize:vertical}"
   +".fld textarea:focus{outline:none;border-color:var(--or)}"
   +".tt-row{display:grid;gap:.6rem}"
   +".tt-row .nm{font:800 1.1rem var(--head)}"
   +".tt-row .mt{color:var(--muted);font:500 .8rem var(--mono)}"
   +".sm.on{border-color:var(--or);color:var(--or)}";
  document.head.appendChild(css);

  /* ---------- сетка на 8 / 16 / 32 ---------- */
  var NAMES={32:["1/16 финала","1/8 финала","1/4 финала","Полуфинал","Финал"],16:["1/8 финала","1/4 финала","Полуфинал","Финал"],8:["1/4 финала","Полуфинал","Финал"]};
  window.bracket=function(n,box){
    var names=NAMES[n]||NAMES[16],h="",m=n/2;
    names.forEach(function(name){
      h+='<div class="rd"><h3>'+name+'</h3><div class="ms">';
      var duo=!!box.closest("#m-duo")||box.id==="br-duo";
      var cell=duo?'<span class="pr"><i>—</i><i>—</i></span>':'<span>—</span>';
      for(var i=0;i<m;i++){h+='<div class="m">'+cell+cell+'</div>'}
      h+='</div></div>';m/=2;
    });
    box.innerHTML=h;
    var md=box.closest(".mode");
    if(md){var sl=md.querySelector(".slots");sl.textContent=n+" "+sl.dataset.unit}
    var pv=box.previousElementSibling;if(pv&&pv.querySelectorAll)pv.querySelectorAll("button").forEach(function(b){b.classList.toggle("on",+b.dataset.n===n)});
  };
  document.querySelectorAll("#format .seg.sz").forEach(function(seg){
    var b=document.createElement("button");b.dataset.n="32";b.textContent="32x";
    seg.insertBefore(b,seg.firstChild);
    b.addEventListener("click",function(){window.bracket(32,seg.nextElementSibling)});
  });

  /* ---------- размер сетки на странице «Сетка» / во всплывающем окне ---------- */
  var BRN=16; // текущий размер сетки (задаётся выбранным турниром)
  window.fillBr=function(){
    var n=BRN;
    ["solo","duo"].forEach(function(md){window.bracket(n,$("br-"+md))});
    if(!window.DB)return;
    Promise.all([window.DB.slots(),window.DB.results().catch(function(){return {}})]).then(function(rs){
      var l=rs[0],RES=rs[1]||{};
      ["solo","duo"].forEach(function(md){
        var box=$("br-"+md);window.bracket(n,box);
        var a=l.filter(function(x){return (x.mode==="duo"?"duo":"solo")===md&&x.status!=="no"}).sort(function(x,y){return (x.t||0)-(y.t||0)});
        var arr=new Array(n).fill(null),rest=[];
        a.forEach(function(x){var p=x.pos;if(typeof p==="number"&&p>=0&&p<n&&!arr[p])arr[p]=x;else rest.push(x)});
        rest.forEach(function(x){var j=arr.indexOf(null);if(j>=0)arr[j]=x});
        window.ARR[md]=arr;
        var cells=box.querySelector(".rd").querySelectorAll(".m > span");
        arr.forEach(function(x,i){var c=cells[i];if(!c||!x)return;c.classList.toggle("pend",x.status!=="ok");
          if(md==="duo"){var s=c.querySelectorAll("i");s[0].textContent=x.nick;s[1].textContent=x.partner||"—"}else c.textContent=x.nick});
        window.bindDrag(box,md);window.applyRes(box,md,arr,(RES[md]||{}));
      });
    }).catch(function(){});
  };

  /* ---------- хранилище ---------- */
  var FSX=null;
  function fsx(){
    if(!FSX)FSX=Promise.all([import(B+"firebase-app.js"),import(B+"firebase-firestore.js")]).then(function(m){return {F:m[1],db:m[1].getFirestore(m[0].getApp())}});
    return FSX;
  }
  function lsGet(k,d){try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}}
  function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function isLocal(){return !!(window.DB&&window.DB.local)}
  function listT(){
    if(isLocal())return Promise.resolve(lsGet("ah_tours",[]));
    return fsx().then(function(o){return o.F.getDocs(o.F.collection(o.db,"tournaments")).then(function(s){return s.docs.map(function(d){var x=d.data();x.id=d.id;return x})})});
  }
  function saveT(t){
    if(isLocal()){var l=lsGet("ah_tours",[]),i=l.findIndex(function(x){return x.id===t.id});if(i<0)l.push(t);else l[i]=t;lsSet("ah_tours",l);return Promise.resolve()}
    var d={};Object.keys(t).forEach(function(k){if(k!=="id")d[k]=t[k]});
    return fsx().then(function(o){return o.F.setDoc(o.F.doc(o.db,"tournaments",t.id),d)});
  }
  function delT(id){
    if(isLocal()){lsSet("ah_tours",lsGet("ah_tours",[]).filter(function(x){return x.id!==id}));return Promise.resolve()}
    return fsx().then(function(o){return o.F.deleteDoc(o.F.doc(o.db,"tournaments",id))});
  }

  /* ---------- сетка поверх страницы ---------- */
  var cs=document.createElement("style");
  cs.textContent="#br-ov{position:fixed;inset:0;z-index:30;background:rgba(6,3,2,.72);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:calc(env(safe-area-inset-top,0px) + 1rem) 1rem calc(env(safe-area-inset-bottom,0px) + 1rem);animation:ovFade .18s ease both}"
   +".ov-p{display:flex;flex-direction:column;width:min(900px,100%);max-height:100%;min-width:0;background:var(--bg);border:1px solid var(--or);border-radius:18px;box-shadow:0 0 0 1px rgba(255,106,43,.15),0 24px 70px rgba(0,0,0,.7),0 0 40px rgba(255,106,43,.12);animation:ovPop .22s cubic-bezier(.22,.61,.36,1) both}"
   +".ov-h{flex:none;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.9rem 1rem .9rem 1.2rem;border-bottom:1px solid var(--line)}"
   +".ov-h b{font:800 1.3rem/1.1 var(--head);color:var(--or);word-break:break-word}"
   +"#ov-body{flex:1;min-height:0;overflow:auto;padding:1.1rem 1.2rem 1.3rem;-webkit-overflow-scrolling:touch}"
   +".ov-x{flex:none;width:44px;height:44px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font-size:1.2rem;cursor:pointer}"
   +".ov-x:hover{border-color:var(--or);color:var(--or)}"
   +"@keyframes ovFade{from{opacity:0}to{opacity:1}}@keyframes ovPop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}";
  document.head.appendChild(cs);
  var navBr=document.querySelector('nav [data-go="bracket"]');if(navBr)navBr.hidden=true;
  var ov=null,held=null;
  function closeBr(){
    if(!ov)return;
    if(held&&held.parent)held.parent.insertBefore(held.box,held.next);
    ov.remove();ov=null;held=null;document.body.style.overflow="";
  }
  function openBr(mode,title,size){
    closeBr();
    BRN=+size||16;
    var box=$("br-"+mode);if(!box)return;
    held={box:box,parent:box.parentNode,next:box.nextSibling};
    ov=document.createElement("div");ov.id="br-ov";
    ov.innerHTML='<div class="ov-p" role="dialog" aria-modal="true"><div class="ov-h"><b></b><button class="ov-x" type="button" aria-label="Закрыть">✕</button></div><div id="ov-body"></div></div>';
    ov.querySelector("b").textContent=title+" · "+ml(mode)+" · "+BRN+"x";
    ov.querySelector("#ov-body").appendChild(box);
    document.body.appendChild(ov);document.body.style.overflow="hidden";
    ov.querySelector(".ov-x").addEventListener("click",closeBr);
    ov.addEventListener("click",function(e){if(e.target===ov)closeBr()});
    if(window.fillBr)window.fillBr();
  }
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeBr()});

  /* ---------- публичная страница «Турниры» ---------- */
  var CACHE=[],PM="solo",PS=0;
  var sec=$("tour");
  var pub=document.createElement("div");pub.id="tt-pub";
  pub.innerHTML='<div class="seg" id="tt-m"><button data-m="solo">1×1</button><button data-m="duo">2×2</button></div>'
    +'<div class="seg" id="tt-s"><button data-s="0">Все</button>'+SIZES.map(function(n){return '<button data-s="'+n+'">'+n+'x</button>'}).join("")+'</div>'
    +'<div id="tt-list"></div>';
  var h1=sec.querySelector("h1");h1.insertAdjacentElement("afterend",pub);

  function fmt(d){if(!d)return "Дата уточняется";try{return new Date(d).toLocaleString("ru-RU",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch(e){return d}}
  function card(t){
    var duo=t.mode==="duo",st=t.status||"open";
    return '<div class="tcard"><div class="art"><b>'+E(t.title)+'</b><small>'+ml(t.mode)+' · '+(+t.size)+'x</small></div>'
      +'<div class="facts"><div class="stat"><small>Режим</small><b>'+ml(t.mode)+'</b></div>'
      +'<div class="stat"><small>Слоты</small><b>'+(+t.size)+' '+(duo?"пар":"игроков")+'</b></div>'
      +'<div class="stat"><small>Старт</small><b style="font-size:.95rem">'+E(fmt(t.start))+'</b></div>'
      +'<div class="stat"><small>Статус</small><b class="'+(st==="open"?"s-ok":st==="done"?"s-no":"")+'">'+STS[st]+'</b></div></div>'
      +(t.desc?'<p class="tt-desc">'+E(t.desc)+'</p>':'')
      +'<div class="btns">'+(st==="open"?'<button class="btn main" data-tt="reg" data-m="'+(duo?"duo":"solo")+'" data-id="'+E(t.id)+'">Зарегистрироваться на турнир</button>':'')
      +'<button class="btn" data-tt="br" data-m="'+(duo?"duo":"solo")+'" data-id="'+E(t.id)+'">Сетка</button></div></div>';
  }
  function renderPub(){
    $("tt-m").querySelectorAll("button").forEach(function(b){b.classList.toggle("on",b.dataset.m===PM)});
    $("tt-s").querySelectorAll("button").forEach(function(b){b.classList.toggle("on",+b.dataset.s===PS)});
    var l=CACHE.filter(function(t){return (t.mode==="duo"?"duo":"solo")===PM&&(!PS||+t.size===PS)})
      .sort(function(a,b){return String(b.start||"").localeCompare(String(a.start||""))||(b.created||0)-(a.created||0)});
    $("tt-list").innerHTML=l.length?l.map(card).join(""):'<div class="empty"><strong>Скоро будут новые</strong>Новые турниры появятся здесь.</div>';
  }
  function loadPub(tries){
    if(!window.DB){if(tries>0)setTimeout(function(){loadPub(tries-1)},700);return}
    listT().then(function(l){CACHE=l;renderPub()}).catch(function(){CACHE=[];renderPub()});
  }
  $("tt-m").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;PM=b.dataset.m;renderPub()});
  $("tt-s").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;PS=+b.dataset.s;renderPub()});
  $("tt-list").addEventListener("click",function(e){
    var b=e.target.closest("button[data-tt]");if(!b)return;
    var tt=CACHE.find(function(x){return x.id===b.dataset.id});
    if(b.dataset.tt==="br"){openBr(b.dataset.m,tt?tt.title:"Сетка",tt?tt.size:16);return}
    BRN=tt?(+tt.size||16):16;
    window.go("apply");
    var mb=document.querySelector('#f-mode button[data-m="'+b.dataset.m+'"]');if(mb)mb.click();
  });
  renderPub();

  /* ---------- админка ---------- */
  var tabs=$("ad-tabs"),own=$("ad-own"),EID=null,ACACHE=[];
  var tabBtn=document.createElement("button");tabBtn.dataset.t="tt";tabBtn.textContent="Создать турнир";
  tabs.insertBefore(tabBtn,$("ad-tab-adm"));
  var panel=document.createElement("div");panel.id="ad-tt";panel.hidden=true;
  panel.innerHTML='<div class="acc"><h2 class="ah" style="margin:0" id="tt-h">Новый турнир</h2>'
    +'<label class="fld"><span>Название</span><input id="tt-title" maxlength="60"></label>'
    +'<label class="fld"><span>Режим</span><select id="tt-mode"><option value="solo">1×1</option><option value="duo">2×2</option></select></label>'
    +'<label class="fld"><span>Размер сетки</span><select id="tt-size">'+SIZES.map(function(n){return '<option value="'+n+'"'+(n===16?' selected':'')+'>'+n+'x</option>'}).join("")+'</select></label>'
    +'<label class="fld"><span>Дата и время старта</span><input id="tt-start" type="datetime-local"></label>'
    +'<label class="fld"><span>Статус</span><select id="tt-status"><option value="open">Набор открыт</option><option value="live">Идёт</option><option value="done">Завершён</option></select></label>'
    +'<label class="fld"><span>Описание (необязательно)</span><textarea id="tt-desc" maxlength="500"></textarea></label>'
    +'<div class="btns"><button class="btn main" id="tt-save" type="button">Создать турнир</button><button class="btn" id="tt-cancel" type="button" hidden>Отмена</button></div>'
    +'<p class="note" id="tt-msg"></p></div>'
    +'<h2 class="ah">Все турниры</h2><div class="acc" id="tt-adm-list" style="max-width:46rem"></div>';
  $("ad-tours").insertAdjacentElement("afterend",panel);

  function msg(t){$("tt-msg").textContent=t||""}
  function resetForm(){
    EID=null;$("tt-h").textContent="Новый турнир";$("tt-save").textContent="Создать турнир";$("tt-cancel").hidden=true;
    $("tt-title").value="";$("tt-mode").value="solo";$("tt-size").value="16";$("tt-start").value="";$("tt-status").value="open";$("tt-desc").value="";
  }
  function renderAdm(){
    var l=ACACHE.slice().sort(function(a,b){return (b.created||0)-(a.created||0)});
    $("tt-adm-list").innerHTML=l.length?l.map(function(t){
      return '<div class="field tt-row" style="display:grid"><div class="nm">'+E(t.title)+'</div>'
        +'<div class="mt">'+ml(t.mode)+' · '+STS[t.status||"open"]+' · '+E(fmt(t.start))+'</div>'
        +'<div>'+SIZES.map(function(n){return '<button class="sm'+(+t.size===n?' on':'')+'" type="button" data-a="size" data-n="'+n+'" data-id="'+E(t.id)+'">'+n+'x</button>'}).join("")
        +'<button class="sm" type="button" data-a="edit" data-id="'+E(t.id)+'">Изменить</button><button class="sm" type="button" data-a="del" data-id="'+E(t.id)+'">Удалить</button></div></div>';
    }).join(""):'<p class="note">Турниров пока нет.</p>';
  }
  function loadAdm(){listT().then(function(l){ACACHE=l;CACHE=l;renderAdm();renderPub()}).catch(function(e){msg(e&&e.code==="permission-denied"?"Firebase не даёт читать турниры. Добавьте правило для коллекции tournaments (см. инструкцию).":"Не удалось загрузить турниры.")})}
  function fail(e){msg(e&&e.code==="permission-denied"?"Firebase запретил запись. Добавьте правило для коллекции tournaments (см. инструкцию).":"Не удалось сохранить.")}

  $("tt-save").addEventListener("click",function(){
    if(!window.isAdmin||!window.isAdmin())return;
    var title=$("tt-title").value.trim();
    if(!title){msg("Введите название турнира.");return}
    var old=ACACHE.find(function(x){return x.id===EID});
    var t={id:EID||("t"+Date.now()),title:title,mode:$("tt-mode").value,size:+$("tt-size").value,start:$("tt-start").value||"",status:$("tt-status").value,desc:$("tt-desc").value.trim(),created:old?old.created:Date.now()};
    saveT(t).then(function(){var was=!!EID;resetForm();msg(was?"Изменения сохранены.":"Турнир создан.");loadAdm()}).catch(fail);
  });
  $("tt-cancel").addEventListener("click",function(){resetForm();msg("")});
  $("tt-adm-list").addEventListener("click",function(e){
    var b=e.target.closest("button[data-a]");if(!b||!window.isAdmin||!window.isAdmin())return;
    var t=ACACHE.find(function(x){return x.id===b.dataset.id});if(!t)return;
    if(b.dataset.a==="size"){t.size=+b.dataset.n;saveT(t).then(function(){msg("Размер изменён: "+t.size+"x");loadAdm()}).catch(fail)}
    else if(b.dataset.a==="del"){if(!confirm("Удалить турнир «"+t.title+"»?"))return;delT(t.id).then(function(){msg("Турнир удалён.");loadAdm()}).catch(fail)}
    else{EID=t.id;$("tt-h").textContent="Изменить турнир";$("tt-save").textContent="Сохранить изменения";$("tt-cancel").hidden=false;
      $("tt-title").value=t.title||"";$("tt-mode").value=t.mode==="duo"?"duo":"solo";$("tt-size").value=String(t.size||16);$("tt-start").value=t.start||"";$("tt-status").value=t.status||"open";$("tt-desc").value=t.desc||"";
      window.scrollTo(0,0)}
  });
  tabs.addEventListener("click",function(e){
    var b=e.target.closest("button");if(!b)return;
    panel.hidden=b.dataset.t!=="tt";
    if(b.dataset.t==="tt")loadAdm();
  });

  /* ---------- хуки на переходы между страницами ---------- */
  var origGo=window.go;
  window.go=function(id){
    closeBr();
    var r=origGo.apply(this,arguments);
    if(id==="tour")loadPub(6);
    if(id==="admin"){panel.hidden=true;tabs.querySelectorAll("button").forEach(function(x){x.classList.toggle("on",x.dataset.t==="tours")});$("ad-tours").hidden=false;$("ad-set").hidden=true;own.hidden=true}
    return r;
  };
})();
