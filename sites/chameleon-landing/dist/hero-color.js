const heroChameleon=document.querySelector('.hero-chameleon');
// Shift the chameleon's hue with scroll: original colours at the top, +240deg once the art has scrolled out of view.
if(heroChameleon&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const heroArt=heroChameleon.closest('.hero-art');
  let frame=0;
  function paintHue(){frame=0;const rect=heroArt.getBoundingClientRect();const top=rect.top+scrollY;const start=Math.min(top,innerHeight);const progress=Math.min(1,Math.max(0,(scrollY-(top-start))/(start+rect.height)));heroChameleon.style.setProperty('--hue',(progress*240).toFixed(1)+'deg');}
  function queueHue(){if(!frame)frame=requestAnimationFrame(paintHue);}
  addEventListener('scroll',queueHue,{passive:true});
  addEventListener('resize',queueHue);
  paintHue();
}
