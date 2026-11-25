function initAnimations(){
  const items=document.querySelectorAll('.reveal');
  document.documentElement.classList.add('js-ready');
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    items.forEach(item=>item.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    });
  },{rootMargin:'0px 0px 80px 0px',threshold:0.01});
  items.forEach(item=>observer.observe(item));
}
window.initAnimations=initAnimations;
