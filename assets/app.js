(() => {
  const d = window.PORTFOLIO_DATA;
  const edu = window.EDUCATION_CATALOG;
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  let zoom=Number(localStorage.getItem('portfolioZoomV2')||1);
  let scrollTick=false;
  let personalMenuUnlocked=false;
  const personalExpectedHash='d0f1e3c007d7e9411923d1922fb8364004ca9eaf7b8aee6cb1955104e35f2dca';
  const routes=['overview','experience','projects','skills','education'];
  const routeLabels={overview:'Overview',experience:'Experience',projects:'Projects',skills:'Skills & Technologies',education:'Education'};
  const tags=arr=>'<div class="tag-row">'+arr.map(x=>'<span class="tag">'+x+'</span>').join('')+'</div>';
  const pageHead=(eyebrow,title,desc,actions='')=>'<div class="page-head"><div><div class="eyebrow">'+eyebrow+'</div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(actions?'<div class="page-actions">'+actions+'</div>':'')+'</div>';
  const experienceOrgAccent=(org)=>({
    "Armstrong Transport Group, Inc.":"#0F4C5C",
    "Cooper University Hospital":"#C8102E",
    "2U, Inc.":"#2F75B5",
    "UNC Charlotte":"#007A53"
  }[org]||"#9C8CFF");
  const sortProjectsByPeriod=(projects)=>[...projects].sort((a,b)=>{
    const years=(value)=>String(value||'').match(/\b(19|20)\d{2}\b/g)?.map(Number)||[];
    const ay=years(a.period), by=years(b.period);
    const aEnd=ay.length?Math.max(...ay):0, bEnd=by.length?Math.max(...by):0;
    const aStart=ay.length?Math.min(...ay):0, bStart=by.length?Math.min(...by):0;
    return bEnd-aEnd || bStart-aStart || a.name.localeCompare(b.name);
  });


  async function sha256(value){
    const bytes=new TextEncoder().encode(value);
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function resetPersonalNav(){
    personalMenuUnlocked=false;
    const gate=qs('#personalNavGate');
    const links=qs('#personalNavLinks');
    const trigger=qs('#personalNavTrigger');
    const input=qs('#personalNavPassword');
    const error=qs('#personalNavError');
    if(gate)gate.hidden=true;
    if(links)links.hidden=true;
    if(trigger)trigger.setAttribute('aria-expanded','false');
    if(input)input.value='';
    if(error)error.hidden=true;
  }

  function openPersonalGate(){
    const gate=qs('#personalNavGate');
    const links=qs('#personalNavLinks');
    const trigger=qs('#personalNavTrigger');
    const input=qs('#personalNavPassword');
    const error=qs('#personalNavError');
    if(personalMenuUnlocked){
      resetPersonalNav();
      return;
    }
    if(gate)gate.hidden=false;
    if(links)links.hidden=true;
    if(trigger)trigger.setAttribute('aria-expanded','true');
    if(error)error.hidden=true;
    setTimeout(()=>input?.focus(),0);
  }

  async function unlockPersonalNav(){
    const input=qs('#personalNavPassword');
    const error=qs('#personalNavError');
    if(!input)return;
    if(await sha256(input.value)===personalExpectedHash){
      personalMenuUnlocked=true;
      qs('#personalNavGate').hidden=true;
      qs('#personalNavLinks').hidden=false;
      qs('#personalNavTrigger')?.setAttribute('aria-expanded','true');
      input.value='';
      if(error)error.hidden=true;
    }else{
      if(error)error.hidden=false;
      input.select();
    }
  }

  function renderOverview(){
    qs('[data-view="overview"]').innerHTML=
      pageHead('Professional CV',d.profile.name,d.profile.summary,'<a class="primary-btn" href="resume/">Open Resume</a>')+
      '<div class="grid kpi-grid">'+d.metrics.map(m=>'<div class="kpi"><div class="kpi-label">'+m.label+'</div><div class="kpi-value">'+m.value+'</div><div class="kpi-note">'+m.note+'</div></div>').join('')+'</div>'+
      '<div class="grid dashboard-grid">'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Professional Scope</div><div class="panel-subtitle">Business Intelligence, Analytics Engineering, Financial Analytics, and Decision Support</div></div></div><div class="panel-body"><div class="stack">'+
          '<div class="mini-card"><strong>Business Intelligence & Decision Support</strong><p>Translate operational and financial questions into KPIs, segmentation, drilldowns, trend analysis, exception views, and management-ready decisions.</p></div>'+
          '<div class="mini-card"><strong>Analytics Engineering & Financial Controls</strong><p>Build reusable Snowflake/Sigma data products, commission workflows, forecasting logic, snapshots, reconciliation controls, and validation processes.</p></div>'+
          '<div class="mini-card"><strong>Cross-Functional Delivery</strong><p>Work across executive leadership, finance, operations, shared services, technology, LTL, marketing, legal, and agent-facing teams.</p></div>'+
        '</div></div></div>'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Current Focus</div><div class="panel-subtitle">How Technical Work Connects to Business Outcomes</div></div></div><div class="panel-body"><div class="stack">'+
          '<div class="mini-card"><strong>Operational Intelligence</strong><p>Performance dashboards, workflow monitoring, growth analytics, service metrics, and exception-driven reporting.</p></div>'+
          '<div class="mini-card"><strong>Financial Analytics</strong><p>Commission systems, payout controls, cash forecasting, settlement analytics, currency logic, and reconciliation.</p></div>'+
          '<div class="mini-card"><strong>Maintainability & Governance</strong><p>Process maps, documentation, data lineage, reusable modeling patterns, QA, and long-term production support.</p></div>'+
        '</div></div></div>'+
      '</div>'+
      '<div class="panel focus-panel"><div class="panel-head"><div><div class="panel-title">Project Highlights</div><div class="panel-subtitle">Click a Project to Expand Its Full Business and Technical Context</div></div><button class="secondary-btn" data-scroll="projects">View All Projects</button></div><div class="panel-body focus-grid">'+sortProjectsByPeriod(d.projects).slice(0,6).map(p=>'<button class="mini-card project-jump" data-project="'+p.id+'" style="text-align:left;cursor:pointer;color:inherit"><strong>'+p.name+'</strong><p>'+p.summary+'</p>'+tags(p.technologies.slice(0,4))+'</button>').join('')+'</div></div>';
  }

  function renderExperience(){
    const details=d.experienceDetails||{};
    qs('[data-view="experience"]').innerHTML=
      pageHead('Experience','Professional Experience','Click anywhere on a role card to expand a deeper view of the business context, year-by-year growth, stakeholder scope, major projects, and additional responsibilities.')+
      '<div class="experience-list">'+d.experience.map((e,i)=>{
        const detail=details[e.org]||{};
        const timeline=(detail.timeline||[]).map(t=>
          '<div class="experience-year">'+
            '<div class="experience-year-label">'+t.year+'</div>'+
            '<div><div class="experience-year-title">'+t.title+'</div><p>'+t.summary+'</p></div>'+
          '</div>'
        ).join('');
        const projects=(detail.projectIds||[]).map(id=>d.projects.find(p=>p.id===id)).filter(Boolean);
        const projectCards=sortProjectsByPeriod(projects).map(p=>
          '<button class="experience-project project-jump" data-project="'+p.id+'">'+
            '<div><strong>'+p.name+'</strong><span>'+p.period+'</span></div>'+
            '<p>'+p.summary+'</p>'+
            '<div class="experience-project-tech">'+p.technologies.slice(0,5).join(' • ')+'</div>'+
          '</button>'
        ).join('');
        const visibleBullets=e.bullets.slice(0,3);
        const additionalBullets=e.bullets.slice(3);
        const businessSense=(detail.businessIntelligence||[]).map(x=>'<li>'+x+'</li>').join('');
        const stakeholder=detail.stakeholderScope||{};
        return '<article class="experience-card experience-expandable" data-experience-card="'+i+'" tabindex="0" role="button" aria-expanded="false" style="--org-accent:'+experienceOrgAccent(e.org)+'">'+
          '<div class="experience-card-header">'+
            '<div class="experience-top"><div><h3>'+e.role+'</h3><div class="experience-meta">'+e.org+' • '+e.location+'</div></div><div class="experience-period">'+e.period+'</div></div>'+
          '</div>'+
          '<div class="experience-card-summary">'+
            tags(e.tags)+
            '<ul class="experience-summary-bullets">'+visibleBullets.map(b=>'<li>'+b+'</li>').join('')+'</ul>'+
          '</div>'+
          '<div class="experience-detail" data-experience-detail="'+i+'" hidden>'+
            (detail.overview?'<div class="experience-detail-section experience-subsection overview-subsection"><div class="inline-detail-title">Role Overview</div><p>'+detail.overview+'</p></div>':'')+
            (businessSense?'<div class="experience-detail-section experience-subsection business-subsection"><div class="inline-detail-title">Business Intelligence & Business Context</div><ul>'+businessSense+'</ul></div>':'')+
            (((stakeholder.levels||[]).length||(stakeholder.functions||[]).length)?'<div class="experience-detail-section experience-subsection stakeholder-subsection"><div class="inline-detail-title">Stakeholder Scope</div>'+(stakeholder.levels?.length?'<div class="subsection-label">Seniority Levels</div>'+tags(stakeholder.levels):'')+(stakeholder.functions?.length?'<div class="subsection-label subsection-label-spaced">Business Functions</div>'+tags(stakeholder.functions):'')+'</div>':'')+
            (timeline?'<div class="experience-detail-section experience-subsection timeline-subsection"><div class="inline-detail-title">Year-by-Year</div><div class="experience-timeline">'+timeline+'</div></div>':'')+
            (additionalBullets.length?'<div class="experience-detail-section experience-subsection responsibilities-subsection"><div class="inline-detail-title">Additional Responsibilities</div><ul>'+additionalBullets.map(b=>'<li>'+b+'</li>').join('')+'</ul></div>':'')+
            ((detail.focus||[]).length?'<div class="experience-detail-section experience-subsection focus-subsection"><div class="inline-detail-title">Focus Areas</div>'+tags(detail.focus)+'</div>':'')+
            (projectCards?'<div class="experience-detail-section experience-subsection projects-subsection"><div class="inline-detail-title">Projects & Initiatives</div><div class="experience-project-grid">'+projectCards+'</div></div>':'')+
          '</div>'+
        '</article>';
      }).join('')+'</div>';
  }

  function renderProjects(){
    qs('[data-view="projects"]').innerHTML=
      pageHead('Project Explorer','Projects','Professional analytics work plus earlier software and data projects. Internal links, credentials, customer names, and confidential implementation details are excluded from the public site.')+
      '<div class="filterbar"><input id="projectSearch" placeholder="Search projects, tools, or topics"><select id="projectCategory"><option value="">All categories</option>'+[...new Set(d.projects.map(p=>p.category))].map(c=>'<option>'+c+'</option>').join('')+'</select></div>'+
      '<div class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Project</th><th>Category</th><th>Period</th><th>Technologies</th></tr></thead><tbody id="projectRows"></tbody></table></div></div>';
    drawProjectRows();
  }

  function drawProjectRows(){
    const search=(qs('#projectSearch')?.value||'').toLowerCase();
    const cat=qs('#projectCategory')?.value||'';
    const rows=sortProjectsByPeriod(d.projects).filter(p=>(!cat||p.category===cat)&&(!search||JSON.stringify(p).toLowerCase().includes(search)));
    const body=qs('#projectRows'); if(!body)return;
    body.innerHTML=rows.map(p=>
      '<tr class="project-row" data-project-toggle="'+p.id+'" aria-expanded="false">'+
        '<td><strong>'+p.name+'</strong><div class="panel-subtitle" style="margin-top:3px">'+p.summary+'</div></td>'+
        '<td>'+p.category+'</td>'+
        '<td>'+p.period+'</td>'+
        '<td>'+p.technologies.slice(0,6).join(' • ')+'</td>'+
      '</tr>'+
      '<tr class="inline-detail-row project-detail-row" data-project-detail="'+p.id+'" hidden>'+
        '<td colspan="4"><div class="inline-detail project-inline-detail">'+
          '<div class="inline-detail-grid">'+
            '<div class="inline-detail-panel project-overview-panel"><div class="inline-detail-title">Project Overview</div><p>'+p.summary+'</p></div>'+
            '<div class="inline-detail-panel project-period-panel"><div class="inline-detail-title">Time Period</div><p>'+p.period+'</p></div>'+
          '</div>'+
          (p.businessContext?'<div class="inline-detail-panel business-context-panel"><div class="inline-detail-title">Business Intelligence & Decision Context</div><p>'+p.businessContext+'</p></div>':'')+
          ((p.stakeholderScope||[]).length?'<div class="inline-detail-panel stakeholder-context-panel"><div class="inline-detail-title">Stakeholder Scope</div>'+tags(p.stakeholderScope)+'</div>':'')+
          '<div class="inline-detail-panel technologies-panel"><div class="inline-detail-title">Technologies</div>'+tags(p.technologies)+'</div>'+
          '<div class="inline-detail-panel highlights-panel"><div class="inline-detail-title">Highlights</div><ul>'+p.highlights.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>'+
        '</div></td>'+
      '</tr>'
    ).join('')||'<tr><td colspan="4">No Matching Projects.</td></tr>';
  }

  function renderSkills(){
    const skillTotal=d.skills.reduce((n,g)=>n+g.items.length,0);
    qs('[data-view="skills"]').innerHTML=
      pageHead('Capability Map','Skills & Technologies','Expanded using the technical skills, tools, development background, certifications, and delivery strengths from the previous resume together with current professional work.')+
      '<div class="grid skills-kpi-row">'+
        '<div class="kpi"><div class="kpi-label">Skill Areas</div><div class="kpi-value">'+d.skills.length+'</div><div class="kpi-note">Grouped by capability</div></div>'+
        '<div class="kpi"><div class="kpi-label">Technologies & Capabilities</div><div class="kpi-value">'+skillTotal+'</div><div class="kpi-note">Analytics, programming, data, and delivery</div></div>'+
        '<div class="kpi"><div class="kpi-label">Certifications / Training</div><div class="kpi-value">'+d.certifications.length+'</div><div class="kpi-note">SQL and Tableau focused</div></div>'+
        '<div class="kpi"><div class="kpi-label">Languages</div><div class="kpi-value">'+d.languages.length+'</div><div class="kpi-note">'+d.languages.join(' • ')+'</div></div>'+
      '</div>'+
      '<div class="grid skill-grid">'+d.skills.map(g=>'<div class="panel skill-group"><div class="panel-head"><div class="panel-title">'+g.group+'</div><span class="tag">'+g.items.length+' skills</span></div><div class="panel-body"><div class="skill-chip-grid">'+g.items.map(x=>'<span class="skill-chip">'+x+'</span>').join('')+'</div></div></div>').join('')+'</div>'+
      '<div class="grid skill-footer-grid">'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Certifications & Completed Training</div><div class="panel-subtitle">Carried Forward From the Previous Resume</div></div></div><div class="panel-body"><div class="credential-list">'+d.certifications.map(x=>'<div class="credential-row"><span class="credential-dot">✓</span><span>'+x+'</span></div>').join('')+'</div></div></div>'+
        '<div class="panel"><div class="panel-head"><div><div class="panel-title">Spoken Languages</div><div class="panel-subtitle">Additional Background</div></div></div><div class="panel-body">'+tags(d.languages)+'</div></div>'+
      '</div>';
  }

  function renderEducation(){
    const areas=[...new Set(edu.courses.map(c=>c.area))].sort();
    const totalCredits=edu.programs.reduce((sum,p)=>sum+p.transcriptCredits,0);
    qs('[data-view="education"]').innerHTML=
      pageHead('Education','Education & Coursework','A catalog-enriched view of completed undergraduate and graduate coursework. Course grades and student identifiers are intentionally excluded.')+
      '<div class="grid education-kpi-grid">'+
        '<div class="kpi"><div class="kpi-label">Degrees</div><div class="kpi-value">'+edu.programs.length+'</div><div class="kpi-note">B.S. + M.S.</div></div>'+
        '<div class="kpi"><div class="kpi-label">Completed Courses</div><div class="kpi-value">'+edu.courses.length+'</div><div class="kpi-note">47 undergraduate • 11 graduate</div></div>'+
        '<div class="kpi"><div class="kpi-label">Academic Credits</div><div class="kpi-value">'+totalCredits+'</div><div class="kpi-note">Across undergraduate + graduate records</div></div>'+
        '<div class="kpi"><div class="kpi-label">Undergraduate Honors</div><div class="kpi-value">7</div><div class="kpi-note">Dean’s List terms</div></div>'+
      '</div>'+
      '<div class="grid education-program-grid">'+edu.programs.map(p=>
        '<article class="panel education-program-card">'+
          '<div class="panel-head"><div><div class="eyebrow">'+p.short+'</div><div class="panel-title education-program-title">'+p.degree+' — '+p.program+'</div></div><span class="tag">'+p.awarded+'</span></div>'+
          '<div class="panel-body">'+
            (p.secondary?'<div class="edu-meta education-secondary">'+p.secondary+'</div>':'')+
            '<p class="education-program-summary">'+p.catalogSummary+'</p>'+
            '<div class="edu-statline"><div><strong>'+p.completedCourses+'</strong><span>Completed Courses</span></div><div><strong>'+p.transcriptCredits+'</strong><span>Transcript Credits</span></div>'+(p.honors?'<div><strong>7</strong><span>Dean’s List Terms</span></div>':'')+'</div>'+
            tags(p.focus)+
            '<div class="catalog-note">'+p.currentCatalogNote+'</div>'+
            '<div class="catalog-links"><a href="'+p.programUrl+'" target="_blank" rel="noopener">Program catalog ↗</a>'+(p.currentProgramUrl?'<a href="'+p.currentProgramUrl+'" target="_blank" rel="noopener">Current program overview ↗</a>':'')+'</div>'+
          '</div>'+
        '</article>'
      ).join('')+'</div>'+
      '<div class="panel education-explorer">'+
        '<div class="panel-head"><div><div class="panel-title">Course Catalog Explorer</div><div class="panel-subtitle">Every Completed Course Enriched With Official Catalog or School of Data Science Context</div></div><span class="tag" id="educationResultCount">'+edu.courses.length+' courses</span></div>'+
        '<div class="panel-body">'+
          '<div class="filterbar education-filterbar">'+
            '<input id="educationSearch" placeholder="Search course, code, topic, or skill">'+
            '<select id="educationInstitution"><option value="">All Institutions</option><option value="NJIT">NJIT</option><option value="UNC Charlotte">UNC Charlotte</option></select>'+
            '<select id="educationArea"><option value="">All Subject Areas</option>'+areas.map(a=>'<option>'+a+'</option>').join('')+'</select>'+
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
    body.innerHTML=rows.map(c=>{
      const key=c.institution+'|'+c.code;
      return '<tr class="course-row" data-course-toggle="'+key+'" aria-expanded="false">'+
        '<td><strong>'+c.code+'</strong><div class="course-title">'+c.title+'</div>'+(c.origin?'<div class="course-origin">'+c.origin+'</div>':'')+'</td>'+
        '<td>'+c.institution+'</td>'+
        '<td>'+c.area+'</td>'+
        '<td>'+c.credits+'</td>'+
        '<td><div class="course-summary-cell">'+c.summary+'</div><div class="course-topic-list">'+(c.topics||[]).slice(0,4).map(t=>'<span>'+t+'</span>').join('')+'</div></td>'+
      '</tr>'+
      '<tr class="inline-detail-row course-detail-row" data-course-detail="'+key+'" hidden>'+
        '<td colspan="5"><div class="inline-detail">'+
          '<div class="inline-detail-grid">'+
            '<div><div class="inline-detail-title">Course Overview</div><p>'+c.summary+'</p></div>'+
            '<div><div class="inline-detail-title">Academic Context</div><p><strong>'+c.credits+' Credit'+(c.credits===1?'':'s')+'</strong>'+(c.origin?' • '+c.origin:'')+'</p></div>'+
          '</div>'+
          '<div class="inline-detail-title">Catalog Topics</div>'+tags(c.topics||[])+
          (c.status?'<div class="notice inline-notice">'+c.status+'</div>':'')+
          '<div class="inline-detail-actions"><a class="secondary-btn" href="'+c.source+'" target="_blank" rel="noopener">Open University Source ↗</a></div>'+
        '</div></td>'+
      '</tr>';
    }).join('')||'<tr><td colspan="5"><div class="empty-state">No Courses Match the Current Filters.</div></td></tr>';
  }

  function toggleInlineDetail(toggleSelector,detailSelector,key){
    const toggle=qs('['+toggleSelector+'="'+CSS.escape(key)+'"]');
    const detail=qs('['+detailSelector+'="'+CSS.escape(key)+'"]');
    if(!detail)return;
    const willOpen=detail.hidden;
    detail.hidden=!willOpen;
    if(toggle){
      toggle.setAttribute('aria-expanded',String(willOpen));
      toggle.classList.toggle('expanded',willOpen);
    }
  }

  function toggleExperienceDetail(index){
    const detail=qs('[data-experience-detail="'+index+'"]');
    const card=qs('[data-experience-card="'+index+'"]');
    if(!detail||!card)return;
    const willOpen=detail.hidden;
    detail.hidden=!willOpen;
    card.setAttribute('aria-expanded',String(willOpen));
    card.classList.toggle('expanded',willOpen);
  }

  function toggleProjectDetail(id){
    toggleInlineDetail('data-project-toggle','data-project-detail',id);
  }

  function toggleCourseDetail(key){
    toggleInlineDetail('data-course-toggle','data-course-detail',key);
  }

  function jumpToProject(id){
    scrollToSection('projects');
    setTimeout(()=>{
      const detail=qs('[data-project-detail="'+CSS.escape(id)+'"]');
      const toggle=qs('[data-project-toggle="'+CSS.escape(id)+'"]');
      if(detail && detail.hidden){
        detail.hidden=false;
        toggle?.setAttribute('aria-expanded','true');
        toggle?.classList.add('expanded');
      }
      toggle?.scrollIntoView({behavior:'smooth',block:'center'});
    },350);
  }

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
    if(e.target.closest('#personalNavTrigger')){openPersonalGate();return}
    if(e.target.closest('#personalNavCancel')){resetPersonalNav();return}
    if(e.target.closest('#personalNavUnlock')){unlockPersonalNav();return}
    const personalAnalyticsLink=e.target.closest('#personalAnalyticsLink');
    if(personalAnalyticsLink){sessionStorage.setItem('personalAnalyticsEntryGrant','1');return}
    const collegeProjectsLink=e.target.closest('#collegeProjectsLink');
    if(collegeProjectsLink){sessionStorage.setItem('collegeProjectsEntryGrant','1');return}
    const nav=e.target.closest('[data-route]');
    if(nav){scrollToSection(nav.dataset.route);return}
    const scroll=e.target.closest('[data-scroll]');
    if(scroll){scrollToSection(scroll.dataset.scroll);return}
    const experienceCard=e.target.closest('[data-experience-card]');
    if(experienceCard && !e.target.closest('a,button,.project-jump')){
      toggleExperienceDetail(experienceCard.dataset.experienceCard);
      return;
    }
    const course=e.target.closest('[data-course-toggle]');
    if(course){toggleCourseDetail(course.dataset.courseToggle);return}
    const projectRow=e.target.closest('[data-project-toggle]');
    if(projectRow){toggleProjectDetail(projectRow.dataset.projectToggle);return}
    const projectJump=e.target.closest('.project-jump');
    if(projectJump){jumpToProject(projectJump.dataset.project);return}
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

  document.addEventListener('keydown',e=>{
    if(e.target.id==='personalNavPassword' && e.key==='Enter'){
      e.preventDefault();
      unlockPersonalNav();
      return;
    }
    const experienceCard=e.target.closest?.('[data-experience-card]');
    if(experienceCard && (e.key==='Enter'||e.key===' ')){
      e.preventDefault();
      toggleExperienceDetail(experienceCard.dataset.experienceCard);
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
  window.addEventListener('pagehide',resetPersonalNav);
  window.addEventListener('pageshow',e=>{if(e.persisted)resetPersonalNav()});

  const savedTheme=localStorage.getItem('portfolioTheme');
  document.documentElement.dataset.theme=savedTheme||'dark';
  applyZoom();
  resetPersonalNav();

  const initial=location.hash.replace('#','');
  if(routes.includes(initial)) setTimeout(()=>scrollToSection(initial,false),0);
  else setActive('overview',false);
})();