(() => {
  const d = window.PORTFOLIO_DATA;
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  let zoom=Number(localStorage.getItem('portfolioZoom')||1);
  let scrollTick=false;
  const routes=['overview','experience','projects','skills','education'];
  const routeLabels={overview:'Overview',experience:'Experience',projects:'Projects',skills:'Skills & Technologies',education:'Education'};
  const tags=arr=>'<div class="tag-row">'+arr.map(x=>'<span class="tag">'+x+'</span>').join('')+'</div>';
  const pageHead=(eyebrow,title,desc,actions='')=>'<div class="page-head"><div><div class="eyebrow">'+eyebrow+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(actions?'<div class="page-actions">'+actions+'</div>':'')+'</div>';

  function renderOverview(){
    const max=Math.max(...d.activityMonthly.map(x=>x[1]));
    qs('[data-view="overview"]').innerHTML=
      pageHead('Professional CV',d.profile.name,d.profile.summary,'<a class="primary-btn" href="resume/">Open resume</a><a class="secondary-btn" href="college-projects/">College projects</a>')+
      '<div class="grid kpi-grid">'+d.metrics.map(m=>'<div class="kpi"><div class="kpi-label">'+m.label+'</div><div class="kpi-value">'+m.value+'</div><div class="kpi-note">'+m.note+'</div></div>').join('')+'</div>'+
      '<div class="grid dashboard-grid">'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Documented work activity</div><div class="panel-subtitle">Work items captured by month</div></div><span class="tag">2023–2026</span></div><div class="panel-body"><div class="chart-wrap">'+d.activityMonthly.map(([m,v])=>'<div class="bar" style="height:'+Math.max(8,v/max*100)+'%" data-label="'+m+': '+v+'"></div>').join('')+'</div><div class="chart-axis"><span>Dec 2023</span><span>Sep 2026</span></div></div></div>'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Professional profile</div><div class="panel-subtitle">Current focus and technical background</div></div></div><div class="panel-body"><div class="stack"><div class="mini-card"><strong>Business intelligence & analytics</strong><p>Production reporting, financial analytics, operational dashboards, data modeling, QA, and stakeholder-facing delivery.</p></div><div class="mini-card"><strong>Automation & engineering</strong><p>Python, REST APIs, browser automation, Snowflake, SQL procedures, scheduled processes, snapshots, and repeatable validation workflows.</p></div><div class="mini-card"><strong>Technical breadth</strong><p>Background spanning data science, machine learning, software development, web technologies, databases, and technical instruction.</p></div></div></div></div>'+
      '</div>'+
      '<div class="panel focus-panel"><div class="panel-head"><div><div class="panel-title">Selected bodies of work</div><div class="panel-subtitle">Click a project to open its detail panel</div></div><button class="secondary-btn" data-scroll="projects">View all projects</button></div><div class="panel-body focus-grid">'+d.projects.slice(0,6).map(p=>'<button class="mini-card project-open" data-project="'+p.id+'" style="text-align:left;cursor:pointer;color:inherit"><strong>'+p.name+'</strong><p>'+p.summary+'</p>'+tags(p.technologies.slice(0,4))+'</button>').join('')+'</div></div>';
  }

  function renderExperience(){
    qs('[data-view="experience"]').innerHTML=
      pageHead('Experience','Professional experience','Roles across business intelligence, logistics, healthcare, analytics education, and technical support.')+
      '<div class="experience-list">'+d.experience.map(e=>'<article class="experience-card"><div class="experience-top"><div><h3>'+e.role+'</h3><div class="experience-meta">'+e.org+' • '+e.location+'</div></div><div class="experience-period">'+e.period+'</div></div>'+tags(e.tags)+'<ul>'+e.bullets.map(b=>'<li>'+b+'</li>').join('')+'</ul></article>').join('')+'</div>';
  }

  function renderProjects(){
    qs('[data-view="projects"]').innerHTML=
      pageHead('Project explorer','Selected projects','Professional analytics work plus earlier software and data projects. Internal links, credentials, customer names, and confidential implementation details are excluded from the public site.')+
      '<div class="filterbar"><input id="projectSearch" placeholder="Search projects, tools, or topics"><select id="projectCategory"><option value="">All categories</option>'+[...new Set(d.projects.map(p=>p.category))].map(c=>'<option>'+c+'</option>').join('')+'</select></div>'+
      '<div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Project</th><th>Category</th><th>Period</th><th>Technologies</th></tr></thead><tbody id="projectRows"></tbody></table></div></div>';
    drawProjectRows();
  }

  function drawProjectRows(){
    const search=(qs('#projectSearch')?.value||'').toLowerCase();
    const cat=qs('#projectCategory')?.value||'';
    const rows=d.projects.filter(p=>(!cat||p.category===cat)&&(!search||JSON.stringify(p).toLowerCase().includes(search)));
    const body=qs('#projectRows'); if(!body)return;
    body.innerHTML=rows.map(p=>'<tr class="project-open" data-project="'+p.id+'"><td><strong>'+p.name+'</strong><div class="panel-subtitle" style="margin-top:3px">'+p.summary+'</div></td><td>'+p.category+'</td><td>'+p.period+'</td><td>'+p.technologies.slice(0,6).join(' • ')+'</td></tr>').join('')||'<tr><td colspan="4">No matching projects.</td></tr>';
  }

  function renderSkills(){
    const skillTotal=d.skills.reduce((n,g)=>n+g.items.length,0);
    qs('[data-view="skills"]').innerHTML=
      pageHead('Capability map','Skills & technologies','Expanded using the technical skills, tools, development background, certifications, and delivery strengths from the previous resume together with current professional work.')+
      '<div class="grid skills-kpi-row">'+
        '<div class="kpi"><div class="kpi-label">Skill areas</div><div class="kpi-value">'+d.skills.length+'</div><div class="kpi-note">Grouped by capability</div></div>'+
        '<div class="kpi"><div class="kpi-label">Technologies & capabilities</div><div class="kpi-value">'+skillTotal+'</div><div class="kpi-note">Analytics, programming, data, and delivery</div></div>'+
        '<div class="kpi"><div class="kpi-label">Certifications / training</div><div class="kpi-value">'+d.certifications.length+'</div><div class="kpi-note">SQL and Tableau focused</div></div>'+
        '<div class="kpi"><div class="kpi-label">Languages</div><div class="kpi-value">'+d.languages.length+'</div><div class="kpi-note">'+d.languages.join(' • ')+'</div></div>'+
      '</div>'+
      '<div class="grid skill-grid">'+d.skills.map(g=>'<div class="panel skill-group"><div class="panel-head"><div class="panel-title">'+g.group+'</div><span class="tag">'+g.items.length+' skills</span></div><div class="panel-body"><div class="skill-chip-grid">'+g.items.map(x=>'<span class="skill-chip">'+x+'</span>').join('')+'</div></div></div>').join('')+'</div>'+
      '<div class="grid skill-footer-grid">'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Certifications & completed training</div><div class="panel-subtitle">Carried forward from the previous resume</div></div></div><div class="panel-body"><div class="credential-list">'+d.certifications.map(x=>'<div class="credential-row"><span class="credential-dot">✓</span><span>'+x+'</span></div>').join('')+'</div></div></div>'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Spoken languages</div><div class="panel-subtitle">Additional background</div></div></div><div class="panel-body">'+tags(d.languages)+'</div></div>'+
      '</div>';
  }

  function renderEducation(){
    const max=Math.max(...d.courseSubjects.map(x=>x[1]));
    qs('[data-view="education"]').innerHTML=
      pageHead('Education','Education & coursework','Degree and coursework view without individual course grades or student identifiers.')+
      '<div class="grid edu-grid">'+d.education.map(e=>'<article class="panel edu-card"><h3>'+e.school+'</h3><div class="edu-degree">'+e.degree+' — '+e.program+'</div>'+(e.secondary?'<div class="edu-meta">'+e.secondary+'</div>':'')+'<div class="edu-meta">'+e.period+(e.honors?' • '+e.honors:'')+'</div><div class="edu-statline"><div><strong>'+e.completedCourses+'</strong><span>Courses</span></div><div><strong>'+e.credits+'</strong><span>Credits</span></div></div>'+tags(e.highlights)+'</article>').join('')+'</div>'+
      '<div class="panel"><div class="panel-head"><div><div class="panel-title">Coursework by subject</div><div class="panel-subtitle">Grouped from completed undergraduate and graduate coursework</div></div></div><div class="panel-body subject-bars">'+d.courseSubjects.map(([s,v])=>'<div class="subject-row"><span>'+s+'</span><div class="subject-track"><div class="subject-fill" style="width:'+(v/max*100)+'%"></div></div><strong>'+v+'</strong></div>').join('')+'</div></div>';
  }

  function openProject(id){
    const p=d.projects.find(x=>x.id===id); if(!p)return;
    qs('#drawerTitle').textContent=p.name;
    qs('#drawerBody').innerHTML='<div class="eyebrow">'+p.category+'</div><p><strong>'+p.period+'</strong></p><p>'+p.summary+'</p>'+tags(p.technologies)+'<h3>Highlights</h3><ul>'+p.highlights.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="notice">This public view intentionally excludes internal ticket links, customer names, credentials, and confidential implementation details.</div>';
    qs('#drawer').classList.add('open'); qs('#drawerBackdrop').classList.add('open');
  }

  function closeDrawer(){qs('#drawer').classList.remove('open');qs('#drawerBackdrop').classList.remove('open')}

  function setActive(route,updateHash=false){
    if(!routes.includes(route))return;
    qsa('.nav-item[data-route]').forEach(n=>n.classList.toggle('active',n.dataset.route===route));
    qs('#crumb').textContent='Portfolio / '+routeLabels[route];
    if(updateHash && location.hash!=='#'+route) history.replaceState(null,'','#'+route);
  }

  function scrollToSection(route,smooth=true){
    if(!routes.includes(route))route='overview';
    const el=qs('[data-view="'+route+'"]'); if(!el)return;
    const topbar=58;
    const y=window.scrollY+el.getBoundingClientRect().top-topbar-10;
    window.scrollTo({top:y,behavior:smooth?'smooth':'auto'});
    setActive(route,true);
    if(innerWidth<760)qs('#sidebar').classList.remove('mobile-open');
  }

  function updateActiveFromScroll(){
    const threshold=100;
    let current='overview';
    routes.forEach(route=>{
      const el=qs('[data-view="'+route+'"]');
      if(el && el.getBoundingClientRect().top<=threshold)current=route;
    });
    setActive(current,true);
    scrollTick=false;
  }

  function applyZoom(){
    document.documentElement.style.setProperty('--zoom',zoom);
    qs('#zoomReadout').textContent=Math.round(zoom*100)+'%';
    localStorage.setItem('portfolioZoom',zoom);
  }

  renderOverview();
  renderExperience();
  renderProjects();
  renderSkills();
  renderEducation();

  qsa('.view').forEach(v=>{v.id=v.dataset.view;});
  qs('#projectCountBadge').textContent=d.projects.length;

  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-route]');
    if(nav){scrollToSection(nav.dataset.route);return}
    const scroll=e.target.closest('[data-scroll]');
    if(scroll){scrollToSection(scroll.dataset.scroll);return}
    const project=e.target.closest('.project-open');
    if(project){openProject(project.dataset.project);return}
    if(e.target.id==='drawerClose'||e.target.id==='drawerBackdrop')closeDrawer();
    if(e.target.id==='menuToggle'){
      if(innerWidth<760)qs('#sidebar').classList.toggle('mobile-open');
      else qs('#sidebar').classList.toggle('collapsed');
    }
    if(e.target.id==='zoomOut'){zoom=Math.max(.75,+(zoom-.05).toFixed(2));applyZoom()}
    if(e.target.id==='zoomIn'){zoom=Math.min(1.5,+(zoom+.05).toFixed(2));applyZoom()}
    if(e.target.id==='fitWidth'){zoom=1;applyZoom()}
    if(e.target.id==='themeToggle'){
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.dataset.theme=next;
      localStorage.setItem('portfolioTheme',next);
    }
  });

  document.addEventListener('input',e=>{if(e.target.id==='projectSearch')drawProjectRows()});
  document.addEventListener('change',e=>{if(e.target.id==='projectCategory')drawProjectRows()});
  window.addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateActiveFromScroll)}},{passive:true});

  const savedTheme=localStorage.getItem('portfolioTheme');
  document.documentElement.dataset.theme=savedTheme||'dark';
  applyZoom();

  const initial=location.hash.replace('#','');
  if(routes.includes(initial)) setTimeout(()=>scrollToSection(initial,false),0);
  else setActive('overview',false);
})();