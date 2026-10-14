const heroChameleon=document.querySelector('.hero-chameleon');
const floatChameleon=document.querySelector('.chameleon-float');
// The hero chameleon shifts hue with scroll; once it scrolls away, a small copy follows the reader down the page
// (top of the viewport at the start of the page, bottom at the end) and links back to the hero.
if(heroChameleon&&floatChameleon){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0;
  function update(){
    frame=0;
    const hue=reduced.matches?0:scrollY*.25%360;
    heroChameleon.style.setProperty('--hue',hue.toFixed(1)+'deg');
    floatChameleon.style.setProperty('--hue',hue.toFixed(1)+'deg');
    const pageProgress=Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));
    const size=floatChameleon.offsetHeight;
    const minY=innerHeight*.2,maxY=innerHeight-size-24;
    floatChameleon.style.setProperty('--float-y',(reduced.matches?maxY:minY+(maxY-minY)*pageProgress).toFixed(0)+'px');
    const art=heroChameleon.getBoundingClientRect();
    const visible=art.top+art.height/2<0;
    floatChameleon.classList.toggle('is-visible',visible);
    floatChameleon.tabIndex=visible?0:-1;
    floatChameleon.setAttribute('aria-hidden',String(!visible));
  }
  function queue(){if(!frame)frame=requestAnimationFrame(update);}
  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',queue);
  update();
}
