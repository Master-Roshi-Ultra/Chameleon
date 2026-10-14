const clientStrip=document.querySelector('#client-logos');
// Duplicate the logos once so the CSS animation can loop seamlessly at -50%,
// then add a second row that scrolls the other way in reverse order.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
[...clientStrip.children].forEach(item=>{const copy=item.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelector('img').alt='';clientStrip.appendChild(copy);});
clientStrip.classList.add('is-running');
const marquee=clientStrip.closest('.client-marquee');
const secondRow=marquee.cloneNode(true);
secondRow.classList.add('is-reverse');secondRow.setAttribute('aria-hidden','true');
const secondStrip=secondRow.querySelector('ul');secondStrip.removeAttribute('id');secondStrip.removeAttribute('aria-label');
const half=[...secondStrip.children].slice(0,secondStrip.children.length/2);
const rotated=[...half.slice(6),...half.slice(0,6)];
secondStrip.replaceChildren(...rotated,...rotated.map(item=>item.cloneNode(true)));
secondStrip.querySelectorAll('img').forEach(img=>img.alt='');
marquee.after(secondRow);
}
