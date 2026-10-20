// Агуулга data/content.js-ээс ирнэ (admin panel-аар засагдана).
const content=window.CHAMELEON_CONTENT||{packages:[],singles:[],clients:[],reels:[]};
const packages=content.packages||[],singles=content.singles||[],clients=content.clients||[],reels=content.reels||[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const money=n=>Number(n||0).toLocaleString('en-US');
const packageFacts=p=>`<dl class="package-facts"><div><dt>Хэнд тохирох вэ?</dt><dd>${esc(p.fit)}</dd></div><div><dt>Хугацаа</dt><dd>${esc(p.time)}</dd></div><div><dt>Засвар</dt><dd>${esc(p.revisions)}</dd></div></dl>`;
document.querySelector('#packages').innerHTML=packages.map((p,i)=>`<article class="package ${p.recommended?'pro':''}">${p.recommended?'<span class="package-badge">Санал болгох</span>':''}<h3>${esc(p.name)}</h3><p class="description">${esc(p.description)}</p><div class="price">${money(p.price)} <small>₮</small></div>${packageFacts(p)}<p class="package-summary">${(p.summary||[]).map(esc).join('<br>')}</p><a href="#contact" data-service="${esc(p.name)} багц" class="button">Багц сонгох ↗</a><button class="package-detail-button" data-package="${i}">Багцын дэлгэрэнгүй</button></article>`).join('');
document.querySelector('#single').innerHTML=singles.map(s=>`<div class="single-row"><span>${esc(s.name)}</span><strong>${money(s.price)} ₮</strong></div>`).join('');
// Үйлчилгээний картын үнэ нэгж үнийн жагсаалтаас.
document.querySelectorAll('[data-single]').forEach(b=>{const s=singles.find(s=>s.name===b.dataset.single);if(s)b.textContent=money(s.price)+' ₮';else b.closest('li').remove();});
// Хүсэлтийн маягтын багц сонголт ба footer-ийн багцын холбоос.
document.querySelector('#package-chips').outerHTML=packages.map(p=>`<label class="chip"><input type="radio" name="service" value="${esc(p.name)} багц"><span>${esc(p.name)} багц</span></label>`).join('');
document.querySelector('#footer-packages').insertAdjacentHTML('beforeend',packages.map(p=>`<a href="#pricing">${esc(p.name)}</a>`).join(''));
document.querySelectorAll('.package-count').forEach(el=>el.textContent=packages.length);
// Харилцагчийн лого (clients.js гүйлгэх хөдөлгөөнийг нэмнэ).
document.querySelector('#client-logos').innerHTML=clients.map(c=>`<li class="client-logo${c.darkLogo?' dark-logo':''}"><img src="${esc(c.logo)}" alt="${esc(c.name)}" loading="lazy"></li>`).join('');
document.querySelectorAll('.client-count').forEach(el=>el.textContent=clients.length);
// Reels: Facebook, Instagram-ын холбоосыг embed болгоно.
function reelEmbed(url){try{const u=new URL(url);const host=u.hostname.replace(/^(www|m|web)\./,'');
  if(host==='instagram.com'){const m=u.pathname.match(/^\/(?:[^/]+\/)?(reel|reels|p|tv)\/([\w-]+)/);if(m)return{src:`https://www.instagram.com/${m[1]==='reels'?'reel':m[1]}/${m[2]}/embed/`,source:'Instagram'};}
  if(host==='facebook.com'||host==='fb.watch')return{src:'https://www.facebook.com/plugins/video.php?show_text=false&href='+encodeURIComponent(url),source:'Facebook'};
}catch{}return null;}
const reelCards=reels.map(r=>({...r,embed:reelEmbed(r.url)})).filter(r=>r.embed);
if(reelCards.length){document.querySelector('#reels-grid').innerHTML=reelCards.map(r=>`<figure class="reel-card"><div class="reel-frame"><iframe src="${esc(r.embed.src)}" title="${esc(r.title||r.embed.source+' Reel')}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen scrolling="no"></iframe></div><figcaption><span class="reel-source">${r.embed.source}</span>${r.title?`<strong>${esc(r.title)}</strong>`:''}<a href="${esc(r.url)}" target="_blank" rel="noopener">Үзэх ↗</a></figcaption></figure>`).join('');document.querySelector('#reels').hidden=false;}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));});document.querySelector('#packages').hidden=b.dataset.tab!=='packages';document.querySelector('#single').hidden=b.dataset.tab!=='single';}));
function setService(value){const chip=document.querySelector('#brief-form input[name=service][value="'+value+'"]');if(chip)chip.checked=true;}
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>{setService(a.dataset.service);}));
document.querySelectorAll('[data-package]').forEach(b=>b.addEventListener('click',()=>{const p=packages[+b.dataset.package];document.querySelector('#package-detail').innerHTML=`<div class="eyebrow">CHAMELEON / БАГЦ</div><h3>${esc(p.name)} багц</h3>${packageFacts(p)}${(p.items||[]).map(it=>`<div class="detail-row"><span>${esc(it.name)} × ${esc(it.qty)}</span><strong>${money(it.price)} ₮</strong></div>`).join('')}<div class="detail-total">Нийт: ${money(p.price)} ₮</div><p class="detail-note">Мөр бүрийн үнэ нь тухайн тоо хэмжээний нийт дүн. Ажлын хүрээ, материал, хугацааг урьдчилан тохирно.</p><a class="button dark" id="choose-detail" href="#contact">Энэ багцыг сонгох ↗</a>`;document.querySelector('#package-dialog').showModal();document.querySelector('#choose-detail').addEventListener('click',()=>{setService(p.name+' багц');document.querySelector('#package-dialog').close();});}));
const workDialog=document.querySelector('#work-dialog');
document.querySelectorAll('.work-item').forEach(b=>b.addEventListener('click',()=>{workDialog.querySelector('h3').textContent=b.dataset.title;const img=workDialog.querySelector('img');img.src='assets/'+b.dataset.image;img.alt=b.dataset.title;workDialog.querySelector('.work-idea').textContent=b.dataset.idea;workDialog.querySelector('.work-tags').innerHTML=b.dataset.tags.split('|').map(t=>`<span>${t}</span>`).join('');workDialog.showModal();}));
document.querySelector('#work-order').addEventListener('click',()=>{setService('Дизайн ба брэндинг');workDialog.close();});
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
const menu=document.querySelector('.menu');menu.addEventListener('click',()=>{const open=document.querySelector('#nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Цэс хаах':'Цэс нээх');});document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#nav').classList.remove('open');menu.setAttribute('aria-expanded','false');}));
// Send the brief straight to Chameleon's inbox through FormSubmit (the site is static, so there is no server of our own).
const briefForm=document.querySelector('#brief-form'),briefStatus=document.querySelector('#brief-status');
briefForm.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(briefForm);if(f.get('_honey'))return;const button=briefForm.querySelector('button[type=submit]');const p=packages.find(p=>p.name+' багц'===f.get('service'));const contact=f.get('contact').trim();
  const payload={_subject:'Chameleon — шинэ хүсэлт: '+f.get('name').trim(),_template:'table','Нэр / байгууллага':f.get('name').trim(),'Утас эсвэл имэйл':contact,'Хэрэгтэй үйлчилгээ':f.get('service'),'Багцын үнэ':p?money(p.price)+' ₮':'—','Хүссэн хугацаа':f.get('deadline')||'Хамтран тохирно','Төслийн тухай':f.get('description').trim()||'—'};
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))payload._replyto=contact;
  button.disabled=true;briefStatus.classList.remove('is-error');briefStatus.textContent='Илгээж байна…';
  try{const r=await fetch('https://formsubmit.co/ajax/info@chameleon.mn',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload)});const data=await r.json().catch(()=>({}));if(!r.ok||String(data.success)!=='true')throw new Error('FormSubmit '+r.status+': '+(data.message||'no confirmation'));briefForm.reset();briefForm.classList.add('is-sent');briefForm.querySelector('.brief-success').hidden=false;briefStatus.textContent='Хүсэлт илгээгдлээ. Бид тантай удахгүй холбогдоно.';}
  catch(err){console.error('Chameleon quote form was not delivered —',err.message);briefStatus.classList.add('is-error');briefStatus.textContent='Илгээж чадсангүй. info@chameleon.mn хаяг руу имэйлээр эсвэл 7775 7050 дугаарт холбогдоно уу.';}
  finally{button.disabled=false;}});
// Footer MN/EN buttons reuse the header language toggle.
const footerLangButtons=document.querySelectorAll('.footer-lang [data-lang]');
function markFooterLanguage(){footerLangButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===(document.documentElement.lang||'mn'))));}
footerLangButtons.forEach(b=>b.addEventListener('click',()=>{if(b.dataset.lang!==(document.documentElement.lang||'mn'))document.querySelector('#language-toggle').click();markFooterLanguage();}));
document.querySelector('#language-toggle').addEventListener('click',()=>setTimeout(markFooterLanguage));
addEventListener('load',markFooterLanguage);
document.querySelector('#brief-again').addEventListener('click',()=>{briefForm.classList.remove('is-sent');briefForm.querySelector('.brief-success').hidden=true;briefStatus.textContent='Хүсэлт шууд Chameleon-д имэйлээр очно.';briefForm.querySelector('[name=name]').focus();});
