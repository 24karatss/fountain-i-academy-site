/* Fountain-I Academy: site behaviour (no dependencies) */
(function(){
  // Mark current page in nav (desktop + mobile)
  var page=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'')||'index';
  document.querySelectorAll('.mobile-menu nav>a').forEach(function(a){
    var h=a.getAttribute('href').replace(/\.html.*$/,'');
    if(h===page||(page==='index'&&h==='index')) a.setAttribute('aria-current','page');
  });

  // Mobile menu
  var btn=document.querySelector('.menu-btn'), menu=document.getElementById('mobile-menu');
  function setMenu(open){
    if(!btn||!menu) return;
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Close menu':'Open menu');
    menu.hidden=!open; document.body.classList.toggle('menu-open',open);
  }
  if(btn){
    btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true');});
    menu.addEventListener('click',function(e){ if(e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') setMenu(false); });
  }

  // Hero video: not downloaded with the page. It loads on first hover/tap (or quietly after the page
  // has finished loading on fast desktop connections), then plays on hover (CSS) or via the control.
  var hero=document.querySelector('.hero'), ctl=document.querySelector('.hero-ctl'), vid=document.querySelector('.hero-gif');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn=navigator.connection||{};
  function loadVideo(){ if(vid&&!vid.src&&vid.dataset.src){ vid.src=vid.dataset.src; vid.preload='auto'; vid.load(); } }
  function playVideo(){ loadVideo(); if(vid&&!reduce){ var p=vid.play(); if(p&&p.catch) p.catch(function(){}); } }
  if(vid&&hero){
    hero.addEventListener('mouseenter',playVideo);
    hero.addEventListener('mouseleave',function(){ if(!hero.classList.contains('playing')) vid.pause(); });
    var desktop=window.matchMedia('(min-width: 1101px) and (hover: hover)').matches;
    if(desktop&&!conn.saveData&&!/2g/.test(conn.effectiveType||'')){
      window.addEventListener('load',function(){ setTimeout(loadVideo,1500); });
    }
  }
  if(ctl&&hero){
    ctl.removeAttribute('aria-hidden'); ctl.setAttribute('role','button'); ctl.setAttribute('tabindex','0'); ctl.setAttribute('aria-label','Play or pause background video');
    var toggle=function(){ hero.classList.toggle('playing'); if(hero.classList.contains('playing')) playVideo(); else if(vid) vid.pause(); };
    ctl.addEventListener('click',toggle);
    ctl.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();} });
  }

  // Forms: no backend yet, so submissions open WhatsApp with the details pre-filled.
  // To switch to email/CRM later, replace this handler (see README).
  var WHATSAPP='2348100119066';
  document.querySelectorAll('form[data-whatsapp]').forEach(function(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var lines=[], title=(form.closest('section')||document).querySelector('h2');
      lines.push((title?title.textContent.trim():'Website enquiry')+' (fountainiacademy website)');
      form.querySelectorAll('label').forEach(function(l){
        var f=l.querySelector('input,select,textarea'); if(!f||!f.value) return;
        var name=(l.childNodes[0]&&l.childNodes[0].textContent||'').trim();
        lines.push(name+': '+f.value.trim());
      });
      window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener');
      var note=form.querySelector('.form-note');
      if(!note){ note=document.createElement('p'); note.className='form-note'; form.appendChild(note); }
      note.textContent='Thank you. WhatsApp has opened with your details. Press send to reach our team.';
    });
  });

  // Portal link placeholder
  document.querySelectorAll('[data-portal]').forEach(function(a){
    a.addEventListener('click',function(e){ if(a.getAttribute('href')==='#portal'){ e.preventDefault(); alert('The parent portal link will be added at launch.'); } });
  });
})();

/* Instant page changes: prefetch other pages before they are clicked */
(function(){
  var c=navigator.connection; if(c&&(c.saveData||/2g/.test(c.effectiveType||''))) return;
  if(HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules')){
    var s=document.createElement('script'); s.type='speculationrules';
    s.textContent=JSON.stringify({prerender:[{where:{href_matches:'/*'},eagerness:'moderate'}],prefetch:[{where:{href_matches:'/*'},eagerness:'eager'}]});
    document.head.appendChild(s); return;
  }
  var done={};
  function pf(a){ if(!a||!a.href||a.origin!==location.origin||done[a.pathname]||a.pathname===location.pathname) return;
    done[a.pathname]=1; var l=document.createElement('link'); l.rel='prefetch'; l.href=a.href; document.head.appendChild(l); }
  ['mouseover','touchstart','focusin'].forEach(function(ev){ document.addEventListener(ev,function(e){ pf(e.target.closest&&e.target.closest('a[href]')); },{passive:true}); });
})();
