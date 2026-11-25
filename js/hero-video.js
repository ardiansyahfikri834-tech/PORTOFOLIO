function initHeroBackgroundVideo(){
  const video=document.querySelector('#hero-background-video');
  const button=document.querySelector('#hero-video-toggle');
  const icon=button?.querySelector('.hero-video-toggle__icon');
  if(!video||!button||!icon)return;

  const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateButton(isPlaying){
    icon.textContent=isPlaying?'\u23f8':'\u25b6';
    button.setAttribute('aria-label',isPlaying?'Jeda video latar':'Putar video latar');
    button.title=isPlaying?'Jeda video latar':'Putar video latar';
  }

  async function playVideo(){
    try{
      await video.play();
    }catch{
      updateButton(false);
    }
  }

  function applyMotionPreference(){
    if(motionPreference.matches){
      video.pause();
      button.hidden=true;
      return;
    }

    button.hidden=false;
    playVideo();
  }

  button.addEventListener('click',()=>{
    if(video.paused)playVideo();
    else video.pause();
  });

  video.addEventListener('play',()=>updateButton(true));
  video.addEventListener('pause',()=>updateButton(false));
  video.addEventListener('error',()=>{button.hidden=true});
  motionPreference.addEventListener('change',applyMotionPreference);
  applyMotionPreference();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initHeroBackgroundVideo,{once:true});
else initHeroBackgroundVideo();
