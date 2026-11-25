function initBackgroundMusic(){
  const audio=document.querySelector('#background-music');
  const button=document.querySelector('#music-toggle');
  const status=document.querySelector('#music-status');
  if(!audio||!button||!status)return;

  audio.volume=.18;
  let statusTimer;

  function showStatus(message){
    status.textContent=message;
    status.classList.add('is-visible');
    window.clearTimeout(statusTimer);
    statusTimer=window.setTimeout(()=>status.classList.remove('is-visible'),5000);
  }

  function updateButton(isPlaying){
    button.classList.toggle('is-playing',isPlaying);
    button.textContent=isPlaying?'\u23f8':'\u266b';
    button.setAttribute('aria-label',isPlaying?'Jeda musik latar':'Putar musik latar');
    button.title=isPlaying?'Jeda musik latar':'Putar musik latar';
  }

  button.addEventListener('click',async()=>{
    if(!audio.paused){
      audio.pause();
      return;
    }

    try{
      await audio.play();
      status.classList.remove('is-visible');
    }catch{
      showStatus('Tambahkan lagu MP3 ke assets/audio/portfolio-theme.mp3 dulu.');
    }
  });

  audio.addEventListener('play',()=>updateButton(true));
  audio.addEventListener('pause',()=>updateButton(false));
  audio.addEventListener('error',()=>{
    updateButton(false);
    showStatus('File lagu belum ditemukan. Cek assets/audio/portfolio-theme.mp3.');
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initBackgroundMusic,{once:true});
else initBackgroundMusic();
