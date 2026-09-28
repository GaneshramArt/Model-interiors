
(function(){
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;

  // nav state
  const nav = document.getElementById('nav'); let lastY = 0;
  const hero = document.querySelector('.hero, .page-hero');
  function onScroll(){
    const y = scrollY, h = hero.offsetHeight - 90;
    nav.classList.toggle('solid', y > h);
    nav.classList.toggle('hide', y > h + 200 && y > lastY && !drawer.classList.contains('open'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, {passive:true});

  // drawer
  const drawer = document.getElementById('drawer'), burger = document.getElementById('burger'), closeB = document.getElementById('close');
  function setDrawer(open){
    drawer.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if(open) closeB.focus(); else burger.focus({preventScroll:true});
  }
  burger.onclick = () => setDrawer(true); closeB.onclick = () => setDrawer(false);
  drawer.querySelectorAll('nav a, .foot a').forEach(a => a.addEventListener('click', () => setDrawer(false)));
  addEventListener('keydown', e => {
    if(!drawer.classList.contains('open')) return;
    if(e.key === 'Escape') setDrawer(false);
    if(e.key === 'Tab'){ const f = drawer.querySelectorAll('a,button'); const a=f[0], z=f[f.length-1];
      if(e.shiftKey && document.activeElement===a){e.preventDefault();z.focus()} else if(!e.shiftKey && document.activeElement===z){e.preventDefault();a.focus()} }
  });

  // videos: load after page, respect reduced motion
  function loadVideo(v, auto){
    if(v.dataset.loaded) return; v.dataset.loaded = 1;
    v.src = v.dataset.src; v.load();
    v.addEventListener('canplay', () => { v.classList.add('ready'); if(auto) v.play().catch(()=>{}); }, {once:true});
  }
  const hv = document.getElementById('heroVideo');
  if(hv && !rm && !saveData){ addEventListener('load', () => setTimeout(() => loadVideo(hv, true), 300)); }
  const film = document.getElementById('film'), filmCtl = document.getElementById('filmCtl');
  let filmPaused = rm;
  if(film){
  if(rm){ filmCtl.textContent = 'Play film'; filmCtl.setAttribute('aria-pressed','true'); }
  filmCtl.onclick = () => {
    filmPaused = !filmPaused;
    if(filmPaused){ film.pause(); filmCtl.textContent='Play film'; filmCtl.setAttribute('aria-pressed','true'); }
    else { loadVideo(film,false); film.play().catch(()=>{}); filmCtl.textContent='Pause film'; filmCtl.setAttribute('aria-pressed','false'); }
  };

  // observers: reveal images, play film in view
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
  if(film) new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ if(!filmPaused && !saveData){ loadVideo(film,true); film.play().catch(()=>{}); } }
    else film.pause();
  }), {threshold:.25}).observe(film);

  // filters
  const works = document.getElementById('works');
  if(works){
  document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', x===b));
    const f = b.dataset.f;
    works.style.opacity = 0;
    setTimeout(() => {
      works.classList.toggle('filtered', f !== 'all');
      works.querySelectorAll('.work').forEach(w => w.hidden = !(f==='all' || w.dataset.t===f));
      works.style.opacity = 1;
    }, rm ? 0 : 280);
  }));
  works.style.transition = 'opacity .35s ease';
  }

  // services image swap
  const svcImgs = document.querySelectorAll('.svc-media img');
  document.querySelectorAll('.svc').forEach(s => {
    const act = () => { document.querySelectorAll('.svc').forEach(x => x.classList.toggle('active', x===s)); svcImgs.forEach(i => i.classList.toggle('on', i.dataset.i===s.dataset.i)); };
    s.addEventListener('mouseenter', act); s.addEventListener('click', act);
  });

  // compare sliders
  document.querySelectorAll('.compare').forEach(c => {
    const r = c.querySelector('input');
    const set = v => c.style.setProperty('--p', v + '%');
    r.addEventListener('input', () => set(r.value));
    set(r.value);
  });

  // transformations tabs
  if(document.getElementById('tfCompare')){
  const tA = document.getElementById('tfAfter'), tB = document.getElementById('tfBefore'), tR = document.getElementById('tfRange'), tC = document.getElementById('tfCompare'), tD = document.getElementById('tfDesc');
  const tabs = document.querySelectorAll('.tabs button');
  tabs.forEach((b,i) => {
    b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-selected', x===b));
      const k = b.dataset.k, name = b.firstChild.textContent.trim();
      tA.src = `img/${k}-after.webp`; tB.src = `img/${k}-before.webp`;
      tA.alt = 'After: ' + name.toLowerCase() + ' concept'; tB.alt = 'Before: ' + name.toLowerCase() + ' as found';
      tR.setAttribute('aria-label', 'Compare before and after, ' + name.toLowerCase());
      tD.textContent = b.dataset.d; tR.value = 50; tC.style.setProperty('--p','50%');
    });
    b.addEventListener('keydown', e => {
      if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault(); const n=tabs[(i+1)%tabs.length]; n.focus(); n.click();}
      if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault(); const n=tabs[(i-1+tabs.length)%tabs.length]; n.focus(); n.click();}
    });
  });
  ['kitchen','lounge','hall'].forEach(k => { const a=new Image(); a.src=`img/${k}-after.webp`; const b=new Image(); b.src=`img/${k}-before.webp`; });
  }

  // form
  const form = document.getElementById('form'), thanks = document.getElementById('thanks');
  if(form){
  const req = {name:'Please enter your name.', email:'Please enter a valid email address.', phone:'Please enter a phone number so we can reach you.', ptype:'Please choose a project type.', loc:'Please tell us where the project is.'};
  form.addEventListener('submit', e => {
    e.preventDefault(); let first = null;
    for(const id in req){
      const el = document.getElementById(id), box = el.closest('.f'), err = document.getElementById(id+'-e');
      let ok = el.value.trim() !== '';
      if(id==='email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
      if(id==='phone') ok = el.value.replace(/\D/g,'').length >= 8;
      box.classList.toggle('bad', !ok); err.textContent = ok ? '' : req[id];
      el.setAttribute('aria-invalid', !ok); if(!ok) el.setAttribute('aria-describedby', id+'-e'); else el.removeAttribute('aria-describedby');
      if(!ok && !first) first = el;
    }
    const c = document.getElementById('consent');
    const note = document.getElementById('formNote');
    if(!first && !c.checked){ first = c; note.textContent = 'Please tick the consent box to continue.'; } else note.textContent = '';
    if(first){ first.focus(); return; }
    document.getElementById('tName').textContent = document.getElementById('name').value.trim().split(' ')[0];
    form.hidden = true; thanks.hidden = false; thanks.focus();
  });
  document.getElementById('again').onclick = () => { form.reset(); thanks.hidden = true; form.hidden = false; document.getElementById('name').focus(); };
  // WhatsApp lead: pre-filled message built from the form
  const wa = document.getElementById('waSend');
  const v = id => (document.getElementById(id)||{}).value || '';
  function waHref(){
    const lines = ['Hello Model Interiors, I would like to discuss a project.', '',
      'Name: ' + v('name'), 'Phone: ' + v('phone'), 'Email: ' + v('email'), 'Project type: ' + v('ptype'),
      'Location: ' + v('loc'), 'Size: ' + v('size'), 'Budget: ' + v('budget'), v('msg') ? 'Message: ' + v('msg') : ''].filter(l => !/: $/.test(l));
    wa.href = 'https://wa.me/' + form.dataset.wa + '?text=' + encodeURIComponent(lines.join('\n'));
  }
  form.addEventListener('input', waHref); form.addEventListener('change', waHref); waHref();
  }
})();
