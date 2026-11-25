document.addEventListener('DOMContentLoaded',()=>{
  const portrait=document.querySelector('.portrait-switch');
  const portraitStatus=document.querySelector('#portrait-mode-status');
  const portraitWrap=portrait?.closest('.portrait-wrap');
  let portraitMode='';

  function setPortraitMode(mode){
    portraitMode=mode;
    portrait?.classList.toggle('is-revealing',mode==='pinned');
    portrait?.classList.toggle('is-full-mode',mode==='full');
    portrait?.setAttribute('aria-pressed',String(Boolean(mode)));
    portrait?.setAttribute('aria-label',mode==='full'
      ?'Mode jersey penuh aktif. Aktifkan lagi untuk kembali ke mode kreator.'
      :mode==='pinned'
        ?'Jersey tersorot di titik sentuhan. Aktifkan lagi untuk menyembunyikannya.'
        :'Arahkan kursor ke bagian foto untuk menampilkan jersey hanya di area itu. Aktifkan untuk mengubah seluruh ilustrasi.');
    portraitWrap?.classList.toggle('is-player-mode',mode==='full');
  }

  function setRevealPoint(event){
    if(!portrait)return;
    const bounds=portrait.getBoundingClientRect();
    const x=Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100));
    const y=Math.max(0,Math.min(100,(event.clientY-bounds.top)/bounds.height*100));
    portrait.style.setProperty('--cursor-x',x+'%');
    portrait.style.setProperty('--cursor-y',y+'%');
  }

  portrait?.addEventListener('pointermove',event=>{
    setRevealPoint(event);
    if(event.pointerType==='mouse'&&portraitMode!=='full')portrait.classList.add('is-revealing');
  });
  portrait?.addEventListener('pointerleave',event=>{
    if(event.pointerType==='mouse'&&portraitMode!=='pinned'&&portraitMode!=='full')portrait.classList.remove('is-revealing');
  });
  portrait?.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse')return;
    setRevealPoint(event);
    const nextMode=portraitMode==='pinned'?'':'pinned';
    setPortraitMode(nextMode);
    if(portraitStatus)portraitStatus.textContent=nextMode?'Jersey muncul di area yang kamu sentuh. Sentuh lagi untuk menyembunyikannya.':'Sorotan jersey disembunyikan.';
  });
  portrait?.addEventListener('click',event=>{
    if(event.detail!==0)return;
    const nextMode=portraitMode==='full'?'':'full';
    setPortraitMode(nextMode);
    if(portraitStatus)portraitStatus.textContent=nextMode?'Mode jersey penuh aktif.':'Mode kreator aktif.';
  });

  const track=document.querySelector('#portfolio-items');
  const controls=document.querySelector('#portfolio-controls');
  const counter=document.querySelector('#portfolio-slide-count');
  const pagination=document.querySelector('#portfolio-pagination');
  const previous=document.querySelector('#portfolio-previous');
  const next=document.querySelector('#portfolio-next');
  if(!track||!controls||!pagination)return;

  const visibleCards=()=>[...track.querySelectorAll('[data-category]')].filter(card=>!card.hidden);
  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastControlState='';
  let lastCategory='';
  let lastPaginationState='';

  function cardTitle(card){
    return card.querySelector('.project-info h3')?.textContent.trim()||card.dataset.category;
  }

  function updatePagination(cards,category){
    const state=category+':'+cards.map(cardTitle).join('|');
    if(state===lastPaginationState)return;
    lastPaginationState=state;
    pagination.replaceChildren(...cards.map((card,index)=>{
      const button=document.createElement('button');
      button.type='button';
      button.setAttribute('aria-label','Tampilkan '+cardTitle(card));
      button.setAttribute('aria-current',String(index===0));
      button.addEventListener('click',()=>goTo(index));
      return button;
    }));
  }

  function activeIndex(cards){
    if(cards.length<2)return 0;
    const compact=cards[0].classList.contains('credential-card');
    const trackRect=track.getBoundingClientRect();
    const trackStyle=window.getComputedStyle(track);
    const snapStart=trackRect.left+track.clientLeft+(parseFloat(trackStyle.paddingLeft)||0);
    const trackCenter=trackRect.left+track.clientWidth/2;
    return cards.reduce((closest,card,index)=>{
      const cardRect=card.getBoundingClientRect();
      const distance=compact
        ?Math.abs(cardRect.left-snapStart)
        :Math.abs(cardRect.left+cardRect.width/2-trackCenter);
      return distance<closest.distance?{index,distance}:closest;
    },{index:0,distance:Infinity}).index;
  }

  function updateControls(){
    const cards=visibleCards();
    controls.hidden=cards.length===0;
    if(!cards.length){lastControlState='';lastCategory='';lastPaginationState='';return;}
    const category=cards[0].dataset.category;
    track.classList.toggle('is-credential-track',cards[0].classList.contains('credential-card'));
    if(category!==lastCategory){
      track.scrollLeft=0;
      lastCategory=category;
      lastControlState='';
    }
    updatePagination(cards,category);
    const index=activeIndex(cards);
    const state=category+'/'+index+'/'+cards.length;
    if(state===lastControlState)return;
    lastControlState=state;
    if(counter)counter.innerHTML='<b>'+String(index+1).padStart(2,'0')+'</b><i> / '+String(cards.length).padStart(2,'0')+'</i>';
    if(previous)previous.disabled=index===0;
    if(next)next.disabled=index===cards.length-1;
    [...pagination.children].forEach((dot,dotIndex)=>dot.setAttribute('aria-current',String(dotIndex===index)));
  }

  function goTo(index){
    const cards=visibleCards();
    if(!cards.length)return;
    const safeIndex=Math.max(0,Math.min(cards.length-1,index));
    const card=cards[safeIndex];
    const trackRect=track.getBoundingClientRect();
    const cardRect=card.getBoundingClientRect();
    const compact=card.classList.contains('credential-card');
    const trackStyle=window.getComputedStyle(track);
    const snapStart=trackRect.left+track.clientLeft+(parseFloat(trackStyle.paddingLeft)||0);
    const left=compact
      ?track.scrollLeft+cardRect.left-snapStart
      :track.scrollLeft+cardRect.left+cardRect.width/2-(trackRect.left+track.clientWidth/2);
    track.scrollTo({left,behavior:reducedMotion()?'auto':'smooth'});
    updateControls();
  }

  previous?.addEventListener('click',()=>goTo(activeIndex(visibleCards())-1));
  next?.addEventListener('click',()=>goTo(activeIndex(visibleCards())+1));
  let scrollFrame=0;
  track.addEventListener('scroll',()=>{
    if(scrollFrame)return;
    scrollFrame=window.requestAnimationFrame(()=>{scrollFrame=0;updateControls();});
  },{passive:true});
  new MutationObserver(updateControls).observe(track,{subtree:true,attributes:true,attributeFilter:['hidden']});
  window.addEventListener('resize',updateControls,{passive:true});
  updateControls();
});
