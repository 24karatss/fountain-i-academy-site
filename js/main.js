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
    document.body.classList.toggle('menu-open',open); clearTimeout(menu._t);
    if(open){ menu.hidden=false; requestAnimationFrame(function(){ requestAnimationFrame(function(){ menu.classList.add('show'); }); }); }
    else { menu.classList.remove('show'); menu._t=setTimeout(function(){ menu.hidden=true; },window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:380); }
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
    hero.addEventListener('mouseover',function(){ if(vid.paused) playVideo(); });
    var desktop=window.matchMedia('(min-width: 1101px) and (hover: hover)').matches;
    if(desktop&&!conn.saveData&&!/2g/.test(conn.effectiveType||'')){
      window.addEventListener('load',function(){ setTimeout(playVideo,1200); });
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
  var WHATSAPP='2348061714270';
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
    a.addEventListener('click',function(e){ if(a.getAttribute('href')==='#portal'){ e.preventDefault(); (window.faToast?window.faToast('The parent portal link will be added at launch.'):alert('The parent portal link will be added at launch.')); } });
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

/* Motion and custom controls */
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll reveal: headings, cards, images and FAQ items fade up as they enter, siblings in sequence
  if(!reduce&&'IntersectionObserver' in window){
    var sel=['.fa .eyebrow','.fa .h2','.fa p.body','.fa .prog','.fa .mihrab','.fa .faq details','.fa .orbit','.fa img','.fa form','.fa table','.fa [style*="border-radius:22px"]','.fa [style*="border-radius:24px"]','.fa [style*="border-radius:26px"]','.fa [style*="border-radius:28px"]','.fa .ar','.fa blockquote','.fa section > .fa-wrap > div > p'].join(',');
    var els=[].slice.call(document.querySelectorAll(sel)).filter(function(el){
      if(el.closest('.mobile-menu,.orbit .spin,.orbit .ctr,.glance')&&!el.matches('.fa table')) return false;
      var p=el.parentElement; while(p&&!p.classList.contains('fa')){ if(p.classList.contains('rv')) return false; p=p.parentElement; }
      el.classList.add('rv'); return true;
    });
    els.forEach(function(el){
      var sibs=[].filter.call(el.parentElement.children,function(c){return c.classList.contains('rv');});
      var i=sibs.indexOf(el); el.style.setProperty('--d',Math.min(i,5)*90+'ms');
    });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var el=en.target; io.unobserve(el); el.classList.add('in');
        var d=parseInt(el.style.getPropertyValue('--d'))||0;
        setTimeout(function(){ el.classList.remove('rv','in'); el.style.removeProperty('--d'); },d+900);
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(el){ io.observe(el); });
  }

  // Cards that should lift on hover
  document.querySelectorAll('.fa [style*="border-radius:22px"],.fa [style*="border-radius:24px"]').forEach(function(el){ if(!el.closest('form')) el.classList.add('lift'); });

  // Accordions open and close smoothly
  function accordion(d){
    var sum=d.querySelector('summary'); if(!sum) return;
    sum.addEventListener('click',function(e){
      if(reduce||!d.animate) return;
      e.preventDefault();
      if(d._a){ d._a.cancel(); }
      var from=d.getBoundingClientRect().height, opening=!d.open||d.classList.contains('closing');
      d.classList.remove('closing');
      d.open=true; var openH=d.getBoundingClientRect().height;
      d.open=false; var shutH=d.getBoundingClientRect().height;
      d.open=true; d.style.overflow='hidden';
      if(!opening) d.classList.add('closing');
      var body=[].slice.call(d.children).filter(function(c){return c!==sum;});
      d._a=d.animate({height:[from+'px',(opening?openH:shutH)+'px']},{duration:opening?420:320,easing:'cubic-bezier(.2,.7,.2,1)'});
      body.forEach(function(b){ b.animate({opacity:opening?[0,1]:[1,0],transform:opening?['translateY(-6px)','none']:['none','translateY(-4px)']},{duration:opening?380:220,easing:'ease-out',fill:'none'}); });
      d._a.onfinish=function(){ d._a=null; d.style.overflow=''; if(!opening){ d.open=false; d.classList.remove('closing'); } };
      d._a.oncancel=function(){ d.style.overflow=''; };
    });
  }
  document.querySelectorAll('.faq details,.mobile-menu details').forEach(accordion);

  // Custom select menus, kept in sync with the hidden native select the form reads
  var chev='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A1F3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>';
  var tick='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A1F3D" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
  var uid=0, openCs=null;
  document.querySelectorAll('.fld select').forEach(function(sel){
    var n=++uid, wrap=document.createElement('div'); wrap.className='cs';
    var btn=document.createElement('button'); btn.type='button'; btn.className='cs-btn'; btn.setAttribute('aria-haspopup','listbox'); btn.setAttribute('aria-expanded','false');
    var val=document.createElement('span'); btn.appendChild(val); btn.insertAdjacentHTML('beforeend',chev);
    var list=document.createElement('ul'); list.className='cs-list'; list.setAttribute('role','listbox'); list.id='cs'+n; list.tabIndex=-1; btn.setAttribute('aria-controls',list.id);
    var label=sel.closest('label'); if(label){ var t=(label.childNodes[0]&&label.childNodes[0].textContent||'').trim(); if(t) list.setAttribute('aria-label',t); }
    [].forEach.call(sel.options,function(o,i){ var li=document.createElement('li'); li.setAttribute('role','option'); li.id='cs'+n+'-'+i; li.dataset.i=i; li.innerHTML='<span></span>'+tick; li.firstChild.textContent=o.text; list.appendChild(li); });
    sel.parentNode.insertBefore(wrap,sel); wrap.appendChild(btn); wrap.appendChild(list); wrap.appendChild(sel);
    sel.classList.add('cs-native'); sel.tabIndex=-1; sel.setAttribute('aria-hidden','true');
    var items=[].slice.call(list.children), active=sel.selectedIndex;
    function sync(){ val.textContent=sel.options[sel.selectedIndex].text; items.forEach(function(li,i){ li.setAttribute('aria-selected',i===sel.selectedIndex?'true':'false'); }); }
    function setActive(i){ active=Math.max(0,Math.min(items.length-1,i)); items.forEach(function(li,j){ li.classList.toggle('active',j===active); }); list.setAttribute('aria-activedescendant',items[active].id); var li=items[active]; if(li.offsetTop<list.scrollTop) list.scrollTop=li.offsetTop-6; else if(li.offsetTop+li.offsetHeight>list.scrollTop+list.clientHeight) list.scrollTop=li.offsetTop+li.offsetHeight-list.clientHeight+6; }
    function open(){ if(openCs&&openCs!==close) openCs(); var r=btn.getBoundingClientRect(); wrap.classList.toggle('up',window.innerHeight-r.bottom<320&&r.top>320); wrap.classList.add('open'); btn.setAttribute('aria-expanded','true'); setActive(sel.selectedIndex); list.focus({preventScroll:true}); openCs=close; }
    function close(focusBtn){ wrap.classList.remove('open'); btn.setAttribute('aria-expanded','false'); if(openCs===close) openCs=null; if(focusBtn) btn.focus({preventScroll:true}); }
    function choose(i){ if(sel.selectedIndex!==i){ sel.selectedIndex=i; sel.dispatchEvent(new Event('change',{bubbles:true})); } sync(); close(true); }
    btn.addEventListener('click',function(){ wrap.classList.contains('open')?close(true):open(); });
    btn.addEventListener('keydown',function(e){ if(['ArrowDown','ArrowUp','Enter',' '].indexOf(e.key)>-1){ e.preventDefault(); open(); } });
    list.addEventListener('click',function(e){ e.preventDefault(); var li=e.target.closest('li'); if(li) choose(+li.dataset.i); });
    list.addEventListener('mousemove',function(e){ var li=e.target.closest('li'); if(li&&+li.dataset.i!==active) setActive(+li.dataset.i); });
    var typed='', tmr;
    list.addEventListener('keydown',function(e){
      var k=e.key;
      if(k==='ArrowDown'){e.preventDefault();setActive(active+1);} else if(k==='ArrowUp'){e.preventDefault();setActive(active-1);}
      else if(k==='Home'){e.preventDefault();setActive(0);} else if(k==='End'){e.preventDefault();setActive(items.length-1);}
      else if(k==='Enter'||k===' '){e.preventDefault();choose(active);} else if(k==='Escape'){e.preventDefault();close(true);} else if(k==='Tab'){close(false);}
      else if(k.length===1){ typed+=k.toLowerCase(); clearTimeout(tmr); tmr=setTimeout(function(){typed='';},600); for(var i=0;i<items.length;i++){ if(items[i].textContent.toLowerCase().indexOf(typed)===0){ setActive(i); break; } } }
    });
    document.addEventListener('pointerdown',function(e){ if(wrap.classList.contains('open')&&!wrap.contains(e.target)) close(false); });
    sel.form&&sel.form.addEventListener('reset',function(){ setTimeout(sync,0); });
    sync();
  });

  // Toast messages instead of the browser's alert box
  window.faToast=function(msg){
    var t=document.querySelector('.toast');
    if(!t){ t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.setAttribute('aria-live','polite'); document.body.appendChild(t); }
    t.textContent=msg; requestAnimationFrame(function(){ t.classList.add('show'); });
    clearTimeout(t._h); t._h=setTimeout(function(){ t.classList.remove('show'); },3200);
  };
})();
