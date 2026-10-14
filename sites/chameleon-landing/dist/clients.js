const clientStrip=document.querySelector('#client-logos');
// Duplicate the logos once so the CSS animation can loop seamlessly at -50%.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
[...clientStrip.children].forEach(item=>{const copy=item.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelector('img').alt='';clientStrip.appendChild(copy);});
clientStrip.classList.add('is-running');
}
