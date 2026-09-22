window.PORTFOLIO_DATA = {
  profile: {
    name: "Hemanth Velan",
    title: "Business Intelligence Analyst",
    location: "New Jersey",
    summary: "Business intelligence and analytics professional with experience building production reporting, commission systems, data pipelines, operational dashboards, and automation across logistics and healthcare environments.",
    github: "https://github.com/SirB0b27",
    linkedin: "https://www.linkedin.com/in/hemanthvelan27"
  },
  metrics: [
    {label:"Documented work items", value:"651", note:"Confluence work notes"},
    {label:"Weeks documented", value:"145", note:"Dec 2023 – Sep 2026"},
    {label:"Connected Jira issues", value:"323", note:"Collected work history"},
    {label:"Completed courses", value:"58", note:"Undergraduate + graduate"}
  ],
  activityMonthly: [
    ["2023-12",7],["2024-01",6],["2024-02",14],["2024-03",22],["2024-04",17],["2024-05",24],["2024-06",12],["2024-07",16],["2024-08",16],["2024-09",23],["2024-10",23],["2024-11",29],["2024-12",22],
    ["2025-01",17],["2025-02",19],["2025-03",13],["2025-04",18],["2025-05",21],["2025-06",21],["2025-07",17],["2025-08",18],["2025-09",19],["2025-10",25],["2025-11",14],["2025-12",30],
    ["2026-01",26],["2026-02",19],["2026-03",13],["2026-04",18],["2026-05",18],["2026-06",22],["2026-07",27],["2026-08",24],["2026-09",21]
  ],
  experience: [
    {role:"Business Intelligence Analyst",org:"Freight Logistics",period:"2023 – Present",location:"United States",tags:["SQL","Snowflake","Sigma","Python","APIs","Automation"],bullets:[
      "Build and maintain analytics products used by operational, finance, agent, and leadership teams.",
      "Develop commission reporting and payout workflows spanning plan logic, snapshots, overrides, security, and agent-facing statements.",
      "Automate data collection and validation workflows, including API integrations and reproducible comparison/reporting processes.",
      "Own large reporting initiatives from requirements and data modeling through validation, documentation, rollout, and stakeholder review."
    ]},
    {role:"Enterprise Business Analyst Intern",org:"Cooper University Hospital",period:"Jun 2023 – Aug 2023",location:"Camden, NJ",tags:["Dashboards","Business Analysis","Modeling","Reporting"],bullets:[
      "Built an auto-updating performance dashboard with company, team, and individual views.",
      "Developed a model for evaluating partner-hospital appointment availability and operational capacity.",
      "Produced department reporting that helped managers identify anomalous performance data and investigate root causes."
    ]},
    {role:"Data Online Bootcamp Teaching Assistant",org:"2U, Inc.",period:"Mar 2022 – 2024",location:"Remote",tags:["Python","SQL","Tableau","JavaScript","React","Mentoring"],bullets:[
      "Supported data bootcamp cohorts through office hours, class resources, technical troubleshooting, and project mentoring.",
      "Mentored final-project teams building dashboards and machine-learning deliverables.",
      "Provided substitute instruction support across JavaScript, React, MERN, ORM, HTML/CSS/Git, and related topics."
    ]},
    {role:"Undergraduate Class Teaching Assistant",org:"UNC Charlotte",period:"Aug 2022 – Dec 2022",location:"Charlotte, NC",tags:["Data Science","Teaching","Team Coordination"],bullets:[
      "Supported an approximately 110-student Intro to Data Science and Sociology course.",
      "Hosted office hours, graded assignments with feedback, and collaborated with the instructional team on weekly course planning."
    ]}
  ],
  projects: [
    {id:"commission-platform",name:"Commission Reporting & Payout Systems",category:"Analytics Engineering",period:"2024 – 2026",technologies:["SQL","Snowflake","Sigma","Data Modeling","Stored Procedures"],summary:"Reworked complex commission reporting into maintainable internal data products with plan-specific logic, snapshots, overrides, security, statements, and payout-cycle controls.",highlights:["Built and maintained workflows across multiple commission plan variations.","Implemented snapshot and live-data comparison logic for retroactive adjustments, plan changes, bonuses, and payment reconciliation.","Created process maps and maintenance documentation so future developers can trace joins, decisions, security, and statement calculations."]},
    {id:"front-analytics",name:"Front Analytics Automation",category:"API & Automation",period:"2024 – 2026",technologies:["Python","REST APIs","Jupyter","CSV","Snowflake","Sigma"],summary:"Built an API-driven analytics workflow for operational email and conversation metrics, including inbox filtering, response timing, status durations, user handling, and data validation.",highlights:["Designed reusable collection logic for multiple inboxes and historical backfills.","Tracked open, waiting, and resolved durations plus first-reply, resolution, hourly-volume, and user-handling metrics.","Built validation routines to compare API results with source-system reporting and investigate discrepancies."]},
    {id:"cash-forecasting",name:"Cash Forecasting & Payment Behavior",category:"Financial Analytics",period:"2025 – 2026",technologies:["SQL","Forecasting","Customer Segmentation","Data Modeling"],summary:"Developed customer-level payment behavior logic to estimate expected paid dates and forecast unpaid invoiced cash using DSO, payment buckets, and historical settlement patterns.",highlights:["Created aging buckets and customer payment-distribution metrics.","Combined average DSO and weighted payment behavior to estimate future cash timing.","Built comparison outputs for alternative inclusion rules and six-week current-year versus prior-year views."]},
    {id:"cad-controls",name:"CAD Currency & Settlement Controls",category:"Financial Data Controls",period:"2025 – 2026",technologies:["SQL","Snowflake","Regex","Snapshots","Reconciliation"],summary:"Implemented currency detection, conversion, and settlement-change logic for USD/CAD reporting with historical snapshots and order/load-level application rules.",highlights:["Built currency-type change tracking using dated snapshots and recent-settlement reprocessing.","Implemented order-level versus load-level adjustment rules by transaction type.","Added reconciliation calculations comparing expected versus actual CAD payment behavior."]},
    {id:"user-activity",name:"Analytics User Activity & Adoption",category:"Product Analytics",period:"2026",technologies:["Sigma","SQL","Business-Day Calendars","Usage Analytics"],summary:"Built user and agent activity reporting with business-day aware metrics, request status filtering, usage cadence classification, and adoption views.",highlights:["Created active-user, request-count, active-day, and business-day metrics.","Added daily, weekly, monthly, and drop-off cadence classifications.","Designed dashboard filters and visual organization for operational review."]},
    {id:"snapshot-automation",name:"Snapshot & Data Quality Automation",category:"Data Engineering",period:"2024 – 2026",technologies:["Snowflake","SQL","Stored Procedures","Scheduled Tasks","Validation"],summary:"Created and maintained snapshot procedures, scheduled tasks, historical comparison logic, and validation routines used to stabilize production reporting.",highlights:["Implemented repeatable snapshot procedures and task-driven refreshes.","Compared live and snapshot datasets using stable identifiers to isolate missing or changed records.","Added defensive logic to reduce breakage when schemas or upstream columns change."]},
    {id:"process-docs",name:"Commission Process Maps & Documentation",category:"Documentation & Enablement",period:"2026",technologies:["Figma","Confluence","Process Mapping","Technical Writing"],summary:"Documented commission systems as explicit data-flow, security, and statement maps paired with maintenance-focused written documentation.",highlights:["Mapped each major data source, union, join, override, decision point, and downstream output.","Documented pay cycles, snapshots, dashboard security, statement sections, and plan-specific behavior.","Iterated documentation with stakeholder reviews and applied detailed maintenance feedback."]}
  ],
  skills: [
    {group:"Analytics & BI",items:["Sigma","Tableau","Dashboard Design","KPI Design","Reporting","Requirements Gathering","Stakeholder Collaboration"]},
    {group:"Data & SQL",items:["SQL","Snowflake","PostgreSQL","MySQL","Data Modeling","Stored Procedures","Window Functions","Regex"]},
    {group:"Programming & Automation",items:["Python","Jupyter","REST APIs","JavaScript","HTML","CSS","Git","GitHub"]},
    {group:"Data Science",items:["Machine Learning","Forecasting","Data Mining","Predictive Analytics","Visual Analytics","AI / Deep Learning"]},
    {group:"Delivery",items:["Process Improvement","Technical Documentation","Validation","Reconciliation","Project Delivery","Mentoring"]}
  ],
  education: [
    {school:"UNC Charlotte",degree:"Master of Science",program:"Data Science & Business Analytics",period:"2022 – 2025",completedCourses:11,credits:33,highlights:["Business Intelligence & Analytics","Applied Machine Learning","Big Data Analytics","Cloud Computing for Data Analysis","Visual Analytics & Storytelling"]},
    {school:"New Jersey Institute of Technology",degree:"Bachelor of Science",program:"Computer Science",secondary:"Information Technology • Applied Physics minor",period:"2018 – 2022",completedCourses:47,credits:136,honors:"Dean’s List — 7 terms",highlights:["Algorithms & Data Structures","Operating Systems","Artificial Intelligence","Data Mining","Cybersecurity","Systems Integration"]}
  ],
  courseSubjects: [["CS",14],["DSBA",10],["IT",8],["MATH",6],["PHYS",5],["HUM/HSS",5],["IS",3],["Other",7]],
  resume: {
    headline:"Business Intelligence Analyst | Data & Analytics",
    summary:"Business intelligence analyst with experience delivering analytics products, data automation, financial reporting, operational dashboards, and internal commission systems. Strong background in SQL, Snowflake, Sigma, Python, APIs, data modeling, validation, and cross-functional project delivery.",
    skills:"SQL • Snowflake • Sigma • Python • REST APIs • Data Modeling • BI Dashboards • Automation • Forecasting • Technical Documentation"
  }
};