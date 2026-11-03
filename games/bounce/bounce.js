/* Bounce — browser-only adaptation of the original CC Bounce rules.
   No Apps Script, Google Sheets, credentials, or network score submission. */
(() => {
  'use strict';
  const arena=document.getElementById('arena');
  const token=document.getElementById('token');
  const overlay=document.getElementById('overlay');
  const title=document.getElementById('overlayTitle');
  const description=document.getElementById('overlayText');
  const startButton=document.getElementById('overlayStart');
  const scoreEl=document.getElementById('score');
  const sessionEl=document.getElementById('session');
  const bestEl=document.getElementById('best');
  const status=document.getElementById('status');
  const emojis=['🐸','🦊','🐼','🐯','🐨','🐱','🐶','🐰','🦁','🐻','🐵','🐷','🦄','🐮','🐧','🦉','🦋','🐙'];
  const key='cc-bounce-best-v1';
  const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let assetPaths=[],animalIndex=-1,frame=0,round=null,last=0,sessionBest=0;
  let personalBest=0;
  try{personalBest=Math.max(0,Number(localStorage.getItem(key))||0);}catch(_){}
  bestEl.textContent=personalBest;
  let lastEmoji=-1;
  function setAnimal(){
    // Use only confirmed published media; missing PNGs never trigger 404s.
    const pool=assetPaths.length?assetPaths:emojis;
    let index=Math.floor(Math.random()*pool.length);
    if(pool.length>1&&index===(assetPaths.length?animalIndex:lastEmoji)){
      index=(index+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;
    }
    token.replaceChildren();
    if(assetPaths.length){
      animalIndex=index;
      const image=document.createElement('img');
      image.src=pool[index];image.alt='Animal';image.draggable=false;
      image.onerror=()=>{image.replaceWith(createEmoji(emojis[index%emojis.length]));};
      token.append(image);
    }else{
      lastEmoji=index;token.append(createEmoji(pool[index]));
    }
  }
  function createEmoji(value){const span=document.createElement('span');span.className='emoji';span.setAttribute('aria-hidden','true');span.textContent=value;return span;}
  async function loadMedia(){
    try{
      const response=await fetch('../../assets/media/animals.json',{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();
      if(!Array.isArray(data))return;
      assetPaths=data.filter(p=>typeof p==='string'&&/^\/assets\/media\/[a-z0-9/_-]+\.(png|webp|svg)$/i.test(p)).map(p=>new URL(p,location.origin).href).slice(0,50);
    }catch(_){}
  }
  function size(){return token.getBoundingClientRect().width||76;}
  function render(){if(round)token.style.transform='translate3d('+round.x+'px,'+round.y+'px,0)';}
  function stop(){
    if(frame)cancelAnimationFrame(frame);
    frame=0;last=0;
  }
  function showOverlay(head,body,button){
    title.textContent=head;description.textContent=body;startButton.textContent=button;overlay.hidden=false;
  }
  function endRound(){
    if(!round||round.done)return;
    round.done=true;stop();token.hidden=true;
    sessionBest=Math.max(sessionBest,round.score);
    sessionEl.textContent=sessionBest;
    if(round.score>personalBest){
      personalBest=round.score;bestEl.textContent=personalBest;
      try{localStorage.setItem(key,String(personalBest));}catch(_){}
    }
    status.textContent='Round over — '+round.score+' points';
    showOverlay('Round over!','You scored '+round.score+' points. Tap start to try again.','Play again');
  }
  function tick(now){
    if(!round||round.done)return;
    const dt=Math.min((now-last)/16.67,3);last=now;
    round.vy+=.16*dt;round.y+=round.vy*dt;round.x+=round.vx*dt;
    round.vx*=Math.pow(.995,dt);
    const maxX=Math.max(0,arena.clientWidth-size()),maxY=Math.max(0,arena.clientHeight-size());
    if(round.x<=0||round.x>=maxX||round.y<=0||round.y>=maxY){
      round.x=Math.max(0,Math.min(maxX,round.x));round.y=Math.max(0,Math.min(maxY,round.y));
      render();endRound();return;
    }
    render();frame=requestAnimationFrame(tick);
  }
  function start(){
    stop();setAnimal();
    const side=size(),maxX=Math.max(0,arena.clientWidth-side),maxY=Math.max(0,arena.clientHeight-side);
    // Gravity, click strength, and wall-loss rules match the original game.
    round={x:Math.max(1,maxX/2),y:Math.max(15,maxY*.25),vx:0,vy:1.25,score:0,done:false};
    scoreEl.textContent='0';overlay.hidden=true;token.hidden=false;status.textContent='Tap the animal!';
    render();last=performance.now();frame=requestAnimationFrame(tick);
  }
  function bounce(e){
    if(!round||round.done)return;
    e.preventDefault();e.stopPropagation();
    const rect=token.getBoundingClientRect(),radius=Math.min(rect.width,rect.height)/2;
    const dx=e.clientX-(rect.left+rect.width/2),dy=e.clientY-(rect.top+rect.height/2);
    const r=Math.hypot(dx,dy);
    if(r>radius)return;
    round.score+=1;scoreEl.textContent=round.score;
    let nx=dx/(r||1),ny=dy/(r||1);
    if(r<.12*radius){nx=(Math.random()-.5)*.9;ny=.7;}
    if(Math.random()<.05){const a=Math.random()*Math.PI*2;nx=Math.cos(a);ny=Math.sin(a);}
    const strength=6+Math.min(4,r/radius*4);
    round.vx=-nx*strength;round.vy=-Math.max(5,Math.abs(ny*strength));
    if(prefersReduced)token.animate([{opacity:.75},{opacity:1}],{duration:90});
  }
  token.addEventListener('pointerdown',bounce);
  token.addEventListener('keydown',e=>{
    if(!round||round.done)return;
    if(e.key==='Enter'||e.key===' '){
      e.preventDefault();round.score++;scoreEl.textContent=round.score;
      round.vy=-7;round.vx=(Math.random()-.5)*3;
    }
  });
  startButton.addEventListener('click',start);
  document.getElementById('newRound').addEventListener('click',start);
  document.getElementById('changeAnimal').addEventListener('click',()=>{setAnimal();status.textContent='New animal selected';});
  // Keep physics bounded when screen orientation changes.
  window.addEventListener('resize',()=>{
    if(!round||round.done)return;
    round.x=Math.min(round.x,Math.max(0,arena.clientWidth-size()));
    round.y=Math.min(round.y,Math.max(0,arena.clientHeight-size()));
    render();
  });
  // Pause when hidden so background tabs cannot silently lose a round.
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}
    else if(round&&!round.done&&!frame){last=performance.now();frame=requestAnimationFrame(tick);}
  });
  setAnimal();
  void loadMedia().then(()=>{if(!round)setAnimal();});
})();
