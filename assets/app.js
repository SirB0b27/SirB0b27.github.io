(() => {
  const d = window.PORTFOLIO_DATA;
  const edu = window.EDUCATION_CATALOG;
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  let zoom=Number(localStorage.getItem('portfolioZoomV2')||1);
  let scrollTick=false;
  const routes=['overview','experience','projects','skills','education'];
  const routeLabels={overview:'Overview',experience:'Experience',projects:'Projects',skills:'Skills & Technologies',education:'Education'};
  const tags=arr=>'<div class="tag-row">'+arr.map(x=>'<span class="tag">'+x+'</span>').join('')+'</div>';
  const pageHead=(eyebrow,title,desc,actions='')=>'<div class="page-head"><div><div class="eyebrow">'+eyebrow+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(actions?'<div class="page-actions">'+actions+'</div>':'')+'</div>';
  const sortProjectsByPeriod=(projects)=>[...projects].sort((a,b)=>{
    const years=(value)=>String(value||'').match(/\b(19|20)\d{2}\b/g)?.map(Number)||[];
    const ay=years(a.period), by=years(b.period);
    const aEnd=ay.length?Math.max(...ay):0, bEnd=by.length?Math.max(...by):0;
    const aStart=ay.length?Math.min(...ay):0, bStart=by.length?Math.min(...by):0;
    return bEnd-aEnd || bStart-aStart || a.name.localeCompare(b.name);
  });

  function renderOverview(){
    const max=Math.max(...d.activityMonthly.map(x=>x[1]));
    qs('[data-view="overview"]').innerHTML=
      pageHead('Professional CV',d.profile.name,d.profile.summary,'<a class="primary-btn" href="resume/">Open resume</a><a class="secondary-btn" href="college-projects/">College projects</a>')+
      '<div class="grid kpi-grid">'+d.metrics.map(m=>'<div class="kpi"><div class="kpi-label">'+m.label+'</div><div class="kpi-value">'+m.value+'</div><div class="kpi-note">'+m.note+'</div></div>').join('')+'</div>'+
      '<div class="grid dashboard-grid">'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Documented work activity</div><div class="panel-subtitle">Work items captured by month</div></div><span class="tag">2023–2026</span></div><div class="panel-body"><div class="chart-wrap">'+d.activityMonthly.map(([m,v])=>'<div class="bar" style="height:'+Math.max(8,v/max*100)+'%" data-label="'+m+': '+v+'"></div>').join('')+'</div><div class="chart-axis"><span>Dec 2023</span><span>Sep 2026</span></div></div></div>'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Professional profile</div><div class="panel-subtitle">Current focus and technical background</div></div></div><div class="panel-body"><div class="stack"><div class="mini-card"><strong>Business intelligence & analytics</strong><p>Production reporting, financial analytics, operational dashboards, data modeling, QA, and stakeholder-facing delivery.</p></div><div class="mini-card"><strong>Automation & engineering</strong><p>Python, REST APIs, browser automation, Snowflake, SQL procedures, scheduled processes, snapshots, and repeatable validation workflows.</p></div><div class="mini-card"><strong>Technical breadth</strong><p>Background spanning data science, machine learning, software development, web technologies, databases, and technical instruction.</p></div></div></div></div>'+
      '</div>'+
      '<div class="panel focus-panel"><div class="panel-head"><div><div class="panel-title">Selected bodies of work</div><div class="panel-subtitle">Click a project to open its detail panel</div></div><button class="secondary-btn" data-scroll="projects">View all projects</button></div><div class="panel-body focus-grid">'+sortProjectsByPeriod(d.projects).slice(0,6).map(p=>'<button class="mini-card project-open" data-project="'+p.id+'" style="text-align:left;cursor:pointer;color:inherit"><strong>'+p.name+'</strong><p>'+p.summary+'</p>'+tags(p.technologies.slice(0,4))+'</button>').join('')+'</div></div>';
  }

  function renderExperience(){
    qs('[data-view="experience"]').innerHTML=
      pageHead('Experience','Professional experience','Roles across business intelligence, logistics, healthcare, analytics education, and technical support.')+
      '<div class="experience-list">'+d.experience.map(e=>'<article class="experience-card"><div class="experience-top"><div><h3>'+e.role+'</h3><div class="experience-meta">'+e.org+' • '+e.location+'</div></div><div class="experience-period">'+e.period+'</div></div>'+tags(e.tags)+'<ul>'+e.bullets.map(b=>'<li>'+b+'</li>').join('')+'</ul></article>').join('')+'</div>';
  }

  function renderProjects(){
    qs('[data-view="projects"]').innerHTML=
      pageHead('Project explorer','Projects','Professional analytics work plus earlier software and data projects. Internal links, credentials, customer names, and confidential implementation details are excluded from the public site.')+
      '<div class="filterbar"><input id="projectSearch" placeholder="Search projects, tools, or topics"><select id="projectCategory"><option value="">All categories</option>'+[...new Set(d.projects.map(p=>p.category))].map(c=>'<option>'+c+'</option>').join('')+'</select></div>'+
      '<div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Project</th><th>Category</th><th>Period</th><th>Technologies</th></tr></thead><tbody id="projectRows"></tbody></table></div></div>';
    drawProjectRows();
  }

  function drawProjectRows(){
    const search=(qs('#projectSearch')?.value||'').toLowerCase();
    const cat=qs('#projectCategory')?.value||'';
    const rows=sortProjectsByPeriod(d.projects).filter(p=>(!cat||p.category===cat)&&(!search||JSON.stringify(p).toLowerCase().includes(search)));
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
    const areas=[...new Set(edu.courses.map(c=>c.area))].sort();
    const totalCredits=edu.programs.reduce((sum,p)=>sum+p.transcriptCredits,0);
    qs('[data-view="education"]').innerHTML=
      pageHead('Education','Education & coursework','A catalog-enriched view of completed undergraduate and graduate coursework. Course grades and student identifiers are intentionally excluded.')+
      '<div class="grid education-kpi-grid">'+
        '<div class="kpi"><div class="kpi-label">Degrees</div><div class="kpi-value">'+edu.programs.length+'</div><div class="kpi-note">B.S. + M.S.</div></div>'+
        '<div class="kpi"><div class="kpi-label">Completed courses</div><div class="kpi-value">'+edu.courses.length+'</div><div class="kpi-note">47 undergraduate • 11 graduate</div></div>'+
        '<div class="kpi"><div class="kpi-label">Academic credits</div><div class="kpi-value">'+totalCredits+'</div><div class="kpi-note">Across undergraduate + graduate records</div></div>'+
        '<div class="kpi"><div class="kpi-label">Undergraduate honors</div><div class="kpi-value">7</div><div class="kpi-note">Dean’s List terms</div></div>'+
      '</div>'+
      '<div class="grid education-program-grid">'+edu.programs.map(p=>
        '<article class="panel education-program-card">'+
          '<div class="panel-head"><div><div class="eyebrow">'+p.short+'</div><div class="panel-title education-program-title">'+p.degree+' — '+p.program+'</div></div><span class="tag">'+p.awarded+'</span></div>'+
          '<div class="panel-body">'+
            (p.secondary?'<div class="edu-meta education-secondary">'+p.secondary+'</div>':'')+
            '<p class="education-program-summary">'+p.catalogSummary+'</p>'+
            '<div class="edu-statline"><div><strong>'+p.completedCourses+'</strong><span>Completed courses</span></div><div><strong>'+p.transcriptCredits+'</strong><span>Transcript credits</span></div>'+(p.honors?'<div><strong>7</strong><span>Dean’s List terms</span></div>':'')+'</div>'+
            tags(p.focus)+
            '<div class="catalog-note">'+p.currentCatalogNote+'</div>'+
            '<div class="catalog-links"><a href="'+p.programUrl+'" target="_blank" rel="noopener">Program catalog ↗</a>'+(p.currentProgramUrl?'<a href="'+p.currentProgramUrl+'" target="_blank" rel="noopener">Current program overview ↗</a>':'')+'</div>'+
          '</div>'+
        '</article>'
      ).join('')+'</div>'+
      '<div class="panel education-explorer">'+
        '<div class="panel-head"><div><div class="panel-title">Course catalog explorer</div><div class="panel-subtitle">Every completed course enriched with official catalog or School of Data Science context</div></div><span class="tag" id="educationResultCount">'+edu.courses.length+' courses</span></div>'+
        '<div class="panel-body">'+
          '<div class="filterbar education-filterbar">'+
            '<input id="educationSearch" placeholder="Search course, code, topic, or skill">'+
            '<select id="educationInstitution"><option value="">All institutions</option><option value="NJIT">NJIT</option><option value="UNC Charlotte">UNC Charlotte</option></select>'+
            '<select id="educationArea"><option value="">All subject areas</option>'+areas.map(a=>'<option>'+a+'</option>').join('')+'</select>'+
          '</div>'+
          '<div class="education-source-note">Catalog summaries are paraphrased from official university catalog, archived catalog, program, and syllabus pages. Historical course titles are kept when the current catalog has changed.</div>'+
          '<div class="table-wrap education-table-wrap"><table class="data-table education-table"><thead><tr><th>Course</th><th>Institution</th><th>Area</th><th>Credits</th><th>Catalog focus</th></tr></thead><tbody id="educationRows"></tbody></table></div>'+
        '</div>'+
      '</div>';
    drawEducationRows();
  }

  function filteredEducationCourses(){
    const search=(qs('#educationSearch')?.value||'').trim().toLowerCase();
    const institution=qs('#educationInstitution')?.value||'';
    const area=qs('#educationArea')?.value||'';
    return edu.courses.filter(c=>{
      if(institution && c.institution!==institution)return false;
      if(area && c.area!==area)return false;
      if(!search)return true;
      return [c.code,c.title,c.area,c.summary,(c.topics||[]).join(' '),c.status||''].join(' ').toLowerCase().includes(search);
    });
  }

  function drawEducationRows(){
    const body=qs('#educationRows'); if(!body)return;
    const rows=filteredEducationCourses();
    const count=qs('#educationResultCount'); if(count)count.textContent=rows.length+' course'+(rows.length===1?'':'s');
    body.innerHTML=rows.map(c=>
      '<tr class="course-open" data-course="'+c.institution+'|'+c.code+'">'+
        '<td><strong>'+c.code+'</strong><div class="course-title">'+c.title+'</div>'+(c.origin?'<div class="course-origin">'+c.origin+'</div>':'')+'</td>'+
        '<td>'+c.institution+'</td>'+
        '<td>'+c.area+'</td>'+
        '<td>'+c.credits+'</td>'+
        '<td><div class="course-summary-cell">'+c.summary+'</div><div class="course-topic-list">'+(c.topics||[]).slice(0,4).map(t=>'<span>'+t+'</span>').join('')+'</div></td>'+
      '</tr>'
    ).join('')||'<tr><td colspan="5"><div class="empty-state">No courses match the current filters.</div></td></tr>';
  }

  function openCourse(key){
    const [institution,code]=key.split('|');
    const c=edu.courses.find(x=>x.institution===institution&&x.code===code);
    if(!c)return;
    qs('#drawerTitle').textContent=c.code+' — '+c.title;
    qs('#drawerBody').innerHTML=
      '<div class="eyebrow">'+c.institution+' • '+c.area+'</div>'+
      '<p><strong>'+c.credits+' credit'+(c.credits===1?'':'s')+'</strong>'+(c.origin?' • '+c.origin:'')+'</p>'+
      '<p>'+c.summary+'</p>'+
      '<h3>Catalog topics</h3>'+tags(c.topics||[])+
      (c.status?'<div class="notice" style="margin-top:14px">'+c.status+'</div>':'')+
      '<h3>Official source</h3><p><a class="secondary-btn drawer-source-link" href="'+c.source+'" target="_blank" rel="noopener">Open university source ↗</a></p>'+
      '<div class="notice">This portfolio intentionally omits individual course grades, student IDs, transcript identifiers, and other private academic information.</div>';
    qs('#drawer').classList.add('open');
    qs('#drawerBackdrop').classList.add('open');
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
    const effectiveZoom=zoom*1.25;
    document.documentElement.style.setProperty('--zoom',effectiveZoom);
    qs('#zoomReadout').textContent=Math.round(zoom*100)+'%';
    localStorage.setItem('portfolioZoomV2',zoom);
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
    const course=e.target.closest('.course-open');
    if(course){openCourse(course.dataset.course);return}
    const project=e.target.closest('.project-open');
    if(project){openProject(project.dataset.project);return}
    if(e.target.id==='drawerClose'||e.target.id==='drawerBackdrop')closeDrawer();
    if(e.target.id==='menuToggle'){
      if(innerWidth<760)qs('#sidebar').classList.toggle('mobile-open');
      else qs('#sidebar').classList.toggle('collapsed');
    }
    if(e.target.id==='zoomOut'){zoom=Math.max(.6,+(zoom-.05).toFixed(2));applyZoom()}
    if(e.target.id==='zoomIn'){zoom=Math.min(1.4,+(zoom+.05).toFixed(2));applyZoom()}
    if(e.target.id==='fitWidth'){zoom=.8;applyZoom()}
    if(e.target.id==='themeToggle'){
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.dataset.theme=next;
      localStorage.setItem('portfolioTheme',next);
    }
  });

  document.addEventListener('input',e=>{
    if(e.target.id==='projectSearch')drawProjectRows();
    if(e.target.id==='educationSearch')drawEducationRows();
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='projectCategory')drawProjectRows();
    if(e.target.id==='educationInstitution'||e.target.id==='educationArea')drawEducationRows();
  });
  window.addEventListener('scroll',()=>{if(!scrollTick){scrollTick=true;requestAnimationFrame(updateActiveFromScroll)}},{passive:true});

  const savedTheme=localStorage.getItem('portfolioTheme');
  document.documentElement.dataset.theme=savedTheme||'dark';
  applyZoom();

  const initial=location.hash.replace('#','');
  if(routes.includes(initial)) setTimeout(()=>scrollToSection(initial,false),0);
  else setActive('overview',false);
})();