window.PORTFOLIO_DATA = {
  profile: {
    name: "Hemanth Velan",
    title: "Business Intelligence Analyst",
    location: "New Jersey",
    summary: "Business intelligence and analytics professional with experience building production reporting, commission systems, financial analytics, data pipelines, operational dashboards, API automation, and technical documentation across logistics, healthcare, and education environments.",
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
    {role:"Business Intelligence Analyst",org:"Freight Logistics",period:"2023 – Present",location:"United States",tags:["SQL","Snowflake","Sigma","Python","REST APIs","Automation","Financial Analytics","Data Modeling"],bullets:[
      "Build and maintain analytics products used by operations, finance, agents, external partners, and executive leadership.",
      "Develop commission reporting and payout workflows spanning plan logic, historical snapshots, overrides, dashboard security, agent statements, and pay-cycle controls.",
      "Create financial analytics for settlements, currency conversion, payment behavior, prior balances, reconciliation, and expected-cash forecasting.",
      "Automate API and browser-based data collection, historical backfills, validation, and repeatable comparison workflows.",
      "Own large reporting initiatives from requirements and source analysis through SQL modeling, QA, stakeholder review, documentation, rollout, and maintenance.",
      "Create process maps and Confluence documentation that make complex data flows, joins, business rules, and decision points maintainable for future developers."
    ]},
    {role:"Enterprise Business Analyst Intern",org:"Cooper University Hospital",period:"Jun 2023 – Aug 2023",location:"Camden, NJ",tags:["Dashboards","Business Analysis","Data Modeling","Reporting","Performance Analytics"],bullets:[
      "Built an auto-updating performance dashboard with company, team, and individual views using interactive slicers.",
      "Developed a business model to evaluate partner-hospital appointment availability and help teams assess capacity and support needs.",
      "Produced department reporting comparing actual performance with expectations and helped managers investigate anomalous data.",
      "Combined operational analysis and dashboard reporting to give managers a clearer view of department performance and appointment access."
    ]},
    {role:"Data Online Bootcamp Teaching Assistant",org:"2U, Inc.",period:"Mar 2022 – 2024",location:"Remote",tags:["Python","SQL","Tableau","JavaScript","React","MERN","Mentoring","Technical Support"],bullets:[
      "Supported data bootcamp cohorts through office hours, class resources, technical troubleshooting, and project mentoring.",
      "Managed recurring student support sessions and coordinated resources with instructional teams using Slack, GitLab, and related tools.",
      "Mentored final-project teams building dashboards and machine-learning deliverables using tools such as Tableau, neural networks, and Python.",
      "Provided substitute instructional support across JavaScript, React, MERN, ORM, HTML/CSS/Git, and related development topics."
    ]},
    {role:"Undergraduate Class Teaching Assistant",org:"UNC Charlotte",period:"Aug 2022 – Dec 2022",location:"Charlotte, NC",tags:["Data Science","Teaching","Grading","Office Hours","Team Coordination"],bullets:[
      "Supported an approximately 110-student Intro to Data Science and Sociology course.",
      "Graded weekly student assignments and provided feedback focused on technical improvement.",
      "Hosted recurring office hours for one-on-one support and collaborated with an eight-person instructional team on weekly planning."
    ]}
  ],
  projects: [
    {id:"commission-platform",name:"Commission Reporting & Payout Systems",category:"Analytics Engineering",period:"2024 – 2026",technologies:["SQL","Snowflake","Sigma","Data Modeling","Stored Procedures","Snapshots","Security"],summary:"Reworked complex commission reporting into maintainable internal data products with plan-specific logic, snapshots, overrides, security, statements, and payout-cycle controls.",highlights:["Built and maintained workflows across multiple commission plan variations.","Implemented snapshot and live-data comparison logic for retroactive adjustments, plan changes, bonuses, and payment reconciliation.","Created process maps and maintenance documentation so future developers can trace joins, decisions, security, and statement calculations."]},
    {id:"front-analytics",name:"Front Analytics Automation",category:"API & Automation",period:"2024 – 2026",technologies:["Python","REST APIs","Jupyter","CSV","Snowflake","Sigma"],summary:"Built an API-driven analytics workflow for operational email and conversation metrics, including inbox filtering, response timing, status durations, user handling, and data validation.",highlights:["Designed reusable collection logic for multiple inboxes and historical backfills.","Tracked open, waiting, and resolved durations plus first-reply, resolution, hourly-volume, and user-handling metrics.","Built validation routines to compare API results with source-system reporting and investigate discrepancies."]},
    {id:"cash-forecasting",name:"Cash Forecasting & Payment Behavior",category:"Financial Analytics",period:"2025 – 2026",technologies:["SQL","Forecasting","Customer Segmentation","Data Modeling","DSO"],summary:"Developed customer-level payment behavior logic to estimate expected paid dates and forecast unpaid invoiced cash using DSO, payment buckets, and historical settlement patterns.",highlights:["Created aging buckets and customer payment-distribution metrics.","Combined average DSO and weighted payment behavior to estimate future cash timing.","Built comparison outputs for alternative inclusion rules and six-week current-year versus prior-year views."]},
    {id:"cad-controls",name:"CAD Currency & Settlement Controls",category:"Financial Data Controls",period:"2025 – 2026",technologies:["SQL","Snowflake","Regex","Snapshots","Reconciliation","Currency Conversion"],summary:"Implemented currency detection, conversion, and settlement-change logic for USD/CAD reporting with historical snapshots and order/load-level application rules.",highlights:["Built currency-type change tracking using dated snapshots and recent-settlement reprocessing.","Implemented order-level versus load-level adjustment rules by transaction type.","Added reconciliation calculations comparing expected versus actual CAD payment behavior."]},
    {id:"user-activity",name:"Analytics User Activity & Adoption",category:"Product Analytics",period:"2026",technologies:["Sigma","SQL","Business-Day Calendars","Usage Analytics"],summary:"Built user and agent activity reporting with business-day aware metrics, request status filtering, usage cadence classification, and adoption views.",highlights:["Created active-user, request-count, active-day, and business-day metrics.","Added daily, weekly, monthly, and drop-off cadence classifications.","Designed dashboard filters and visual organization for operational review."]},
    {id:"snapshot-automation",name:"Snapshot & Data Quality Automation",category:"Data Engineering",period:"2024 – 2026",technologies:["Snowflake","SQL","Stored Procedures","Scheduled Tasks","Validation","Reconciliation"],summary:"Created and maintained snapshot procedures, scheduled tasks, historical comparison logic, and validation routines used to stabilize production reporting.",highlights:["Implemented repeatable snapshot procedures and task-driven refreshes.","Compared live and snapshot datasets using stable identifiers to isolate missing or changed records.","Added defensive logic to reduce breakage when schemas or upstream columns change."]},
    {id:"process-docs",name:"Commission Process Maps & Documentation",category:"Documentation & Enablement",period:"2026",technologies:["Figma","Confluence","Process Mapping","Technical Writing"],summary:"Documented commission systems as explicit data-flow, security, and statement maps paired with maintenance-focused written documentation.",highlights:["Mapped each major data source, union, join, override, decision point, and downstream output.","Documented pay cycles, snapshots, dashboard security, statement sections, and plan-specific behavior.","Iterated documentation with stakeholder reviews and applied detailed maintenance feedback."]},
    {id:"get-that-recipe",name:"Get That Recipe",category:"Software Development",period:"College project",technologies:["HTML","PHP","CSS","Bootstrap","RabbitMQ","MariaDB","Virtual Machines","VPN"],summary:"Multi-tier recipe application using a web client, service communication through RabbitMQ, and server-side API/data storage on MariaDB.",highlights:["Built the web experience with HTML, PHP, CSS, and Bootstrap.","Used RabbitMQ for client/server communication.","Deployed application components across linked virtual machines."]},
    {id:"social-fitness",name:"Social Fitness",category:"Software Development",period:"College project",technologies:["ReactJS","Python","PostgreSQL","Heroku"],summary:"Social fitness web application focused on diet tracking and community interaction.",highlights:["Built the application with ReactJS, Python, and PostgreSQL.","Designed social and diet-tracking functionality.","Deployed the application to Heroku."]},
    {id:"spotify-api",name:"Spotify API Application",category:"API & Software Development",period:"College project",technologies:["Python","HTML","CSS","Spotify API","Heroku"],summary:"Web application that uses the Spotify API to select an artist, display top tracks, and provide a randomly selected preview.",highlights:["Integrated the Spotify API with a Python web application.","Displayed artist and track data through a lightweight HTML/CSS frontend.","Deployed the project to Heroku."]},
    {id:"tic-tac-toe",name:"Real-Time Tic-Tac-Toe",category:"Software Development",period:"College project",technologies:["ReactJS","Flask","Python","PostgreSQL","Socket.IO","Heroku"],summary:"Real-time multiplayer tic-tac-toe application with ReactJS, Flask, PostgreSQL, and Socket.IO communication.",highlights:["Implemented real-time communication between multiple users with Socket.IO.","Used Flask/Python and PostgreSQL for the application backend.","Built the interactive frontend in ReactJS."]},
    {id:"academic-success",name:"Academic vs Financial Success",category:"Data Analysis",period:"College project",technologies:["Data Wrangling","Data Cleaning","Exploratory Analysis"],summary:"Team project focused on dataset cleaning, wrangling, and analysis of academic and financial outcomes.",highlights:["Prepared and cleaned source datasets.","Performed exploratory analysis on relationships between academic and financial measures.","Used the project to apply practical data-analysis workflows."]}
  ],
  skills: [
    {group:"Core Analytics",items:["Data Analysis","Business Intelligence","Data Mining","Predictive Modeling & Analytics","Machine Learning","Forecasting","Visual Analytics","KPI Design","Dashboard Design","Reporting","Reconciliation"]},
    {group:"SQL, Databases & Data Engineering",items:["SQL","Snowflake","PostgreSQL","MySQL","MariaDB","MongoDB","PgAdmin","Data Modeling","Stored Procedures","Window Functions","Regex","Snapshots","Scheduled Tasks"]},
    {group:"Programming Languages",items:["Python","Java","C++","C#","C","Bash Shell Scripting","JavaScript","PHP","MATLAB","Assembly","SQL"]},
    {group:"Web & Application Development",items:["ReactJS","HTML","CSS","Bootstrap","Flask","MERN","REST APIs","Socket.IO","RabbitMQ"]},
    {group:"Data Science & ML",items:["TensorFlow","Applied Machine Learning","AI / Deep Learning","Big Data Analytics","Customer Segmentation","DSO Modeling","Statistical Analysis"]},
    {group:"Development & Infrastructure Tools",items:["Git","GitHub","GitLab","GitHub Actions","Jupyter Notebooks","Unix","Vim","Nano","Virtual Machines","VPN","Heroku","Trello"]},
    {group:"BI & Collaboration Tools",items:["Sigma","Tableau","Figma","Confluence","Jira","Slack","Process Mapping","Technical Documentation"]},
    {group:"Delivery & Leadership",items:["Project Delivery","Requirements Gathering","Stakeholder Collaboration","Process Improvement","Validation","Team Coordination","Mentoring","Technical Support","Cross-Functional Collaboration"]}
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
    {school:"UNC Charlotte",degree:"Master of Science",program:"Data Science & Business Analytics",period:"2022 – 2025",completedCourses:11,credits:33,highlights:["Business Intelligence & Analytics","Applied Machine Learning","Big Data Analytics","Cloud Computing for Data Analysis","Visual Analytics & Storytelling","Database Systems for Data Scientists","Strategic Business Analytics"]},
    {school:"New Jersey Institute of Technology",degree:"Bachelor of Science",program:"Computer Science",secondary:"Information Technology • Applied Physics minor",period:"2018 – 2022",completedCourses:47,credits:136,honors:"Dean’s List — 7 terms",highlights:["Algorithms & Data Structures","Operating Systems","Artificial Intelligence","Data Mining","Cybersecurity","Systems Integration","Database Design","Software Engineering"]}
  ],
  courseSubjects: [["CS",14],["DSBA",10],["IT",8],["MATH",6],["PHYS",5],["HUM/HSS",5],["IS",3],["Other",7]],
  resume: {
    headline:"Business Intelligence Analyst | Data, Analytics & Automation",
    summary:"Business intelligence analyst with experience delivering analytics products, data automation, financial reporting, operational dashboards, commission systems, and data-quality controls. Strong background in SQL, Snowflake, Sigma, Python, APIs, data modeling, forecasting, validation, technical documentation, and cross-functional project delivery.",
    skills:[
      {label:"Analytics",value:"Data Analysis, BI, Forecasting, Data Mining, Predictive Analytics, Machine Learning, Dashboard Design"},
      {label:"Data",value:"SQL, Snowflake, PostgreSQL, MySQL, MongoDB, Data Modeling, Stored Procedures, Regex"},
      {label:"Programming",value:"Python, JavaScript, Java, C++, C#, C, Bash, ReactJS, HTML/CSS, PHP"},
      {label:"Tools",value:"Sigma, Tableau, Jupyter, Git/GitHub, GitLab, GitHub Actions, Figma, Confluence, Jira, Slack"}
    ]
  }
};