
(() => {
  const d=window.PORTFOLIO_DATA;
  const root=document.documentElement;
  const doc=document.getElementById('resumeDocument');
  const layout=document.getElementById('resumeLayout');
  const stage=document.getElementById('stage');
  const readout=document.getElementById('zoomReadout');
  const styleSelect=document.getElementById('resumeStyle');
  const panel=document.getElementById('summaryPanel');
  const summaryInput=document.getElementById('summaryInput');
  const photoPanel=document.getElementById('photoPanel');
  const photoMenu=document.getElementById('photoMenu');
  const photoPickerButton=document.getElementById('photoPickerButton');
  const photoUpload=document.getElementById('photoUpload');
  const exportMenu=document.getElementById('exportMenu');
  const defaultSummary=d.resume.summary;
  const allowedTemplates=['azurill','bronzor','chikorita','ditgar','ditto','gengar','glalie','kakuna','lapras','leafish','meowth','onyx','pikachu','rhyhorn','scizor'];
  let template=localStorage.getItem('resumeStyleV4')||'onyx';
  let zoom=Number(localStorage.getItem('resumeDisplayZoomV3')||1);
  let customSummary=localStorage.getItem('resumeCustomSummary')||defaultSummary;
  let photos=[];
  let selectedPhotoId=localStorage.getItem('resumeSelectedPhotoId')||'';
  let selectedPhotoUrl='';

  const escapeHTML=(value)=>String(value??'').replace(/[&<>"']/g,(ch)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));

  const contactHTML=()=>escapeHTML(d.profile.location);

  const photoHTML=(shape='round')=>selectedPhotoUrl
    ? '<img class="resume-photo '+shape+'" src="'+selectedPhotoUrl+'" alt="Profile photo">'
    : '';

  const headerHTML=(mode='normal')=>{
    if(mode==='scizor'){
      return '<header class="resume-header"><div class="resume-header-main"><div class="resume-header-name">'+escapeHTML(d.profile.name.toUpperCase())+'</div><div class="resume-name-rule"></div><div class="resume-headline">'+escapeHTML(d.resume.headline)+'</div><div class="resume-contact">'+contactHTML()+'</div></div>'+photoHTML('square')+'</header>';
    }
    return '<header class="resume-header">'+photoHTML(template==='lapras'||template==='meowth'?'soft':'round')+'<div class="resume-header-main"><div class="resume-header-name">'+escapeHTML(d.profile.name.toUpperCase())+'</div><div class="resume-headline">'+escapeHTML(d.resume.headline)+'</div><div class="resume-contact">'+contactHTML()+'</div></div></header>';
  };

  const section=(title,body,cls='')=>'<section class="resume-section '+cls+'"><h2 class="resume-section-title">'+title+'</h2><div class="resume-section-body">'+body+'</div></section>';

  const summaryHTML=(showHeading=true)=>showHeading
    ? section('Summary','<div class="resume-summary">'+escapeHTML(customSummary)+'</div>','resume-summary-section')
    : '<div class="resume-featured-summary"><div class="resume-summary">'+escapeHTML(customSummary)+'</div></div>';

  const resumeImpactBullets={
    "Armstrong Transport Group, Inc.":[
      "Own 30+ BI, financial analytics, commission, and automation projects from requirements through production, working with managers, directors, VPs, SVPs, and C-suite leaders.",
      "Built Sigma and Snowflake dashboards for agent, carrier, office, capacity, customer, LTL, and finance teams with KPIs, drilldowns, trends, and exception views.",
      "Built commission and payout workflows for multiple plans, including snapshots, overrides, row-level security, statements, reconciliation, and payroll controls."
    ],
    "Cooper University Hospital":[
      "Built an auto-updating performance dashboard with company, team, and individual views; the prior resume documented a 2–3% improvement across teams after rollout.",
      "Built a partner-hospital capacity model using appointment availability to support staffing and partnership decisions."
    ],
    "2U, Inc.":[
      "Helped data bootcamp students with Python, SQL, Tableau, machine learning, and project troubleshooting through office hours and one-on-one support.",
      "Mentored capstone teams and provided substitute instruction across JavaScript, React, MERN, databases, HTML/CSS, Git, and related development topics."
    ],
    "UNC Charlotte":[
      "Supported about 110 students in Intro to Data Science & Sociology through grading, office hours, and one-on-one technical feedback."
    ]
  };

  const experienceHTML=()=>section('Professional Experience',d.experience.map(x=>{
    const bullets=resumeImpactBullets[x.org]||x.bullets.slice(0,2);
    return '<div class="resume-item">'+
      '<div class="resume-item-head"><span>'+escapeHTML(x.role)+' — '+escapeHTML(x.org)+'</span><span>'+escapeHTML(x.period)+'</span></div>'+
      '<div class="resume-item-sub"><span>'+escapeHTML(x.tags.slice(0,4).join(' • '))+'</span><span>'+escapeHTML(x.location)+'</span></div>'+
      '<ul>'+bullets.map(b=>'<li>'+escapeHTML(b)+'</li>').join('')+'</ul>'+
    '</div>';
  }).join(''),'resume-experience-section');

  const resumeProjectIds=["commission-platform","agent-operations-dashboard","cash-forecasting"];
  const resumeProjectImpact={
    "commission-platform":"Built a multi-plan payout platform with snapshots, security, overrides, reconciliation, and payroll support.",
    "agent-operations-dashboard":"Moved agent-performance reporting into Sigma/Snowflake with roster logic, KPI drilldowns, and growth views.",
    "cash-forecasting":"Used DSO and payment patterns to forecast unpaid invoice timing for finance planning."
  };

  const projectsHTML=()=>{
    const projects=resumeProjectIds.map(id=>d.projects.find(p=>p.id===id)).filter(Boolean);
    return section('Projects',projects.map(p=>
      '<div class="resume-project">'+
        '<div class="resume-project-title">'+escapeHTML(p.name)+'</div>'+
        '<div class="resume-project-tech">'+escapeHTML(p.technologies.slice(0,5).join(' • '))+'</div>'+
        '<div class="resume-project-text">'+escapeHTML(resumeProjectImpact[p.id]||p.summary)+'</div>'+
      '</div>'
    ).join(''),'resume-projects-section');
  };

  const educationHTML=()=>section('Education',d.education.map(x=>
    '<div class="resume-education-item">'+
      '<div class="resume-education-head"><span>'+escapeHTML(x.degree)+' — '+escapeHTML(x.program)+', '+escapeHTML(x.school)+'</span><span>'+escapeHTML(x.period.split(' – ').pop())+'</span></div>'+
      '<div class="resume-education-sub">'+
        (x.secondary?escapeHTML(x.secondary)+' • ':'')+
        (x.honors?escapeHTML(x.honors)+' • ':'')+
        escapeHTML('Coursework: '+x.highlights.slice(0,2).join(', '))+
      '</div>'+
    '</div>'
  ).join(''),'resume-education-section');

  const baseResumeSkillLines=[
    {label:"Analytics & BI",value:"SQL, Snowflake, Sigma, Tableau, Power BI, Forecasting, KPI Design, Dashboard Design, Reconciliation"},
    {label:"Programming & Data",value:"Python, REST APIs, JavaScript, PostgreSQL, MySQL, MongoDB, Data Modeling, ETL/ELT, Stored Procedures"},
    {label:"Delivery",value:"Business Process Analysis, Requirements Gathering, Decision Support, QA, Process Mapping, Technical Documentation, Stakeholder Collaboration"}
  ];
  const requirementsInput=document.getElementById('skillsInput');
  const accentInput=document.getElementById('accentColor');
  let requirements=localStorage.getItem('resumeJobRequirementsV1')||'';
  let accent=localStorage.getItem('resumeAccentV1')||'#0084d1';
  if(!/^#[0-9a-f]{6}$/i.test(accent))accent='#0084d1';
  root.style.setProperty('--resume-accent',accent);
  accentInput.value=accent;
  requirementsInput.value=requirements;
  const normSkill=x=>String(x).toLowerCase().replace(/[^a-z0-9+#/]+/g,' ').trim();
  const aliases={
   'etl/elt':['etl','elt','data pipelines','data integration'],
   'rest apis':['rest api','api integration','restful api'],
   'power bi':['powerbi'],
   'kpi design':['kpi','key performance indicators'],
   'qa':['quality assurance'],
   'sql':['sql queries','sql development'],
   'business process analysis':['process analysis'],
   'dashboard design':['dashboard development','dashboarding']
  };
  function isSkillMatch(skill,posting){
    const text=' '+normSkill(posting)+' ';
    const terms=[skill,...(aliases[normSkill(skill)]||[])];
    return terms.some(term=>{
      const phrase=normSkill(term);
      if(!phrase)return false;
      const index=text.indexOf(' '+phrase+' ');
      return index>=0;
    });
  }
  function getSkillGroups(){
    if(!requirements.trim())return baseResumeSkillLines;
    return baseResumeSkillLines.map(group=>{
      const skills=group.value.split(', ').filter(skill=>isSkillMatch(skill,requirements));
      return {label:group.label,value:skills.join(', ')};
    }).filter(group=>group.value);
  }
  function displaySkillsMatch(){
    const groups=getSkillGroups();
    const matches=groups.flatMap(g=>g.value.split(', ')).filter(Boolean);
    document.getElementById('skillsMatches').textContent=requirements.trim()?
      (matches.length?matches.length+' matching existing skills: '+matches.join(', '):'No matching skills found in the current resume list. The default skills remain visible.'):
      'No requirements entered. All default resume skills are displayed.';
  }
  let resumeSkillLines=baseResumeSkillLines;
  function applyRequirements(){
    const matches=getSkillGroups();
    resumeSkillLines=matches.length?matches:baseResumeSkillLines;
    displaySkillsMatch();
    renderTemplate();
  }

  const skillsHTML=()=>section('Technical Skills',resumeSkillLines.map(x=>
    '<div class="resume-skill-line"><strong>'+escapeHTML(x.label)+':</strong> '+escapeHTML(x.value)+'</div>'
  ).join(''),'resume-skills-section');

  const additionalHTML=()=>section('Certifications & Additional Skills',
    '<div class="resume-small"><strong>Training:</strong> SQL • Relational Databases • Tableau</div>'+
    '<div class="resume-small" style="margin-top:.025in"><strong>Languages:</strong> '+escapeHTML(d.languages.join(' • '))+'</div>',
    'resume-additional-section'
  );

  function renderTemplate(){
    doc.className='resume-document template-'+template;
    const summary=summaryHTML();
    const mainBody=summary+experienceHTML()+projectsHTML();
    const sideBody=skillsHTML()+educationHTML()+additionalHTML();
    const fullHeader=headerHTML();

    if(template==='azurill'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><aside class="resume-sidebar">'+sideBody+'</aside><main class="resume-main">'+mainBody+'</main></div>';
    }
    if(template==='bronzor'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><main class="resume-main">'+mainBody+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='chikorita'){
      layout.innerHTML='<div class="resume-columns"><main class="resume-main">'+fullHeader+mainBody+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='ditgar'){
      layout.innerHTML='<div class="resume-columns"><aside class="resume-sidebar"><div class="resume-side-header">'+fullHeader+'</div><div class="resume-side-content">'+sideBody+'</div></aside><main class="resume-main">'+summaryHTML(false)+experienceHTML()+projectsHTML()+'</main></div>';
    }
    if(template==='ditto'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><aside class="resume-sidebar">'+sideBody+'</aside><main class="resume-main">'+mainBody+'</main></div>';
    }
    if(template==='gengar'){
      layout.innerHTML='<div class="resume-columns"><aside class="resume-sidebar"><div class="resume-side-header">'+fullHeader+'</div><div class="resume-side-content">'+sideBody+'</div></aside><main class="resume-main">'+summaryHTML(false)+experienceHTML()+projectsHTML()+'</main></div>';
    }
    if(template==='glalie'){
      layout.innerHTML='<div class="resume-columns"><aside class="resume-sidebar">'+fullHeader+sideBody+'</aside><main class="resume-main">'+mainBody+'</main></div>';
    }
    if(template==='kakuna'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><main class="resume-main">'+mainBody+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='lapras'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><main class="resume-main">'+mainBody+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='leafish'){
      layout.innerHTML='<div class="resume-header-intro"><div class="resume-header">'+photoHTML('round')+'<div class="resume-header-main"><div class="resume-header-name">'+escapeHTML(d.profile.name.toUpperCase())+'</div><div class="resume-headline">'+escapeHTML(d.resume.headline)+'</div></div><div class="resume-header-summary resume-summary">'+escapeHTML(customSummary)+'</div></div></div><div class="resume-contact-band">'+contactHTML()+'</div><div class="resume-columns"><main class="resume-main">'+experienceHTML()+projectsHTML()+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='meowth'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><aside class="resume-sidebar">'+sideBody+'</aside><main class="resume-main">'+mainBody+'</main></div>';
    }
    if(template==='onyx'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><main class="resume-main">'+mainBody+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='pikachu'){
      layout.innerHTML='<div class="resume-columns"><aside class="resume-sidebar">'+sideBody+'</aside><main class="resume-main"><div class="resume-main-header">'+fullHeader+'</div>'+mainBody+'</main></div>';
    }
    if(template==='rhyhorn'){
      layout.innerHTML=fullHeader+'<div class="resume-columns"><main class="resume-main">'+mainBody+'</main><aside class="resume-sidebar">'+sideBody+'</aside></div>';
    }
    if(template==='scizor'){
      layout.innerHTML=headerHTML('scizor')+'<div class="resume-columns"><aside class="resume-sidebar">'+sideBody+'</aside><main class="resume-main">'+mainBody+'</main></div>';
    }

    styleSelect.value=template;
    localStorage.setItem('resumeStyleV4',template);
    requestAnimationFrame(autoFitContent);
  }

  const photoDb=()=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('portfolioResumePhotos',1);
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('photos'))db.createObjectStore('photos',{keyPath:'id'});};
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });

  async function getPhotos(){
    const db=await photoDb();
    return new Promise((resolve,reject)=>{
      const req=db.transaction('photos','readonly').objectStore('photos').getAll();
      req.onsuccess=()=>resolve(req.result.sort((a,b)=>b.createdAt-a.createdAt));
      req.onerror=()=>reject(req.error);
    });
  }

  async function savePhoto(photo){
    const db=await photoDb();
    return new Promise((resolve,reject)=>{
      const req=db.transaction('photos','readwrite').objectStore('photos').put(photo);
      req.onsuccess=()=>resolve();
      req.onerror=()=>reject(req.error);
    });
  }

  async function removePhoto(id){
    const db=await photoDb();
    return new Promise((resolve,reject)=>{
      const req=db.transaction('photos','readwrite').objectStore('photos').delete(id);
      req.onsuccess=()=>resolve();
      req.onerror=()=>reject(req.error);
    });
  }

  function fileToDataUrl(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=()=>reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function refreshPhotoLibrary(){
    photos=await getPhotos();
    const selected=photos.find(x=>x.id===selectedPhotoId);
    if(!selected && selectedPhotoId){
      selectedPhotoId='';
      localStorage.removeItem('resumeSelectedPhotoId');
    }
    const active=photos.find(x=>x.id===selectedPhotoId);
    selectedPhotoUrl=active?.dataUrl||'';
    document.getElementById('selectedPhotoName').textContent=active?.name||'No photo';
    const thumb=document.getElementById('selectedPhotoThumb');
    thumb.className='photo-thumb'+(active?'':' empty');
    thumb.innerHTML=active?'':'＋';
    thumb.style.backgroundImage=active?'url("'+active.dataUrl+'")':'';
    thumb.style.backgroundSize='cover';
    thumb.style.backgroundPosition='center';
    photoMenu.innerHTML=
      '<div class="photo-choice"><button class="photo-choice-main" data-photo-select="" type="button"><span class="photo-thumb empty">∅</span><span>No photo</span></button><span></span></div>'+
      photos.map(p=>'<div class="photo-choice"><button class="photo-choice-main" data-photo-select="'+p.id+'" type="button"><img class="photo-thumb" src="'+p.dataUrl+'" alt=""><span>'+escapeHTML(p.name)+'</span></button><button class="photo-delete" data-photo-delete="'+p.id+'" type="button" aria-label="Delete '+escapeHTML(p.name)+'">🗑</button></div>').join('');
    renderTemplate();
  }

  async function addPhotoFile(file){
    if(!file)return;
    if(!/^image\/(png|jpeg|webp)$/.test(file.type)){alert('Please choose a PNG, JPG, or WebP image.');return;}
    if(file.size>8*1024*1024){alert('Please choose an image smaller than 8 MB.');return;}
    const dataUrl=await fileToDataUrl(file);
    const photo={id:'photo-'+Date.now()+'-'+Math.random().toString(36).slice(2,8),name:file.name,dataUrl,createdAt:Date.now()};
    await savePhoto(photo);
    selectedPhotoId=photo.id;
    localStorage.setItem('resumeSelectedPhotoId',selectedPhotoId);
    await refreshPhotoLibrary();
  }

  function downloadBlob(name,type,content){
    const blob=content instanceof Blob?content:new Blob([content],{type});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
  }

  function exportStyles(){
    autoFitContent();
    return [...document.querySelectorAll('style')].map(s=>s.textContent).join('\n');
  }

  function exportWord(){
    const html='<!doctype html><html><head><meta charset="utf-8"><style>'+exportStyles()+
      'html,body{margin:0;background:#fff}.resume-document{transform:none!important;box-shadow:none!important;margin:0 auto!important}</style></head><body>'+
      '<article class="'+doc.className+'" style="--resume-accent:'+getComputedStyle(root).getPropertyValue('--resume-accent')+'"><div class="resume-layout">'+layout.innerHTML+'</div></article></body></html>';
    downloadBlob('Hemanth_Velan_Resume_'+template+'.doc','application/msword;charset=utf-8',html);
  }

  function exportHtml(){
    const html='<!doctype html><html><head><meta charset="utf-8"><style>'+exportStyles()+
      'html,body{margin:0;background:#fff}.resume-document{transform:none!important;box-shadow:none!important;margin:0 auto!important}</style></head><body>'+
      '<article class="'+doc.className+'"><div class="resume-layout">'+layout.innerHTML+'</div></article></body></html>';
    downloadBlob('Hemanth_Velan_Resume_'+template+'.html','text/html;charset=utf-8',html);
  }

  function odfEscape(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
  }

  function odfParagraph(text,style='Body'){
    return '<text:p text:style-name="'+style+'">'+odfEscape(text)+'</text:p>';
  }

  function odfSection(title,paragraphs){
    return odfParagraph(title,'Section')+paragraphs.join('');
  }

  function exportOdf(){
    const config={
      azurill:{side:'left',header:'full'},bronzor:{side:'right',header:'full'},chikorita:{side:'right',header:'main'},
      ditgar:{side:'left',header:'side'},ditto:{side:'left',header:'full'},gengar:{side:'left',header:'side'},
      glalie:{side:'left',header:'side'},kakuna:{side:'right',header:'full'},lapras:{side:'right',header:'full'},
      leafish:{side:'right',header:'full'},meowth:{side:'left',header:'full'},onyx:{side:'right',header:'full'},
      pikachu:{side:'left',header:'main'},rhyhorn:{side:'right',header:'full'},scizor:{side:'left',header:'full'}
    }[template];

    const headerParts=[
      odfParagraph(d.profile.name.toUpperCase(),'Name'),
      odfParagraph(d.resume.headline,'Headline'),
      odfParagraph(d.profile.location,'Contact')
    ];
    if(selectedPhotoUrl){
      const base64=selectedPhotoUrl.split(',')[1]||'';
      headerParts.unshift('<text:p text:style-name="Photo"><draw:frame draw:name="ProfilePhoto" text:anchor-type="paragraph" svg:width="0.82in" svg:height="0.82in"><draw:image><office:binary-data>'+base64+'</office:binary-data></draw:image></draw:frame></text:p>');
    }
    const header=headerParts.join('');

    const exp=resumeImpactBullets;
    const experienceParas=d.experience.flatMap(x=>[
      odfParagraph(x.role+' — '+x.org+' | '+x.period,'ItemHead'),
      odfParagraph(x.location+' • '+x.tags.slice(0,4).join(' • '),'Meta'),
      ...(exp[x.org]||x.bullets.slice(0,2)).map(b=>odfParagraph('• '+b,'Body'))
    ]);
    const projects=resumeProjectIds.map(id=>d.projects.find(p=>p.id===id)).filter(Boolean);
    const projectParas=projects.flatMap(p=>[
      odfParagraph(p.name,'ItemHead'),
      odfParagraph(p.technologies.slice(0,5).join(' • '),'Meta'),
      odfParagraph(resumeProjectImpact[p.id]||p.summary,'Body')
    ]);
    const main=odfSection('Summary',[odfParagraph(customSummary,'Body')])+
      odfSection('Professional Experience',experienceParas)+
      odfSection('Projects',projectParas);

    const skillParas=resumeSkillLines.map(x=>odfParagraph(x.label+': '+x.value,'Body'));
    const educationParas=d.education.flatMap(x=>[
      odfParagraph(x.degree+' — '+x.program+', '+x.school+' | '+x.period.split(' – ').pop(),'ItemHead'),
      odfParagraph((x.secondary?x.secondary+' • ':'')+(x.honors?x.honors+' • ':'')+'Coursework: '+x.highlights.slice(0,2).join(', '),'Meta')
    ]);
    const side=odfSection('Technical Skills',skillParas)+
      odfSection('Education',educationParas)+
      odfSection('Certifications & Additional Skills',[
        odfParagraph('Training: SQL • Relational Databases • Tableau','Body'),
        odfParagraph('Languages: '+d.languages.join(' • '),'Body')
      ]);

    const headerInFull=config.header==='full'?header:'';
    const mainWithHeader=(config.header==='main'?header:'')+main;
    const sideWithHeader=(config.header==='side'?header:'')+side;
    const left=config.side==='left'?sideWithHeader:mainWithHeader;
    const right=config.side==='left'?mainWithHeader:sideWithHeader;
    const leftWidth=config.side==='left'?'30%':'70%';
    const rightWidth=config.side==='left'?'70%':'30%';

    const xml='<?xml version="1.0" encoding="UTF-8"?>'+
      '<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" office:mimetype="application/vnd.oasis.opendocument.text" office:version="1.3">'+
      '<office:styles>'+
        '<style:style style:name="Body" style:family="paragraph"><style:paragraph-properties fo:text-align="justify" fo:line-height="142%" fo:margin-bottom="0.05in"/><style:text-properties style:font-name="IBM Plex Serif" fo:font-family="IBM Plex Serif" fo:font-size="10pt"/></style:style>'+
        '<style:style style:name="Section" style:family="paragraph"><style:paragraph-properties fo:margin-top="0.10in" fo:margin-bottom="0.05in"/><style:text-properties style:font-name="Fira Sans Condensed" fo:font-family="Fira Sans Condensed" fo:font-size="12pt" fo:font-weight="bold" fo:color="#0084D1"/></style:style>'+
        '<style:style style:name="Name" style:family="paragraph"><style:paragraph-properties fo:margin-bottom="0.03in"/><style:text-properties style:font-name="Fira Sans Condensed" fo:font-family="Fira Sans Condensed" fo:font-size="24pt" fo:font-weight="bold"/></style:style>'+
        '<style:style style:name="Headline" style:family="paragraph"><style:text-properties fo:font-size="10pt" fo:font-weight="bold"/></style:style>'+
        '<style:style style:name="Contact" style:family="paragraph"><style:text-properties fo:font-size="8.8pt" fo:color="#4D535C"/></style:style>'+
        '<style:style style:name="ItemHead" style:family="paragraph"><style:paragraph-properties fo:margin-top="0.06in" fo:margin-bottom="0.02in"/><style:text-properties fo:font-size="10pt" fo:font-weight="bold"/></style:style>'+
        '<style:style style:name="Meta" style:family="paragraph"><style:paragraph-properties fo:margin-bottom="0.025in"/><style:text-properties fo:font-size="8.7pt" fo:color="#4D535C"/></style:style>'+
        '<style:style style:name="Photo" style:family="paragraph"><style:paragraph-properties fo:margin-bottom="0.05in"/></style:style>'+
        '<style:style style:name="ResumeTable" style:family="table"><style:table-properties style:width="100%" table:align="margins"/></style:style>'+
        '<style:style style:name="LeftCol" style:family="table-column"><style:table-column-properties style:column-width="'+leftWidth+'"/></style:style>'+
        '<style:style style:name="RightCol" style:family="table-column"><style:table-column-properties style:column-width="'+rightWidth+'"/></style:style>'+
        '<style:style style:name="Cell" style:family="table-cell"><style:table-cell-properties fo:padding="0.10in"/></style:style>'+
      '</office:styles>'+
      '<office:body><office:text>'+headerInFull+
        '<table:table table:style-name="ResumeTable"><table:table-column table:style-name="LeftCol"/><table:table-column table:style-name="RightCol"/><table:table-row>'+
          '<table:table-cell table:style-name="Cell">'+left+'</table:table-cell>'+
          '<table:table-cell table:style-name="Cell">'+right+'</table:table-cell>'+
        '</table:table-row></table:table>'+
      '</office:text></office:body></office:document>';
    downloadBlob('Hemanth_Velan_Resume_'+template+'.fodt','application/vnd.oasis.opendocument.text;charset=utf-8',xml);
  }

  function fitSpacing(){
    autoFitContent();
  }

  function autoFitContent(){
    // Start at full template size. Only reduce the inner document when content would
    // otherwise cross the bottom edge of the Letter page.
    let scale=1;
    const targetHeight=doc.clientHeight;

    for(let i=0;i<14;i++){
      root.style.setProperty('--resume-content-scale',scale.toFixed(4));
      // Force layout so scrollHeight reflects the wider inverse-scaled content width.
      void layout.offsetHeight;
      const visualHeight=layout.scrollHeight*scale;
      if(visualHeight<=targetHeight+1)break;
      const next=Math.min(scale-.01,scale*(targetHeight/visualHeight)*.992);
      scale=Math.max(.86,next);
      if(scale<=.86)break;
    }

    root.style.setProperty('--resume-content-scale',scale.toFixed(4));
    void layout.offsetHeight;

    // If a template still overflows at the readability floor, loosen only the
    // high-density spacing rather than hiding content.
    const stillOver=layout.scrollHeight*scale>targetHeight+2;
    doc.classList.toggle('resume-compact-fit',stillOver);
    if(stillOver){
      scale=.84;
      root.style.setProperty('--resume-content-scale',scale.toFixed(4));
      void layout.offsetHeight;
    }

    return scale;
  }

  function applyZoom(){
    const actualScale=zoom*1.25;
    root.style.setProperty('--resume-preview-scale',actualScale);
    readout.textContent=Math.round(zoom*100)+'%';
    doc.style.marginBottom=((actualScale-1)*11)+'in';
    localStorage.setItem('resumeDisplayZoomV3',zoom);
  }

  function fitWidth(){
    const naturalW=816;
    const availableW=Math.max(340,stage.clientWidth-18);
    const actualScale=availableW/naturalW;
    zoom=Math.max(.45,Math.min(1.35,actualScale/1.25));
    applyZoom();
  }

  function fitPage(){
    const naturalW=816,naturalH=1056;
    const availableW=Math.max(340,stage.clientWidth-18);
    const availableH=Math.max(420,window.innerHeight-86);
    const actualScale=Math.min(availableW/naturalW,availableH/naturalH);
    zoom=Math.max(.45,Math.min(1.35,actualScale/1.25));
    applyZoom();
  }

  function setSummary(value,save=true){
    customSummary=(value||'').trim()||defaultSummary;
    summaryInput.value=customSummary;
    if(save)localStorage.setItem('resumeCustomSummary',customSummary);
    renderTemplate();
  }

  document.getElementById('zoomOut').onclick=()=>{zoom=Math.max(.45,+(zoom-.05).toFixed(2));applyZoom()};
  document.getElementById('zoomIn').onclick=()=>{zoom=Math.min(1.35,+(zoom+.05).toFixed(2));applyZoom()};
  document.getElementById('fitPage').onclick=fitPage;
  document.getElementById('fitWidth').onclick=fitWidth;
  document.getElementById('printResume').onclick=()=>{autoFitContent();setTimeout(()=>window.print(),50)};
  document.getElementById('exportPdf').onclick=()=>{exportMenu.hidden=true;autoFitContent();setTimeout(()=>window.print(),50)};
  document.getElementById('exportWord').onclick=()=>{exportMenu.hidden=true;exportWord()};
  document.getElementById('exportOdf').onclick=()=>{exportMenu.hidden=true;exportOdf()};
  document.getElementById('exportHtml').onclick=()=>{exportMenu.hidden=true;exportHtml()};
  document.getElementById('exportToggle').onclick=()=>{
    exportMenu.hidden=!exportMenu.hidden;
    document.getElementById('exportToggle').setAttribute('aria-expanded',String(!exportMenu.hidden));
  };
  document.getElementById('themeToggle').onclick=()=>{
    const next=root.dataset.theme==='dark'?'light':'dark';
    root.dataset.theme=next;localStorage.setItem('portfolioTheme',next);
  };
  accentInput.addEventListener('input',()=>{
    accent=accentInput.value;
    root.style.setProperty('--resume-accent',accent);
    localStorage.setItem('resumeAccentV1',accent);
    renderTemplate();
  });
  const skillsPanel=document.getElementById('skillsPanel');
  document.getElementById('skillsToggle').onclick=()=>{skillsPanel.classList.toggle('open');panel.classList.remove('open');photoPanel.classList.remove('open')};
  document.getElementById('skillsClose').onclick=()=>skillsPanel.classList.remove('open');
  document.getElementById('skillsDone').onclick=()=>skillsPanel.classList.remove('open');
  document.getElementById('skillsReset').onclick=()=>{requirements='';requirementsInput.value='';localStorage.removeItem('resumeJobRequirementsV1');applyRequirements()};
  requirementsInput.addEventListener('input',()=>{
    requirements=requirementsInput.value;
    localStorage.setItem('resumeJobRequirementsV1',requirements);
    applyRequirements();
  });
  document.getElementById('summaryToggle').onclick=()=>{panel.classList.toggle('open');photoPanel.classList.remove('open')};
  document.getElementById('summaryClose').onclick=()=>panel.classList.remove('open');
  document.getElementById('summaryDone').onclick=()=>{setSummary(summaryInput.value);panel.classList.remove('open')};
  document.getElementById('summaryReset').onclick=()=>{localStorage.removeItem('resumeCustomSummary');setSummary(defaultSummary,false)};
  summaryInput.addEventListener('input',()=>{customSummary=summaryInput.value.trim()||defaultSummary;localStorage.setItem('resumeCustomSummary',summaryInput.value);renderTemplate()});
  document.getElementById('photoToggle').onclick=()=>{photoPanel.classList.toggle('open');panel.classList.remove('open')};
  document.getElementById('photoClose').onclick=()=>photoPanel.classList.remove('open');
  document.getElementById('photoDone').onclick=()=>photoPanel.classList.remove('open');
  document.getElementById('addPhoto').onclick=()=>photoUpload.click();
  photoUpload.onchange=async()=>{await addPhotoFile(photoUpload.files?.[0]);photoUpload.value=''};
  photoPickerButton.onclick=()=>{photoMenu.hidden=!photoMenu.hidden;photoPickerButton.setAttribute('aria-expanded',String(!photoMenu.hidden))};
  photoMenu.onclick=async(e)=>{
    const del=e.target.closest('[data-photo-delete]');
    if(del){
      e.stopPropagation();
      const id=del.dataset.photoDelete;
      await removePhoto(id);
      if(selectedPhotoId===id){selectedPhotoId='';localStorage.removeItem('resumeSelectedPhotoId');}
      await refreshPhotoLibrary();
      photoMenu.hidden=false;
      return;
    }
    const pick=e.target.closest('[data-photo-select]');
    if(pick){
      selectedPhotoId=pick.dataset.photoSelect||'';
      if(selectedPhotoId)localStorage.setItem('resumeSelectedPhotoId',selectedPhotoId);else localStorage.removeItem('resumeSelectedPhotoId');
      photoMenu.hidden=true;
      await refreshPhotoLibrary();
    }
  };
  styleSelect.addEventListener('change',()=>{template=allowedTemplates.includes(styleSelect.value)?styleSelect.value:'onyx';renderTemplate()});
  window.addEventListener('resize',()=>{if(window.innerWidth<980)fitWidth()});
  document.addEventListener('click',e=>{
    if(!e.target.closest('.resume-toolbar-group'))exportMenu.hidden=true;
    if(!e.target.closest('.photo-picker'))photoMenu.hidden=true;
  });

  async function boot(){
    root.dataset.theme=localStorage.getItem('portfolioTheme')||'dark';
    if(!allowedTemplates.includes(template))template='onyx';
    summaryInput.value=customSummary;
    applyRequirements();
    await refreshPhotoLibrary();
    if(document.fonts?.ready)await document.fonts.ready;
    autoFitContent();
    applyZoom();
  }
  boot();
})();
