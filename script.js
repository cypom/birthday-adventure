'use strict';
/* ===== 在這裡改文字、照片、音樂 ===== */
const CFG={music:'music.mp3',photo:'photo.jpg',
diary:['今天是個特別的日子。\n這本日記，是為你準備的第一個秘密。','翻到這一頁的你，\n一定發現這個房間有點不一樣了。','繼續探索吧，\n每一件物品都藏著一段回憶。'],
frame:'這張照片……是那天最自然的笑容。（請換成你們的回憶）',
shirt:'那件黑色襯衫，還留著那天的味道。（請換成相關回憶）',
drawer:'抽屜裡有一張小紙條：「謝謝你一直都在。」',
plush:'你找到我了！我是守護這個房間的小狗。',
speaker:'Birthday Memory',
final:'親愛的 ○○：\n\n生日快樂！\n這一路上的每一個回憶，都是因為有你才特別。\n願新的一歲，溫暖、可愛、一切順心。\n\n— 署名'};
/* ================================== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S={state:'identity-check',got:{},open:false,music:null,playing:false,done:false,after:null};
const IDS=['diary','frame','shirt','drawer','plush','speaker'];
const cnt=()=>IDS.filter(i=>S.got[i]).length;
const setState=s=>{S.state=s;document.body.dataset.state=s};
const txt=t=>{const d=document.createElement('div');d.textContent=t;return d};
function toast(t){const e=$('#toast');e.textContent=t;e.className='show';clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',2400)}
function dlg(title,node,btns){$('#dt').textContent=title;const b=$('#db');b.className='';void b.offsetWidth;b.className='flip';b.innerHTML='';b.append(node);
const bt=$('#dbtn');bt.innerHTML='';(btns||[{t:'CLOSE',f:closeDlg}]).forEach(x=>{const k=document.createElement('button');k.className='btn';k.textContent=x.t;k.onclick=x.f;bt.append(k)});$('#dlg').hidden=false}
function closeDlg(){$('#dlg').hidden=true;const a=S.after;S.after=null;a&&a()}
function hud(){$('#mem').textContent='MEMORIES\n'+IDS.map(i=>S.got[i]?'▣':'□').join(' ');
const q=[['Explore the room',S.open],['Find the diary',S.got.diary],['Find the photo',S.got.frame],['Find the black shirt',S.got.shirt],['Discover all memories',cnt()===6]];
$('#quest').textContent='QUEST'+(cnt()===6?' COMPLETE':'')+'\n'+q.map(a=>(a[1]?'▣ ':'□ ')+a[0]).join('\n')}
const chk=()=>{if(cnt()===6&&!S.done){S.done=true;complete()}};
const memDone=()=>{S.after=chk};
function found(id,st){if(S.got[id])return;S.got[id]=1;hud();toast('NEW MEMORY FOUND!');if(st)setState(st)}

const LOCK={frame:['diary','先看看桌上的日記本吧。'],wardrobe:['frame','也許照片裡有線索……'],drawer:['shirt','抽屜鎖著，衣櫃裡也許有線索。'],plush:['drawer','抽屜裡好像有提示。'],speaker:[null,'再多找幾個回憶，音響才會有反應。']};
const locked=id=>{const l=LOCK[id];return l?(id==='speaker'?cnt()<4:!S.got[l[0]]):false};
const H={
window(){toast('窗外的天氣，很適合過生日。')},
diary(){found('diary','diary-found');let p=0;const n=CFG.diary.length;
 const show=()=>dlg(`DIARY ${p+1}/${n}`,txt(CFG.diary[p]),[...(p?[{t:'◀ PREV',f:()=>{p--;show()}}]:[]),p<n-1?{t:'NEXT ▶',f:()=>{p++;show()}}:{t:'CLOSE',f:closeDlg}]);
 memDone();show()},
frame(){found('frame','photo-found');const w=document.createElement('div');const im=new Image();im.className='photo';
 im.onerror=()=>{const p=document.createElement('div');p.className='ph';p.textContent='[ PHOTO PLACEHOLDER ]\n請放入 photo.jpg';im.replaceWith(p)};
 im.src=CFG.photo;w.append(im,txt(CFG.frame));dlg('MEMORY: PHOTO',w);memDone()},
wardrobe(){$('#wardrobe').classList.add('open');found('shirt','shirt-found');memDone();
 setTimeout(()=>dlg('NEW ITEM FOUND: Black Shirt',txt(CFG.shirt)),1600)},
drawer(){$('#drawer').classList.add('open');found('drawer');memDone();
 setTimeout(()=>dlg('DRAWER',txt(CFG.drawer)),1000)},
plush(){const p=$('#plush');p.classList.add('shake');setTimeout(()=>p.classList.remove('shake'),650);found('plush');memDone();
 setTimeout(()=>dlg('你找到我了！',txt(CFG.plush)),500)},
speaker(){const s=$('#speaker');
 try{if(!S.music){S.music=new Audio(CFG.music);S.music.loop=true}
  if(S.playing){S.music.pause();S.playing=false;s.classList.remove('on');toast('MUSIC OFF')}
  else{const r=S.music.play();r&&r.catch&&r.catch(()=>{});S.playing=true;s.classList.add('on');toast('NOW PLAYING\n'+CFG.speaker)}}
 catch(e){toast('NOW PLAYING\n'+CFG.speaker)}
 if(!S.got.speaker){found('speaker');setTimeout(chk,1400)}},
bed(){const b=$('#bed');b.classList.add('lift');setTimeout(()=>b.classList.remove('lift'),1000);toast('好像藏著什麼……')},
rug(){toast('嗯？好像沒有什麼……')},
clock(){toast('現在時間 '+new Date().toLocaleTimeString('zh-TW',{hour12:false}))},
cake(){const c=$('#cake');if(c.classList.contains('out'))return finalCard();
 c.classList.add('out');$('#stage').classList.add('dim');setState('final');toast('HAPPY BIRTHDAY');setTimeout(finalCard,1800)}};
function finalCard(){const w=document.createElement('div');w.append(txt('QUEST COMPLETE\nYou found every birthday memory.\n\n'),txt(CFG.final));
 dlg('HAPPY BIRTHDAY!',w,[{t:'↻ RESTART',f:()=>location.reload()},{t:'CLOSE',f:closeDlg}])}
function complete(){setState('memories-complete');
 dlg('ALL MEMORIES FOUND.',txt('QUEST COMPLETE.'),[{t:'▶ CONTINUE',f:()=>{closeDlg();$('#stage').classList.add('bright');$('#cake').hidden=false;toast('點擊蛋糕，吹熄蠟燭吧');if(!S.playing)H.speaker()}}])}

function openCurtain(){if(S.open)return;S.open=true;$('#stage').classList.add('open');$('#openBtn').hidden=true;document.body.classList.add('play');
 setState('room');hud();setTimeout(()=>toast('QUEST STARTED\nFind all the birthday memories.'),1800)}
function toCurtain(){if(S.state!=='identity-check')return;$('#boot').classList.add('gone');setState('curtain');$('#openBtn').hidden=false}

$('#stage').addEventListener('click',e=>{const o=e.target.closest('.obj');if(!o)return;const id=o.dataset.id;
 try{if(S.state==='curtain'||S.state==='identity-check'){if(id==='window')openCurtain();return}
  if(!$('#dlg').hidden||S.state==='final'&&id!=='cake')return;
  if(locked(id)){toast(LOCK[id][1]);return}
  H[id]&&H[id]()}catch(err){console.error(err);toast('…')}});
$('#openBtn').onclick=openCurtain;$('#startBtn').onclick=toCurtain;$('#restart').onclick=()=>location.reload();
const HINT={diary:'▶ 這本日記似乎有些東西……',frame:'▶ 這張照片……',wardrobe:'▶ 裡面好像藏著什麼。',drawer:'▶ 抽屜……',plush:'▶ 咦，它在動？',speaker:'▶ 播放音樂',window:'▶ [OPEN] 拉開窗簾',cake:'▶ 吹熄蠟燭'};
$$('.obj').forEach(o=>o.dataset.hint=HINT[o.dataset.id]||'▶ 查看');
$('#stage').addEventListener('mouseover',e=>{const o=e.target.closest('.obj'),h=$('#hint');if(o){h.textContent=o.dataset.hint;h.style.display='block';o.classList.toggle('locked',S.open&&locked(o.dataset.id))}else h.style.display='none'});
$('#stage').addEventListener('mouseleave',()=>$('#hint').style.display='none');

function fit(){$('#stage').style.transform=`scale(${Math.min(innerWidth/640,innerHeight/360)})`}
function tick(){const d=new Date();$('#ss').style.transform=`rotate(${d.getSeconds()*6}deg)`;$('#mm').style.transform=`rotate(${d.getMinutes()*6}deg)`;$('#hh').style.transform=`rotate(${(d.getHours()%12)*30+d.getMinutes()/2}deg)`}
function boot(){let p=0;const L={30:'> Detecting player...',60:'> Loading room...',90:'> Preparing birthday quest...'};
 const t=setInterval(()=>{p+=2;const n=Math.floor(p/10);$('#bar').textContent=`[${'█'.repeat(n)}${'░'.repeat(10-n)}] ${p}%`;
  if(L[p])$('#log').textContent+=L[p]+'\n';
  if(p>=100){clearInterval(t);$('#ok').hidden=false;setTimeout(toCurtain,1800)}},70)}
try{fit();addEventListener('resize',fit);tick();setInterval(tick,1000);hud()}catch(e){console.error(e)}
try{boot()}catch(e){console.error(e)}


