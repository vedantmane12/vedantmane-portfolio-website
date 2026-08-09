/**
 * Single source of truth for every piece of copy on the site.
 * Page sections, the sitemap, and the JSON-LD structured data all read from
 * here, so wording changes rarely require touching a component.
 *
 * House rules for anything written in this file:
 *   1. Every metric traces back to Vedant's resume or project documentation.
 *      Don't add a number that isn't in those source documents.
 *   2. No em dashes in visitor-facing copy. Use commas, colons, or a full stop.
 *   3. Write what was learned or built, not how a course or project was
 *      structured. No "the second half covered", no "three strands", no
 *      "taught through". State the capability, not the timeline.
 */

/**
 * The origin every canonical, Open Graph URL, sitemap entry and JSON-LD @id is
 * built from. Only ever read on the server.
 *
 * Resolution order matters. The first deploy pointed all of it at
 * vedantmane.com, a domain that does not exist, which is worse than pointing at
 * nothing: canonicals name a dead page as the real one, and social previews
 * fetch an og:image URL that 404s.
 *
 *   1. NEXT_PUBLIC_SITE_URL, an explicit override for when a real domain lands.
 *   2. VERCEL_PROJECT_PRODUCTION_URL, which Vercel sets to the project's
 *      production domain. It follows a custom domain automatically once one is
 *      attached, and stays pointed at production on preview deployments, so
 *      previews never claim a canonical of their own.
 *   3. localhost, for `next dev` and local builds.
 */
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000")
).replace(/\/$/, "");

export type Social = {
  label: string;
  href: string;
  handle: string;
  /** Key into the glyph set in `components/contact-icon.tsx`. */
  icon: string;
};

export type Experience = {
  role: string;
  company: string;
  /** Resolved in components/org-logo.tsx against public/logos/companies. */
  logo: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type Project = {
  slug: string;
  title: string;
  /** Grouping shown above the title on the card. Four values across ten projects. */
  discipline: string;
  /**
   * Card-only summary, deliberately short. `blurb` is a full sentence and runs
   * to four lines in a card column, so it stays for the detail page header and
   * the page metadata while this carries the grid.
   */
  cardLine: string;
  blurb: string;
  description: string;
  /** The single headline number. Rendered as the card's metric line. */
  outcome: string;
  stack: string[];
  href?: string;
  repo?: string;
  featured: boolean;
};

export type Tech = {
  name: string;
  /** One line on how it's actually used. Specifics beat adjectives. */
  description: string;
  /**
   * Brand key resolved in components/tech-icon.tsx. Falls back to a
   * monogram tile when no brand mark is available.
   */
  slug: string;
};

export type Course = {
  /** Catalogue code, e.g. "DAMG 6210". */
  code: string;
  title: string;
  term: string;
  grade: string;
  credits: number;
  /** What was learned, in Vedant's voice. See house rule 3 at the top. */
  description: string;
  /**
   * Slugs from `projects` that came out of this course. Rendered as links
   * down to the relevant project card.
   */
  projects?: string[];
};

export type Education = {
  degree: string;
  school: string;
  /** Resolved in components/org-logo.tsx against public/logos/companies. */
  logo: string;
  location: string;
  start: string;
  end: string;
  grade: string;
  /** Short paragraph on what the programme actually covered. */
  summary?: string;
  courses?: Course[];
  /**
   * Credits for the whole programme. Set this where `courses` lists only the
   * theory subjects, since summing those would understate the total.
   * Falls back to the sum of `courses` when omitted.
   */
  totalCredits?: number;
};

/**
 * The headline, as three parallel clauses rather than one sentence.
 *
 * Each line names one of the three things the work actually covers, and each
 * ends on the verb that carries it, which is the word the hero sets in italic
 * serif. Kept to nine words total: hero headlines stop being read at about ten.
 *
 * This is the single source of truth. `person.tagline` is derived from it so
 * the social card can never drift from what the page says.
 */
export const heroLines = [
  /**
   * "keep up" has to carry three things at once: speed, robustness, and
   * incremental processing. It is the one phrase that does all three without
   * naming any of them. Keeping up with an arriving feed is only possible by
   * processing increments as they land, since a full reprocess cannot; keeping
   * up is the speed; and keeping up continuously is the robustness.
   *
   * "act" rather than "read" separates multi-agent work from retrieval that
   * only fetches text back.
   */
  { text: "Pipelines that keep up.", accents: ["keep", "up"] },
  { text: "Models that answer.", accents: ["answer"] },
  { text: "Agents that act.", accents: ["act"] },
];

export const person = {
  name: "Vedant Mane",
  firstName: "Vedant",
  role: "Data Engineer & AI Developer",
  tagline: heroLines.map((line) => line.text).join(" "),
  /**
   * Visitor-facing opening statement for About. Deliberately free of employer
   * and tool names: it says what the work is for, and the four chapters in
   * `journey` supply the evidence underneath it.
   */
  bio: "I build the systems that move data between platforms, and the AI applications that run on top of them. In practice that means pipelines that run reliably on a schedule, data models that give teams a consistent answer to the same question, and AI tools that work through documents and records at volumes no one could review by hand. Most of my experience has been on platforms where people make decisions from the output, so I treat data quality and reliability as part of the build rather than something added afterwards.",
  /**
   * Machine-facing version of the same thing, used as the JSON-LD `description`
   * rather than `bio`. Search engines need the concrete nouns a human reader
   * doesn't want in an opening paragraph, so the two are kept separate on
   * purpose. Third person, because that is the convention for Person schema.
   */
  seoDescription: "Vedant Mane is a Data Engineer and AI Developer in Boston, MA with over three years building production data systems. His work covers real-time ETL and dimensional warehousing on Databricks and Snowflake, multi-agent AI systems with LangGraph and RAG, and core banking infrastructure clearing more than 450 million transactions a day.",
  location: "Boston, MA",
  email: "vedant12mane@gmail.com",
  phone: "+1 (857) 565-5980",
  resumeHref: "/vedant-mane-resume.pdf",
  /**
   * Deliberately short, and paired with a green indicator rather than the blue
   * accent so it reads as a status light. The pill sits directly beside the mono
   * line naming the role, and six job titles appear on the pipeline band below,
   * so spelling out the disciplines here only repeated what is already on screen
   * twice.
   */
  availability: "Available to work",
} as const;

/**
 * E.164 form of `person.phone`, for the `tel:` link and for JSON-LD.
 *
 * Derived rather than stored a second time: a hand-written duplicate is exactly
 * the kind of thing that ends up one digit different from the label next to it.
 */
export const phoneHref = `tel:${person.phone.replace(/[^\d+]/g, "")}`;

/**
 * The hero graphic is a data pipeline, and each stage is labelled with the job
 * title that stage is usually hired under. That is the argument the section is
 * making: the same person covers the whole run, not one slice of it.
 *
 * Stage verbs are deliberately distinct. "Serve" and "Ship" would read as the
 * same step to anyone who has built one of these.
 */
export type PipelineStage = {
  stage: string;
  role: string;
  detail: string;
};

export const pipelineIntro =
  "Building scalable data pipelines and AI-powered analytics solutions";

export const pipeline: PipelineStage[] = [
  {
    stage: "Ingest",
    role: "Data Engineer",
    detail: "Streaming and batch pipelines that hold to a schedule.",
  },
  {
    stage: "Model",
    role: "Data Analyst",
    detail: "Star schemas and dashboards teams reopen.",
  },
  {
    stage: "Explore",
    role: "Data Scientist",
    detail: "The analysis that decides what is worth building.",
  },
  {
    stage: "Train",
    role: "ML Engineer",
    detail: "Training, evaluation and fine tuning, then serving it.",
  },
  {
    stage: "Reason",
    role: "AI Engineer",
    detail: "Retrieval and agents over documents that were never clean.",
  },
  {
    stage: "Ship",
    role: "Software Engineer",
    detail: "APIs, containers and CI, next to the people using them.",
  },
];

/**
 * Every title this site should be findable under, including the two the six
 * stages above don't name outright. This feeds JSON-LD `hasOccupation` only.
 * It is deliberately not rendered as hidden text: invisible keyword lists are
 * a spam signal, and structured data is the supported way to say this.
 */
export const targetRoles = [
  "Data Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Software Development Engineer",
  "Forward Deployed Engineer",
];

/**
 * The About section is a narrative in four chapters rather than a bio blob.
 * Each one is a turning point, and the figure is the receipt for it.
 */
export const journey = [
  {
    year: "2016",
    place: "Mumbai",
    title: "Foundation",
    body: "Computer science from the ground up, and the parts of it I still use daily: how data is structured, how systems behave under load, how a database actually answers a query. Results climbed steadily across six semesters and then held near the top.",
    figure: "8.77 / 10",
    figureLabel: "B.Sc. final",
  },
  {
    year: "2019",
    place: "Mumbai",
    title: "Decision",
    body: "Where the career stopped being general. I took every analytics and big data elective on offer and went deep on how large data sets get stored, queried and mined at volume. Two semesters closed at a perfect score.",
    figure: "9.56 / 10",
    figureLabel: "M.Sc. final",
  },
  {
    year: "2021",
    place: "Mumbai",
    title: "Scale, for real",
    body: "Three years on the core banking platform of a national bank, where a wrong number reaches millions of people the same day. I tuned replication and warehouse transformations, and found a defect at day boundaries that had been sitting underneath every alert threshold we had.",
    figure: "450M",
    figureLabel: "Transactions a day",
  },
  {
    year: "2024",
    place: "Boston",
    // Non-breaking space so the narrowest four-column width breaks after the
    // comma rather than dropping "AI" onto a line of its own.
    title: "Modern data stack, plus AI",
    body: "A graduate degree pointed at the two gaps I had: modern warehouse architecture and applied AI. I built systems end to end across both, and spent a year teaching database design and generative AI to eighty graduate students, which is the quickest way to find out what you only half know.",
    figure: "3.88 / 4.0",
    figureLabel: "M.S. final",
  },
];

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/vedantmane12",
    handle: "@vedantmane12",
    icon: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vedant-mane/",
    handle: "in/vedant-mane",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/_vedantmane_/",
    handle: "@_vedantmane_",
    icon: "instagram",
  },
  {
    label: "Email",
    href: `mailto:${person.email}`,
    handle: person.email,
    icon: "email",
  },
];

export const education: Education[] = [
  {
    degree: "M.S. Information Systems",
    school: "Northeastern University",
    logo: "neu-logo",
    location: "Boston, MA",
    start: "Aug 2024",
    end: "May 2026",
    grade: "GPA 3.88 / 4.0",
    summary:
      "Thirty-three credits in the College of Engineering, concentrating in General Information Systems, with the weight on data architecture and applied AI. The DAMG courses gave me the warehousing side: relational design and normalisation, building pipelines at scale, and architecting across structured and unstructured sources at once. The INFO courses covered the engineering around it, from Java application development and algorithms through machine learning methods, prompt engineering and LLM fine-tuning, to what it takes to land a system inside a working business. Degree awarded April 2026.",
    courses: [
      {
        code: "INFO 5100",
        title: "Application Engineering and Development",
        term: "Fall 2024",
        grade: "A-",
        credits: 4,
        description:
          "Building Java applications from a business problem rather than a written spec, holding UX flow, process logic, and the data model as a single design. Object-oriented decomposition as a repeatable method instead of instinct.",
      },
      {
        code: "INFO 5101",
        title: "Lab for INFO 5100",
        term: "Fall 2024",
        grade: "S",
        credits: 0,
        description:
          "Focused Java practice supporting INFO 5100, drilling the language mechanics behind the application work.",
      },
      {
        code: "INFO 6105",
        title: "Data Science Engineering Methods and Tools",
        term: "Fall 2024",
        grade: "A",
        credits: 4,
        description:
          "Supervised learning through to neural networks, unsupervised methods including clustering, and the pipeline work that decides whether a model survives contact with real data. Worked on real datasets, not clean textbook ones.",
      },
      {
        code: "ENCP 6000",
        title: "Career Management for Engineers",
        term: "Fall 2024",
        grade: "A",
        credits: 1,
        description:
          "Setting concrete career goals for co-op and assessing my skills honestly against them. Does not count toward degree requirements.",
      },
      {
        code: "DAMG 6210",
        title: "Data Management and Database Design",
        term: "Spring 2025",
        grade: "A",
        credits: 4,
        description:
          "Modelling before building: conceptual and logical design, enhanced entity-relationship models, and normalisation carried through to a physical schema in Oracle SQL Data Modeler. SQL from joins and grouping through subqueries, set operations, and analytical functions, with DDL, DML, and transaction control across both Oracle and SQL Server. PL/SQL for procedures, functions, triggers, and packages, and the user, role, and permission model that decides who is allowed to run them.",
        projects: ["orchestrate-event-db"],
      },
      {
        code: "DAMG 7245",
        title: "Big Data Systems and Intelligence Analytics",
        term: "Spring 2025",
        grade: "A",
        credits: 4,
        description:
          "Building data pipelines that survive contact with production, which is where most data science effort actually goes and where most of it fails. Extracting unstructured PDFs and web pages with Docling and MarkItDown into S3, then warehouse design in Snowflake weighing raw staging against JSON transformation against denormalised fact tables, with Snowpark for in-warehouse processing. RAG pipelines orchestrated in Airflow, moving from naive cosine similarity through Pinecone and ChromaDB with hybrid metadata filtering, served over FastAPI and Streamlit. Multi-agent systems in LangGraph coordinating structured Snowflake queries, vector retrieval, and live web search into a single report.",
        projects: [
          "venture-scope",
          "sec-financial-pipeline",
          "nvidia-fin-rag",
          "fred-economic-data",
        ],
      },
      {
        code: "INFO 7375",
        title: "Prompt Engineering and Agentic AI",
        term: "Summer 2025",
        grade: "A-",
        credits: 4,
        description:
          "Prompt patterns as a discipline rather than trial and error: persona, question refinement, cognitive verifier, audience persona, few-shot, chain-of-thought, and ReAct. Retrieval built on embeddings and vector stores for semantic search, wired into applications through LangChain. Parameter-efficient fine-tuning with PEFT, instruction tuning, and alignment through reinforcement learning from human feedback. On the agent side, agent taxonomies, short-term and long-term and episodic memory, tool integration, multi-agent orchestration in LangGraph, sandboxed code-writing agents, and deploying them as monitored services.",
        projects: ["lora-peft-finetuning", "academic-research-assistant"],
      },
      {
        code: "DAMG 7370",
        title: "Designing Advanced Data Architectures for Business Intelligence",
        term: "Fall 2025",
        grade: "A",
        credits: 4,
        description:
          "Designing the whole BI stack rather than one layer of it: requirements analysis, architecture frameworks, dimensional modelling with hierarchies and slowly changing dimensions, and the integration design underneath. Modelled in ER/Studio and Navicat, loaded SQL Server OLTP into Snowflake through Azure Data Factory, implemented Medallion architecture with SCD Type 1 and 2 in Databricks Delta Live Tables, and handled schema drift as new fields and type changes arrived. Served through Power BI with DAX and column-level security, and through Tableau, with Alteryx for profiling and prep.",
        projects: ["imdb-analytics", "la-crime-analytics", "food-inspections"],
      },
      {
        code: "INFO 6205",
        title: "Program Structure and Algorithms",
        term: "Fall 2025",
        grade: "A",
        credits: 4,
        description:
          "Implementing the structures in Python rather than importing them: dynamic arrays with table doubling and amortised cost, linked lists, stacks, queues, deques, hash tables built from scratch, heaps, tries, graphs, and disjoint sets with union by size and path compression. On the algorithm side, recursion and divide-and-conquer, greedy methods, dynamic programming with memoisation, and the graph set of BFS, DFS with timestamps, topological sort, Dijkstra, minimum spanning trees, and Huffman encoding. Everything measured on time and space complexity, both asymptotically and by experiment.",
      },
      {
        code: "INFO 7260",
        title: "Business Process Engineering",
        term: "Spring 2026",
        grade: "A-",
        credits: 4,
        description:
          "Mapping processes as-is and to-be in flowcharts, swimlane diagrams, and BPMN, then analysing them on cycle time, cost, and error rate with Fishbone, 5 Whys, and Lean's TIMWOOD waste model. Design Thinking for the human side: empathy mapping, journey maps, divergent and convergent ideation, prototyping. Waterfall against Agile for actually delivering the change. The principle that stuck: optimise a process before automating it, or you automate the mess.",
      },
    ],
  },
  {
    degree: "M.S. Computer Science",
    school: "University of Mumbai",
    logo: "mu-logo",
    location: "Mumbai, India",
    start: "Jun 2019",
    end: "May 2021",
    grade: "GPA 9.56 / 10",
    totalCredits: 96,
    summary:
      "Ninety-six credits at Ramnarain Ruia Autonomous College, affiliated to the University of Mumbai. The elective track I carried through all four semesters was Business Intelligence and Big Data Analytics, and it is where the work I do now started: mining massive data sets, intelligent data analysis, and social network analysis, sitting alongside a systems core of compilers, advanced operating systems, and distributed databases. A second track covered network security and cyber forensics. Finished at 9.56 on a ten-point scale with two perfect semesters, a six-credit research project, and a twelve-credit industry internship.",
    courses: [
      {
        code: "RPSCS101",
        title: "Analysis of Algorithms",
        term: "Semester I",
        grade: "A",
        credits: 4,
        description:
          "Worked through CLRS end to end: asymptotic analysis and recurrences, divide and conquer including Strassen's matrix multiplication, and randomised algorithms, then dynamic programming, greedy methods, and the graph set of BFS, DFS, Kruskal, Prim, Bellman-Ford, and Dijkstra. Also the number theory behind RSA, NP-completeness and reducibility, and approximation algorithms for vertex cover, travelling salesman, and subset-sum.",
      },
      {
        code: "RPSCS102",
        title: "Advanced Computer and Enterprise Networking",
        term: "Semester I",
        grade: "B+",
        credits: 4,
        description:
          "Routing across the TCP/IP suite including IPv4, ARP, and Mobile IP, network virtualisation with VMware NSX, ad hoc and wireless networking from MANET routing protocols through to Bluetooth PANs, and enterprise campus architecture built on modularity and layered security services.",
      },
      {
        code: "RPSCS103",
        title: "Advanced Database Management Systems",
        term: "Semester I",
        grade: "B+",
        credits: 4,
        description:
          "Past the relational core into deductive databases with Datalog and Horn clauses, active databases driven by event-condition-action rules, and XML and multimedia storage. Distributed work covered fragmentation, allocation and replication, distributed query optimisation, and concurrency control through locking and timestamp ordering. Also object-oriented databases with ODMG and OQL, spatial data using R-trees and space-filling curves, and an introduction to NoSQL.",
      },
      {
        code: "RPSCS104",
        title: "Robot Computing",
        term: "Semester I",
        grade: "A+",
        credits: 4,
        description:
          "Robot control from cybernetics and Braitenberg vehicles through reactive architectures and vision-based navigation, with the mechanics underneath it: effectors and actuators, degrees of freedom, locomotion and gait, manipulators and teleoperation, and the sensor types feeding all of it.",
      },
      {
        code: "RPSCS201",
        title: "Advanced Operating Systems",
        term: "Semester II",
        grade: "O",
        credits: 4,
        description:
          "Synchronisation and deadlock, then distributed operating systems in depth: distributed mutual exclusion, distributed deadlock detection, agreement protocols, distributed file systems, distributed shared memory, and scheduling across nodes. Also failure recovery and fault tolerance, protection and flow control, and multiprocessor operating system architecture.",
      },
      {
        code: "RPSCS202",
        title: "Design and Implementation of Modern Compilers",
        term: "Semester II",
        grade: "O",
        credits: 4,
        description:
          "The full translation pipeline built out rather than described: lexical analysis, syntax analysis, syntax-directed translation, type checking, run-time environments, and intermediate code generation through to optimisation.",
      },
      {
        code: "RPSCS203B",
        title: "Cyber and Information Security: Network Security",
        term: "Semester II",
        grade: "O",
        credits: 4,
        description:
          "Operating system protection mechanics from fences and base-bound registers through segmentation, paging, and access control lists, plus multilevel database security. On the network side, layer attacks, firewall design with ACLs, packet filtering and DMZs, intrusion detection and prevention across signature, anomaly, policy, and honeypot approaches, and SSL/TLS with the PKI behind it.",
      },
      {
        code: "RPSCS204A",
        title: "Business Intelligence and Big Data Analytics",
        term: "Semester II",
        grade: "O",
        credits: 4,
        description:
          "OLTP set against OLAP, data integration and warehousing, multidimensional modelling, and the measures, metrics, and KPIs that make enterprise reporting mean anything. First of four electives in this track, and the start of the work I do now.",
      },
      {
        code: "RPSCS301",
        title: "Social Network Analysis",
        term: "Semester III",
        grade: "O",
        credits: 4,
        description:
          "Graph theory applied to relationships: adjacency structures, traversals, distance and diameter, then density, reachability, structural holes, and centrality by degree, closeness, and betweenness alongside PageRank. Cohesive subgroup detection through cliques, K-plexes, K-cores, components and cut-points, structural and automorphic equivalence, and two-mode bipartite analysis using singular value decomposition.",
      },
      {
        code: "RPSCS302B",
        title: "Cyber Forensics",
        term: "Semester III",
        grade: "O",
        credits: 4,
        description:
          "Evidence handling done properly: collection rules, image verification and authentication, and reconstructing events from artefacts. Network forensics across traffic, protocol, packet, and flow analysis, wireless capture, and NIDS and NIPS acquisition. Also device-level work on switches, routers, firewalls, web proxies including encrypted traffic, and GSM and SMS mobile forensics.",
      },
      {
        code: "RPSCS303A",
        title: "Mining Massive Data Sets",
        term: "Semester III",
        grade: "O",
        credits: 4,
        description:
          "MapReduce as the programming model for data that will not fit on one machine, applied to relational operations, matrix-vector multiplication, and aggregation. Similarity at scale through k-shingling and near-duplicate detection, with regression and forecasting layered on top. Built on Rajaraman and Ullman.",
      },
      {
        code: "RPSCSP304",
        title: "Computer Science Project",
        term: "Semester III",
        grade: "O",
        credits: 6,
        description:
          "Six-credit research project carried from proposal through to implementation.",
      },
      {
        code: "RPSCS401",
        title: "Simulation and Modeling",
        term: "Semester IV",
        grade: "O",
        credits: 4,
        description:
          "Modelling systems that resist closed-form analysis: conceptual modelling and simplification, representing variability with the right statistical distributions, and validating that a model actually stands for the thing it claims to. Handling initialisation bias through warm-up, choosing replication counts and run length, and comparing scenarios across system dynamics, discrete event, and agent-based approaches.",
      },
      {
        code: "RPSCS402C",
        title: "Intelligent Data Analysis",
        term: "Semester IV",
        grade: "O",
        credits: 4,
        description:
          "Clustering from K-Means and K-Medoids through CLARA, CLARANS, AGNES, DIANA, and DBSCAN, including non-Euclidean spaces and streaming. Classification across kNN with kD-trees, decision trees on information gain, Bayesian classifiers and networks, and support vector machines, evaluated on confusion matrices, lift and ROC curves. Dimensionality reduction through PCA, SVD, and CUR, and link analysis with PageRank feeding content-based and collaborative recommendation.",
      },
      {
        code: "RPSCSP403",
        title: "Computer Science Internship",
        term: "Semester IV",
        grade: "O",
        credits: 12,
        description:
          "Twelve-credit industry internship, the single largest component of the degree.",
      },
    ],
  },
  {
    degree: "B.S. Computer Science",
    school: "University of Mumbai",
    logo: "mu-logo",
    location: "Mumbai, India",
    start: "Jun 2016",
    end: "May 2019",
    grade: "GPA 8.77 / 10",
    totalCredits: 120,
    summary:
      "One hundred and twenty credits at K. J. Somaiya College of Science and Commerce, an autonomous college affiliated to the University of Mumbai. A computer science foundation that widened each year, from programming, data structures, and discrete mathematics, through operating systems, networks, and databases, and out into cloud computing, data science, image processing, and security. Semester results climbed from 7.90 in the first term to 9.25 and held there, finishing at 8.77 overall. Lab components are folded into their parent subject below rather than listed separately.",
    courses: [
      {
        code: "Sem I",
        title: "Computer Organization and Design",
        term: "2016 to 2017",
        grade: "A",
        credits: 2,
        description:
          "How instructions, memory, and datapaths fit together underneath the code.",
      },
      {
        code: "Sem I",
        title: "Programming with Python I",
        term: "2016 to 2017",
        grade: "B",
        credits: 2,
        description: "First principles of Python: types, control flow, functions.",
      },
      {
        code: "Sem I",
        title: "Free and Open Source Software",
        term: "2016 to 2017",
        grade: "B",
        credits: 2,
        description:
          "The open source toolchain, and the licensing and collaboration model around it.",
      },
      {
        code: "Sem I",
        title: "Database Systems",
        term: "2016 to 2017",
        grade: "B",
        credits: 2,
        description: "The relational model and first contact with SQL.",
      },
      {
        code: "Sem I",
        title: "Discrete Mathematics",
        term: "2016 to 2017",
        grade: "A+",
        credits: 2,
        description:
          "Logic, sets, relations, and proof, the mathematical grammar underneath computing.",
      },
      {
        code: "Sem I",
        title: "Descriptive Statistics and Introduction to Probability",
        term: "2016 to 2017",
        grade: "A",
        credits: 2,
        description: "Summarising data and reasoning about uncertainty.",
      },
      {
        code: "Sem I",
        title: "Soft Skills Development",
        term: "2016 to 2017",
        grade: "B",
        credits: 2,
        description: "Communication, presentation, and working inside a team.",
      },
      {
        code: "Sem II",
        title: "Programming with C",
        term: "2016 to 2017",
        grade: "A+",
        credits: 2,
        description:
          "Pointers, memory, and manual resource management close to the machine.",
      },
      {
        code: "Sem II",
        title: "Programming with Python II",
        term: "2016 to 2017",
        grade: "B+",
        credits: 2,
        description: "Object orientation, modules, and libraries in Python.",
      },
      {
        code: "Sem II",
        title: "Linux",
        term: "2016 to 2017",
        grade: "C",
        credits: 2,
        description: "The shell, filesystem, processes, and permissions.",
      },
      {
        code: "Sem II",
        title: "Data Structures",
        term: "2016 to 2017",
        grade: "A",
        credits: 2,
        description:
          "Lists, stacks, queues, and trees, and the tradeoffs between them.",
      },
      {
        code: "Sem II",
        title: "Calculus",
        term: "2016 to 2017",
        grade: "B+",
        credits: 2,
        description: "Differential and integral calculus for continuous change.",
      },
      {
        code: "Sem II",
        title: "Statistical Methods and Testing of Hypothesis",
        term: "2016 to 2017",
        grade: "A+",
        credits: 2,
        description: "Inference and hypothesis testing on sampled data.",
      },
      {
        code: "Sem II",
        title: "Green Technologies",
        term: "2016 to 2017",
        grade: "C",
        credits: 2,
        description:
          "Environmental cost of computing and what sustainable practice looks like.",
      },
      {
        code: "Sem III",
        title: "Theory of Computation",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description:
          "Formal grammars and the Chomsky hierarchy, regular expressions and finite automata with the pumping lemma and closure properties, then context-free languages, derivation trees, ambiguity and normal forms, and pushdown automata.",
      },
      {
        code: "Sem III",
        title: "Core Java",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description: "Abstraction, encapsulation, interfaces and abstract classes, then string handling, packages and access specifiers, exception handling including user-defined exceptions, multithreading across the thread life cycle and synchronisation, I/O streams, and AWT with the event-delegation model.",
      },
      {
        code: "Sem III",
        title: "Operating System",
        term: "2017 to 2018",
        grade: "A+",
        credits: 2,
        description: "System calls and operating system structure, processes and interprocess communication, threads and multicore programming, synchronisation from the critical-section problem through Peterson's solution, mutexes, semaphores and monitors, and CPU scheduling across FCFS, SJF, SRTF, priority, round robin, and multilevel queues.",
      },
      {
        code: "Sem III",
        title: "Database Management Systems",
        term: "2017 to 2018",
        grade: "O",
        credits: 2,
        description:
          "Triggers for data integrity, sequences, file organisation and indexing with hash and tree-based structures, cost models across heap, sorted and clustered files, and PL/SQL fundamentals covering variables, boolean and CASE expressions, null handling, and iterative control.",
      },
      {
        code: "Sem III",
        title: "Combinatorics and Graph Theory",
        term: "2017 to 2018",
        grade: "O",
        credits: 2,
        description:
          "Binomial and multinomial coefficients, recursive problem solving and proof by induction including strong induction, then graph theory: multigraphs, Eulerian and Hamiltonian graphs, graph colouring, planarity, labelled trees, and a first look at complexity theory.",
      },
      {
        code: "Sem III",
        title: "Physical Computing and IoT Programming",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description:
          "Raspberry Pi from the boot sequence up without a BIOS, Raspbian and Linux configuration, programming interfaces in Node.js and Python, hardware interfaces across UART, GPIO, I2C and SPI, pulse width modulation, and IoT service platforms.",
      },
      {
        code: "Sem III",
        title: "Web Programming",
        term: "2017 to 2018",
        grade: "A+",
        credits: 2,
        description: "HTML structure and embedded media, CSS selectors and positioning, JavaScript fundamentals through functions and timers, then server-side work on files, databases, cookies and sessions.",
      },
      {
        code: "Sem IV",
        title: "Fundamentals of Algorithms",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description:
          "Asymptotic performance with logarithms and summations, the Master Theorem for both divide and conquer and subtract and conquer recurrences, and guess-and-confirm. Then trees in depth: binary and generic trees, traversals including threaded, expression trees, binary search trees, and AVL balancing.",
      },
      {
        code: "Sem IV",
        title: "Advanced Java",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description: "JDBC from driver types through prepared and callable statements, scrollable and updatable result sets, savepoints, batch updates and BLOB handling. Servlets across the container model, life cycle, config and context, and session tracking, then JSP life cycle and implicit objects, and Struts with interceptors, result types and the value stack.",
      },
      {
        code: "Sem IV",
        title: "Computer Networks",
        term: "2017 to 2018",
        grade: "A+",
        credits: 2,
        description:
          "The TCP/IP suite layer by layer with the principles of protocol layering, encapsulation and decapsulation, addressing, and multiplexing, working from physical and data-link through network and transport to application, alongside LAN and WAN switching and internet standards.",
      },
      {
        code: "Sem IV",
        title: "Software Engineering",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description:
          "Process models from waterfall through incremental, evolutionary and concurrent to the Unified Process, plus agile and extreme programming. Requirements engineering and what makes an SRS good, object-oriented design in UML across class, object, use case and sequence diagrams, and maintenance metrics including cyclomatic complexity.",
      },
      {
        code: "Sem IV",
        title: "Linear Algebra using Python",
        term: "2017 to 2018",
        grade: "A",
        credits: 2,
        description:
          "Vectors, matrices, and decompositions, implemented rather than only derived.",
      },
      {
        code: "Sem IV",
        title: "NET Technologies",
        term: "2017 to 2018",
        grade: "O",
        credits: 2,
        description: "The .NET framework and building applications on top of it.",
      },
      {
        code: "Sem IV",
        title: "Android Developer Fundamentals",
        term: "2017 to 2018",
        grade: "A+",
        credits: 2,
        description: "Mobile application structure, lifecycle, and UI on Android.",
      },
      {
        code: "Sem V",
        title: "Linux Server Administration",
        term: "2018 to 2019",
        grade: "A",
        credits: 3,
        description:
          "Managing users, groups, file systems and core services, booting and shutdown, and kernel configuration and compilation. Then TCP/IP for administrators, Netfilter firewalling, and internet services across DNS, FTP, Apache, SMTP, POP and IMAP, SSH, OpenLDAP and Kerberos, with NFS, Samba and NIS on the intranet side.",
      },
      {
        code: "Sem V",
        title: "Software Testing and Quality Assurance",
        term: "2018 to 2019",
        grade: "A",
        credits: 3,
        description: "The distinction between QA, QC and SQA, verification against validation through reviews, inspections and walkthroughs, white box and black box test case design, and testing strategy from unit level upward with metrics and defect management.",
      },
      {
        code: "Sem V",
        title: "Information and Network Security",
        term: "2018 to 2019",
        grade: "A+",
        credits: 3,
        description:
          "The OSI security architecture, classical ciphers through DES, triple DES and AES with block cipher modes and stream ciphers, public-key cryptography and RSA, Diffie-Hellman key exchange, message authentication codes and secure hash functions with HMAC, digital signatures, and authentication applications including Kerberos and X.509.",
      },
      {
        code: "Sem V",
        title: "Web Services",
        term: "2018 to 2019",
        grade: "O",
        credits: 3,
        description: "SOAP, WSDL and UDDI with JAX-WS, service-oriented architecture and the web service development life cycle, then REST properly: HTTP and the core architectural constraints of a RESTful system, plus WCF services, security, and quality of service.",
      },
      {
        code: "Sem V",
        title: "Game Programming",
        term: "2018 to 2019",
        grade: "O",
        credits: 3,
        description: "The mathematics first: Cartesian geometry in 2D and 3D, polygons and Euler's rule, then vectors through addition, scaling, and dot and cross products. That feeds DirectX graphics programming, GPU concepts, and VR and AR.",
      },
      {
        code: "Sem V",
        title: "Project Implementation",
        term: "2018 to 2019",
        grade: "O",
        credits: 1,
        description: "Individual project run over roughly three months, required to be implemented rather than a theoretical study.",
      },
      {
        code: "Sem VI",
        title: "Cyber Forensics",
        term: "2018 to 2019",
        grade: "A+",
        credits: 3,
        description:
          "Standard procedure for incident verification and system identification, recovering erased and damaged data, and disk imaging and preservation. Network forensics through traffic tracking, log review, live acquisition and order of volatility, plus internet, email and messenger forensics including header spoofing, and mobile device acquisition.",
      },
      {
        code: "Sem VI",
        title: "Cloud Computing",
        term: "2018 to 2019",
        grade: "A",
        credits: 3,
        description:
          "Distributed and utility computing foundations, the cloud reference model across IaaS, PaaS and SaaS and the public, private and hybrid split, and a virtualisation taxonomy with KVM and oVirt. Then OpenStack hands on: CLI and APIs, tenants and quotas, controller, networking, block storage and compute deployment, and orchestration with Heat.",
      },
      {
        code: "Sem VI",
        title: "Data Science",
        term: "2018 to 2019",
        grade: "O",
        credits: 3,
        description:
          "Exploratory analysis and visualisation, then data collection, cleaning and curation across structured, semi-structured and unstructured sources. Statistical modelling covered regularisation and the bias-variance tradeoff, AIC and BIC, cross validation, ridge and LASSO, and dimension reduction, with supervised learning through regression trees and time-series forecasting and unsupervised work in PCA, k-means and hierarchical clustering with ensembles.",
      },
      {
        code: "Sem VI",
        title: "Digital Image Processing",
        term: "2018 to 2019",
        grade: "O",
        credits: 3,
        description:
          "Sampling, quantisation and resolution, 2D signals and systems with digital filters, and convolution and correlation through graphical, Z-transform and matrix methods. Image transforms across Fourier, Walsh, Hadamard, Haar, slant, DCT and KL, then spatial and frequency domain enhancement, histogram manipulation, morphological processing with dilation and erosion, and colour models.",
      },
      {
        code: "Sem VI",
        title: "Ethical Hacking",
        term: "2018 to 2019",
        grade: "A+",
        credits: 2,
        description:
          "Reconnaissance with Google and Whois, password cracking with CrypTool and Cain and Abel, port scanning in NMap across ACK, SYN, FIN, NULL and XMAS, traffic capture in Wireshark, ARP poisoning, cross-site scripting and session impersonation, SQL injection, keyloggers in Python, and exploitation with Metasploit on Kali.",
      },
      {
        code: "Sem VI",
        title: "Project Implementation",
        term: "2018 to 2019",
        grade: "A",
        credits: 1,
        description:
          "Second individual project, chosen from any topic across the six semesters and implemented end to end.",
      },
    ],
  },
];

export const experience: Experience[] = [
  {
    role: "Graduate Teaching Assistant",
    company: "Northeastern University",
    logo: "neu-logo",
    location: "Boston, MA",
    start: "Sep 2025",
    end: "Apr 2026",
    summary:
      "Taught across two graduate courses: Data Management & Database Design, and Prompt Engineering & Generative AI.",
    highlights: [
      "Mentored over 80 graduate students in Oracle SQL, PL/SQL, ER and dimensional modelling, RAG architecture, and prompt engineering patterns.",
      "Evaluated 30+ ER diagrams, 250+ database assignments, and 100+ AI application projects, giving structured feedback that helped students ship production-ready LLM applications.",
    ],
    stack: ["Oracle SQL", "PL/SQL", "Dimensional Modelling", "RAG", "LLMs"],
  },
  {
    role: "Data Engineer",
    company: "Tata Consultancy Services",
    logo: "tcs-logo",
    location: "Mumbai, India",
    start: "May 2021",
    end: "Jul 2024",
    summary:
      "Core banking data platform for State Bank of India on TCS BaNCS, handling over 450 million daily transactions across 28,000 financial centres and peaking near 10,000 transactions per second.",
    highlights: [
      "Optimised Oracle GoldenGate CDC replication and warehouse transformations by refactoring 50+ SQL queries with index tuning, partitioning, and execution-plan analysis, improving query performance by 20% and cutting end-to-end data latency by 12%.",
      "Automated archival of high-volume transaction tables with Bash scripts scheduled through Autosys, referencing archived data via Oracle database links to keep active tables lean without losing history.",
      "Engineered production monitoring across 12 servers using Python and Bash for GoldenGate trail-file parsing, anomaly detection, and alerting on transaction delays and service health, improving operational efficiency by 15%.",
      "Diagnosed a silent replication defect at day boundaries that fell below every existing alert threshold. Traced it through trail files at the timestamp level and built an automated anomaly detection framework so that class of failure surfaces on its own.",
      "Established Git-based CI/CD with automated testing for PL/SQL deployments, reducing release cycles by 30%.",
    ],
    stack: [
      "Oracle",
      "PL/SQL",
      "GoldenGate CDC",
      "Python",
      "Bash",
      "Autosys",
      "Power BI",
    ],
  },
  {
    role: "ML & AI Software Engineer Intern",
    company: "ABCOM Information Systems",
    logo: "abcom-logo",
    location: "Mumbai, India",
    start: "Feb 2021",
    end: "May 2021",
    summary:
      "Automated the repetitive parts of the modelling workflow so experiments could run without constant supervision.",
    highlights: [
      "Built automated machine learning and deep learning workflows for model selection, hyperparameter tuning, and deployment across regression and classification tasks.",
      "Reduced deployment time and shortened experimentation cycles through data pipeline automation.",
    ],
    stack: ["Python", "Machine Learning", "Deep Learning", "Model Deployment"],
  },
];

export const projects: Project[] = [
  {
    slug: "venture-scope",
    title: "Multi-Agentic AI for Startup Intelligence",
    discipline: "AI Systems",
    cardLine: "Four agents, two data stores, one question at a time.",
    blurb:
      "Four specialised agents coordinated by a LangGraph state machine, answering market, competitor, location, and financial questions for early-stage founders.",
    description:
      "Founders make market-entry decisions from fragmented sources: SEC filings, VC quarterly reports, Crunchbase records, state labour law, demographics. This platform stitches them together. A LangGraph state machine coordinates a Market Analyst, Competitor Research, Location Intelligence, and Financial Advisor agent on GPT-4o-mini, with a Model Context Protocol server wrapping the Google Maps Places API for site scoring. Structured Snowflake data and unstructured filings land in a shared Pinecone index, so the same question can hit a vector search or a SQL lookup depending on which fits better.",
    outcome:
      "MCP integration built within two weeks of the protocol's public release",
    stack: [
      "LangGraph",
      "MCP",
      "GPT-4o-mini",
      "Pinecone",
      "Snowflake",
      "Airflow",
      "FastAPI",
      "GCP Cloud Run",
    ],
    repo: "https://github.com/BigDataIA-Spring2025-4/Venture-Scope",
    featured: true,
  },
  {
    slug: "sec-financial-pipeline",
    title: "SEC Financial Data Engineering",
    discipline: "Data Engineering",
    cardLine: "One SEC archive, modelled three ways.",
    blurb:
      "An end-to-end pipeline that turns raw SEC EDGAR filings into queryable dimensional fact tables, and cuts the warehouse bill by 81% along the way.",
    description:
      "Three independent Airflow DAGs handle the RAW, JSON, and dbt transformation paths for 10-Q and 10-K filings across 25 companies and 20 quarters. A dbt layer of 7 models, made up of 4 staging views and 3 fact tables, builds the dimensional model with schema tests and business-rule checks that ran clean across the entire dataset. The results are served through a containerised FastAPI backend and Streamlit UI on Cloud Run.",
    outcome:
      "50M+ financial values, zero data quality failures across 30M+ rows, 81% warehouse cost reduction",
    stack: [
      "Airflow",
      "dbt",
      "Snowflake",
      "AWS S3",
      "FastAPI",
      "Streamlit",
      "Docker",
    ],
    repo: "https://github.com/vedantmane12/US-SEC-Financial-Data-ETL-Pipeline",
    featured: true,
  },
  {
    slug: "imdb-analytics",
    title: "IMDb Entertainment Analytics",
    discipline: "Data Engineering",
    cardLine: "Seven datasets, two of them many-to-many.",
    blurb:
      "The largest dataset I've modelled: the full IMDb corpus streamed through a Medallion architecture into a 12-dimension star schema.",
    description:
      "Delta Live Tables with Auto Loader streams seven core IMDb TSV files into Bronze, PySpark handles null sentinels and array explosion in Silver, and DQX profiles data quality throughout. The dimensional model leans on bridge tables for the genuinely hard many-to-many relationships. The person-profession bridge alone holds more than 21 million associations.",
    outcome: "98M+ records across 24 tables, full pipeline run in 1 min 48 s",
    stack: [
      "Databricks",
      "Delta Live Tables",
      "PySpark",
      "DQX",
      "Star Schema",
      "Tableau",
    ],
    repo:
      "https://github.com/vedantmane12/IMDB-data-analytics-databricks-dqx-tableau",
    featured: true,
  },
  {
    slug: "nvidia-fin-rag",
    title: "NVIDIA Financial Report RAG",
    discipline: "AI Systems",
    cardLine: "An agent that picks its own retrieval path.",
    blurb:
      "A RAG system over five years of NVIDIA filings that treats chunking strategy as an experiment rather than an assumption.",
    description:
      "Three Airflow DAGs automate SEC EDGAR ingestion, S3 storage, and embedding generation. Docling handles modern text-layer PDFs with Mistral OCR as the fallback for scanned older reports, and together they reached 100% extraction. The core of the project is a head-to-head comparison of Markdown sectioning, semantic chunking, and sliding-window chunking.",
    outcome:
      "8,307 vectors over 1,847 pages, with 85 to 92% retrieval relevance across three chunking strategies",
    stack: [
      "RAG",
      "Airflow",
      "Docling",
      "Mistral OCR",
      "OpenAI Embeddings",
      "Pinecone",
      "Streamlit",
    ],
    repo: "https://github.com/BigDataIA-Spring2025-4/NvidiaFinRAG",
    featured: false,
  },
  {
    slug: "lora-peft-finetuning",
    title: "LoRA / PEFT Fine-Tuning",
    discipline: "Machine Learning",
    cardLine: "Adapting a 345M model on a free GPU.",
    blurb:
      "Adapting a 345M-parameter conversational model for mental-health Q&A on modest hardware, with a safety layer that isn't an afterthought.",
    description:
      "LoRA freezes the base weights and trains low-rank adapters on the query and value projections at rank 8, alpha 16. Combined with 8-bit quantisation and mixed-precision training, that brought GPU memory down by 90% and training to 20 minutes. An inference wrapper adds crisis keyword detection, helpline routing, and response filtering, all of which are non-negotiable in this domain.",
    outcome:
      "9.2M trainable parameters (2.67% of the model), 90% less GPU memory, 20-minute training",
    stack: [
      "PyTorch",
      "Hugging Face",
      "PEFT",
      "LoRA",
      "8-bit Quantisation",
      "Responsible AI",
    ],
    repo: "https://github.com/vedantmane12/LLM-FineTuning",
    featured: false,
  },
  {
    slug: "la-crime-analytics",
    title: "LA Crime Analytics Platform",
    discipline: "Data Engineering",
    cardLine: "A million incidents, none of them dropped.",
    blurb:
      "Streaming LAPD incident data through Delta Live Tables, with Unity Catalog governing metadata and lineage end to end.",
    description:
      "Auto Loader streams incidents into a Medallion architecture, with a DLT expectations framework enforcing validation in Silver. The star schema uses 8 dimensions and a bridge table to handle the multiple crime codes a single incident can carry.",
    outcome:
      "1M+ incidents from 2020 to 2025, 100% data retention, pipeline run in 1 min 48 s",
    stack: [
      "Databricks",
      "Delta Live Tables",
      "Auto Loader",
      "Unity Catalog",
      "PySpark",
      "Tableau",
    ],
    repo:
      "https://github.com/vedantmane12/los-angeles-crime-analytics-databricks",
    featured: false,
  },
  {
    slug: "food-inspections",
    title: "Food Inspections Data Engineering",
    discipline: "Data Engineering",
    cardLine: "Two cities that agree on nothing, reconciled.",
    blurb:
      "Two cities publishing the same data in incompatible shapes, harmonised into one dimensional warehouse.",
    description:
      "Chicago buries violations in pipe-delimited free text; Dallas spreads them across roughly 100 wide columns. RegEx parsing handled the first, Alteryx Transpose and Crosstab the second. The result is a star schema with 7 dimensions, a fact table, and a bridge table, with SCD Type 2 tracking historical change in the restaurant dimension.",
    outcome: "450K records unified, 97.8% field completeness on validated records",
    stack: [
      "Databricks",
      "Delta Live Tables",
      "PySpark",
      "Alteryx",
      "SCD Type 2",
      "Tableau",
    ],
    repo:
      "https://github.com/vedantmane12/food-inspections-data-engineering-analysis",
    featured: false,
  },
  {
    slug: "chinook-azure-snowflake",
    title: "Chinook: Azure SQL to Snowflake Warehouse",
    discipline: "Data Engineering",
    cardLine: "Eleven tables, one Copy activity, no hardcoded names.",
    blurb:
      "An Azure Data Factory warehouse load where table names live in parameters rather than in pipelines, so eleven source tables move through a single Copy activity into a Snowflake star schema.",
    description:
      "Digital media store data moves from Azure SQL through Parquet in Blob Storage into a Snowflake star schema, with every schema, table, and file path supplied at runtime. Three parameterised datasets carry every read and write across nine pipelines and seven data flows. Six dimensions load through six instances of one pattern: left join the target, generate a surrogate key, then split the stream into updates and inserts. Neither database password appears in the factory definition, as both resolve from Azure Key Vault through the factory's managed identity.",
    outcome:
      "24 Data Factory resources loading 8 dimensions and a sales fact table",
    stack: [
      "Azure Data Factory",
      "Snowflake",
      "Azure SQL",
      "Parquet",
      "Dimensional Modelling",
      "Azure Key Vault",
    ],
    repo:
      "https://github.com/vedantmane12/chinook_movie_data_AzureSQL_to_Snowflake_Data_PL",
    featured: false,
  },
  {
    slug: "seattle-pet-license",
    title: "Seattle Pet Licenses: CSV to Snowflake",
    discipline: "Data Engineering",
    cardLine: "No row dropped for failing to match.",
    blurb:
      "One Data Factory pipeline that joins Seattle's pet licence register to ZIP code reference data and loads a star schema where an unmatched lookup produces a sentinel key rather than a missing row.",
    description:
      "Public data does not join cleanly, so the fact load is built to survive that. Every dimension lookup is a left join wrapped in COALESCE, and breed matching is null-safe, so a licence with an unparseable date or an unlisted breed still lands and carries a key that says which lookup failed. Column names are normalised at ingestion, before an apostrophe or a space can reach a SQL identifier. Six activities chain on success inside a single pipeline, with all thirteen paths, schemas, and table names exposed as parameters.",
    outcome:
      "6 chained activities, 3 sentinel-key lookups, one re-runnable fact load",
    stack: [
      "Azure Data Factory",
      "Snowflake",
      "Parquet",
      "Dimensional Modelling",
      "Data Quality",
      "Azure Key Vault",
    ],
    repo:
      "https://github.com/vedantmane12/Seattle-Pet-License_ETL-using-ADF-Snowflake",
    featured: false,
  },
  {
    slug: "web-pdf-extraction",
    title: "Web & PDF Extraction Tool",
    discipline: "Data Engineering",
    cardLine: "Six extraction paths, one output format.",
    blurb:
      "A FastAPI service that runs the same URL or PDF through open source, enterprise, and document AI extractors, so the tools can be compared on your input rather than on their own demos.",
    description:
      "Two input types across three classes of extractor gives six endpoints, every one of them returning markdown so the outputs can be diffed instead of merely described. PyMuPDF rebuilds structure by hand and infers headings from font size. Docling runs layout and table models with OCR and embeds images at double scale. Azure Document Intelligence adds handwriting detection and table geometry through selectable read and layout models, and Diffbot classifies a page before extracting it. Each run lands in S3 under a prefix keyed by input type, tool, and timestamp, so two tools can be compared on the same document.",
    outcome:
      "6 extraction endpoints across 3 tool classes, normalised to one format",
    stack: [
      "FastAPI",
      "Streamlit",
      "Docling",
      "PyMuPDF",
      "Azure Document Intelligence",
      "AWS S3",
    ],
    repo: "https://github.com/vedantmane12/Web-and-PDF-Data-Extraction-Tool",
    featured: false,
  },
  {
    slug: "orchestrate-event-db",
    title: "Orchestrate: Event Management Database",
    discipline: "Databases",
    cardLine: "Business rules an application tier cannot bypass.",
    blurb:
      "An event platform built entirely inside Oracle, with access control and business rules enforced by the database rather than an application tier.",
    description:
      "Event scheduling, registration, venue booking, payments, and sponsorship modelled across 11 normalised tables under 60 constraints. Access is enforced at the database level, with six roles from EVENT_ADMIN down to EVENT_VIEWER each granted only the procedures and views its job requires. Logic sits in PL/SQL rather than an application tier: functions check seat availability and validate contact details, procedures handle event creation, registration changes, and sponsorship, and a trigger assigns user type on insert.",
    outcome:
      "11 tables, 6 database roles, 13 stored procedures, 7 views, and 5 analytical reports",
    stack: [
      "Oracle",
      "PL/SQL",
      "Data Modelling",
      "Normalisation",
      "RBAC",
      "Stored Procedures",
    ],
    // Team project, so the repo lives under a teammate's account.
    repo: "https://github.com/adityaamitra/DMDD_Project",
    featured: false,
  },
  {
    slug: "fred-economic-data",
    title: "FRED Economic Data Pipeline",
    discipline: "Data Engineering",
    cardLine: "Ten years of yields, each loaded exactly once.",
    blurb:
      "A full incremental pipeline running entirely inside Snowflake, with no Airflow and no external orchestrator.",
    description:
      "Built to test whether Snowflake-native tooling can carry a real pipeline on its own. A Snowflake Tasks DAG drives RAW to HARMONIZED to ANALYTICS, Streams provide native CDC, and MERGE via stored procedures means daily runs touch only the delta. UDFs compute yield spread for recession-indicator analysis, detecting when the 2-year yield crosses above the 10-year.",
    outcome: "10 years of Treasury yield data, processed incrementally",
    stack: [
      "Snowflake Tasks",
      "Snowpark",
      "Snowflake Streams",
      "GitHub Actions",
      "AWS S3",
      "Streamlit",
    ],
    repo: "https://github.com/vedantmane12/FRED-Economic-Data-Analysis",
    featured: false,
  },
  {
    slug: "academic-research-assistant",
    title: "Academic Research Assistant",
    discipline: "AI Systems",
    cardLine: "Four agents that judge their own sources.",
    blurb:
      "A CrewAI crew that turns a research question into a structured report with credibility scoring and formatted citations.",
    description:
      "Four agents run a sequential workflow of plan, gather, analyse, and synthesise, sharing a memory system that persists context across stages. A custom Academic Source Analyzer tool handles credibility scoring, bias detection, and citation generation in APA, MLA, Chicago, and BibTeX.",
    outcome: "Four-agent sequential crew with shared-memory context persistence",
    stack: ["CrewAI", "SerperDev", "FastAPI", "Streamlit", "Multi-Agent Systems"],
    repo: "https://github.com/vedantmane12/agentic-systems",
    featured: false,
  },
];

export const techStackIntro =
  "I build with enterprise-grade data engineering tools and current AI frameworks. The stack spans cloud platforms, distributed processing, dimensional warehousing, machine learning, and business intelligence, all chosen for performance, scale, and getting things into production.";

export const techStack: Tech[] = [
  {
    name: "Python",
    slug: "python",
    description:
      "Primary language across ETL pipelines, ML workflows, and production automation, including log parsing and anomaly detection over 12 banking servers.",
  },
  {
    name: "SQL",
    slug: "sql",
    description:
      "Refactored 50+ production queries with index tuning, partitioning, and execution-plan analysis for a 20% performance gain.",
  },
  {
    name: "PL/SQL",
    slug: "plsql",
    description:
      "Stored procedures and packages on Oracle core banking, deployed through Git-based CI/CD with automated testing gates.",
  },
  {
    name: "Oracle",
    slug: "oracle",
    description:
      "Enterprise OLTP platform processing over 450 million daily transactions, with GoldenGate CDC replication to disaster-recovery sites.",
  },
  {
    name: "Snowflake",
    slug: "snowflake",
    description:
      "Warehousing with star schemas and SCD Type 2, plus native Tasks, Streams, and Snowpark for orchestration without Airflow.",
  },
  {
    name: "Databricks",
    slug: "databricks",
    description:
      "Delta Live Tables and Medallion architecture processing 98M+ records, with Unity Catalog for governance and lineage.",
  },
  {
    name: "Apache Spark",
    slug: "spark",
    description:
      "PySpark transformations across Bronze, Silver, and Gold layers, covering null sentinel handling, array explosion, and deduplication at scale.",
  },
  {
    name: "Apache Airflow",
    slug: "airflow",
    description:
      "DAG orchestration with parallel task execution and retry logic; three independent DAGs drive the SEC filing pipeline.",
  },
  {
    name: "dbt",
    slug: "dbt",
    description:
      "Staging views and dimensional fact tables with schema tests and business-rule checks that ran clean across 30M+ rows.",
  },
  {
    name: "PostgreSQL",
    slug: "postgresql",
    description:
      "Relational modelling with ACID guarantees, complex queries, and indexing strategy for reliability.",
  },
  {
    name: "AWS",
    slug: "aws",
    description:
      "S3 data lakes and EC2 compute backing the ingestion layer of most pipelines in this portfolio.",
  },
  {
    name: "GCP",
    slug: "gcp",
    description:
      "Cloud Run for containerised FastAPI deployments, with GitHub Actions handling build and release.",
  },
  {
    name: "Azure",
    slug: "azure",
    description:
      "Data Factory orchestration, Azure SQL warehousing, and Blob Storage for end-to-end data solutions.",
  },
  {
    name: "Docker",
    slug: "docker",
    description:
      "Containerised pipelines and model services so local, staging, and production behave the same way.",
  },
  {
    name: "Kubernetes",
    slug: "kubernetes",
    description:
      "Container orchestration for scaling deployed services and scheduling workloads.",
  },
  {
    name: "Git",
    slug: "git",
    description:
      "Branching strategy, code review, and release discipline that cut deployment cycles by 30% at TCS.",
  },
  {
    name: "GitHub Actions",
    slug: "githubactions",
    description:
      "CI/CD for testing and deployment, plus scheduled jobs such as the daily FRED API scrape into S3.",
  },
  {
    name: "PyTorch",
    slug: "pytorch",
    description:
      "Deep learning and LLM fine-tuning with LoRA and PEFT, reaching 97.33% fewer trainable parameters and 90% less GPU memory.",
  },
  {
    name: "TensorFlow",
    slug: "tensorflow",
    description:
      "Neural network training and classification models with automated experimentation workflows.",
  },
  {
    name: "Hugging Face",
    slug: "huggingface",
    description:
      "Transformers and the PEFT library for parameter-efficient fine-tuning and model deployment.",
  },
  {
    name: "scikit-learn",
    slug: "scikitlearn",
    description:
      "Classical modelling, feature engineering, and evaluation for regression and classification tasks.",
  },
  {
    name: "LangChain",
    slug: "langchain",
    description:
      "RAG architectures, agent tooling, memory systems, and prompt engineering for LLM applications.",
  },
  {
    name: "LangGraph",
    slug: "langgraph",
    description:
      "State machines coordinating four specialised agents through complex multi-step decision workflows.",
  },
  {
    name: "CrewAI",
    slug: "crewai",
    description:
      "Sequential agent crews with shared memory for research planning, analysis, and synthesis.",
  },
  {
    name: "Pinecone",
    slug: "pinecone",
    description:
      "Vector search unifying structured and unstructured sources, holding 8,307 vectors across 1,847 pages of filings.",
  },
  {
    name: "ChromaDB",
    slug: "chromadb",
    description:
      "Embedded vector store for local RAG prototyping with metadata filtering and persistent collections.",
  },
  {
    name: "Tableau",
    slug: "tableau",
    description:
      "Interactive dashboards over 9 million titles across 230 regions, plus geographic hotspot and trend analysis.",
  },
  {
    name: "Power BI",
    slug: "powerbi",
    description:
      "Enterprise dashboards across OLTP, replication, and warehouse layers; incremental refresh cut load time by 40%.",
  },
  {
    name: "FastAPI",
    slug: "fastapi",
    description:
      "Containerised Python backends serving agent systems and analytics platforms in production.",
  },
  {
    name: "Streamlit",
    slug: "streamlit",
    description:
      "Fast analytical front ends for natural-language querying and pipeline monitoring.",
  },
];

/** Options in the contact form's "What's this about?" dropdown. */
export const contactReasons = [
  "Full-time opportunity",
  "Contract or freelance work",
  "Research collaboration",
  "Just saying hello",
] as const;

/**
 * Section anchors. Drives the nav, the scroll-spy, and the sitemap.
 * Order here must match the render order in app/page.tsx, otherwise the
 * scroll-spy highlight jumps around as you scroll.
 */
export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Coursera and other credentials, grouped the way the certificates themselves
 * are: a programme certificate at the top with the individual course
 * certificates that make it up nested inside.
 *
 * Every entry carries its own verification URL, taken from the certificate PDF,
 * so each claim on the page can be checked at source. Course codes resolve at
 * coursera.org/verify/<code>, programmes at /verify/specialization/<code> or
 * /verify/professional-cert/<code>.
 *
 * `alsoAwarded` holds the interim specialization certificates issued for
 * subsets of the same courses. They are real, separately verifiable
 * certificates, but listing them as peers of the parent programme would count
 * the same coursework two and three times over.
 */
export type Certificate = {
  title: string;
  issued: string;
  verify: string;
  /** Coursera marks a small number of course certificates "with honors". */
  honors?: boolean;
};

export type Specialization = {
  name: string;
  issuer: string;
  platform: string;
  issued: string;
  verify: string;
  /** One line on what the programme actually covered. */
  summary: string;
  courses: Certificate[];
  alsoAwarded?: { name: string; issued: string; verify: string }[];
};

export const specializations: Specialization[] = [
  {
    name: "Data Science",
    issuer: "Johns Hopkins University",
    platform: "Coursera",
    issued: "Jul 2020",
    verify: "https://coursera.org/verify/specialization/BFP8N4PVX6K5",
    summary:
      "Ten courses across the full analysis pipeline in R, from cleaning and exploration through inference and regression to machine learning and a capstone.",
    courses: [
      { title: "The Data Scientist's Toolbox", issued: "May 2020", verify: "https://coursera.org/verify/SCK2UVSLHCU3" },
      { title: "R Programming", issued: "May 2020", verify: "https://coursera.org/verify/DZ9LXECHQ7UB" },
      { title: "Getting and Cleaning Data", issued: "May 2020", verify: "https://coursera.org/verify/G5V4HGKTLS4X" },
      { title: "Exploratory Data Analysis", issued: "Jun 2020", verify: "https://coursera.org/verify/D3DZCGUJGRN9" },
      { title: "Reproducible Research", issued: "Jun 2020", verify: "https://coursera.org/verify/6SL4YGG665SK" },
      { title: "Statistical Inference", issued: "Jun 2020", verify: "https://coursera.org/verify/UFH68SAWG9FX" },
      { title: "Regression Models", issued: "Jun 2020", verify: "https://coursera.org/verify/GRN3RDK7ECKU" },
      { title: "Practical Machine Learning", issued: "Jul 2020", verify: "https://coursera.org/verify/REM5GW93QX5C" },
      { title: "Developing Data Products", issued: "Jul 2020", verify: "https://coursera.org/verify/642565CXNQAB" },
      { title: "Data Science Capstone", issued: "Jul 2020", verify: "https://coursera.org/verify/QTBT2T4EV4HR" },
    ],
    alsoAwarded: [
      { name: "Data Science: Foundations using R", issued: "Jun 2020", verify: "https://coursera.org/verify/specialization/ETHA35TYRC7R" },
      { name: "Data Science: Statistics and Machine Learning", issued: "Jul 2020", verify: "https://coursera.org/verify/specialization/V5J6ZZ7F5FVJ" },
    ],
  },
  {
    name: "IBM Data Science Professional Certificate",
    issuer: "IBM",
    platform: "Coursera",
    issued: "Oct 2020",
    verify: "https://coursera.org/verify/professional-cert/G4QZ9B766WE8",
    summary:
      "Nine courses on the Python side of the same ground: methodology, SQL and relational databases, analysis and visualisation, then machine learning and an applied capstone.",
    courses: [
      { title: "What is Data Science?", issued: "Aug 2020", verify: "https://coursera.org/verify/TN8R937QAGFG" },
      { title: "Tools for Data Science", issued: "Aug 2020", verify: "https://coursera.org/verify/4SPE8F4Q8QSW" },
      { title: "Data Science Methodology", issued: "Aug 2020", verify: "https://coursera.org/verify/7U4RNCPJFK97" },
      { title: "Python for Data Science and AI", issued: "Aug 2020", verify: "https://coursera.org/verify/Z6B5SAGDK8ZV" },
      { title: "Databases and SQL for Data Science", issued: "Sep 2020", verify: "https://coursera.org/verify/NYYD7SVPP9AD" },
      { title: "Data Analysis with Python", issued: "Sep 2020", verify: "https://coursera.org/verify/NPTA8PYPBWZE" },
      { title: "Data Visualization with Python", issued: "Sep 2020", verify: "https://coursera.org/verify/VN4ZGJNFQA9U" },
      { title: "Machine Learning with Python", issued: "Oct 2020", verify: "https://coursera.org/verify/7NB3Q2Y2XCSH" },
      { title: "Applied Data Science Capstone", issued: "Oct 2020", verify: "https://coursera.org/verify/T6SFMQ66GWC8" },
    ],
    alsoAwarded: [
      { name: "Introduction to Data Science", issued: "Sep 2020", verify: "https://coursera.org/verify/specialization/GN4KBK6W3XU2" },
      { name: "Applied Data Science", issued: "Oct 2020", verify: "https://coursera.org/verify/specialization/ZJF3X94AZB4T" },
      { name: "Credly badge", issued: "Oct 2020", verify: "https://www.youracclaim.com/go/ngTMgC8V" },
    ],
  },
  {
    name: "Python for Everybody",
    issuer: "University of Michigan",
    platform: "Coursera",
    issued: "Jul 2020",
    verify: "https://coursera.org/verify/specialization/ZK2STR99S3S5",
    summary:
      "Five courses on Python itself rather than on analysis: data structures, consuming web APIs, working against databases, and a capstone that ties them together.",
    courses: [
      { title: "Programming for Everybody (Getting Started with Python)", issued: "Jul 2020", verify: "https://coursera.org/verify/SJQDUUXT5PDE" },
      { title: "Python Data Structures", issued: "Jul 2020", verify: "https://coursera.org/verify/B6NG6Y8JUV99" },
      { title: "Using Python to Access Web Data", issued: "Jul 2020", verify: "https://coursera.org/verify/9GU7MW7TWR2L" },
      { title: "Capstone: Retrieving, Processing, and Visualizing Data with Python", issued: "Jul 2020", verify: "https://coursera.org/verify/E9YK7HQDCXEL", honors: true },
      { title: "Using Databases with Python", issued: "Jul 2020", verify: "https://coursera.org/verify/A6LXHL8Q6VFD" },
    ],
  },
];

/**
 * Credentials that stand on their own rather than sitting inside a programme.
 *
 * Carries the same fields as a specialization so both render as the same card.
 * The absence of a course list is the thing that distinguishes them: a card you
 * can expand contains courses, a card you cannot expand is one.
 */
export type StandaloneCertificate = Certificate & {
  issuer: string;
  platform: string;
  summary: string;
};

export const standaloneCertificates: StandaloneCertificate[] = [
  {
    title: "AI For Everyone",
    issuer: "DeepLearning.AI",
    platform: "Coursera",
    issued: "Jul 2020",
    summary:
      "Andrew Ng's non-technical course on what machine learning can and cannot do, and what it takes for a project to land inside an organisation.",
    verify: "https://coursera.org/verify/77BZS7E492P3",
  },
  {
    title: "Getting Started with AWS Machine Learning",
    issuer: "Amazon Web Services",
    platform: "Coursera",
    issued: "Aug 2021",
    summary:
      "Amazon's introduction to machine learning on AWS: the managed services on offer, and which problem each of them is meant for.",
    verify: "https://coursera.org/verify/32TNK769QBPP",
  },
  {
    title: "How to use ChatGPT and Generative AI to help create content",
    issuer: "Udemy",
    platform: "Udemy",
    issued: "Jul 2023",
    summary:
      "A short practical course on prompting generative models for content work, taken shortly after the tools became widely available.",
    verify: "https://ude.my/UC-1ab41fc6-9d89-4785-aba1-1de837ab492e",
  },
];
