window.PORTFOLIO_DATA = {
  profile: {
    name: "Hemanth Velan",
    title: "Business Intelligence Analyst",
    location: "New Jersey",
    summary: "Business intelligence, analytics engineering, and automation professional with experience owning production reporting, internal commission systems, financial analytics, forecasting, API and browser automation, data quality controls, operational dashboards, and technical documentation across logistics, healthcare, and education environments.",
    github: "https://github.com/SirB0b27",
    linkedin: "https://www.linkedin.com/in/hemanthvelan27"
  },
  metrics: [
    {label:"Documented work items", value:"651", note:"Structured Confluence work notes"},
    {label:"Weeks documented", value:"145", note:"Dec 2023 – Sep 2026"},
    {label:"Connected Jira issues", value:"323", note:"Work-linked Jira records collected"},
    {label:"Completed courses", value:"58", note:"Undergraduate + graduate"}
  ],
  activityMonthly: [
    ["2023-12",7],["2024-01",6],["2024-02",14],["2024-03",22],["2024-04",17],["2024-05",24],["2024-06",12],["2024-07",16],["2024-08",16],["2024-09",23],["2024-10",23],["2024-11",29],["2024-12",22],
    ["2025-01",17],["2025-02",19],["2025-03",13],["2025-04",18],["2025-05",21],["2025-06",21],["2025-07",17],["2025-08",18],["2025-09",19],["2025-10",25],["2025-11",14],["2025-12",30],
    ["2026-01",26],["2026-02",19],["2026-03",13],["2026-04",18],["2026-05",18],["2026-06",22],["2026-07",27],["2026-08",24],["2026-09",21]
  ],
  experience: [
    {
      role:"Business Intelligence Analyst",
      org:"Armstrong Transport Group, Inc.",
      period:"2023 – Present",
      location:"United States",
      tags:["SQL","Snowflake","Sigma","Python","REST APIs","Playwright","Automation","Financial Analytics","Data Modeling"],
      bullets:[
        "Own end-to-end analytics initiatives from requirements and source analysis through SQL modeling, QA, stakeholder review, rollout, documentation, and long-term maintenance.",
        "Serve as sole developer or primary technical owner for multiple large reporting and commission initiatives used by operations, finance, agents, external partners, and executive leadership.",
        "Build internal commission reporting and payout systems spanning plan logic, historical snapshots, overrides, row-level security, agent statements, monthly and weekly pay cycles, and reconciliation controls.",
        "Create financial analytics for settlements, currency conversion, payment behavior, prior balances, DSO-based cash forecasting, historical comparisons, and expected-versus-actual payment analysis.",
        "Automate API and browser-based data collection with Python, REST APIs, Playwright, pagination, rate limiting, historical backfills, retry/error handling, structured exports, and downstream BI reporting.",
        "Develop Sigma dashboards and Snowflake models for operational activity, usage cadence, adoption, productivity, data quality, exception monitoring, and financial decision support.",
        "Create process maps and Confluence documentation that make complex joins, unions, security rules, business logic, snapshots, and downstream calculations maintainable for future developers."
      ]
    },
    {
      role:"Enterprise Business Analyst Intern",
      org:"Cooper University Hospital",
      period:"Jun 2023 – Aug 2023",
      location:"Camden, NJ",
      tags:["Dashboards","Business Analysis","Performance Analytics","Data Modeling","Reporting","Decision Support"],
      bullets:[
        "Built an auto-updating performance dashboard with company, team, and individual views using interactive slicers; the prior resume documented a 2–3% improvement across teams after deployment.",
        "Developed a decision-support model using partner-hospital appointment availability to evaluate partnership value, capacity, and where additional operational support might be needed.",
        "Produced department reporting comparing actual performance with expectations and helped managers identify anomalous data requiring deeper investigation.",
        "Translated operational questions into repeatable reporting and business models that made performance and appointment-access patterns easier for managers to act on."
      ]
    },
    {
      role:"Data Online Bootcamp Teaching Assistant",
      org:"2U, Inc.",
      period:"Mar 2022 – 2024",
      location:"Remote",
      tags:["Python","SQL","Tableau","Power BI","JavaScript","React","MERN","Mentoring","Technical Support"],
      bullets:[
        "Supported data bootcamp cohorts through recurring office hours, technical troubleshooting, class resources, and one-on-one project guidance.",
        "Mentored final-project teams building dashboards, machine-learning solutions, and data applications using Python, SQL, Tableau, neural networks, and related tools.",
        "Provided substitute instructional support across JavaScript, React, MERN, ORM, HTML/CSS/Git, databases, and software-development topics.",
        "Coordinated student support with instructional teams using Slack, GitLab, and shared course resources."
      ]
    },
    {
      role:"Undergraduate Class Teaching Assistant",
      org:"UNC Charlotte",
      period:"Aug 2022 – Dec 2022",
      location:"Charlotte, NC",
      tags:["Data Science","Teaching","Grading","Office Hours","Team Coordination"],
      bullets:[
        "Supported an approximately 110-student Intro to Data Science and Sociology course through grading, feedback, office hours, and instructional support.",
        "Provided technical and conceptual feedback on weekly assignments and helped students work through course material one-on-one.",
        "Collaborated with an eight-person instructional team on weekly planning and student-support coverage."
      ]
    }
  ],
  projects: [
    {
      id:"commission-platform",
      name:"Commission Reporting & Payout Systems",
      category:"Analytics Engineering",
      period:"2024 – 2026",
      technologies:["SQL","Snowflake","Sigma","Data Modeling","Stored Procedures","Snapshots","Row-Level Security","Reconciliation"],
      summary:"Reworked complex commission reporting into maintainable internal analytics products with plan-specific business logic, historical snapshots, overrides, security, statements, and payout-cycle controls.",
      highlights:[
        "Built and maintained workflows across multiple compensation-plan variations with different pay cycles and calculation rules.",
        "Implemented snapshot and live-data comparison logic for retroactive adjustments, plan changes, bonuses, currency changes, and payout reconciliation.",
        "Structured dashboard security and statement logic for different user roles while keeping detailed transaction-level drilldown.",
        "Created maintenance-focused documentation so future developers can trace source data, joins, decisions, overrides, and downstream calculations."
      ]
    },
    {
      id:"front-analytics",
      name:"Front Operational Email & Conversation Analytics",
      category:"API & Automation",
      period:"2024 – 2026",
      technologies:["Python","REST APIs","Jupyter","Snowflake","Sigma","Pagination","Rate Limiting","Retry Logic"],
      summary:"Built a resilient API-driven collection and analytics pipeline for operational email/conversation data, including historical backfills, response timing, status duration, workload, and user-handling metrics.",
      highlights:[
        "Collected multiple inboxes with paginated extraction, configurable date windows, rate limiting, retry/backoff handling, and incremental/full-history modes.",
        "Captured message/event data for first reply, total resolution, open/waiting/resolved duration, hourly volume, workload, pushback, and outlier analysis.",
        "Added fallbacks and client-side filtering when source search behavior was inconsistent, then validated output against source reporting.",
        "Produced structured CSV outputs and downstream Sigma/Snowflake-ready datasets for recurring operational reporting."
      ]
    },
    {
      id:"cash-forecasting",
      name:"Cash Forecasting & Payment Behavior",
      category:"Financial Analytics",
      period:"2025 – 2026",
      technologies:["SQL","Forecasting","DSO","Customer Segmentation","Data Modeling","Historical Comparison"],
      summary:"Developed customer-level payment behavior logic to estimate expected payment dates and forecast unpaid invoiced cash using DSO, payment buckets, and historical settlement patterns.",
      highlights:[
        "Created payment-aging buckets and customer-level average/median DSO and volatility metrics.",
        "Combined average DSO with weighted payment-distribution behavior to estimate future cash timing.",
        "Built alternative calculation views for different inclusion rules and recurring current-year versus prior-year comparisons."
      ]
    },
    {
      id:"cad-controls",
      name:"CAD Currency & Settlement Controls",
      category:"Financial Data Controls",
      period:"2025 – 2026",
      technologies:["SQL","Snowflake","Regex","Snapshots","Reconciliation","Currency Conversion"],
      summary:"Implemented currency detection, conversion, and settlement-change logic for USD/CAD reporting using historical snapshots and transaction-specific application rules.",
      highlights:[
        "Built currency-type change tracking using dated snapshots and recent-settlement reprocessing.",
        "Implemented order-level versus load-level adjustment rules by transaction type.",
        "Added reconciliation calculations comparing expected and actual CAD payment behavior.",
        "Created regex-based currency detection and parsing logic for inconsistent free-text descriptions."
      ]
    },
    {
      id:"user-activity",
      name:"Analytics User Activity & Adoption",
      category:"Product Analytics",
      period:"2026",
      technologies:["Sigma","SQL","Snowflake","Business-Day Calendars","Usage Analytics"],
      summary:"Built user and agent activity reporting with business-day aware metrics, request-status filtering, usage cadence classification, and adoption views.",
      highlights:[
        "Created active-user, request-count, active-business-day, and total-active-day metrics.",
        "Added daily, weekly, monthly, and drop-off cadence classifications.",
        "Designed dashboard filters, KPI views, weekday/hour reporting, and operational drilldowns."
      ]
    },
    {
      id:"snapshot-automation",
      name:"Snapshot, Scheduling & Data Quality Automation",
      category:"Data Engineering",
      period:"2024 – 2026",
      technologies:["Snowflake","SQL","Stored Procedures","Scheduled Tasks","Validation","Reconciliation","Live-vs-Snapshot Comparison"],
      summary:"Created and maintained snapshot procedures, scheduled tasks, historical comparison logic, and validation routines used to stabilize production reporting.",
      highlights:[
        "Implemented repeatable snapshot procedures and task-driven refresh processes.",
        "Compared live and snapshot datasets using stable identifiers to isolate missing, changed, or duplicated records.",
        "Added defensive logic around dates, source changes, nulls, and historical reprocessing to reduce reporting breakage."
      ]
    },
    {
      id:"commission-reconciliation",
      name:"Commission Data Quality & Charge Reconciliation",
      category:"Data Quality & Investigation",
      period:"2026",
      technologies:["SQL","Snowflake","Reconciliation","Root-Cause Analysis","Cross-System Validation"],
      summary:"Investigated discrepancies across commission snapshots, live calculations, and charge summaries to isolate data-quality problems and source-system identifier limitations.",
      highlights:[
        "Compared multiple reporting layers and narrowed mismatches to specific line-item and workflow behaviors.",
        "Worked cross-functionally to identify source identifiers reused across multiple workflows on the same transaction.",
        "Quantified discrepancy patterns and handed validated findings to engineering stakeholders for downstream handling."
      ]
    },
    {
      id:"process-docs",
      name:"Commission Process Maps & Technical Documentation",
      category:"Documentation & Enablement",
      period:"2026",
      technologies:["Figma","Confluence","Process Mapping","Technical Writing","Data Lineage"],
      summary:"Documented commission systems as explicit data-flow, security, and statement maps paired with maintenance-focused written documentation.",
      highlights:[
        "Mapped each major source, union, join, override, decision point, and downstream output instead of relying on high-level diagrams.",
        "Documented pay cycles, snapshots, dashboard security, statement sections, manual adjustments, and plan-specific behavior.",
        "Iterated documentation through stakeholder reviews and incorporated detailed maintenance feedback."
      ]
    },
    {
      id:"work-history-collector",
      name:"Atlassian Work History Collector",
      category:"Automation & Developer Tools",
      period:"2026",
      technologies:["Python","Playwright","Microsoft Edge","Confluence","Jira","CSV","Excel","JSONL","Browser Automation"],
      summary:"Built a reusable Windows application that collects structured personal work history from Confluence and Jira through browser automation, then prepares the data for analytics, resume generation, and portfolio use.",
      highlights:[
        "Used a persistent Edge automation profile so SSO/MFA could be completed manually without storing credentials.",
        "Collected weekly Confluence work notes and Jira issues connected through assignment, reporting, comments, activity, and historical relationships.",
        "Generated normalized CSV, Excel, JSON/JSONL, analytics manifests, and resume-source outputs organized by company and workflow.",
        "Added validation/test modes, progress reporting, configurable cutoffs, exhaustive Jira range inspection, and full-run summary metrics."
      ]
    },
    {
      id:"healthcare-performance",
      name:"Healthcare Performance Dashboard",
      category:"Business Intelligence",
      period:"2023",
      technologies:["Dashboarding","Interactive Slicers","Performance Analytics","Business Reporting"],
      summary:"Built an auto-updating healthcare performance dashboard with company, team, and individual views to improve visibility into operational results.",
      highlights:[
        "Created dynamic company, team, and individual views controlled through interactive slicers.",
        "The prior resume documented a 2–3% improvement across teams after deployment.",
        "Made performance differences and anomalies easier for managers to identify and investigate."
      ]
    },
    {
      id:"hospital-capacity-model",
      name:"Hospital Partnership & Capacity Model",
      category:"Business Analysis",
      period:"2023",
      technologies:["Business Modeling","Capacity Analysis","Appointment Availability","Decision Support"],
      summary:"Developed a decision-support model using appointment availability across partner hospitals to evaluate partnership value and operational capacity.",
      highlights:[
        "Compared appointment availability and department performance across partner organizations.",
        "Used the model to surface areas where additional operational support might be needed.",
        "Translated operational availability data into a management-facing partnership assessment."
      ]
    },
    {
      id:"dnd-character-vault",
      name:"D&D Character Vault Desktop App",
      category:"Desktop Application Development",
      period:"2026",
      technologies:["Python","Desktop UI","Local Data","PDF Import/Export","Automated Testing","Search","Installer"],
      summary:"Designed and iteratively built a Windows desktop character-management application with offline game-data catalogs, guided character creation, progression tracking, PDF workflows, preferences, backups, and regression testing.",
      highlights:[
        "Built local/offline catalogs containing hundreds of spells, feats, and magic items so core workflows do not depend on repeated web lookups.",
        "Implemented character generation, level-up and multiclass flows, spell/feat/item management, notes, change history/revert, shared inventory/funds, PDF preview/import/export, and installer/uninstaller workflows.",
        "Added permanent regression coverage across 14 classes, 117 subclasses, and 2,223 level-up paths plus targeted multiclass testing.",
        "Iterated on modern single-window UI behavior, theming, layout density, state persistence, and no-reload interaction patterns."
      ]
    },
    {
      id:"get-that-recipe",
      name:"Get That Recipe",
      category:"Software Development",
      period:"College project",
      technologies:["HTML","PHP","CSS","Bootstrap","RabbitMQ","MariaDB","Virtual Machines","VPN"],
      summary:"Multi-tier recipe application using a web client, service communication through RabbitMQ, and server-side API/data storage on MariaDB.",
      highlights:["Built the web experience with HTML, PHP, CSS, and Bootstrap.","Used RabbitMQ for client/server communication.","Deployed application components across linked virtual machines."]
    },
    {
      id:"social-fitness",
      name:"Social Fitness",
      category:"Software Development",
      period:"College project",
      technologies:["ReactJS","Python","PostgreSQL","Heroku"],
      summary:"Social fitness web application focused on diet tracking and community interaction.",
      highlights:["Built the application with ReactJS, Python, and PostgreSQL.","Designed social and diet-tracking functionality.","Deployed the application to Heroku."]
    },
    {
      id:"spotify-api",
      name:"Spotify API Application",
      category:"API & Software Development",
      period:"College project",
      technologies:["Python","HTML","CSS","Spotify API","Heroku"],
      summary:"Web application that uses the Spotify API to select an artist, display top tracks, and provide a randomly selected preview.",
      highlights:["Integrated the Spotify API with a Python web application.","Displayed artist and track data through a lightweight HTML/CSS frontend.","Deployed the project to Heroku."]
    },
    {
      id:"tic-tac-toe",
      name:"Real-Time Tic-Tac-Toe",
      category:"Software Development",
      period:"College project",
      technologies:["ReactJS","Flask","Python","PostgreSQL","Socket.IO","Heroku"],
      summary:"Real-time multiplayer tic-tac-toe application with ReactJS, Flask, PostgreSQL, and Socket.IO communication.",
      highlights:["Implemented real-time communication between multiple users with Socket.IO.","Used Flask/Python and PostgreSQL for the application backend.","Built the interactive frontend in ReactJS."]
    },
    {
      id:"academic-success",
      name:"Academic vs Financial Success",
      category:"Data Analysis",
      period:"College project",
      technologies:["Data Wrangling","Data Cleaning","Exploratory Analysis"],
      summary:"Team project focused on dataset cleaning, wrangling, and analysis of academic and financial outcomes.",
      highlights:["Prepared and cleaned source datasets.","Performed exploratory analysis on relationships between academic and financial measures.","Applied practical data-wrangling and exploratory-analysis workflows."]
    }
  ],
  skills: [
    {group:"Analytics & Business Intelligence",items:["Data Analysis","Business Intelligence","Sigma","Tableau","Power BI","Excel","SSRS","KPI Design","Dashboard Design","Reporting","Data Storytelling","Reconciliation","Root-Cause Analysis"]},
    {group:"SQL, Databases & Data Engineering",items:["SQL","Snowflake","PostgreSQL","MySQL","MariaDB","MongoDB","PgAdmin","Data Modeling","ETL / ELT","Stored Procedures","Window Functions","Regex","Snapshots","Scheduled Tasks","JSON / JSONL"]},
    {group:"Programming Languages",items:["Python","JavaScript","Java","C++","C#","C","Bash Shell Scripting","PHP","MATLAB","Assembly","SQL"]},
    {group:"Automation, APIs & Pipelines",items:["REST APIs","Playwright","Browser Automation","Microsoft Edge Automation","Jupyter Notebooks","Pagination","Rate Limiting","Retry / Backoff","Historical Backfills","CSV / Excel Pipelines"]},
    {group:"Web & Application Development",items:["ReactJS","HTML","CSS","Bootstrap","Flask","MERN","Socket.IO","RabbitMQ","Desktop Application Development","PDF Import / Export","Search & State Management"]},
    {group:"Data Science & Machine Learning",items:["TensorFlow","Applied Machine Learning","AI / Deep Learning","Big Data Analytics","Forecasting","Data Mining","Customer Segmentation","DSO Modeling","Statistical Analysis","Visual Analytics"]},
    {group:"Development & Infrastructure Tools",items:["Git","GitHub","GitLab","GitHub Actions","Unix","Vim","Nano","Virtual Machines","VPN","Heroku","Trello"]},
    {group:"Delivery, Documentation & Leadership",items:["Figma","Confluence","Jira","Slack","Process Mapping","Technical Documentation","Data Lineage","Requirements Gathering","Stakeholder Collaboration","Process Improvement","Validation","QA / Regression Testing","Project Delivery","Team Coordination","Mentoring","Technical Support"]}
  ],
  certifications: [
    "Intermediate SQL Queries",
    "Introduction to Relational Databases in SQL",
    "Joining Data in SQL",
    "Applying SQL to Real-World Problems",
    "Introduction to Tableau"
  ],
  languages: ["English","Spanish","Tamil"],
  education: [
    {school:"UNC Charlotte",degree:"Master of Science",program:"Data Science & Business Analytics",period:"2022 – 2025",completedCourses:11,credits:33,highlights:["Business Intelligence & Analytics","Applied Machine Learning","Artificial Intelligence & Deep Learning","Big Data Analytics","Cloud Computing for Data Analysis","Visual Analytics & Storytelling","Database Systems for Data Scientists","Strategic Business Analytics"]},
    {school:"New Jersey Institute of Technology",degree:"Bachelor of Science",program:"Computer Science",secondary:"Information Technology • Applied Physics minor",period:"2018 – 2022",completedCourses:47,credits:136,honors:"Dean’s List — 7 terms",highlights:["Algorithms & Data Structures","Operating Systems","Artificial Intelligence","Data Mining","Cybersecurity","Computer Networks","Systems Integration","Database Design","Software Engineering","Linux Programming"]}
  ],
  courseSubjects: [["CS",14],["DSBA",10],["IT",8],["MATH",6],["PHYS",5],["HUM/HSS",5],["IS",3],["Other",7]],
  resume: {
    headline:"Business Intelligence Analyst | Data, Analytics Engineering & Automation",
    summary:"Business intelligence and analytics professional with experience owning production reporting, commission systems, financial analytics, data automation, operational dashboards, forecasting, data-quality controls, and stakeholder-facing analytics. Strong background in SQL, Snowflake, Sigma, Python, APIs, data modeling, reconciliation, documentation, and cross-functional project delivery.",
    featuredProjectIds:["commission-platform","front-analytics","cash-forecasting","work-history-collector"],
    skills:[
      {label:"Analytics & BI",value:"Data Analysis, Business Intelligence, Sigma, Tableau, Power BI, Forecasting, KPI Design, Dashboard Design, Reconciliation"},
      {label:"Data & Engineering",value:"SQL, Snowflake, PostgreSQL, MySQL, MongoDB, Data Modeling, ETL/ELT, Stored Procedures, Window Functions, Regex, Snapshots"},
      {label:"Programming & Automation",value:"Python, JavaScript, Java, C++, C#, C, Bash, REST APIs, Playwright, Jupyter, Git/GitHub, GitLab"},
      {label:"Delivery & Tools",value:"Figma, Confluence, Jira, Slack, Process Mapping, Technical Documentation, Requirements Gathering, Validation, QA, Mentoring"}
    ]
  }
};