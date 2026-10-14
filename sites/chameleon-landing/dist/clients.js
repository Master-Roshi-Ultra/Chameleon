const clientStrip=document.querySelector('#client-logos');
const clientPrevious=document.querySelector('#clients-prev');
const clientNext=document.querySelector('#clients-next');
function updateClientControls(){const end=clientStrip.scrollWidth-clientStrip.clientWidth;clientPrevious.disabled=clientStrip.scrollLeft<=2;clientNext.disabled=clientStrip.scrollLeft>=end-2;}
function scrollClients(direction){clientStrip.scrollBy({left:direction*Math.max(180,clientStrip.clientWidth*.8),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
clientPrevious.addEventListener('click',()=>scrollClients(-1));
clientNext.addEventListener('click',()=>scrollClients(1));
clientStrip.addEventListener('scroll',updateClientControls,{passive:true});
window.addEventListener('resize',updateClientControls);
clientStrip.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();scrollClients(event.key==='ArrowRight'?1:-1);}});
updateClientControls();
