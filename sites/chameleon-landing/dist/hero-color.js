const heroChameleon=document.querySelector('.hero-chameleon');
const floatChameleon=document.querySelector('.chameleon-float');
// One chameleon: it starts in the hero art, shrinks and slides to the right edge as the reader scrolls,
// then follows them down the page. Scrolling back up grows it back into its hero spot.
if(heroChameleon&&floatChameleon&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const heroArt=heroChameleon.closest('.hero-art');
  heroArt.classList.add('has-actor');
  const lerp=(a,b,t)=>a+(b-a)*t;
  function heroSlot(){
    const r=heroChameleon.getBoundingClientRect(),cs=getComputedStyle(heroChameleon);
    const pl=parseFloat(cs.paddingLeft),pr=parseFloat(cs.paddingRight),pt=parseFloat(cs.paddingTop),pb=parseFloat(cs.paddingBottom);
    const w=r.width-pl-pr,h=r.height-pt-pb,s=Math.min(w,h);
    return {x:r.left+pl+(w-s)/2,y:r.top+pt+(h-s)/2,s};
  }
  function update(){
    const small=innerWidth<760,dockSize=small?64:92;
    const slot=heroSlot();
    // Start shrinking once the hero chameleon has reached the middle of the screen (immediately on desktop).
    const start=Math.max(0,slot.y+slot.s/2+scrollY-innerHeight*.5);
    const t=Math.min(1,Math.max(0,(scrollY-start)/(small?380:460)));
    const e=t*t*(3-2*t);
    const pageProgress=Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));
    const minY=innerHeight*.2,maxY=innerHeight-dockSize-(small?110:120);
    const dockX=innerWidth-dockSize-(small?12:22),dockY=lerp(minY,maxY,pageProgress);
    const size=lerp(slot.s,dockSize,e);
    floatChameleon.style.setProperty('--size',size.toFixed(1)+'px');
    floatChameleon.style.setProperty('--x',lerp(slot.x,dockX,e).toFixed(1)+'px');
    floatChameleon.style.setProperty('--y',lerp(slot.y,dockY,e).toFixed(1)+'px');
    floatChameleon.style.setProperty('--hue',(scrollY*.25%360).toFixed(1)+'deg');
    const docked=e>.95;
    floatChameleon.classList.toggle('is-docked',docked);
    floatChameleon.tabIndex=docked?0:-1;
    floatChameleon.setAttribute('aria-hidden',String(!docked));
  }
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update);
  addEventListener('load',update);
  update();
}
