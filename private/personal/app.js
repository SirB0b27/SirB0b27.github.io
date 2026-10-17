(() => {
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const data=window.PERSONAL_ANALYTICS||{};
  // Same-origin assignment entry pages use this flag to confirm they are being
  // rendered inside the authenticated Personal workspace rather than opened directly.
  window.__collegeProjectsUnlocked=true; // Enables existing public demo wrappers only; NOT authentication.
  window.__personalSpaceUnlocked=true;
  let analyticsRendered=false;
  let currentView='home';
  let zoom=Number(localStorage.getItem('portfolioZoomV2')||1);
  const assignments={
    1:{src:'../../IT201/Assignment1/index.html',desc:'HTML/CSS heritage page'},
    2:{src:'../../IT201/Assignment2/index.html',desc:'JavaScript validation and account verification interface'},
    3:{src:'../../IT201/Assignment3/index.html',desc:'Database-backed dental records assignment — static GitHub Pages reconstruction'},
    4:{src:'../../IT201/Assignment4/index.html',desc:'Dental account and appointment workflow — browser-based compatibility version'},
    5:{src:'../../IT201/Assignment5/index.html',desc:'Real-time chat assignment — browser-based compatibility recreation'}
  };

  function clearPersonalAccess(){
    sessionStorage.removeItem('gpPrivatePersonalToken');
  }

  function applyZoom(){
    const effectiveZoom=zoom*1.25;
    document.documentElement.style.setProperty('--personal-zoom',effectiveZoom);
    const readout=q('#zoomReadout');
    if(readout)readout.textContent=Math.round(zoom*100)+'%';
    localStorage.setItem('portfolioZoomV2',zoom);
  }

  function goPortfolio(){
    clearPersonalAccess();
    location.href='../#overview';
  }

  function setTheme(){
    document.documentElement.dataset.theme=localStorage.getItem('portfolioTheme')||'dark';
  }

  function rowList(items,labelKey='level'){
    items=items||[];
    const max=Math.max(...items.map(x=>Number(x.value)||0),1);
    return items.map(x=>'<div class="private-row"><span>'+x[labelKey]+'</span><div class="private-track"><div class="private-fill" style="width:'+((Number(x.value)||0)/max*100)+'%"></div></div><strong>'+x.value+'</strong></div>').join('');
  }

  function renderAnalytics(){
    if(analyticsRendered)return;
    analyticsRendered=true;
    q('#privacyBanner').textContent=(data.privacyNote||'This workspace contains personal aggregates only.')+' This GitHub Pages login is a client-side access gate, so raw secrets are not stored here.';
    q('#metricGrid').innerHTML=(data.metrics||[]).map(m=>'<div class="kpi"><div class="kpi-label">'+m.label+'</div><div class="kpi-value">'+m.value+'</div><div class="kpi-note">'+m.note+'</div></div>').join('');
    const monthly=data.monthlyActivity||[];
    const max=Math.max(...monthly.map(x=>Number(x[1])||0),1);
    q('#monthlyChart').innerHTML=monthly.map(([m,v])=>'<div class="private-bar" style="height:'+Math.max(8,(Number(v)||0)/max*100)+'%" data-label="'+m+': '+v+'"></div>').join('');
    q('#workYear').innerHTML=rowList(data.workItemsByYear,'year');
    q('#jiraYear').innerHTML=rowList(data.jiraByYear,'year');
    q('#stakeholderTickets').innerHTML=rowList(data.stakeholderTicketCounts);
    q('#uniqueStakeholders').innerHTML=rowList(data.uniqueMatchedStakeholders);
    q('#functions').innerHTML=rowList(data.stakeholderFunctions,'function');
    q('#projectFamilies').innerHTML=(data.projectFamilies||[]).map(x=>'<tr><td>'+x.name+'</td><td>'+x.period+'</td><td>'+x.count+'</td></tr>').join('');
  }

  function showAssignment(n,updateHash=true){
    n=String(assignments[n]?n:1);
    const item=assignments[n];
    qa('.assignment-tab').forEach(tab=>tab.classList.toggle('active',tab.dataset.assignment===n));
    const stage=q('#assignmentStage');
    let frame=q('[data-assignment-frame="'+n+'"]');
    if(!frame){
      frame=document.createElement('iframe');
      frame.className='assignment-frame';
      frame.dataset.assignmentFrame=n;
      frame.title='Interactive IT201 Assignment '+n+' — public compatibility demo';
      frame.referrerPolicy='strict-origin-when-cross-origin';
      // Legacy same-origin assignment wrappers check their parent for this marker.
      // This is NOT security and does not restrict direct public GitHub URLs.
      frame.src=item.src;
      stage.append(frame);
    }
    qa('[data-assignment-frame]').forEach(x=>x.hidden=x.dataset.assignmentFrame!==n);
    q('#assignmentDescription').textContent=item.desc+' — Interactive public compatibility demo. This page is not protected against direct URL access.';
    const open=q('#openAssignment');
    if(open){open.hidden=true;open.removeAttribute('href');open.setAttribute('aria-disabled','true')}
    if(updateHash)history.replaceState(null,'','#college/assignment-'+n);
  }

  function parseHash(){
    const raw=(location.hash||'#home').slice(1);
    const parts=raw.split('/');
    return {view:['home','analytics','college'].includes(parts[0])?parts[0]:'home',assignment:(parts[1]||'').replace('assignment-','')||'1'};
  }

  function navigate(view,updateHash=true){
    if(!['home','analytics','college'].includes(view))view='home';
    currentView=view;
    qa('[data-personal-view]').forEach(x=>x.hidden=x.dataset.personalView!==view);
    qa('[data-personal-route]').forEach(x=>x.classList.toggle('active',x.dataset.personalRoute===view));
    const label={home:'Home',analytics:'Personal Analytics',college:'College Projects'}[view];
    q('#personalCrumb').textContent='Personal / '+label;
    if(view==='analytics')renderAnalytics();
    if(view==='college'){
      const route=parseHash();
      showAssignment(route.view==='college'?route.assignment:'1',false);
    }
    if(updateHash)history.replaceState(null,'','#'+view);
    if(innerWidth<760)q('#personalSidebar').classList.remove('mobile-open');
    window.scrollTo({top:0,behavior:'auto'});
  }

  q('#portfolioBack').addEventListener('click',e=>{e.preventDefault();goPortfolio()});
  qa('[data-personal-route]').forEach(x=>x.addEventListener('click',()=>navigate(x.dataset.personalRoute)));
  qa('[data-open-view]').forEach(x=>x.addEventListener('click',()=>navigate(x.dataset.openView)));
  qa('[data-back-home]').forEach(x=>x.addEventListener('click',()=>navigate('home')));
  qa('.assignment-tab').forEach(x=>x.addEventListener('click',()=>showAssignment(x.dataset.assignment)));
  q('#menuToggle').addEventListener('click',()=>{
    if(innerWidth<760)q('#personalSidebar').classList.toggle('mobile-open');
    else q('#personalSidebar').classList.toggle('collapsed');
    q('#personalMain').classList.toggle('sidebar-collapsed',q('#personalSidebar').classList.contains('collapsed'));
  });
  q('#zoomOut').addEventListener('click',()=>{zoom=Math.max(.6,+(zoom-.05).toFixed(2));applyZoom()});
  q('#zoomIn').addEventListener('click',()=>{zoom=Math.min(1.4,+(zoom+.05).toFixed(2));applyZoom()});
  q('#fitWidth').addEventListener('click',()=>{zoom=.8;applyZoom()});
  q('#themeToggle').addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;
    localStorage.setItem('portfolioTheme',next);
  });

  window.addEventListener('hashchange',()=>{
    const route=parseHash();
    navigate(route.view,false);
    if(route.view==='college')showAssignment(route.assignment,false);
  });
  window.addEventListener('pagehide',clearPersonalAccess);
  

  setTheme();
  applyZoom();
  const route=parseHash();
  navigate(route.view,false);
  if(route.view==='college')showAssignment(route.assignment,false);
})()