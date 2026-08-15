import { projects } from "@/content/site";

/**
 * Deep-dive content for the project pages, one entry per project slug.
 *
 * Written from the cloned repositories rather than their READMEs. Several
 * READMEs undersell or misdescribe what is actually in the code, so where the
 * two disagree the code wins. Specifics here (endpoint names, DAG schedules,
 * LoRA ranks, dimension names, object counts) were read out of the source.
 *
 * House rules, same as `site.ts`:
 *   1. Every claim traces to the repository. Where a repository is thin, the
 *      page says less rather than inventing more.
 *   2. No em dashes in visitor-facing copy.
 *   3. Describe what was built and why, not how an assignment was structured.
 *
 * Diagram node labels use "\n" for explicit line breaks: the renderer draws on
 * a fixed grid and cannot reflow text.
 */

export type DiagramNode = {
  id: string;
  /** Up to two lines. Use "\n" to break. */
  label: string;
  /** Lane index, left to right. */
  col: number;
  /** Position within the lane, top to bottom. */
  row: number;
  kind?: "source" | "process" | "store" | "model" | "serve";
  /** Small monospace line under the label, for a technology or a count. */
  note?: string;
};

export type DiagramEdge = { from: string; to: string };

export type ProjectDiagram = {
  caption: string;
  lanes: string[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

export type ProjectDetail = {
  /** What the project is for, in plain terms. */
  problem: string;
  /** How it works, in order. */
  stages: { name: string; detail: string }[];
  /** Choices worth defending, and the reasoning behind them. */
  decisions: { title: string; detail: string }[];
  /** Measured figures, taken from the repository. */
  results: { metric: string; label: string }[];
  diagram: ProjectDiagram;
  /** Anything running or readable beyond the repository itself. */
  links?: { label: string; href: string }[];
  /** Shown as a caveat when the repository documents less than the rest. */
  sourceNote?: string;
};

export const projectDetails: Record<string, ProjectDetail> = {
  "venture-scope": {
    problem:
      "A founder deciding whether and where to start a business has to reconcile sources that do not talk to each other: company registries, VC funding reports, public financials, small business regulation, and whatever is physically on the street at a candidate location. Venture Scope collects those on a schedule and puts four separate reasoning agents in front of them, so a question about a market, a competitor, a site, or a strategy is answered from whichever source actually holds the answer.",
    stages: [
      {
        name: "Collect on a schedule",
        detail:
          "Five Airflow DAGs feed the system. Two run quarterly on a cron of 0 0 1 1,4,7,10, loading US market analysis and real estate data into Snowflake. The others run once to build the corpus: NVCA venture funding records scraped state by state, the SBA business structure guide collected through Selenium, and expert chatbot personality sources parsed from PDF.",
      },
      {
        name: "Turn documents into text",
        detail:
          "VC reports and guides arrive as PDFs, so a dedicated OCR path converts them with Mistral OCR, rewrites embedded image references, and stitches the pages into a single markdown document per source. Only then is the text chunked and embedded, which keeps the retrieval layer working on prose rather than on PDF artefacts.",
      },
      {
        name: "Build the two stores",
        detail:
          "Company data is enriched with yfinance metrics and written to Snowflake, giving exact answers for numeric questions. The OCR'd documents are semantically chunked, embedded, and upserted into Pinecone. Both stores stay live, because a question about revenue and a question about strategy are not the same kind of lookup.",
      },
      {
        name: "Four agents, one pattern",
        detail:
          "Rather than one large agent, there are four: market analysis, question and answer, strategic summary, and expert chat. Each is its own LangGraph graph with its own typed state (AgentState, ChatbotState, SummaryAgentState) and each runs the same loop: an oracle node decides what to do, a router dispatches to a tool, the tool result returns to the oracle, and the loop repeats until the agent emits its final answer.",
      },
      {
        name: "Serve",
        detail:
          "FastAPI exposes five POST endpoints, one per capability, plus a health check. The backend also classifies the user's industry before dispatching and converts agent output to markdown for display. Streamlit renders the results, including an interactive location map. Fifteen backend unit tests plus an integration suite cover the endpoints and their failure paths.",
      },
    ],
    decisions: [
      {
        title: "Four small graphs instead of one large one",
        detail:
          "Every agent implements the same oracle, router, and tool-runner loop, but each has its own state type and its own tool set. Market analysis can reach the warehouse and the web; question answering can reach the vector index; expert chat is deliberately restricted to a strict domain web search. Keeping them separate means one capability cannot degrade another, and a weak answer is traceable to a single graph.",
      },
      {
        title: "Model Context Protocol for the maps integration",
        detail:
          "Location scoring needs live place data, which normally means writing and maintaining a bespoke Google Maps client. Wrapping it as an MCP server made it a tool the agent calls through a standard interface, so the location agent holds no knowledge of the Maps API. This was built within two weeks of the protocol's public release.",
      },
      {
        title: "OCR as its own pipeline stage",
        detail:
          "Embedding a PDF directly produces chunks full of layout noise, and retrieval quality never recovers from it. Running Mistral OCR first, then repairing image references and combining pages into one markdown file, means the chunker sees clean prose. The cost is an extra stage; the benefit is that retrieval is working on the document rather than on its formatting.",
      },
    ],
    results: [
      { metric: "4", label: "Independent LangGraph agents" },
      { metric: "5", label: "Airflow DAGs, two on a quarterly cron" },
      { metric: "5", label: "FastAPI endpoints, one per capability" },
      { metric: "2 weeks", label: "From MCP release to working integration" },
    ],
    diagram: {
      caption:
        "Structured and unstructured data are kept in separate stores through ingestion and rejoined only at the agent layer, where four independent graphs each choose the store that suits their question.",
      lanes: ["Sources", "Ingest", "Stores", "Agents", "Interface"],
      nodes: [
        { id: "market", label: "Market and\nreal estate", col: 0, row: 0, kind: "source", note: "quarterly" },
        { id: "nvca", label: "NVCA funding\nreports", col: 0, row: 1, kind: "source", note: "pdf" },
        { id: "sba", label: "SBA guide", col: 0, row: 2, kind: "source", note: "selenium" },
        { id: "dags", label: "Airflow DAGs", col: 1, row: 0, kind: "process", note: "5 dags" },
        { id: "ocr", label: "Mistral OCR\nto markdown", col: 1, row: 1, kind: "process", note: "combined" },
        { id: "sf", label: "Snowflake", col: 2, row: 0, kind: "store", note: "yfinance joined" },
        { id: "pc", label: "Pinecone", col: 2, row: 1, kind: "store", note: "semantic chunks" },
        { id: "mkt", label: "Market\nanalysis", col: 3, row: 0, kind: "model", note: "agentstate" },
        { id: "qa", label: "Q and A", col: 3, row: 1, kind: "model", note: "chatbotstate" },
        { id: "sum", label: "Summary", col: 3, row: 2, kind: "model", note: "recommends" },
        { id: "mcp", label: "Location via\nMCP maps", col: 3, row: 3, kind: "model", note: "mcp server" },
        { id: "api", label: "FastAPI", col: 4, row: 0, kind: "serve", note: "5 endpoints" },
        { id: "ui", label: "Streamlit", col: 4, row: 1, kind: "serve", note: "map + plotly" },
      ],
      edges: [
        { from: "market", to: "dags" },
        { from: "nvca", to: "ocr" },
        { from: "sba", to: "ocr" },
        { from: "dags", to: "sf" },
        { from: "ocr", to: "pc" },
        { from: "sf", to: "mkt" },
        { from: "pc", to: "qa" },
        { from: "pc", to: "sum" },
        { from: "mkt", to: "api" },
        { from: "qa", to: "api" },
        { from: "mcp", to: "api" },
        { from: "api", to: "ui" },
      ],
    },
    links: [
      { label: "Live app", href: "https://venture-scope.streamlit.app/" },
      {
        label: "API",
        href: "https://venture-scope-969760129380.us-central1.run.app",
      },
    ],
  },

  "sec-financial-pipeline": {
    problem:
      "The SEC publishes its financial statement data sets as quarterly zip archives of loosely related text files. Getting from that to a question you can answer means deciding how the data should be shaped, and different questions want different shapes. Rather than pick one, this pipeline builds three representations of the same source and lets the person querying choose.",
    stages: [
      {
        name: "Scrape and stage",
        detail:
          "The scraper pulls the quarterly archives and extracts them in memory rather than to disk, then stages the contents in S3 through a shared S3FileManager. The untouched archive stays in object storage so any later modelling decision can be replayed without going back to the SEC.",
      },
      {
        name: "Convert",
        detail:
          "Transformers convert the staged files to CSV and to Parquet, with a ticker file joined in. Parquet exists because the fact-table path scans columns rather than rows, and a columnar format is what makes that scan affordable.",
      },
      {
        name: "Three parallel pipelines",
        detail:
          "Three separate Airflow DAGs load the same source three ways: sec_raw_data_to_snowflake keeps the source shape, sec_json_data_to_snowflake stores it as semi-structured JSON for flexible querying, and sec_fact_data_to_snowflake builds dimensional fact tables. The fact pipeline runs daily.",
      },
      {
        name: "Model and test",
        detail:
          "dbt builds the modelled layer over the loaded tables, with tests attached to the models so a bad load fails the build rather than quietly producing wrong numbers downstream.",
      },
      {
        name: "Serve",
        detail:
          "FastAPI exposes two endpoints, one to check whether a year and quarter are available and one to query. The Streamlit front end populates the schema, generates the availability check, and runs the query, so a user picks a period and a representation rather than writing SQL against an unfamiliar model.",
      },
    ],
    decisions: [
      {
        title: "Three representations rather than one",
        detail:
          "Raw, JSON, and fact tables answer different questions well: raw for fidelity to the source, JSON for fields whose shape varies, dimensional for aggregate analysis. Building all three from the same staged archive costs three pipelines but removes the need to guess which shape a future question will want.",
      },
      {
        title: "Extract in memory, keep the archive",
        detail:
          "The scraper unzips to bytes rather than to local disk, which keeps the task stateless and safe to retry. The extracted archive then lives in S3 rather than only inside the warehouse, so a modelling mistake costs a rebuild rather than a re-crawl.",
      },
      {
        title: "Availability check as its own endpoint",
        detail:
          "Querying a period that was never loaded is the most likely user error, and it surfaces as an empty result that looks like a real answer. A dedicated check-availability endpoint makes the difference between no data and no rows explicit before the query runs.",
      },
    ],
    results: [
      { metric: "50M+", label: "Financial values extracted" },
      { metric: "3", label: "Parallel pipelines: raw, JSON, and fact" },
      { metric: "0", label: "Data quality failures across 30M+ rows" },
      { metric: "81%", label: "Reduction in warehouse cost" },
    ],
    diagram: {
      caption:
        "One staged archive, three load paths. Raw, JSON, and dimensional representations are built in parallel so the query decides the shape rather than the pipeline.",
      lanes: ["Source", "Stage", "Convert", "Load", "Serve"],
      nodes: [
        { id: "sec", label: "SEC statement\ndata sets", col: 0, row: 0, kind: "source", note: "quarterly zip" },
        { id: "s3", label: "S3 archive", col: 1, row: 0, kind: "store", note: "unzipped to bytes" },
        { id: "csv", label: "CSV", col: 2, row: 0, kind: "process", note: "transformer" },
        { id: "pq", label: "Parquet", col: 2, row: 1, kind: "process", note: "columnar" },
        { id: "raw", label: "Raw DAG", col: 3, row: 0, kind: "store", note: "source shape" },
        { id: "json", label: "JSON DAG", col: 3, row: 1, kind: "store", note: "semi-structured" },
        { id: "fact", label: "Fact DAG\nplus dbt", col: 3, row: 2, kind: "store", note: "daily" },
        { id: "api", label: "FastAPI", col: 4, row: 0, kind: "serve", note: "2 endpoints" },
        { id: "ui", label: "Streamlit", col: 4, row: 1, kind: "serve", note: "query builder" },
      ],
      edges: [
        { from: "sec", to: "s3" },
        { from: "s3", to: "csv" },
        { from: "s3", to: "pq" },
        { from: "csv", to: "raw" },
        { from: "csv", to: "json" },
        { from: "pq", to: "fact" },
        { from: "raw", to: "api" },
        { from: "fact", to: "api" },
        { from: "api", to: "ui" },
      ],
    },
    links: [
      {
        label: "API docs",
        href: "https://fastapi-service-7ss2sa6dka-uc.a.run.app/docs",
      },
    ],
  },

  "imdb-analytics": {
    problem:
      "IMDb publishes seven separate datasets with no enforced relationships between them, and two of those relationships are many-to-many: a title has many crew members, and a person works on many titles. Querying that directly means re-deriving the joins every time and getting the grain wrong at least once. This project models all seven into a warehouse where the joins are already made and checked.",
    stages: [
      {
        name: "Profile with quality rules",
        detail:
          "Before any modelling, both profiling notebooks run Databricks DQX over the seven source files, using DQEngine to apply checks rather than eyeballing the data. That establishes types, null rates, and cardinality, which is what determines whether a column can serve as a key.",
      },
      {
        name: "Load each source on its own",
        detail:
          "There is one load notebook per source: title.basics, title.akas, title.crew, title.episode, title.principals, title.ratings, and name.basics, plus small loaders for language and region. Each produces its own silver table, so a change to how one source is cleaned cannot disturb the other six.",
      },
      {
        name: "Build dimensions",
        detail:
          "Delta Live Tables build the dimensional layer from silver: dim_title from title.basics and title.episode, dim_person from name.basics, and dim_language and dim_region from the localisation data.",
      },
      {
        name: "Resolve the many-to-many",
        detail:
          "title.crew and title.principals are the two relationships that cannot live in a fact or a dimension, so they become bridge tables between dim_title and dim_person. That keeps the fact grain honest: a rating row stays one row per title rather than being multiplied by its crew.",
      },
      {
        name: "Facts and dashboards",
        detail:
          "Fact tables are built from title.ratings and title.akas against the dimensions, and Tableau reads the result. A column-level mapping workbook and a saved data model file record the lineage alongside the code.",
      },
    ],
    decisions: [
      {
        title: "Bridge tables rather than a wider fact",
        detail:
          "Folding crew and principals into the fact would multiply every rating row by the number of people attached to the title, and every average taken afterwards would be silently wrong. Bridge tables keep the many-to-many where it belongs and leave the fact at one row per title.",
      },
      {
        title: "One notebook per source table",
        detail:
          "Twelve small load notebooks are more files than one large one, but each source has its own quirks and its own failure mode. Splitting them means a schema change in title.akas is a change to one notebook rather than a change to the pipeline.",
      },
      {
        title: "DQX in profiling, not after loading",
        detail:
          "Running quality checks during profiling means the cleaning rules are written against measured reality rather than against the documentation's description of it. Key selection follows the observed cardinality.",
      },
    ],
    results: [
      { metric: "98M+", label: "Records modelled" },
      { metric: "24", label: "Tables in the dimensional model" },
      { metric: "7", label: "Source datasets, one loader each" },
      { metric: "1m 48s", label: "Full pipeline run" },
    ],
    diagram: {
      caption:
        "Seven sources become seven silver tables, then dimensions. The two many-to-many relationships are resolved into bridge tables so the fact grain stays one row per title.",
      lanes: ["Source", "Profile", "Silver", "Gold", "Serve"],
      nodes: [
        { id: "titles", label: "title.basics\n.akas .ratings", col: 0, row: 0, kind: "source", note: "imdb" },
        { id: "people", label: "name.basics\n.crew .principals", col: 0, row: 1, kind: "source", note: "imdb" },
        { id: "dqx", label: "DQX profiling", col: 1, row: 0, kind: "process", note: "dqengine" },
        { id: "silver", label: "7 silver\ntables", col: 2, row: 0, kind: "store", note: "one per source" },
        { id: "dimt", label: "dim_title\ndim_person", col: 3, row: 0, kind: "store", note: "dlt" },
        { id: "bridge", label: "Bridge tables", col: 3, row: 1, kind: "store", note: "many-to-many" },
        { id: "fact", label: "Fact tables", col: 3, row: 2, kind: "store", note: "ratings" },
        { id: "tab", label: "Tableau", col: 4, row: 0, kind: "serve", note: "workbook" },
      ],
      edges: [
        { from: "titles", to: "dqx" },
        { from: "people", to: "dqx" },
        { from: "dqx", to: "silver" },
        { from: "silver", to: "dimt" },
        { from: "dimt", to: "bridge" },
        { from: "silver", to: "fact" },
        { from: "fact", to: "tab" },
        { from: "bridge", to: "tab" },
      ],
    },
    sourceNote:
      "This repository carries no written README. Everything above was read out of its notebooks, its data model file, and its column mapping workbook.",
  },

  "nvidia-fin-rag": {
    problem:
      "A question about NVIDIA's finances can need three different kinds of answer: something stated in a quarterly report, something in the stock and balance sheet record, or something that happened after the reports were indexed. A single retrieval strategy serves one of those well and the other two badly, so this system lets a supervising agent pick the tool per question.",
    stages: [
      {
        name: "Chunk deliberately",
        detail:
          "Five years of quarterly reports are chunked by a two-part strategy: semantic chunking groups related passages, and a splitter then breaks any chunk that exceeds the token ceiling. Chunking is treated as a parameter to test rather than a default to accept.",
      },
      {
        name: "Index with metadata",
        detail:
          "Chunks are embedded through OpenAI and upserted into Pinecone with year and quarter attached. Quarterly reports repeat their structure every quarter, so without that metadata a semantic search returns the right passage from the wrong period.",
      },
      {
        name: "Load the structured side",
        detail:
          "Historical prices, balance sheets, and financials are pulled from Yahoo Finance into Snowflake, with column names sanitised for SQL on the way in. That gives the system an exact source for numeric questions instead of asking a language model to read numbers out of prose.",
      },
      {
        name: "Route with an oracle",
        detail:
          "The LangGraph graph is a supervisor loop, not a fixed chain. An oracle node inspects the state and decides which tool to call, a router dispatches it, the result returns to the oracle, and the cycle repeats until the oracle calls final_answer. The three tools are a filtered vector search, a Snowflake query, and a web search restricted to NVIDIA.",
      },
      {
        name: "Answer and chart",
        detail:
          "The Snowflake tool selects its SQL by analysis type and summarises the result. The front end turns the structured data into four chart types: stock performance, financial summary, balance sheet, and earnings analysis, alongside the written answer.",
      },
    ],
    decisions: [
      {
        title: "A supervisor loop rather than a chain",
        detail:
          "A fixed chain has to decide the retrieval path before it knows what the question needs. The oracle and router pattern lets the agent call one tool, look at what came back, and decide whether that was enough, which is what makes a question needing both a filing and a stock price answerable in one pass.",
      },
      {
        title: "Metadata filtering before semantic search",
        detail:
          "Filtering the Pinecone query by year and quarter first is what stops a question about Q3 being answered from a structurally identical passage in Q1. Without it, retrieval relevance is a property of the corpus rather than of the question.",
      },
      {
        title: "Numbers from SQL, prose from vectors",
        detail:
          "Balance sheet figures live in Snowflake and are fetched with SQL rather than retrieved as text. A language model asked to read a number out of a retrieved chunk will sometimes read it wrong, and there is no way to tell from the answer.",
      },
    ],
    results: [
      { metric: "8,307", label: "Vectors indexed" },
      { metric: "1,847", label: "Pages of quarterly reports" },
      { metric: "85 to 92%", label: "Retrieval relevance across three chunking strategies" },
      { metric: "4", label: "Generated chart types" },
    ],
    diagram: {
      caption:
        "An oracle node decides which tool to call and loops until it has enough to answer, so the retrieval path is chosen per question rather than fixed in advance.",
      lanes: ["Sources", "Prepare", "Stores", "Agent loop", "Interface"],
      nodes: [
        { id: "pdf", label: "Quarterly\nreports", col: 0, row: 0, kind: "source", note: "5 years" },
        { id: "yahoo", label: "Yahoo Finance", col: 0, row: 1, kind: "source", note: "scraped" },
        { id: "chunk", label: "Semantic chunk\nplus splitter", col: 1, row: 0, kind: "process", note: "token cap" },
        { id: "clean", label: "Column\nsanitiser", col: 1, row: 1, kind: "process", note: "sql safe" },
        { id: "pc", label: "Pinecone", col: 2, row: 0, kind: "store", note: "year + quarter" },
        { id: "sf", label: "Snowflake", col: 2, row: 1, kind: "store", note: "4 tables" },
        { id: "oracle", label: "Oracle", col: 3, row: 0, kind: "model", note: "decides" },
        { id: "router", label: "Router", col: 3, row: 1, kind: "model", note: "dispatches" },
        { id: "tools", label: "vector, sql,\nweb search", col: 3, row: 2, kind: "model", note: "3 tools" },
        { id: "ui", label: "Streamlit", col: 4, row: 0, kind: "serve", note: "4 charts" },
      ],
      edges: [
        { from: "pdf", to: "chunk" },
        { from: "yahoo", to: "clean" },
        { from: "chunk", to: "pc" },
        { from: "clean", to: "sf" },
        { from: "pc", to: "oracle" },
        { from: "sf", to: "oracle" },
        { from: "oracle", to: "router" },
        { from: "router", to: "tools" },
        { from: "oracle", to: "ui" },
      ],
    },
    links: [{ label: "Live app", href: "https://nvidia-finrag.streamlit.app/" }],
  },

  "financial-report-agent": {
    problem:
      "A question about a company rarely sits in one source. What the last filing said is in a PDF, what the market thinks is in today's price, and what changed this week is in the news. Answering from any one of them alone gives a confident answer built on a partial picture. This puts all three behind a single agent and lets it decide, after every step, which one the question still needs.",
    stages: [
      {
        name: "Read the filings",
        detail:
          "Quarterly earnings reports are collected per company across 2023, 2024 and 2025, and converted with Mistral OCR, since a scanned report yields nothing useful to an embedding model without it. The markdown that comes out is what everything downstream works on.",
      },
      {
        name: "Chunk against the tokenizer",
        detail:
          "Text is grouped into semantic chunks, then measured with tiktoken using the embedding model's own encoding. Anything over the limit is split by tokens rather than characters, so a chunk is never silently truncated at embed time. Vectors are upserted to Pinecone keyed by company, year and quarter, which is what makes a filtered question possible later.",
      },
      {
        name: "Put an oracle in front",
        detail:
          "A LangGraph state graph holds one oracle node that decides what to do next, and four tools it can call. Every tool edge routes back to the oracle rather than onward to the next tool, so the graph loops instead of running a fixed pipeline, and the number of steps is set by the question rather than by the wiring.",
      },
      {
        name: "Four tools, four different questions",
        detail:
          "Vector search answers what a filing said. Web search covers what has happened since. The market tool pulls a price history for a date range and computes change, percentage move, volatility, high and low. The fourth tool is the final answer, which is how the loop terminates rather than running until it hits a step limit.",
      },
      {
        name: "Serve it, and let the caller narrow it",
        detail:
          "A FastAPI service exposes health, analyze, options, sample queries and a per-tool test endpoint. The Streamlit interface reads the options endpoint to offer year, quarter and company filters plus a choice of which tools are permitted, so the search space can be cut before the agent starts rather than after.",
      },
    ],
    decisions: [
      {
        title: "Every tool returns to the oracle",
        detail:
          "The alternative is a pipeline: retrieve, then search, then summarise. That works until a question needs the market data before it knows which filing matters, at which point a fixed order is wrong. Routing every tool back to the oracle costs an extra decision per step and buys the ability to answer questions the graph was never explicitly designed for.",
      },
      {
        title: "A test endpoint per tool",
        detail:
          "Agent loops fail in a specific way: the answer is wrong and it is not obvious which leg produced it. Exposing the tools individually means a suspect tool can be exercised on its own with a known input, so debugging is a single call rather than a full run followed by inference about what went wrong inside it.",
      },
      {
        title: "Token budgets, not character counts",
        detail:
          "Chunking on characters is the common shortcut and it fails at the boundary: a chunk that looks fine is rejected or silently cut by the embedding model. Counting with the tokenizer that model actually uses means the split happens where the limit really is, and the sub-chunks that come out are all embeddable by construction.",
      },
    ],
    results: [
      {
        metric: "4",
        label: "Tools the agent routes between, each returning to the oracle",
      },
      { metric: "12", label: "Quarters indexed per company, 2023 through 2025" },
      { metric: "3", label: "Sources reconciled: filings, market data, and news" },
      { metric: "5", label: "API endpoints, with every tool testable on its own" },
    ],
    diagram: {
      caption:
        "The loop is the point. Every tool edge returns to the oracle rather than continuing to the next tool, so the number of steps is decided by the question rather than fixed by the graph.",
      lanes: ["Source", "Extract", "Store", "Agent", "Serve"],
      nodes: [
        { id: "filings", label: "Quarterly\nfilings", col: 0, row: 0, kind: "source", note: "2023 to 2025" },
        { id: "ocr", label: "Mistral OCR", col: 1, row: 0, kind: "process", note: "pdf to markdown" },
        { id: "chunks", label: "Semantic chunks", col: 1, row: 1, kind: "process", note: "tiktoken budget" },
        { id: "pine", label: "Pinecone", col: 2, row: 0, kind: "store", note: "year, quarter" },
        { id: "oracle", label: "Oracle", col: 3, row: 0, kind: "process", note: "decides each step" },
        { id: "tools", label: "4 tools", col: 3, row: 1, kind: "model", note: "back to oracle" },
        { id: "live", label: "Market + news", col: 3, row: 2, kind: "source", note: "yfinance, serpapi" },
        { id: "api", label: "FastAPI", col: 4, row: 0, kind: "serve", note: "5 endpoints" },
      ],
      edges: [
        { from: "filings", to: "ocr" },
        { from: "ocr", to: "chunks" },
        { from: "chunks", to: "pine" },
        { from: "pine", to: "oracle" },
        { from: "oracle", to: "tools" },
        { from: "live", to: "tools" },
        { from: "tools", to: "api" },
      ],
    },
  },

  "lora-peft-finetuning": {
    problem:
      "Fully fine-tuning a language model updates every weight, which needs hardware most people do not have and produces a checkpoint as large as the original model. This project adapts microsoft/DialoGPT-medium to a mental health question and answer domain by training a small fraction of it, on a single free Colab GPU, and ships the result as a file small enough to attach to an email.",
    stages: [
      {
        name: "Measure before deciding",
        detail:
          "The dataset's text lengths are analysed before any training configuration is chosen. Sequence length drives attention memory quadratically, so measuring the actual distribution is what keeps the run inside the available GPU instead of truncating answers or running out of memory partway through.",
      },
      {
        name: "Clean, augment, split",
        detail:
          "The mental health FAQ data is cleaned and augmented, then split 70/15/15 into training, validation, and test, so the reported result comes from data the adapter never saw.",
      },
      {
        name: "Configure the adapters",
        detail:
          "LoRA is configured at rank 16 with alpha 32 and dropout 0.1, with no bias adaptation, for a causal language modelling task. The adapters target c_attn and c_proj in the attention blocks and also c_fc in the feed-forward layer, so the adaptation is not limited to attention alone.",
      },
      {
        name: "Train",
        detail:
          "The base weights stay frozen and only the injected adapters train: 9.2 million parameters, 2.67% of the model's 345 million. Training completes in about 20 minutes using roughly 90% less GPU memory than a full fine-tune of the same model.",
      },
      {
        name: "Evaluate and ship",
        detail:
          "The adapter is evaluated against the held-out test split and saved at around 36MB, rather than as a full copy of the base model.",
      },
    ],
    decisions: [
      {
        title: "Rank 16 with alpha at twice the rank",
        detail:
          "Rank sets how much capacity the adapter has and alpha scales its contribution. Holding alpha at 32 against rank 16 keeps the effective scaling at 2, which is the ratio that tends to train stably without the adapter either being ignored or overwhelming the frozen base.",
      },
      {
        title: "Adapting the feed-forward layer too",
        detail:
          "Most LoRA setups target attention projections only. Including c_fc means the MLP adapts as well, which matters for a domain shift like this one: the model is not just learning who to attend to, it is learning different content.",
      },
      {
        title: "Freeze the base, ship the difference",
        detail:
          "Training 2.67% of the parameters is not a compromise made reluctantly. It brings the memory requirement down to freely available hardware, and it makes the deliverable a 36MB artefact that can be swapped or versioned independently of the model it adapts.",
      },
    ],
    results: [
      { metric: "9.2M", label: "Trainable parameters, 2.67% of 345M" },
      { metric: "r=16", label: "LoRA rank, alpha 32, dropout 0.1" },
      { metric: "90%", label: "Less GPU memory than a full fine-tune" },
      { metric: "36MB", label: "Shipped adapter" },
    ],
    diagram: {
      caption:
        "The base weights never change. Low-rank adapters are injected into both the attention projections and the feed-forward layer, and only those train.",
      lanes: ["Data", "Prepare", "Model", "Train", "Output"],
      nodes: [
        { id: "faq", label: "Mental health\nFAQ", col: 0, row: 0, kind: "source", note: "csv" },
        { id: "len", label: "Length\nanalysis", col: 1, row: 0, kind: "process", note: "seq budget" },
        { id: "split", label: "Clean and\nsplit", col: 1, row: 1, kind: "process", note: "70/15/15" },
        { id: "base", label: "DialoGPT\nmedium", col: 2, row: 0, kind: "store", note: "345m frozen" },
        { id: "lora", label: "LoRA r=16\nalpha 32", col: 2, row: 1, kind: "model", note: "c_attn c_proj c_fc" },
        { id: "train", label: "Training", col: 3, row: 0, kind: "process", note: "20 min" },
        { id: "eval", label: "Held-out\nevaluation", col: 3, row: 1, kind: "process", note: "15% test" },
        { id: "out", label: "Adapter", col: 4, row: 0, kind: "serve", note: "36mb" },
      ],
      edges: [
        { from: "faq", to: "len" },
        { from: "len", to: "split" },
        { from: "split", to: "base" },
        { from: "split", to: "lora" },
        { from: "base", to: "train" },
        { from: "lora", to: "train" },
        { from: "train", to: "eval" },
        { from: "eval", to: "out" },
      ],
    },
  },

  "mental-wellness-rl": {
    problem:
      "A support agent that learns from experience needs conversations to learn from, and in this domain those conversations are patient data. The way around it is to not use any: personas are generated from archetypes and a severity distribution, an LLM plays them turn by turn, and the policy trains against thousands of simulated conversations. That buys the training signal without the privacy problem, and it makes the safety layer non-optional rather than a feature, because an agent optimising a reward will happily find responses that score well and should never be said.",
    stages: [
      {
        name: "Generate the people",
        detail:
          "A persona generator builds psychologically consistent users from a set of archetypes and a severity distribution, and an LLM then plays each one across a conversation. No real transcript is used at any point, which is the reason the project can exist as an open repository at all.",
      },
      {
        name: "Describe the state",
        detail:
          "Each turn is compressed into a 256 dimension embedding: five emotional dimensions covering anxiety, depression, stress, anger and happiness, the previous five turns, three engagement signals, and two temporal features including how long it has been since the last contact.",
      },
      {
        name: "Decide on three axes at once",
        detail:
          "The policy network runs 512, 256 and 128 hidden units and emits nineteen logits, which are read as three separate choices: one of eight conversation strategies, one of six resource types, and one of five response tones. A check-in time between one and 168 hours is chosen alongside them, so the agent decides not only what to say but when to come back.",
      },
      {
        name: "Learn with two algorithms",
        detail:
          "PPO trains the conversation policy, clipping at 0.2 with an entropy bonus of 0.01, generalised advantage estimation and ten update epochs per batch. Resource recommendation instead runs Thompson sampling over Beta-distributed arms, sampling each arm's success probability rather than estimating a long-horizon return.",
      },
      {
        name: "Score it, then override the score",
        detail:
          "Reward weights engagement at 0.4, mood improvement 0.3, resource use 0.2 and conversation quality 0.1, with a safety penalty of minus one and a crisis penalty of minus ten. Separately from the reward, a monitor screens every inbound message and outbound response for crisis keywords, harmful patterns and boundary violations, and appends crisis resources whenever risk crosses the referral threshold.",
      },
    ],
    decisions: [
      {
        title: "Simulated users, by necessity and by design",
        detail:
          "Reinforcement learning needs far more conversations than any ethical collection process would yield here, and real ones would be among the most sensitive data there is. Generating personas and letting a language model play them removes the consent problem entirely. The cost is honest and worth stating: the agent is good at the simulated cohort it was trained against, which is not the same as being good with people.",
      },
      {
        title: "Two learners, because the feedback differs",
        detail:
          "Conversation strategy pays off over a whole episode, so it needs a method that can assign credit backwards across turns, which is PPO. A resource recommendation gets its own immediate signal, so treating it the same way would spread one clear outcome across an entire conversation. Thompson sampling uses that signal where it lands, and the split follows the shape of the feedback rather than a preference for one algorithm.",
      },
      {
        title: "Safety is not a weight in the reward",
        detail:
          "The ablation is the argument. Removing the safety layer barely moves engagement, 79% down to 75%, and takes the safety score from 100 to zero. Anything expressed as a reward term is by definition tradeable against the other terms, and those numbers show the trade is one an optimiser would happily make. It sits outside the objective, as a monitor that can override the policy's output.",
      },
    ],
    results: [
      { metric: "0", label: "Safety violations across 476 training episodes" },
      { metric: "79%", label: "Engagement rate, a 75% improvement on the baseline" },
      {
        metric: "19",
        label: "Action dimensions: 8 strategies, 6 resources, 5 tones",
      },
      { metric: "4", label: "Ablations: full, no PPO, no bandits, no safety" },
    ],
    diagram: {
      caption:
        "A closed training loop with no real user in it. The safety monitor sits between the policy and the reward deliberately, so it can override an action the objective would otherwise have rewarded.",
      lanes: ["Simulate", "Observe", "Act", "Learn"],
      nodes: [
        { id: "persona", label: "Persona\ngenerator", col: 0, row: 0, kind: "source", note: "archetypes" },
        { id: "user", label: "LLM user", col: 0, row: 1, kind: "source", note: "plays the persona" },
        { id: "state", label: "256-d state", col: 1, row: 0, kind: "store", note: "mood, history" },
        { id: "policy", label: "Policy network", col: 2, row: 0, kind: "model", note: "19 outputs" },
        { id: "bandit", label: "Thompson bandit", col: 2, row: 1, kind: "model", note: "resources" },
        { id: "safety", label: "Safety monitor", col: 2, row: 2, kind: "process", note: "can override" },
        { id: "reward", label: "Reward", col: 3, row: 0, kind: "store", note: "4 terms, 2 penalties" },
        { id: "ppo", label: "PPO update", col: 3, row: 1, kind: "process", note: "clip 0.2, GAE" },
      ],
      edges: [
        { from: "persona", to: "user" },
        { from: "user", to: "state" },
        { from: "state", to: "policy" },
        { from: "state", to: "bandit" },
        { from: "policy", to: "safety" },
        { from: "safety", to: "reward" },
        { from: "bandit", to: "reward" },
        { from: "reward", to: "ppo" },
      ],
    },
    sourceNote:
      "The engagement, mood and safety figures are the project's own evaluation against its simulated cohort, reported in the repository. They are not a clinical result and nothing here was trained on, or tested with, real patient data.",
  },

  "atari-kaboom-dqn": {
    problem:
      "Getting a Q-network to play an Atari game is a solved exercise, and a score on its own says very little: without knowing what random play scores, ten points could be excellent or barely better than nothing. This project treats that as the actual work. A baseline is measured first, then learning rate, discount, exploration policy and decay schedule are each varied on their own, and every run's raw scores are committed rather than summarised.",
    stages: [
      {
        name: "Frame the problem honestly",
        detail:
          "Kaboom presents a 210 by 160 RGB frame and four discrete actions: no-op, fire, right and left. Inspecting the reward structure first showed no shaped reward to lean on, so the score is the only learning signal and the agent has to discover timing and positioning from it alone.",
      },
      {
        name: "Measure random play",
        detail:
          "A random agent runs over the same episode budget and scores a mean of 3.45. That number comes before any training and is what every later figure is quoted against, which is the difference between reporting an improvement and reporting a score.",
      },
      {
        name: "Build the network",
        detail:
          "A convolutional Q-network of 11.6 million parameters maps the raw frame to four action values. Experience replay breaks the correlation between consecutive frames, and a separate target network holds the bootstrap target still, so the value being regressed towards is not moving with the weights doing the regressing.",
      },
      {
        name: "Vary one thing at a time",
        detail:
          "Learning rate is tested at 0.00025 and 0.001, discount at 0.99 and 0.8, exploration as epsilon-greedy against Boltzmann, and three epsilon decay schedules covering fast, slow and low-start. Each run changes a single variable, which is what makes the resulting difference attributable to it.",
      },
      {
        name: "Commit the numbers",
        detail:
          "Ten result files land next to the notebook holding per-episode scores, the epsilon reached at the step limit, environment and architecture summaries, and the comparison tables. The claims on this page are read out of those files rather than from the write-up.",
      },
    ],
    decisions: [
      {
        title: "Baseline before agent",
        detail:
          "Random play scoring 3.45 is the least interesting run and the most important one. Without it the trained agent's 10.85 is a number with nothing to compare against, and the temptation is to describe it as good. With it, the claim is 214% and it is checkable.",
      },
      {
        title: "One variable per run, even when it is slow",
        detail:
          "Changing several settings at once and keeping whatever scores best produces a configuration nobody can explain. Isolating them costs more runs and yields attributable findings: raising the learning rate to 0.001 cost 24%, and dropping the discount to 0.8 cost 56%, which says the game's reward is far enough in the future that a short horizon cannot see it.",
      },
      {
        title: "Report the experiment that lost",
        detail:
          "Boltzmann exploration scored 8.3 against epsilon-greedy's 8.95, about 7% behind. It stayed in the results rather than being quietly dropped. A comparison only means anything if the losing arm is still visible, and on this environment it is a genuine finding that the simpler policy won.",
      },
    ],
    results: [
      { metric: "214%", label: "Improvement over random play, 3.45 to 10.85" },
      { metric: "11.6M", label: "Parameters in the convolutional Q-network" },
      {
        metric: "56%",
        label: "Performance lost by dropping the discount to 0.8",
      },
      { metric: "10", label: "Result files committed alongside the notebook" },
    ],
    diagram: {
      caption:
        "The agent is the ordinary part. Replay and a separate target network keep training stable, and the experiment matrix on the right is what turns a single score into an attributable result.",
      lanes: ["Environment", "Network", "Training", "Evidence"],
      nodes: [
        { id: "env", label: "Kaboom (ALE)", col: 0, row: 0, kind: "source", note: "210x160, 4 actions" },
        { id: "random", label: "Random agent", col: 0, row: 1, kind: "process", note: "baseline 3.45" },
        { id: "cnn", label: "CNN Q-network", col: 1, row: 0, kind: "model", note: "11.6M params" },
        { id: "replay", label: "Replay buffer", col: 1, row: 1, kind: "store", note: "breaks correlation" },
        { id: "target", label: "Target network", col: 2, row: 0, kind: "model", note: "stable bootstrap" },
        { id: "explore", label: "Exploration", col: 2, row: 1, kind: "process", note: "greedy, boltzmann" },
        { id: "runs", label: "Experiment matrix", col: 3, row: 0, kind: "process", note: "one variable each" },
        { id: "json", label: "Result files", col: 3, row: 1, kind: "store", note: "raw scores" },
      ],
      edges: [
        { from: "env", to: "cnn" },
        { from: "random", to: "runs" },
        { from: "cnn", to: "replay" },
        { from: "replay", to: "target" },
        { from: "cnn", to: "explore" },
        { from: "target", to: "runs" },
        { from: "explore", to: "runs" },
        { from: "runs", to: "json" },
      ],
    },
  },

  "la-crime-analytics": {
    problem:
      "Los Angeles publishes its crime incidents openly, but the feed is a flat file whose schema drifts and whose codes are inconsistent. Analysing it by time, place, offence, weapon, or victim means restructuring it first, and doing that without silently dropping incidents. This pipeline runs it through a medallion architecture on Databricks and keeps every row accounted for.",
    stages: [
      {
        name: "Profile",
        detail:
          "A profiling notebook establishes what is actually in each column before any cleaning rule is written, so the transformations that follow are based on the data rather than on the published description of it.",
      },
      {
        name: "Bronze, with schema rescue",
        detail:
          "Raw incidents land in bronze inside Unity Catalog, under an explicit catalog and schema. Ingestion runs with a schema checkpoint and a rescue flow, so a column that changes shape upstream is captured rather than dropped or crashing the load.",
      },
      {
        name: "Silver, with an audit trail",
        detail:
          "The silver transformation cleans and conforms the data, deduplicates, and enforces not-null on the fields the model depends on. Each row carries who created it and when it was processed, so a number in a dashboard can be traced back to a run.",
      },
      {
        name: "Eight dimensions",
        detail:
          "The gold layer builds eight dimensions around the incident: crime type, date, time, location, premise, weapon, status, and victim demographics. Separating date from time matters here, because time-of-day patterns are one of the questions the data is asked.",
      },
      {
        name: "Fact and dashboards",
        detail:
          "fact_crime_incidents joins silver against every dimension, holding foreign keys and measures. Tableau reads the gold layer for the analytical output.",
      },
    ],
    decisions: [
      {
        title: "Schema rescue instead of a fixed schema",
        detail:
          "An open data feed will change without warning. Declaring a rigid schema means the pipeline either fails or silently discards new columns. Rescuing unexpected data keeps it available for inspection rather than losing it between runs.",
      },
      {
        title: "Date and time as separate dimensions",
        detail:
          "Collapsing a timestamp into one dimension makes questions about day-of-week and questions about hour-of-day awkward to ask together. Splitting them keeps both cheap, which suits a dataset where when-in-the-day is a primary axis of analysis.",
      },
      {
        title: "Retention as a checkable property",
        detail:
          "Cleaning that drops rows produces dashboards whose totals do not match the source, and the discrepancy is usually found by someone else. Rows are corrected or flagged rather than deleted, so 100% of incidents survive from source to gold.",
      },
    ],
    results: [
      { metric: "1M+", label: "Incidents from 2020 to 2025" },
      { metric: "8", label: "Dimensions around the incident fact" },
      { metric: "100%", label: "Data retention through the pipeline" },
      { metric: "1m 48s", label: "Full pipeline run" },
    ],
    diagram: {
      caption:
        "Medallion layering inside Unity Catalog. Bronze rescues unexpected schema changes, silver carries an audit trail, and gold splits eight dimensions off the incident fact.",
      lanes: ["Source", "Bronze", "Silver", "Gold", "Serve"],
      nodes: [
        { id: "lapd", label: "LA crime\nincidents", col: 0, row: 0, kind: "source", note: "2020-2025" },
        { id: "prof", label: "Profiling", col: 0, row: 1, kind: "process", note: "column stats" },
        { id: "bronze", label: "Bronze ingest", col: 1, row: 0, kind: "store", note: "schema rescue" },
        { id: "silver", label: "Clean, dedupe,\naudit columns", col: 2, row: 0, kind: "process", note: "conformed" },
        { id: "dims", label: "8 dimensions", col: 3, row: 0, kind: "store", note: "date + time split" },
        { id: "fact", label: "fact_crime_\nincidents", col: 3, row: 1, kind: "store", note: "1m+ rows" },
        { id: "tab", label: "Tableau", col: 4, row: 0, kind: "serve", note: "dashboards" },
      ],
      edges: [
        { from: "lapd", to: "bronze" },
        { from: "prof", to: "silver" },
        { from: "bronze", to: "silver" },
        { from: "silver", to: "dims" },
        { from: "dims", to: "fact" },
        { from: "fact", to: "tab" },
      ],
    },
  },

  "food-inspections": {
    problem:
      "Chicago and Dallas both publish restaurant inspection results and they agree on almost nothing: column names, outcome codes, risk categories, how an establishment is identified. Answering one question across both cities means reconciling them into a single model, and doing it in a way that survives a restaurant changing hands.",
    stages: [
      {
        name: "Profile and unify in Alteryx",
        detail:
          "Three Alteryx workflows do the preparatory work: one per city to profile and standardise its own feed, and a third to unify them. Five year-slices per city are covered, from 2021 through to a partial 2025.",
      },
      {
        name: "Bronze",
        detail:
          "A Delta Live Tables pipeline of about 1,500 lines takes over from there. Bronze reads the unified source table with minimal transformation, keeping the ingested shape intact.",
      },
      {
        name: "Silver, with two classes of rule",
        detail:
          "The silver layer separates warnings from rejections deliberately. Expectations that only need visibility are declared with expect_all so violations are logged and the record passes. Five critical rules use expect_or_drop, so records that break them never reach the model. A second silver table then applies proper types for the gold layer.",
      },
      {
        name: "Six dimensions",
        detail:
          "Gold builds a date dimension spanning 2018 to 2028, a streaming location dimension, and dimensions for violation codes reconciled across both cities, inspection type, inspection result, and risk category.",
      },
      {
        name: "Slowly changing restaurants",
        detail:
          "The restaurant dimension is built as Type 2, so a change of owner, name, or risk classification creates a new version rather than overwriting the old one. An inspection from 2022 stays attached to the restaurant as it was in 2022.",
      },
    ],
    decisions: [
      {
        title: "Warn and drop as separate policies",
        detail:
          "Treating every failed expectation the same way forces a choice between losing data and trusting it. Declaring most rules as warnings and only five as hard drops means the pipeline keeps everything it safely can, while the records that would corrupt an aggregate never arrive.",
      },
      {
        title: "Type 2 on the restaurant dimension",
        detail:
          "Restaurants change hands, rename, and get reclassified. Overwriting the dimension would rewrite history, making a 2022 inspection appear to belong to the current owner. Versioning the dimension keeps each inspection attached to the establishment as it was at the time.",
      },
      {
        title: "Typing as its own silver table",
        detail:
          "Validation and type coercion fail for different reasons, and combining them makes it unclear which one rejected a record. Splitting them into two silver tables keeps each stage's failures attributable.",
      },
    ],
    results: [
      { metric: "97.8%", label: "Field completeness on validated records" },
      { metric: "2 cities", label: "Reconciled into one model" },
      { metric: "5", label: "Hard drop rules, the rest warn only" },
      { metric: "6", label: "Gold dimensions plus a Type 2 restaurant" },
    ],
    diagram: {
      caption:
        "Alteryx unifies two incompatible city feeds, then a Delta Live Tables pipeline separates warnings from hard drops and versions the restaurant dimension over time.",
      lanes: ["Sources", "Prepare", "Bronze", "Silver", "Gold"],
      nodes: [
        { id: "chi", label: "Chicago\n5 year slices", col: 0, row: 0, kind: "source", note: "tsv" },
        { id: "dal", label: "Dallas\n5 year slices", col: 0, row: 1, kind: "source", note: "tsv" },
        { id: "alt", label: "3 Alteryx\nworkflows", col: 1, row: 0, kind: "process", note: "unify" },
        { id: "bronze", label: "DLT bronze", col: 2, row: 0, kind: "store", note: "as ingested" },
        { id: "val", label: "Validate\nwarn or drop", col: 3, row: 0, kind: "process", note: "5 drop rules" },
        { id: "typed", label: "Typed silver", col: 3, row: 1, kind: "process", note: "coercion" },
        { id: "dims", label: "6 dimensions", col: 4, row: 0, kind: "store", note: "date 2018-2028" },
        { id: "scd", label: "Restaurant\nType 2", col: 4, row: 1, kind: "store", note: "versioned" },
      ],
      edges: [
        { from: "chi", to: "alt" },
        { from: "dal", to: "alt" },
        { from: "alt", to: "bronze" },
        { from: "bronze", to: "val" },
        { from: "val", to: "typed" },
        { from: "typed", to: "dims" },
        { from: "dims", to: "scd" },
      ],
    },
  },

  "chinook-azure-snowflake": {
    problem:
      "A warehouse load written table by table grows a pipeline for every table, and each one has to be opened and edited whenever a schema moves. This build inverts that. The Data Factory resources describe the shape of the work and nothing else: schema names, table names, containers, and file paths all arrive as runtime parameters. Adding a table to the extract means adding a string to an array rather than cloning a pipeline.",
    stages: [
      {
        name: "Extract to Parquet",
        detail:
          "One Copy activity loops over an array of eleven table names, three at a time, writing one Snappy-compressed Parquet file per table into blob storage. Consistency validation is on and type conversion is declared rather than inferred. The extract deliberately pulls wider than the warehouse currently models, including Track, Playlist, PlaylistTrack, MediaType, and Employee, so a dimension added later already has its source landed and needs no second pass at the operational database.",
      },
      {
        name: "Land in staging with an audit trail",
        detail:
          "A single data flow runs once per table on eight cores. It reads with schema drift allowed, derives Created_By as 'ADF_PIPELINE' and Created_Dt as the current date, and inserts into Snowflake. The target table name is the loop item passed through toUpper(), which is what reconciles Parquet's mixed-case naming with Snowflake's uppercase identifiers instead of hardcoding six mappings.",
      },
      {
        name: "Build six dimensions from one template",
        detail:
          "Every dimension flow reads two sources: the staging table, and the dimension it is about to write. A left join on the business key decides what is new. keyGenerate issues the surrogate key, then alterRow splits the stream, updating where a matched row's attributes differ and inserting where the join found nothing. The sink is keyed on the business ID and is insertable and updateable but never deletable, so the dimension is added to rather than rebuilt.",
      },
      {
        name: "Detect customer change with a hash",
        detail:
          "The customer dimension is the one that does not compare column by column. An MD5 over twelve business attributes, from name and company through address, phone, fax, and email, is checked against the hash stored on the existing row. One comparison covers every attribute at once, so an update fires only when something genuinely changed and a run over untouched customers writes nothing.",
      },
      {
        name: "Load the fact from the dimensions",
        detail:
          "The fact load aggregates quantity times unit price per invoice, joins the customer dimension for its surrogate key, and resolves the date dimension on full date and the time dimension on HH24:MI. A NOT EXISTS check on invoice ID makes the load safe to re-run. Staging is enabled through a blob path so Snowflake's own COPY command moves the rows rather than streaming them through the integration runtime.",
      },
    ],
    decisions: [
      {
        title: "Parameters instead of pipelines",
        detail:
          "Three datasets serve the entire factory: one Azure SQL table, one Parquet file, one Snowflake table, each taking its location as a parameter. The dimension pipelines then expose stage schema, stage table, warehouse schema, and warehouse table as parameters with defaults, so a published pipeline can be aimed at a different schema or environment by changing four values at trigger time rather than by editing and republishing JSON.",
      },
      {
        title: "Every credential by reference",
        detail:
          "Neither database password appears in the factory definition. Both are Key Vault secret references resolved through the factory's system-assigned managed identity, and the Azure SQL connection parameterises the secret name alongside server, database, and username, so a second environment is a set of parameter values rather than a second connection. The one place a different credential model was unavoidable is the fact load, where Snowflake's COPY command needs an external stage it can authenticate against directly, so a SAS-scoped connection to the same storage account exists solely for that.",
      },
      {
        title: "The fact reads the dimensions, not staging",
        detail:
          "Sales facts are built from the invoice and invoice line dimensions rather than from the staging tables those dimensions came from. The customer surrogate key on a fact row then comes from the same row the dimension load wrote, so a fact cannot reference a customer the dimension does not have. The two layers agree by construction instead of needing a reconciliation query to prove it.",
      },
    ],
    results: [
      {
        metric: "3",
        label: "Parameterised datasets serving all 9 pipelines and 7 data flows",
      },
      { metric: "8", label: "Conformed dimensions feeding one sales fact table" },
      { metric: "11", label: "Source tables extracted by a single Copy activity" },
      { metric: "24", label: "Factory resources deployed from one ARM template" },
    ],
    diagram: {
      caption:
        "Schemas, tables, and file paths are runtime parameters, so three datasets carry every read and write in the factory. The fact table is built from the dimensions rather than from staging, so its keys agree with them by construction.",
      lanes: ["Source", "Extract", "Stage", "Model"],
      nodes: [
        { id: "sql", label: "Azure SQL\nChinook", col: 0, row: 0, kind: "source", note: "11 tables" },
        { id: "copy", label: "Copy activity", col: 1, row: 0, kind: "process", note: "3 in parallel" },
        { id: "blob", label: "Blob Storage", col: 1, row: 1, kind: "store", note: "parquet, snappy" },
        { id: "flow", label: "Parquet to STAGE", col: 2, row: 0, kind: "process", note: "audit columns" },
        { id: "stage", label: "STAGE schema", col: 2, row: 1, kind: "store", note: "6 tables" },
        { id: "dims", label: "6 dimension\ndata flows", col: 3, row: 0, kind: "process", note: "join, key, alterRow" },
        { id: "dw", label: "DW dimensions", col: 3, row: 1, kind: "store", note: "8 conformed" },
        { id: "fact", label: "SALES_FACT", col: 3, row: 2, kind: "store", note: "NOT EXISTS guard" },
      ],
      edges: [
        { from: "sql", to: "copy" },
        { from: "copy", to: "blob" },
        { from: "blob", to: "flow" },
        { from: "flow", to: "stage" },
        { from: "stage", to: "dims" },
        { from: "dims", to: "dw" },
        { from: "dw", to: "fact" },
      ],
    },
  },

  "seattle-pet-license": {
    problem:
      "Public data does not join cleanly. Seattle's pet licence register carries a ZIP code but no city or county, breeds arrive as free text with a nullable secondary breed, and some licences hold dates that will not parse. An inner join drops every one of those rows silently, and the totals still look plausible afterwards. This pipeline routes them instead. Every dimension lookup resolves to a sentinel key when it fails, so the row lands in the fact table and the gap becomes something you can count rather than something that left no trace.",
    stages: [
      {
        name: "Normalise the names on the way in",
        detail:
          "Two Copy activities convert the source CSVs to Snappy Parquet, and each declares an explicit column mapping rather than passing the headers through. 'License Issue Date', \"Animal's Name\", and 'ZIP Code' become License_Issue_Date, Animals_Name, and ZipCode, so an apostrophe and a set of spaces never reach a SQL identifier. Type conversion is declared at the same boundary rather than left to inference further down.",
      },
      {
        name: "Land both files in staging",
        detail:
          "A ForEach runs one staging data flow over both Parquet files, two at a time on eight cores. The flow derives DI_CREATED_DT and DI_CREATED_BY audit columns and writes with truncate enabled, so the staging tables are rebuilt on every run and a re-run cannot double-count what is already there.",
      },
      {
        name: "Build location from the second source",
        detail:
          "The licence register knows ZIP codes and nothing else about geography. The reference file supplies state, county, city, and state FIPS for each one. A left join on ZIP code against the existing dimension decides what is new, keyGenerate issues the surrogate key, and the sink inserts without updating, on the reasoning that the county a ZIP code sits in is not a value that changes.",
      },
      {
        name: "Derive breed from the facts",
        detail:
          "There is no breed reference file to load, so the dimension is derived from the data it describes. The staged licence rows are grouped on species, primary breed, and secondary breed to get the distinct combinations, each combination takes a surrogate key, and the dimension is rebuilt in full each run.",
      },
      {
        name: "Load the fact, keeping every row",
        detail:
          "The fact query left joins the date, location, and breed dimensions and wraps each key in COALESCE with a sentinel: 99991231 for a date that will not parse, 99999 for a location or breed with no match. Breed matching is explicitly null-safe, treating a null secondary breed on both sides as a match instead of letting a NULL comparison discard the row. A NOT EXISTS check on licence number makes the whole load safe to run again.",
      },
    ],
    decisions: [
      {
        title: "Sentinel keys instead of inner joins",
        detail:
          "The easy version of this fact load is an inner join, and it produces a warehouse that looks clean because everything awkward has been thrown away. Three separate lookups here can miss: a date that will not parse, a ZIP code absent from the reference file, a breed combination that does not match. Each one resolves to a sentinel key, so the licence is still counted, the failure is attributable to a specific lookup, and the size of each gap is a query rather than a guess.",
      },
      {
        title: "Rename at the boundary, once",
        detail:
          "Source headers include spaces and an apostrophe. Those can be quoted and carried through the whole warehouse, which means every downstream query has to keep quoting them, or they can be renamed once at the point of ingestion. Doing it in the Copy activity's mapping means the Parquet, the staging tables, the dimensions, and the fact all share one naming convention, and nothing after the first activity has to know what the source called things.",
      },
      {
        title: "One pipeline that knows its own order",
        detail:
          "Every activity chains on the success of the one before it, so extract, stage, dimensions, and fact run in sequence without a runbook explaining what to trigger next, and a failure halfway leaves the later steps untriggered rather than running against half-loaded tables. The thirteen parameters at the top cover every container, directory, file, schema, and table name, so the same published pipeline can be pointed at a different environment without opening it.",
      },
    ],
    results: [
      {
        metric: "3",
        label: "Dimension lookups with sentinel keys, so unmatched rows still land",
      },
      {
        metric: "13",
        label: "Pipeline parameters, with no path or table name hardcoded",
      },
      {
        metric: "2",
        label: "Public sources joined: the licence register and ZIP reference data",
      },
      { metric: "6", label: "Activities chained in one re-runnable pipeline" },
    ],
    diagram: {
      caption:
        "Two public files that share nothing but a ZIP code. Every dimension lookup in the fact load is a left join wrapped in COALESCE, so a licence with an unparseable date or an unlisted breed still lands, carrying a sentinel key that records which lookup missed.",
      lanes: ["Source", "Land", "Stage", "Model"],
      nodes: [
        { id: "lic", label: "Pet licence\nregister", col: 0, row: 0, kind: "source", note: "csv" },
        { id: "geo", label: "ZIP reference\ndata", col: 0, row: 1, kind: "source", note: "state, county, city" },
        { id: "copy", label: "2 Copy activities", col: 1, row: 0, kind: "process", note: "explicit mapping" },
        { id: "pq", label: "Parquet", col: 1, row: 1, kind: "store", note: "snappy" },
        { id: "stg", label: "Staging flow", col: 2, row: 0, kind: "process", note: "audit, truncate" },
        { id: "stage", label: "STAGE schema", col: 2, row: 1, kind: "store", note: "2 tables" },
        { id: "dims", label: "Location + breed\ndata flows", col: 3, row: 0, kind: "process", note: "surrogate keys" },
        { id: "dw", label: "DW dimensions", col: 3, row: 1, kind: "store", note: "date, loc, breed" },
        { id: "fact", label: "FACT_PET_LICENSE", col: 3, row: 2, kind: "store", note: "sentinel keys" },
      ],
      edges: [
        { from: "lic", to: "copy" },
        { from: "geo", to: "copy" },
        { from: "copy", to: "pq" },
        { from: "pq", to: "stg" },
        { from: "stg", to: "stage" },
        { from: "stage", to: "dims" },
        { from: "dims", to: "dw" },
        { from: "dw", to: "fact" },
      ],
    },
    sourceNote:
      "The repository holds the Data Factory definitions only. The Snowflake schema they load into, including the pre-populated date dimension, is created outside it, so the table shapes described here are read from the pipeline and data flow column mappings rather than from DDL.",
  },

  "web-pdf-extraction": {
    problem:
      "Every document extraction tool demos well on the document it picked. The question that decides anything is how they behave on yours: whether tables survive, whether headings are real headings or just larger text, whether a scanned page yields anything at all. This tool sends one input through open source, enterprise, and document AI extractors and normalises all of them to markdown, so the comparison happens on the same file instead of across three marketing pages.",
    stages: [
      {
        name: "Choose an input and a tool",
        detail:
          "The Streamlit sidebar takes a web URL or a PDF, then one of three extractors for whichever was chosen. URLs get a HEAD request before anything is submitted, so an unreachable page fails immediately rather than after a round trip. PDFs are base64 encoded in the browser and posted as JSON. Picking Azure adds a second choice, between its read and layout models.",
      },
      {
        name: "Route to one of six endpoints",
        detail:
          "The API exposes a separate endpoint per input and tool pair rather than one endpoint behind a strategy flag. Each writes to its own S3 prefix, so results land under web/os, web/ent, web/docling, pdf/os, pdf/ent, or pdf/docling, every one stamped with the time of the run.",
      },
      {
        name: "Rebuild the structure by hand",
        detail:
          "The open source path infers everything. PyMuPDF walks blocks, lines, and spans, promoting any span set above twelve point to a heading, lifting images out by xref into S3 and linking them, and reading tables with find_tables. BeautifulSoup does the web equivalent: drop script and style, prefer main over body, walk the headings, paragraphs, images, and tables, and resolve relative image sources against the page they came from.",
      },
      {
        name: "Let a document model do it instead",
        detail:
          "Docling runs with OCR and table structure recognition enabled and images at double scale. PDFs export with images embedded, so the markdown is self-contained. Web pages export by reference, and because Docling's HTML path emits placeholder comments where pictures should be, a second BeautifulSoup pass walks the original page and substitutes the real image URLs back into the placeholders one at a time.",
      },
      {
        name: "Measure the enterprise services against both",
        detail:
          "Azure Document Intelligence is wired up with both prebuilt models: read returns paragraphs with per-page language confidence, layout adds handwriting detection, table dimensions with the content of every cell, and bounding polygons for figures. Diffbot takes the other approach on the web side, classifying the page type first and then extracting title, text, and images against a schema fixed for that type.",
      },
    ],
    decisions: [
      {
        title: "One output format, or there is nothing to compare",
        detail:
          "The six tools return six different shapes: PyMuPDF spans, Docling documents, Azure AnalyzeResult objects, Diffbot JSON. Converting each to markdown at the endpoint is the thing that makes the question answerable, because two runs over the same document then differ only in what the tool actually found, and the difference can be read directly instead of argued about.",
      },
      {
        title: "Six endpoints rather than one with a switch",
        detail:
          "The tools do not take the same inputs or fail the same way. Azure needs a model name, PDFs arrive base64 encoded, URLs arrive as a string, and the enterprise services fail on quota and file size where the local libraries fail on malformed documents. Separate endpoints keep those differences visible where they can be handled individually, and give every tool its own addressable S3 prefix.",
      },
      {
        title: "Judge the tools on cost, not only on output",
        detail:
          "The prototype work carries the part that never shows up in the application: rate limits and pricing followed through to a number. Ten thousand pages through Diffbot's free tier is capped at five calls a minute, roughly thirty-three hours at no cost, against about thirty-three minutes for $299 on the paid tier. A tool that extracts beautifully but cannot be run at the volume you need is not a tool you have actually chosen.",
      },
    ],
    results: [
      { metric: "6", label: "Extraction endpoints, one per input type and tool" },
      { metric: "3", label: "Tool classes compared on identical input" },
      { metric: "2", label: "Azure prebuilt models exposed: read and layout" },
      { metric: "10K", label: "Pages costed across Diffbot's free and paid tiers" },
    ],
    diagram: {
      caption:
        "One input, three classes of extractor, one output format. Each endpoint writes to its own S3 prefix keyed by tool and timestamp, so the same document run through two tools leaves two artefacts that can be put side by side.",
      lanes: ["Input", "Interface", "Route", "Extract", "Store"],
      nodes: [
        { id: "url", label: "Web URL", col: 0, row: 0, kind: "source", note: "head-checked" },
        { id: "pdf", label: "PDF upload", col: 0, row: 1, kind: "source", note: "base64" },
        { id: "ui", label: "Streamlit UI", col: 1, row: 0, kind: "process", note: "tool selector" },
        { id: "api", label: "FastAPI", col: 2, row: 0, kind: "process", note: "6 endpoints" },
        { id: "os", label: "Open source", col: 3, row: 0, kind: "model", note: "pymupdf, bs4" },
        { id: "doc", label: "Docling", col: 3, row: 1, kind: "model", note: "ocr, tables" },
        { id: "ent", label: "Enterprise", col: 3, row: 2, kind: "model", note: "azure, diffbot" },
        { id: "s3", label: "S3", col: 4, row: 0, kind: "store", note: "tool + timestamp" },
        { id: "md", label: "Markdown", col: 4, row: 1, kind: "serve", note: "rendered in UI" },
      ],
      edges: [
        { from: "url", to: "ui" },
        { from: "pdf", to: "ui" },
        { from: "ui", to: "api" },
        { from: "api", to: "os" },
        { from: "api", to: "doc" },
        { from: "api", to: "ent" },
        { from: "os", to: "s3" },
        { from: "doc", to: "s3" },
        { from: "ent", to: "s3" },
        { from: "s3", to: "md" },
      ],
    },
    sourceNote:
      "Built with two teammates. The Streamlit interface and the Cloud Run API were both live during the project and are offline now, so everything described here is read from the repository rather than from a running deployment.",
  },

  "orchestrate-event-db": {
    problem:
      "Event management is a domain where the rules matter more than the interface: who may register, whether a venue still has seats, which sponsor belongs to which event, what an attendee is allowed to see. Orchestrate puts those rules inside the database rather than in an application above it, so they hold for any client, including someone at a SQL prompt.",
    stages: [
      {
        name: "Schema",
        detail:
          "Eleven tables cover the domain: EVENT, EVENT_SCHEDULE, EVENT_USERS, USER_ADDRESS, ATTENDEE, ORGANIZER, VENUE, SPONSOR, REGISTRATION, PAYMENT, and EVENT_REVIEW. Eight sequences supply surrogate keys and the tables carry constraints rather than relying on callers to behave.",
      },
      {
        name: "A re-runnable build",
        detail:
          "Each table is dropped before creation inside a PL/SQL block that catches the error Oracle raises when the table does not exist, so the whole setup can be run against a fresh schema or an existing one without editing it first.",
      },
      {
        name: "Logic",
        detail:
          "Two functions enforce the rules that must never be skipped: one checks seat availability, one validates user contact details. Thirteen stored procedures carry the operations, grouped by the role that performs them, from creating an event to updating a registration to adding sponsorship. A trigger assigns user type on insert, so classification cannot be bypassed by writing to the table directly.",
      },
      {
        name: "Access",
        detail:
          "Six roles exist: EVENT_ADMIN, ORGANIZER, VENUE_MANAGER, EVENT_SPONSOR, EVENT_ATTENDEE, and EVENT_VIEWER. Each is granted the specific procedures and views its job needs rather than access to the underlying tables.",
      },
      {
        name: "Reporting",
        detail:
          "Seven views and five analytical reports sit on top: revenue, feedback, sponsorship, attendee, and venue. Reading happens through those rather than against the base tables.",
      },
    ],
    decisions: [
      {
        title: "Grant procedures, not tables",
        detail:
          "If a role can write to a table directly, every validation in front of that table is optional. Granting execute on procedures instead makes those procedures the only write path, which is what turns the seat check and the contact validation from conventions into guarantees.",
      },
      {
        title: "Business rules in PL/SQL",
        detail:
          "Rules enforced in an application hold only while everyone goes through that application. Putting seat availability, contact validation, and user classification into functions and a trigger means they hold regardless of what is connected.",
      },
      {
        title: "An idempotent setup script",
        detail:
          "Guarding each drop against the does-not-exist error means the build can be run repeatedly during development without manual cleanup between attempts. It is a small thing that makes the schema genuinely reproducible.",
      },
    ],
    results: [
      { metric: "11", label: "Tables with 8 sequences" },
      { metric: "13", label: "Stored procedures, 2 functions, 1 trigger" },
      { metric: "6", label: "Roles granted procedures, not tables" },
      { metric: "7", label: "Views and 5 analytical reports" },
    ],
    diagram: {
      caption:
        "Roles are granted procedures rather than tables, which makes the stored procedures the only write path and the validation inside them unavoidable.",
      lanes: ["Schema", "Logic", "Access", "Reporting"],
      nodes: [
        { id: "tables", label: "11 tables", col: 0, row: 0, kind: "store", note: "constrained" },
        { id: "seq", label: "8 sequences", col: 0, row: 1, kind: "source", note: "surrogate keys" },
        { id: "fn", label: "2 functions", col: 1, row: 0, kind: "process", note: "seats, contact" },
        { id: "sp", label: "13 procedures", col: 1, row: 1, kind: "process", note: "only write path" },
        { id: "trg", label: "1 trigger", col: 1, row: 2, kind: "process", note: "on insert" },
        { id: "roles", label: "6 roles", col: 2, row: 0, kind: "model", note: "execute grants" },
        { id: "views", label: "7 views", col: 3, row: 0, kind: "serve", note: "read only" },
        { id: "rep", label: "5 reports", col: 3, row: 1, kind: "serve", note: "analytical" },
      ],
      edges: [
        { from: "seq", to: "tables" },
        { from: "tables", to: "fn" },
        { from: "fn", to: "sp" },
        { from: "sp", to: "trg" },
        { from: "sp", to: "roles" },
        { from: "roles", to: "views" },
        { from: "views", to: "rep" },
      ],
    },
  },

  "fred-economic-data": {
    problem:
      "Treasury yield series published by the Federal Reserve update on their own schedule, and a pipeline that reloads ten years of history on every run does almost entirely wasted work. This one runs on CI, loads only what changed, and applies a retention policy, so it can run often enough to stay current without accumulating cost.",
    stages: [
      {
        name: "Fetch",
        detail:
          "The extraction service calls the FRED API for Treasury yield series and lands the response in S3, keeping the raw payload before anything is shaped.",
      },
      {
        name: "Schedule on CI",
        detail:
          "Two GitHub Actions workflows drive it: one scheduled extraction and one manual pipeline execution. Scheduling, secrets, logs, and run history come from CI rather than from an orchestrator that would have to be hosted and maintained.",
      },
      {
        name: "Load and retain",
        detail:
          "Snowflake pipelines apply the new observations, and a retention step bounds what is kept rather than letting the raw layer grow without limit.",
      },
      {
        name: "Serve at three grains",
        detail:
          "The Streamlit application reads the warehouse and presents daily, weekly, and monthly analytics as separate views, since a yield curve question and a trend question want different resolutions.",
      },
    ],
    decisions: [
      {
        title: "CI as the scheduler",
        detail:
          "A pipeline that runs a few times a day does not justify standing up and maintaining an orchestrator. GitHub Actions supplies the schedule, the secret storage, and an auditable run history for nothing, and keeps the pipeline's operation visible in the same place as its code.",
      },
      {
        title: "Incremental loading with retention",
        detail:
          "Reloading the full history keeps a run's cost tied to the size of the archive rather than to the amount of new data, and it grows forever. Loading only new observations and bounding retention keeps both the run and the storage proportional to what is actually being used.",
      },
      {
        title: "Three grains rather than one",
        detail:
          "Daily, weekly, and monthly aggregates are built as separate analytics paths, so a question about a trend is not answered by resampling a daily series in the browser.",
      },
    ],
    results: [
      { metric: "10 years", label: "Treasury yield history" },
      { metric: "2", label: "GitHub Actions workflows" },
      { metric: "3", label: "Analytical grains: daily, weekly, monthly" },
    ],
    diagram: {
      caption:
        "Scheduling lives in CI rather than an orchestrator. Each run applies only new observations, and a retention step bounds the raw layer.",
      lanes: ["Source", "Schedule", "Store", "Serve"],
      nodes: [
        { id: "fred", label: "FRED API", col: 0, row: 0, kind: "source", note: "treasury yields" },
        { id: "gha", label: "GitHub Actions", col: 1, row: 0, kind: "process", note: "2 workflows" },
        { id: "s3", label: "S3 raw", col: 1, row: 1, kind: "store", note: "retention" },
        { id: "sf", label: "Snowflake", col: 2, row: 0, kind: "store", note: "incremental" },
        { id: "app", label: "Streamlit", col: 3, row: 0, kind: "serve", note: "daily/weekly/monthly" },
      ],
      edges: [
        { from: "fred", to: "gha" },
        { from: "gha", to: "s3" },
        { from: "s3", to: "sf" },
        { from: "sf", to: "app" },
      ],
    },
    links: [{ label: "Live app", href: "https://fredanalytics.streamlit.app/" }],
  },

  "academic-research-assistant": {
    problem:
      "Answering a research question properly means four different jobs: deciding what is actually being asked, finding sources, judging whether those sources are any good, and writing the result up with citations. One model prompted to do all four does each of them adequately. This system gives each job to its own agent, and adds the part general agents skip: scoring whether a source deserves to be believed.",
    stages: [
      {
        name: "Plan",
        detail:
          "A research coordinator agent turns the query into a plan and monitors progress against it, so the work has a shape before any searching starts.",
      },
      {
        name: "Gather and rank",
        detail:
          "An information gatherer searches through four tools: a Serper web search, a website scraper, a site-scoped search, and a file reader. It does not just collect results, it evaluates and ranks sources by reliability and extracts the key information from each.",
      },
      {
        name: "Score the sources",
        detail:
          "A custom academic analyzer runs over each source, identifying its type, extracting authors and publication date, detecting bias indicators, and producing separate credibility and quality scores. It also generates citation data, so the eventual report can attribute its claims.",
      },
      {
        name: "Analyse",
        detail:
          "A data analyst agent works over what was gathered, producing insights and running comparative analysis across multiple sources rather than summarising each in isolation.",
      },
      {
        name: "Synthesise",
        detail:
          "A content synthesizer produces the report and a separate short summary. The front end presents the result as an executive summary, the full report, the sources, analytics, and export options, with markdown and citation generation built in.",
      },
    ],
    decisions: [
      {
        title: "Credibility scoring as a first-class tool",
        detail:
          "Most retrieval systems treat a source as trustworthy because it was returned. This one analyses each source for type, authorship, date, and bias indicators, then scores credibility and quality separately. That is the difference between a report that cites things and a report that has judged them.",
      },
      {
        title: "Memory in three tiers",
        detail:
          "Short-term memory is timestamped working state, long-term memory persists across runs, and a shared channel carries cross-agent handoffs with priorities attached. Without the shared tier each agent re-derives what the previous one established; without the separation, transient state and durable findings end up in the same bucket.",
      },
      {
        title: "Tools assigned per agent, not globally",
        detail:
          "A tools manager owns initialisation, validation, and status for every tool, and hands each agent only the tools its role calls for. A gatherer needs search and scraping; a synthesizer does not. Scoping them keeps an agent from reaching for a tool that has no business in its step, and makes a missing API key a startup failure rather than a mid-run one.",
      },
    ],
    results: [
      { metric: "4", label: "Agents: coordinator, gatherer, analyst, synthesizer" },
      { metric: "3", label: "Memory tiers: short, long, and shared" },
      { metric: "5", label: "Tools, assigned per agent role" },
      { metric: "9", label: "Test modules across agents, memory, and tools" },
    ],
    diagram: {
      caption:
        "Four agents over a three-tier memory, with a source analyzer scoring credibility and bias before anything reaches the report.",
      lanes: ["Input", "Plan", "Gather", "Judge", "Output"],
      nodes: [
        { id: "q", label: "Research\nquery", col: 0, row: 0, kind: "source", note: "streamlit" },
        { id: "api", label: "FastAPI", col: 0, row: 1, kind: "process", note: "endpoints" },
        { id: "coord", label: "Coordinator", col: 1, row: 0, kind: "model", note: "plans" },
        { id: "mem", label: "Memory:\nshort, long, shared", col: 1, row: 1, kind: "store", note: "3 tiers" },
        { id: "gath", label: "Gatherer", col: 2, row: 0, kind: "model", note: "ranks sources" },
        { id: "tools", label: "5 tools", col: 2, row: 1, kind: "process", note: "per role" },
        { id: "anal", label: "Source\nanalyzer", col: 3, row: 0, kind: "process", note: "credibility, bias" },
        { id: "dat", label: "Analyst", col: 3, row: 1, kind: "model", note: "comparative" },
        { id: "syn", label: "Synthesizer", col: 4, row: 0, kind: "serve", note: "report" },
        { id: "cite", label: "Citations", col: 4, row: 1, kind: "serve", note: "export" },
      ],
      edges: [
        { from: "q", to: "coord" },
        { from: "api", to: "mem" },
        { from: "coord", to: "gath" },
        { from: "mem", to: "tools" },
        { from: "gath", to: "anal" },
        { from: "tools", to: "gath" },
        { from: "anal", to: "dat" },
        { from: "anal", to: "syn" },
        { from: "dat", to: "cite" },
      ],
    },
  },
};

/**
 * Fails the build if a detail key does not correspond to a real project, or if
 * a project is missing its deep dive. Both mistakes are invisible at runtime:
 * the page falls back to the short description and looks intentional.
 */
const projectSlugs = new Set(projects.map((project) => project.slug));

for (const key of Object.keys(projectDetails)) {
  if (!projectSlugs.has(key)) {
    throw new Error(
      `projectDetails key "${key}" matches no project slug. Known slugs: ${[...projectSlugs].join(", ")}`,
    );
  }
}

for (const slug of projectSlugs) {
  if (!projectDetails[slug]) {
    throw new Error(`Project "${slug}" has no entry in projectDetails.`);
  }
}
