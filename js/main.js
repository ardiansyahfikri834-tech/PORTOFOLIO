document.addEventListener('DOMContentLoaded',()=>{
  window.initNavigation?.();
  window.initAnimations?.();

  // Portfolio category tabs and summary-folder shortcuts.
  const tabs=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-category]')];
  function filterCategory(category){
    tabs.forEach(tab=>{
      const active=tab.dataset.filter===category;
      tab.classList.toggle('is-selected',active);
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex=active?0:-1;
    });
    cards.forEach(card=>{card.hidden=card.dataset.category!==category;});
    const panel=document.querySelector('#portfolio-items');
    if(panel)panel.setAttribute('aria-labelledby',`tab-${category}`);
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>filterCategory(tab.dataset.filter));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      let next=index;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;
      if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      tabs[next].focus();tabs[next].click();
    });
  });
  document.querySelectorAll('[data-filter-link]').forEach(link=>link.addEventListener('click',()=>filterCategory(link.dataset.filterLink)));

  // Project detail dialog.
  const details={
    attendance:{kicker:'PROJECT DETAILS / 01',title:'Presensi Mahasiswa',description:'Website presensi mahasiswa ITS yang dikembangkan sebagai proyek web. Bagian yang ditampilkan di portfolio ini menonjolkan dashboard dan koneksi ke spreadsheet. Lengkapi detail fitur dan kontribusi sesuai implementasi final.',role:'Personal web project',focus:'HTML · CSS · JavaScript · Spreadsheet integration'},
    album:{kicker:'PROJECT DETAILS / 02',title:'VANDSTAVOR Album',description:'Eksplorasi website album digital yang berfokus pada penyajian kenangan melalui komposisi visual dan pengalaman menjelajah konten. Tambahkan detail fitur, proses, dan teknologi sesuai versi proyek yang sebenarnya.',role:'Creative web project',focus:'HTML · CSS · JavaScript · Visual storytelling'}
  };
  const dialog=document.querySelector('#project-dialog');
  document.querySelectorAll('[data-project-detail]').forEach(button=>button.addEventListener('click',()=>{
    const item=details[button.dataset.projectDetail];if(!item||!dialog)return;
    document.querySelector('#dialog-kicker').textContent=item.kicker;
    document.querySelector('#dialog-title').textContent=item.title;
    document.querySelector('#dialog-description').textContent=item.description;
    document.querySelector('#dialog-role').textContent=item.role;
    document.querySelector('#dialog-focus').textContent=item.focus;
    if(typeof dialog.showModal==='function')dialog.showModal();
  }));
  dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});

  // Contact form: uses the address in config.js; never silently sends to a fake address.
  const config=window.PORTFOLIO_CONFIG||{};
  const emailLink=document.querySelector('.contact-email');
  const social=document.querySelectorAll('.social-links a');
  if(emailLink&&config.email&&!config.email.startsWith('GANTI_')){
    emailLink.href=`mailto:${config.email}`;emailLink.textContent=config.email+' ↗';
    emailLink.insertAdjacentHTML('beforeend','');
  }else if(emailLink){emailLink.href='#contact';emailLink.addEventListener('click',e=>{e.preventDefault();document.querySelector('#form-status').textContent='Isi alamat email aktif di file js/config.js terlebih dahulu.';});}
  const socialKeys=['github','linkedin','instagram'];
  social.forEach((link,i)=>{const url=config[socialKeys[i]];if(url)link.href=url;});
  document.querySelector('#contact-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const status=document.querySelector('#form-status');
    if(!config.email||config.email.startsWith('GANTI_')){
      status.textContent='Form belum terhubung ke alamat email. Isi email aktif di js/config.js terlebih dahulu. Setelah itu tombol ini akan membuka aplikasi email untuk mengirim pesan.';document.querySelector('#contact-email')?.focus();return;
    }
    const data=new FormData(event.currentTarget);
    const subject=encodeURIComponent(`Portfolio message from ${data.get('name')}`);
    const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    status.textContent='Membuka aplikasi email di perangkatmu. Tekan Kirim di aplikasi email untuk menyelesaikan pengiriman.';
    window.location.href=`mailto:${config.email}?subject=${subject}&body=${body}`;
  });

  // Reading progress and back-to-top control.
  const progress=document.querySelector('#scroll-progress-bar');
  const topButton=document.querySelector('#back-to-top');
  let ticking=false;
  function updateScrollUI(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const amount=max>0?window.scrollY/max*100:0;
    if(progress)progress.style.width=`${Math.min(100,Math.max(0,amount))}%`;
    topButton?.classList.toggle('is-visible',window.scrollY>500);
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){window.requestAnimationFrame(updateScrollUI);ticking=true;}},{passive:true});
  updateScrollUI();
  topButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'auto'}));
  const year=document.querySelector('.site-footer span');
  if(year)year.textContent=`© ${new Date().getFullYear()} FIKRI TRI ARDIANSYAH`;
});
