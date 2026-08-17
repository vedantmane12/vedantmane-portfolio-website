/**
 * Writing: process engineering case studies.
 *
 * Same house rules as `site.ts`. Every figure here comes from the underlying
 * analysis rather than being invented for the page, and there are no em dashes
 * in visitor-facing copy.
 *
 * One caveat is deliberate and appears on every post that studies a named
 * organisation. The operational figures are the analytical baseline established
 * for the study, drawn from public information, interviews and stated
 * assumptions. They are not audited internal reporting, and saying so is the
 * difference between a case study and a claim about somebody else's numbers.
 */

export type BlogSection = {
  heading: string;
  /** Paragraphs. Rendered in order, no markdown parsing needed. */
  body: string[];
  /** Optional pull-out list under the paragraphs. */
  list?: { term: string; detail: string }[];
  /** Optional figure callouts, rendered as a small stat row. */
  stats?: { value: string; label: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Shown on the card and as the meta description. */
  excerpt: string;
  /** One-line kicker above the title. */
  kicker: string;
  discipline: string;
  date: string;
  /** ISO, for dateline and structured data. */
  isoDate: string;
  /** Derived, never authored. See `withDerived`. */
  readingMinutes: number;
  /** Derived. Shared with the JSON-LD so the page and the markup agree. */
  wordCount: number;
  tags: string[];
  /** The line that carries the card, deliberately short. */
  cardLine: string;
  /** Opening paragraphs, before the first heading. */
  intro: string[];
  sections: BlogSection[];
  /** Closing paragraphs. */
  closing: string[];
  /** Shown in a muted box under the dateline where figures need context. */
  sourceNote?: string;
};

const BASELINE_NOTE =
  "The operational figures in this piece are the analytical baseline for the study, established from public information, user interviews and stated assumptions. They are not audited internal reporting.";

export const blogIntro =
  "Process work is mostly a writing problem. You can draw a flawless future state and still change nothing, because the argument for it never got made in terms anyone could act on. These are six studies where the analysis had to survive that test.";

/** Authored shape. The two derived fields are added by `withDerived`. */
type PostSource = Omit<BlogPost, "readingMinutes" | "wordCount">;

const source: PostSource[] = [
  {
    slug: "it-service-desk-ticket-resolution",
    title: "72 Hours to Resolve a Ticket, and the Three Places It Actually Went",
    kicker: "Process analysis",
    discipline: "Process Analysis",
    date: "November 2025",
    isoDate: "2025-11-14",
    tags: ["BPMN", "TIMWOOD", "Root Cause Analysis", "Service Management"],
    cardLine: "Averages hide where the time goes. Waste analysis finds it.",
    excerpt:
      "Northeastern's IT Help Desk was resolving tickets in 72 hours against a 24 hour target. Waste analysis showed the delay was not in the work, it was in routing, waiting and rework.",
    intro: [
      "Northeastern University's IT Help Desk supports roughly 45,000 students, faculty and staff across 13 campuses, and was resolving tickets in an average of 72 hours against a 24 hour target. Three times over, consistently, on a queue of around 8,000 requests a month.",
      "The tempting read is that the team is understaffed. It usually is not, and it was not here. When a process misses its target by that margin, the time is rarely inside the work itself. It is in the gaps between the steps, and the only way to prove that is to go and measure the gaps.",
    ],
    sections: [
      {
        heading: "Mapping what actually happens, not what is documented",
        body: [
          "The as-is BPMN model was built from how tickets really moved rather than from the process document. That distinction matters because the two had diverged. The documented flow showed triage assigning tickets to a queue. The real flow showed triage assigning tickets to a queue, then a second person reassigning about a third of them once someone with more context looked properly.",
          "Modelling the real path put the rework loop on the page where it could be counted, which is the entire point of drawing the thing.",
        ],
      },
      {
        heading: "TIMWOOD, and why two of the seven mattered",
        body: [
          "Applying the seven wastes to the flow produced findings in every category, which is normal and also unhelpful. A framework that flags everything prioritises nothing. The useful step is ranking them against the metric you are trying to move.",
          "Two dominated. Transport, in the form of misrouted tickets travelling between teams. And Waiting, in the form of tickets sitting idle pending information the requester was never asked for up front. The other five were real but marginal against a 48 hour gap.",
        ],
        list: [
          {
            term: "Transport",
            detail:
              "Around 30% of tickets reached the wrong team first and had to be redirected, each hop adding queue time rather than work time.",
          },
          {
            term: "Waiting",
            detail:
              "Around 20% stalled pending clarification, because intake collected a description but not the specifics the resolving team would need.",
          },
          {
            term: "Motion",
            detail:
              "Agents moved between the ticketing system, a disconnected knowledge base and email to assemble one answer.",
          },
          {
            term: "Overproduction",
            detail:
              "The same solutions were documented repeatedly, because nothing fed them back into the knowledge base.",
          },
        ],
      },
      {
        heading: "Root cause, not symptom",
        body: [
          "A fishbone analysis pushed each waste back to something addressable. Misrouting was not carelessness. Triage staff were sorting on a free-text description with no structured signal about system, urgency or affected population, and no feedback loop telling them when a routing decision had been wrong.",
          "That reframing changes the intervention entirely. Retraining triage staff addresses a cause that does not exist. Giving intake enough structure to route on addresses the one that does.",
        ],
      },
      {
        heading: "Designing the future state around the two findings",
        body: [
          "The to-be model changed five things, each traceable to a measured waste rather than to a wish list.",
          "Classification moved off free text and onto the ticket description itself, so routing had something to act on. The knowledge base was connected to intake, so a requester with a known problem could resolve it without a ticket at all. Simple and complex work were split into separate queues with separate service levels, because holding a password reset behind a server migration is a queueing decision, not a capacity one. Status updates became automatic, which removes the status-check tickets that a slow queue generates. And recurring issues were flagged before they multiplied.",
        ],
        stats: [
          { value: "72h to 28h", label: "Projected average resolution, a 61% reduction" },
          { value: "30% to under 8%", label: "Tickets reaching the wrong team first" },
          { value: "45% to 65%", label: "Resolved on first contact" },
        ],
      },
      {
        heading: "What the roadmap had to admit",
        body: [
          "A phased plan is where process work usually gets honest. Splitting the queues needs a policy decision about service levels, not a technology change, and it delivers the largest single reduction. It went first because it is cheap and immediate.",
          "Automated classification went later, because it needs labelled history to be any good, and shipping it early would have produced confident routing into the wrong queue. Sequencing by dependency rather than by enthusiasm is the difference between a roadmap and a wish list.",
        ],
      },
    ],
    closing: [
      "The finding that mattered was not any single number. It was that the 48 hour gap lived almost entirely in movement and waiting, so every proposal aimed at making agents work faster would have missed.",
      "Averages hide this. A 72 hour mean tells you nothing about whether the time is in the work or in the queue, and those two problems have nothing in common.",
    ],
    sourceNote: BASELINE_NOTE,
  },

  {
    slug: "study-space-design-thinking",
    title: "The Booking System Worked. Students Still Could Not Get a Room.",
    kicker: "Design thinking",
    discipline: "Design Thinking",
    date: "November 2025",
    isoDate: "2025-11-21",
    tags: ["Design Thinking", "User Research", "Journey Mapping", "Prototyping"],
    cardLine: "A working system solving the wrong problem.",
    excerpt:
      "Snell Library has 50 study rooms and a working booking platform, and students still could not get one. Ten interviews found the failure was not in the software.",
    intro: [
      "Snell Library at Northeastern University has 50 group study rooms and a booking platform that works exactly as specified. Students still could not reliably get a room, and the recent migration to a new platform had not changed that.",
      "When a system meets its requirements and users are still stuck, the requirements were describing the wrong problem. Finding out what the right one is means asking people rather than reading tickets, so the study started with ten students across different usage patterns and no hypothesis worth defending.",
    ],
    sections: [
      {
        heading: "Research before design, deliberately",
        body: [
          "Interviews were paired with direct observation during peak afternoon periods and with journey mapping sessions where students marked their own path through booking a room. The observation mattered more than expected. Two separate visits found rooms displaying as reserved with groups inside who were plainly past their booking end time, which is the kind of thing nobody reports and everybody experiences.",
        ],
      },
      {
        heading: "Five findings, and the one nobody had filed",
        body: [
          "The most common frustration was arriving to find a reserved room occupied. The platform has a 15 minute void rule for no-shows, which handles the opposite failure and does nothing about overstay, because once a group is inside there is no enforcement.",
          "The second was that students could not tell what a room contained before booking it. The interface lists rooms by number and floor. No features, no photos, no capacity beyond a figure. One participant needed a display to rehearse a presentation and spent twenty minutes moving between rooms. Another needed accessible space and had no way to filter for it. On one journey map the whole group labelled the selection step with a single word: guess.",
          "The third was structural. Slots open a week ahead, so during busy periods everything desirable is gone within minutes of midnight. Experienced students set an alarm. An international student in the study had no idea this was the norm and said she simply never got a room during exam weeks. The system was not unfair by design, but it distributed access by insider knowledge, which comes to the same thing.",
        ],
      },
      {
        heading: "Reframing the problem",
        body: [
          "Stated as a booking problem, the solution is a better booking form. Stated as what the research actually found, it becomes three separate problems: rooms are held past their slot, rooms cannot be assessed before selection, and access is allocated by who knows the midnight convention.",
          "Only the second is a software problem in the ordinary sense. The first needs enforcement, the third needs an allocation policy. That is why the original platform migration did not help. It solved the interface and left the other two untouched.",
        ],
      },
      {
        heading: "Prototyping at two fidelities",
        body: [
          "A low fidelity sketch tested the concept before anything was built, then a working digital mockup tested the interaction. Splitting it that way keeps the expensive iteration for questions that need it, and stops the first round of feedback being about visual design when the flow is still wrong.",
          "Testing changed the design in three specific ways rather than confirming it. That ratio is the point of prototyping. A round of testing that changes nothing usually means the questions were too safe.",
        ],
      },
      {
        heading: "What the future state had to include",
        body: [
          "The to-be journey addressed all three problems rather than the tractable one. Room detail at the point of selection, so choosing is informed rather than a guess. Occupancy signal, so a held room is visible rather than discovered on arrival. And an allocation rule that does not reward knowing about midnight.",
        ],
      },
    ],
    closing: [
      "The platform was never broken. It was solving the problem it had been given, which was booking, while students were experiencing three problems of which booking was the least severe.",
      "This is the ordinary way requirements go wrong. Nobody made a mistake. The question was framed before anyone had watched somebody stand outside an occupied room for ten minutes, and after that it framed itself.",
    ],
    sourceNote: BASELINE_NOTE,
  },

  {
    slug: "course-evaluation-platform-replacement",
    title: "A 28% Response Rate Is Not a Participation Problem",
    kicker: "Project planning",
    discipline: "Project Management",
    date: "December 2025",
    isoDate: "2025-12-05",
    tags: ["Project Charter", "WBS", "Critical Path", "Risk Management"],
    cardLine: "Below 35%, the data stops meaning anything.",
    excerpt:
      "Northeastern's course evaluation platform was collecting 28% response with 80% mobile abandonment. Planning the replacement meant justifying it in terms a finance committee would accept.",
    intro: [
      "Northeastern's course evaluation system was returning a 28% response rate. That figure sits below the threshold most researchers treat as the floor for statistical reliability, which means the data was not merely thin. It was being used to make decisions it could not support.",
      "The more revealing number was that 80% of students abandoned the evaluation on mobile before finishing. That is not apathy. That is a platform built before phones were the default, still being asked to collect the majority of its responses on one.",
    ],
    sections: [
      {
        heading: "Building the case in the language of the decision",
        body: [
          "A replacement gets approved by a committee weighing it against everything else competing for the same budget, so the business case had to be comparative rather than aspirational. Peer institutions running modern platforms were achieving materially higher participation, which reframes the ask. It stops being a request for new software and becomes a gap against comparable institutions.",
          "The target was set just above where those peers operate. Credible targets survive scrutiny. Ambitious ones invite a conversation about whether the whole estimate is inflated.",
        ],
        stats: [
          { value: "28% to 60%", label: "Target response rate within one academic year" },
          { value: "80%", label: "Mobile abandonment before completion" },
          { value: "~14 months", label: "Projected payback period" },
        ],
      },
      {
        heading: "Scope, and what was deliberately left out",
        body: [
          "The charter fixed scope explicitly, including the exclusions. Scope statements that only list inclusions leave every adjacent request arguable, and on a platform replacement the adjacent requests arrive continuously because everyone has an opinion about what else the system could collect.",
          "Constraints, assumptions and dependencies were written down at the same time, which is less about documentation than about making the assumptions falsifiable. An assumption nobody wrote down cannot be checked when it turns out to be wrong.",
        ],
      },
      {
        heading: "Work breakdown and the critical path",
        body: [
          "The work breakdown structure decomposed delivery into work packages small enough to estimate honestly. The schedule then exposed the critical path, which is the only part of a plan that determines the end date.",
          "This matters more than it sounds. Compressing a task that is not on the critical path buys nothing and costs real money. Most schedule pressure gets applied to whatever is most visible rather than to whatever is actually binding, and the critical path is the difference between the two.",
        ],
      },
      {
        heading: "Justifying it financially",
        body: [
          "Two arguments carried the financial case. Automating manual evaluation workflows removes a recurring administrative cost. And better evaluation data feeds retention, where even a conservative improvement is worth more than the platform costs, because a retained student is a full year of tuition rather than a saved hour of admin.",
          "The second argument is the stronger one and the easier one to overstate, so it was kept deliberately conservative. A business case that assumes the optimistic case gets discounted entirely once anyone finds the assumption.",
        ],
      },
      {
        heading: "Risk, held against the plan",
        body: [
          "Risks were registered with owners and mitigations rather than listed. A risk register with no owner is a list of things that will surprise you later with a written record proving you knew.",
        ],
      },
    ],
    closing: [
      "The framing that made the case was refusing to treat 28% as a participation problem. Participation problems get answered with reminder emails, which had been tried.",
      "Once the abandonment figure was on the table, the diagnosis changed and so did the solution. Students were not declining to respond. They were starting, meeting a form built for a desktop, and leaving.",
    ],
    sourceNote: BASELINE_NOTE,
  },

  {
    slug: "returns-refunds-process-redesign",
    title: "The Refund Fired Before Anyone Looked at the Box",
    kicker: "Process redesign",
    discipline: "Process Redesign",
    date: "December 2025",
    isoDate: "2025-12-12",
    tags: ["SIPOC", "BPMN", "Fraud Controls", "Process Governance"],
    cardLine: "An ordering bug, running at commercial scale.",
    excerpt:
      "A returns process taking 5 to 14 days, with refunds posting before inspection on nearly a fifth of returns. The sequence was the defect.",
    intro: [
      "A retail returns and refunds process was taking between 5 and 14 days across thousands of returns a month, with costs rising 22% year over year. The visible complaints were about speed. The finding underneath was about order of operations.",
      "On roughly 18% of returns, the refund posted before the inspection finished. The process was not slow because inspection was slow. It was expensive because the control that inspection exists to provide was being bypassed by the sequence.",
    ],
    sections: [
      {
        heading: "SIPOC first, to fix the boundary",
        body: [
          "Before any modelling, a SIPOC set the boundary: return request initiated through to refund posted and inventory updated. Getting that boundary right is what stops the analysis wandering into procurement or customer acquisition, and it forces an early answer to who the process actually serves.",
        ],
      },
      {
        heading: "Three failure modes that compound",
        body: [
          "Modelling the current state surfaced three defects that each look survivable alone and are not, because each makes the others worse.",
        ],
        list: [
          {
            term: "Refunds preceding approval",
            detail:
              "Around 18% of refunds posted before inspection completed, so the inspection outcome could not affect the financial decision it existed to inform.",
          },
          {
            term: "Inspection without a standard",
            detail:
              "Around 28% variance in outcomes for identical items across different staff, which makes the inspection result a function of who performed it.",
          },
          {
            term: "No shared visibility",
            detail:
              "Teams could not see each other's state, so handoffs were assumed rather than confirmed and status checks became a support workload of their own, estimated at a quarter to a third of return-related contact.",
          },
        ],
      },
      {
        heading: "Why the ordering defect is the expensive one",
        body: [
          "Refunding before inspection converts every other weakness into a loss. Inconsistent grading stops being a quality issue and becomes money already gone. Fraudulent returns stop being detectable and become a payment already made. Against an industry backdrop where a meaningful share of consumer returns are classified as fraudulent, a process that pays before it checks is not exposed to fraud so much as underwriting it.",
          "This is why sequencing is worth arguing about. The same activities in a different order produce a different risk profile without anyone doing anything wrong.",
        ],
      },
      {
        heading: "The redesign, in the order it had to happen",
        body: [
          "The to-be process enforced inspection before refund approval, which is the change everything else depends on. Fraud checks moved to intake, where they can prevent rather than detect. Inspection criteria were standardised so the outcome stops depending on the assessor. And low risk returns were automated, which is only safe once the first three are true.",
          "The automation is last on purpose. Automating a process with a 28% grading variance and no inspection gate does not remove the defects, it removes the humans who were occasionally catching them.",
        ],
      },
      {
        heading: "Governance as part of the design",
        body: [
          "The plan included monitoring and a governance structure rather than treating the redesign as a delivery with an end date. Processes drift. Without something watching the variance figure, standardised inspection criteria decay back into individual judgement within a couple of staff changes.",
        ],
      },
    ],
    closing: [
      "The lesson worth keeping is how ordinary the root cause was. Nobody designed a process to pay out before checking. It emerged, because refunding on request is faster for the customer and every individual decision that got it there was locally reasonable.",
      "Sequence defects are like that. They hide behind the fact that all the right activities are present, and present is not the same as ordered.",
    ],
  },

  {
    slug: "parking-permit-service-redesign",
    title: "Thirty-Four Percent of Purchases Needed a Human. The Form Was Asking the Wrong Question.",
    kicker: "Service design",
    discipline: "Design Thinking",
    date: "January 2026",
    isoDate: "2026-01-16",
    tags: ["Service Design", "Prototyping", "Concept Selection", "Usability Testing"],
    cardLine: "58% picked the right permit. The rest called.",
    excerpt:
      "A parking permit portal where a third of purchases needed staff intervention. Testing showed people could not tell which permit applied to them, and the fix was not a better form.",
    intro: [
      "A university parking permit system was routing 34% of purchases into manual staff intervention. Testing the live portal found that only 58% of people selected the correct permit on their first attempt.",
      "Those two numbers are the same number. The intervention rate was not a service capacity problem, it was the downstream cost of a selection step that people could not complete correctly.",
    ],
    sections: [
      {
        heading: "How the office saw it versus what research found",
        body: [
          "The operational view was that students chose the wrong permit and needed better instructions. The research view was that the portal presented permit types as a catalogue and asked people to self-identify against eligibility rules they had no way to evaluate.",
          "Those framings produce entirely different solutions. The first leads to clearer help text. The second leads to not asking the question at all.",
        ],
      },
      {
        heading: "The appeals process had a separate problem",
        body: [
          "Appeals ran by phone and took around 15 days, with an 18% success rate. Participants described the process as pointless, and on those numbers that is a reasonable conclusion rather than a complaint.",
          "A low success rate is not inherently wrong. Paired with a two week wait and no visibility, it stops functioning as a remedy and becomes a deterrent, which changes what the process is actually for.",
        ],
      },
      {
        heading: "Diverging properly before converging",
        body: [
          "Ideation produced 38 ideas across five How Might We questions using brainstorming, Crazy 8s and journey-based prompts. That volume is the point. Teams that generate six ideas pick the least objectionable one, because with six options there is no real selection happening.",
          "Those were clustered into five developed concepts and scored against a matrix, which forces the selection criteria to be stated before the preferred answer is known.",
        ],
      },
      {
        heading: "The concept that won, and why",
        body: [
          "The selected concept replaced catalogue selection with a guided flow that asks about circumstances and determines the permit, moving the eligibility logic from the user to the system. Two other concepts were folded into it and one was deferred to a later phase rather than being discarded, which keeps the roadmap honest about what was cut.",
        ],
      },
      {
        heading: "Progressive fidelity, and what testing changed",
        body: [
          "Prototyping moved from a paper wizard through to a working mockup, testing at each level. The results moved substantially between rounds, which is the entire justification for testing more than once.",
        ],
        stats: [
          { value: "58% to 78%", label: "Correct permit on first attempt, first prototype round" },
          { value: "92%", label: "Correct selection after the second round of iteration" },
          { value: "15 days to 3", label: "Target appeal resolution time" },
        ],
      },
    ],
    closing: [
      "The intervention rate was treated as a staffing figure for a long time, and staffing figures get answered with staffing. It was a design figure, and the evidence for that was sitting in a first-attempt success rate nobody had measured.",
      "The reframing that unlocked it was refusing to ask users a question the system could answer itself. Eligibility rules were known to the institution the entire time. They were simply being enforced at the wrong end of the transaction.",
    ],
    sourceNote: BASELINE_NOTE,
  },

  {
    slug: "invoice-automation-governance",
    title: "The Last Automation Attempt Failed. That Shaped Everything About This One.",
    kicker: "Delivery governance",
    discipline: "Project Governance",
    date: "January 2026",
    isoDate: "2026-01-30",
    tags: ["RPA", "Hybrid Delivery", "Stage Gates", "Risk Management"],
    cardLine: "Scoped to 70%, because 100% is how the last one failed.",
    excerpt:
      "An accounts payable automation pilot governed around a prior failure. Deliberately narrow scope, hybrid delivery, and two gates with the authority to stop it.",
    intro: [
      "An accounts payable function was processing invoices at roughly $12 each, running to over $1.4 million a year in processing cost alone. A previous automation attempt had made things worse.",
      "That history is the most important input to the plan. Governing a project in an organisation that has already been burned by the same class of project is a different exercise from governing a first attempt, because the scepticism is earned and the credibility has to be rebuilt before scope can be expanded.",
    ],
    sections: [
      {
        heading: "Scoping to the boring 70%",
        body: [
          "The pilot targeted the 70% of invoices that are clean three-way matches under a threshold, across two departments over 20 weeks. That is deliberately the least interesting portion of the workload, and choosing it was the central decision.",
          "Automating the difficult 30% first is how the previous attempt failed. Exceptions are where the edge cases live, and an automation that stumbles publicly on them destroys the trust needed to continue. Reliable success on the predictable majority buys the credibility to tackle the rest later.",
        ],
        stats: [
          { value: "70%", label: "Of invoice volume in the pilot's scope" },
          { value: "~$93k/mo", label: "Projected savings at full rollout scale" },
          { value: "~2.7 months", label: "Projected payback" },
        ],
      },
      {
        heading: "Hybrid delivery, chosen rather than defaulted",
        body: [
          "Governance milestones and audit checkpoints ran waterfall because those dates could not move. Bot configuration ran in two week sprints because the routing rules could not be fully specified before testing started.",
          "This is the honest version of hybrid delivery. Not a compromise between two camps, but a recognition that the two halves of the work have genuinely different characteristics. Audit dates are fixed and known. Rule behaviour is discovered. Forcing either into the other's method produces either fictional specifications or missed compliance dates.",
        ],
      },
      {
        heading: "Testing rules by coverage, not by count",
        body: [
          "Rather than testing all the routing rules individually, testing prioritised the subset representing about 80% of invoice volume. That is a defensible allocation of limited test capacity, and it is defensible precisely because it is stated. An untested rule you have identified is a known risk. An untested rule you have not is a defect waiting for production.",
        ],
      },
      {
        heading: "Gates with the authority to stop",
        body: [
          "Two gates controlled delivery. At week 12, the bot had to reach a straight-through processing threshold in user acceptance testing, clear audit review and close all critical defects before the live pilot could begin. At week 20, all five success criteria had to hold.",
          "A gate that cannot stop the project is a status meeting. Writing the criteria numerically and in advance is what gives the gate teeth, because it removes the argument about whether the result was good enough from the moment when everyone is invested in continuing.",
        ],
        list: [
          { term: "Cycle time", detail: "Two days or below." },
          { term: "Straight-through processing", detail: "80% of invoices handled without human intervention." },
          { term: "Error rate", detail: "0.5% or below, against a 3% baseline." },
          { term: "Audit trail", detail: "Maintained in full throughout." },
          { term: "Return on investment", detail: "Confirmed positive within 12 months." },
        ],
      },
      {
        heading: "The risk that outlived the project",
        body: [
          "A planned ERP upgrade around 18 months out was identified as the largest threat to the project's long-term value, because it may include native automation that renders the bot layer redundant.",
          "Naming that in the risk register rather than avoiding it is what makes a short payback period the right answer instead of a lucky one. A 2.7 month payback against an 18 month horizon is a sound investment. The same work with a three year payback would not be, and the difference is entirely in whether anyone said the upgrade out loud during planning.",
        ],
      },
    ],
    closing: [
      "The plan's strongest feature is that it is small. Two departments, the predictable majority of the volume, 20 weeks, and gates that can stop it.",
      "In an organisation with a failed attempt behind it, scope discipline is not caution. It is the mechanism for rebuilding the credibility that any larger rollout would need, and it is the thing the previous attempt did not have.",
    ],
  },
];

/**
 * 225 words a minute, the usual average for adult silent reading of non-fiction
 * prose. Platforms sit between 200 and 265, so this is deliberately mid-range
 * rather than flattering.
 */
const WORDS_PER_MINUTE = 225;

/** Everything a reader actually reads, in the order they meet it. */
function countWords(post: PostSource): number {
  const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
  let n = words(post.title) + post.intro.reduce((a, s) => a + words(s), 0);
  for (const section of post.sections) {
    n += words(section.heading);
    n += section.body.reduce((a, s) => a + words(s), 0);
    for (const item of section.list ?? []) n += words(item.term) + words(item.detail);
    for (const stat of section.stats ?? []) n += words(stat.value) + words(stat.label);
  }
  return n + post.closing.reduce((a, s) => a + words(s), 0);
}

/**
 * Reading time is computed, not authored. It was authored once, and every one of
 * the six was roughly four times the real figure: 11 to 14 minutes claimed
 * against 500 to 750 words, which is two to three. A number nobody can check
 * without a stopwatch still has to be true, and deriving it means it cannot
 * drift again when the copy is edited.
 */
function withDerived(post: PostSource): BlogPost {
  const wordCount = countWords(post);
  return {
    ...post,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
  };
}

export const posts: BlogPost[] = source.map(withDerived);

/** Newest first, so the index does not depend on array order being maintained. */
export const postsByDate = [...posts].sort((a, b) =>
  b.isoDate.localeCompare(a.isoDate),
);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
