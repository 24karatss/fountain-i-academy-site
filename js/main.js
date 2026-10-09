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

  // Hero video: plays on hover (CSS); the control toggles it for touch/keyboard users
  var hero=document.querySelector('.hero'), ctl=document.querySelector('.hero-ctl'), vid=document.querySelector('.hero-gif');
  if(ctl&&hero){
    ctl.removeAttribute('aria-hidden'); ctl.setAttribute('role','button'); ctl.setAttribute('tabindex','0'); ctl.setAttribute('aria-label','Play or pause background video');
    var toggle=function(){ hero.classList.toggle('playing'); if(vid){ hero.classList.contains('playing')?vid.play():null; } };
    ctl.addEventListener('click',toggle);
    ctl.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();} });
  }
  if(vid&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){ vid.removeAttribute('autoplay'); vid.pause(); }

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
