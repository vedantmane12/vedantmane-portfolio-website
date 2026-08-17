/**
 * Writing: process engineering case studies.
 *
 * Same house rules as `site.ts`. Every figure here comes from the underlying
 * analysis rather than being invented for the page, and there are no em dashes
 * in visitor-facing copy.
 *
 * Two source notes are deliberate, and one of them appears on every post.
 *
 * Three of these studies examine a named organisation. Their operational
 * figures are the analytical baseline established for the study, drawn from the
 * brief's stated parameters, public information and my own user research. They
 * are not audited internal reporting, and saying so is the difference between a
 * case study and a claim about somebody else's numbers.
 *
 * The other three work from a scenario rather than a client. Their figures are
 * the scenario's parameters plus my own modelling, with industry benchmarks
 * cited to source. Presenting modelled figures as though they were measured
 * from a real company would be the same failure in the other direction.
 *
 * Where a source document contradicted itself, the figure with a stated
 * measurement method won and the conflict is noted in the section comment.
 */

/**
 * A figure lifted from the original analysis: BPMN models, journey maps,
 * fishbone diagrams, risk matrices, prototype screens.
 *
 * `width` and `height` are the real pixel dimensions of the asset, so the page
 * reserves the right box and never shifts on load, and so the component can
 * refuse to upscale a figure past its native size. Several of these were
 * embedded in the source PDFs at modest resolution and go blurry if stretched.
 *
 * `tone` is measured, not guessed: it comes from the mean luminance of the
 * processed file. It decides which way the frame and the zoom affordance need
 * to contrast, since roughly a third of these figures were authored dark and
 * the rest light.
 */
export type BlogFigure = {
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  /** Describes what the figure contains, for screen readers and for search. */
  alt: string;
  /** Visible caption. Says what to look for rather than restating the alt. */
  caption: string;
  tone: "light" | "dark";
};

export type BlogSection = {
  heading: string;
  /** Paragraphs. Rendered in order, no markdown parsing needed. */
  body: string[];
  /** Optional pull-out list under the paragraphs. */
  list?: { term: string; detail: string }[];
  /**
   * Figures illustrating this section. Attached by heading from `FIGURES` in
   * `withDerived` rather than written inline, so the prose stays readable and
   * so an orphaned figure fails the build instead of vanishing quietly.
   */
  figures?: BlogFigure[];
  /**
   * Optional figure callouts, rendered as a small stat row.
   *
   * Keep `value` to about 10 characters. The row is three columns from 640px up
   * and the article measure caps its container at 560px, so each cell is 154px
   * at every width above mobile, which fits roughly ten characters of 24px
   * monospace. Longer values wrap and knock the labels out of alignment. Put the
   * comparison in the label: "Under 8%" with "from 30% today", not
   * "30% to under 8%".
   */
  stats?: { value: string; label: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /**
   * Short, keyword-led title for the `<title>` tag only. The editorial titles
   * run 62 to 102 characters once the name suffix is added, and a search result
   * shows roughly 60, so the interesting half was being cut off. The full title
   * still carries the H1 and the social card, where length is not the
   * constraint and the hook matters more than the keywords.
   */
  seoTitle?: string;
  /** Shown on the card. Also the social description. */
  excerpt: string;
  /**
   * Meta description. The excerpts run 158 to 206 characters because they earn
   * their length on the index card; a search snippet shows about 155.
   */
  seoDescription?: string;
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

/** For studies of a named organisation. */
const BASELINE_NOTE =
  "The operational figures in this piece are the analytical baseline for the study, established from the brief's stated parameters, public information and my own user research. They are not audited internal reporting from the organisation named.";

/** For studies built on a course scenario rather than a client. */
const SCENARIO_NOTE =
  "This study works from a scenario rather than a named client. The operational figures are the scenario's parameters plus my own modelling, and the industry benchmarks are cited to their sources in the original report. Nothing here is a claim about a real company's internal reporting.";

/**
 * When these pieces were last substantially revised, as distinct from when they
 * were published.
 *
 * All six were rewritten in one pass: roughly five times the original length,
 * from the underlying reports, with 56 figures added. `isoDate` stays the
 * publication date so the dateline and `datePublished` keep telling the truth,
 * and this drives `dateModified` and the sitemap's `lastmod`. Using the
 * publication date for both would tell a crawler that nothing has changed since
 * January, which is the opposite of what happened.
 *
 * Bump this by hand on the next real revision. Not `new Date()`: that stamps
 * every build and teaches crawlers the dates mean nothing.
 */
export const CONTENT_REVISED = "2026-08-17";

export const blogIntro =
  "Process work is mostly a writing problem. You can draw a flawless future state and still change nothing, because the argument for it never got made in terms anyone could act on. These are six studies where the analysis had to survive that test.";

/** Authored shape. The two derived fields are added by `withDerived`. */
type PostSource = Omit<BlogPost, "readingMinutes" | "wordCount">;

const source: PostSource[] = [
  {
    slug: "it-service-desk-ticket-resolution",
    seoTitle: "IT Service Desk Process Analysis with BPMN",
    seoDescription:
      "A BPMN and TIMWOOD waste analysis of a university IT help desk resolving tickets in 72 hours against a 24 hour target.",
    title:
      "72 Hours to Resolve a Ticket, and the Three Places It Actually Went",
    kicker: "Process analysis",
    discipline: "Process Analysis",
    date: "November 2025",
    isoDate: "2025-11-14",
    tags: ["BPMN", "TIMWOOD", "Root Cause Analysis", "Service Management"],
    cardLine: "Averages hide where the time goes. Waste analysis finds it.",
    sourceNote: BASELINE_NOTE,
    excerpt:
      "Northeastern's IT Help Desk was resolving tickets in 72 hours against a 24 hour target. Waste analysis showed the delay was not in the work, it was in routing, waiting and rework.",
    intro: [
      "Northeastern University's IT Help Desk supports roughly 45,000 students, faculty and staff across 13 campus locations, and was resolving tickets in an average of 72 hours against a 24 hour target. Three times over, consistently, on a queue of around 8,000 requests a month.",
      "The tempting read is that the team is understaffed. It usually is not, and it was not here. When a process misses its target by that margin, the time is rarely inside the work itself. It is in the gaps between the steps, and the only way to prove that is to go and measure the gaps.",
      "What follows is the analysis in the order it actually ran: map the real process, count the waste, push each waste back to a cause, and only then design anything. The order matters more than any individual finding, because every tempting shortcut in this kind of work involves skipping straight to the solution.",
    ],
    sections: [
      {
        heading: "Why this process, and what I already knew about it",
        body: [
          "I chose ticket resolution over the other candidates because I had worked inside one. Three years as a Systems Engineer on incident management systems handling over 150 tickets a day teaches you where the time goes in a service desk, and it is almost never where the dashboard says.",
          "What I had seen before showed up again here. Tickets sat unseen until somebody assigned them manually. Users got no update unless they chased one themselves. Resolution often needed two or three departments, and no single person owned the outcome across them.",
          "That prior exposure was useful and also a risk. Knowing the pattern makes it easy to assume the pattern rather than verify it, so the discovery work was deliberately structured to test whether this desk actually matched the one I remembered. In two respects it did not, which is why the future state does not simply add headcount or retrain triage staff.",
        ],
      },
      {
        heading: "Mapping what actually happens, not what is documented",
        body: [
          "The as-is BPMN model was built from how tickets really moved rather than from the process document. That distinction matters because the two had diverged. The documented flow showed triage assigning a ticket to a queue. The real flow showed triage assigning a ticket to a queue, then a second person reassigning about a third of them once somebody with more context looked properly.",
          "The shape of the process explains part of the problem. Requests arrive through five channels: phone, email, live chat, the Tech Service Portal, and in person at the Tech Bar. Each channel captures a different amount of information. All of them feed one queue, where a Tier 1 agent reads the description and assigns a category, a priority and a team. Simple work resolves there. Everything else escalates to Tier 2 or Tier 3 specialists.",
          "That tiered structure is standard IT service management and there is nothing wrong with it. Its effectiveness depends entirely on how well tickets are sorted at the point of entry, which is precisely where the process had no support. Modelling the real path put the rework loop on the page where it could be counted, which is the entire point of drawing the thing.",
        ],
        list: [
          {
            term: "Submission",
            detail:
              "Users provide incomplete information, so agents spend time gathering details that intake should have collected.",
          },
          {
            term: "Categorisation",
            detail:
              "Manual sorting on a free-text description, which sends 30% of tickets to the wrong team first.",
          },
          {
            term: "Queue",
            detail:
              "A single queue for every ticket type, so a password reset waits behind a server migration.",
          },
          {
            term: "Resolution",
            detail:
              "No knowledge base integration, so agents rebuild answers that already exist somewhere.",
          },
          {
            term: "Communication",
            detail:
              "Manual status updates only, so users have no visibility unless they contact the desk again.",
          },
        ],
      },
      {
        heading: "TIMWOOD, and why two of the seven mattered",
        body: [
          "Applying the seven wastes to the flow produced findings in every category, which is normal and also unhelpful. A framework that flags everything prioritises nothing. The useful step is ranking them against the metric you are trying to move, in this case a 48 hour gap between actual and target resolution.",
          "Two dominated. Transport, in the form of misrouted tickets travelling between teams. And Waiting, in the form of tickets sitting idle pending information the requester was never asked for up front. The other five were real, and they were also marginal against the gap. Naming them without ranking them would have produced a report where every finding looked equally urgent, which is the same as having no findings at all.",
          "Inventory showed up as backlog building during peak periods. Motion showed up as agents switching between the ticketing system, a disconnected knowledge base and email to assemble a single answer. Overproduction showed up as the same solutions being written repeatedly because nothing fed them back anywhere. Overprocessing showed up as review steps on routine requests. Defects showed up as reopened tickets and duplicates.",
        ],
        stats: [
          {
            value: "30%",
            label: "Tickets reaching the wrong team first, then redirected",
          },
          {
            value: "20%",
            label:
              "Tickets stalling pending information intake never asked for",
          },
          {
            value: "8,000",
            label: "Requests a month across five submission channels",
          },
        ],
      },
      {
        heading: "Three bottlenecks, named and counted",
        body: [
          "A bottleneck is a point where work accumulates because capacity is limited. Three of them controlled the resolution time, and separating them from the waste analysis matters because they call for different interventions.",
          "The first was manual categorisation. Every ticket passed through a Tier 1 agent who read and classified it, which caps throughput at reading speed, makes quality dependent on individual experience, and generates the 30% misroute rate that creates rework downstream.",
          "The second was the single queue. Complexity had no effect on position, so quick fixes could not move ahead of long ones and resources were never matched to difficulty. This is worth stating precisely: it is a queueing decision, not a capacity problem, and it can be changed without hiring anyone.",
          "The third was the information gathering loop. When a ticket lacked detail, work stopped while somebody contacted the user, and the ticket then sat idle for as long as the user took to reply. One in five tickets went through this, and the wait is entirely outside the desk's control once it starts.",
        ],
      },
      {
        heading: "Root cause, not symptom",
        body: [
          "Two tools ran here rather than one, because they answer different questions. A fishbone diagram spreads a single problem across its contributing categories. Five Whys drills a single chain until it reaches something you can actually change.",
          "The fishbone examined the 30% misroute rate across six categories. People contributed varying experience levels and workload pressure. Process contributed no standard categorisation guidelines and no feedback loop. Technology contributed no assisted categorisation and disconnected systems. Information contributed vague descriptions and submission forms with no required fields. Environment contributed volume and peak surges across five channels. Management contributed no tracking by category and limited quality audits.",
          "The Five Whys chain ran: resolution takes 72 hours because tickets wait and get rerouted, they get rerouted because 30% go to the wrong team, they go to the wrong team because agents categorise manually on limited information, they categorise manually because no automated routing exists, and no automated routing exists because the process was designed before these tools were available and has not been redesigned since.",
          "That last answer is the one that changes the intervention. Misrouting was not carelessness. Triage staff were sorting on free text with no structured signal about system, urgency or affected population, and no feedback telling them when a routing decision had been wrong. Retraining triage staff addresses a cause that does not exist. Giving intake enough structure to route on addresses the one that does.",
        ],
      },
      {
        heading: "Which activities the requester would actually pay for",
        body: [
          "Separating value-added from non-value-added activity is a blunt instrument, and it earned its place here by showing how much of the elapsed time belonged to neither the user nor the work.",
          "The value-added path is short: the user submits a ticket, an agent understands the issue, searches for a solution, resolves it, documents it, and the user confirms. Six steps, none of them slow on their own.",
          "The non-value-added path running alongside it is the same length: an agent categorises manually, the ticket waits in queue, it gets rerouted to the correct team, an agent contacts the user for more information, the user waits without updates, and duplicate tickets appear for the same issue. Six steps, and they own most of the 72 hours.",
        ],
      },
      {
        heading: "Five principles, applied before any solution",
        body: [
          "The future state follows five principles taken from Lean thinking, and stating them first was a way of constraining my own design choices rather than decoration.",
          'Simplify before automating. Bill Gates put the risk precisely: "Automation applied to an inefficient operation will magnify the inefficiency." The design removes steps first and automates what survives. Build quality into the process, so errors are prevented at intake rather than caught after routing. Create flow, replacing the single queue with parallel paths by complexity. Pull rather than push, so tickets move to the right resource on actual availability instead of being pushed into one queue. And enable self-service, because a large share of requesters can solve their own problem given the right information at the right moment.',
          "The approach that follows from those principles is moderate rather than transformational. It builds on the existing platform instead of replacing it, which avoids the cost and risk of a migration while still addressing every measured waste.",
        ],
      },
      {
        heading: "The capability was already bought and not switched on",
        body: [
          "The desk runs on ServiceNow, a mainstream IT service management platform, alongside a knowledge base living inside the Tech Service Portal. The two are not connected. A user must search for an answer themselves before submitting, and an agent gets no suggested articles when a ticket arrives.",
          "This is the finding that reframed the whole recommendation. ServiceNow already ships AI capability through its Now Assist features, including retrieval-augmented generation for search, predictive routing and virtual agents. None of it was in use. The gap between current and future state was therefore not a purchasing decision, it was a configuration decision, which changes both the cost and the political difficulty of the proposal.",
          "Five improvements follow, each traceable to a measured waste rather than to a wish list.",
        ],
        list: [
          {
            term: "Categorisation on meaning, not keywords",
            detail:
              "Natural language processing reads what the user described, suggests a category and routes accordingly. Agents can override, and the system learns from the corrections. Targets the 30% misroute rate.",
          },
          {
            term: "Knowledge base joined to intake with RAG",
            detail:
              "As a user types, the system retrieves relevant articles and shows them before submission. If that resolves the issue, no ticket exists. If a ticket is submitted, the articles attach for the agent.",
          },
          {
            term: "Tiered queues with separate service levels",
            detail:
              "Fast-track for simple requests, Tier 1 with assistance for standard incidents, Tier 2 for complex technical work, immediate escalation for anything affecting many users.",
          },
          {
            term: "Smart intake forms",
            detail:
              "Forms that adapt to issue type and require the fields the resolving team will need. Targets the 20% follow-up rate, aiming below 5%.",
          },
          {
            term: "Automated status communication",
            detail:
              "Notifications at every stage: received, assigned, in progress, awaiting information, resolved, closed. Removes the status-check contacts that a slow queue generates.",
          },
        ],
        stats: [
          {
            value: "72h to 28h",
            label: "Projected average resolution, a 61% reduction",
          },
          {
            value: "Under 8%",
            label:
              "Target for tickets reaching the wrong team first, from 30% today",
          },
          {
            value: "25% to 30%",
            label: "Projected self-service deflection, reducing total volume",
          },
        ],
      },
      {
        heading: "What the roadmap had to admit",
        body: [
          "A phased plan is where process work usually gets honest. Four phases over twelve months, and the sequencing is an argument rather than a schedule.",
          "Phase one, months one to three, does the work that needs no technology at all: standardise categorisation guidelines, redesign intake forms with required fields, train Tier 1 staff, and establish baseline metrics. Splitting the queues also belongs here, because it needs a policy decision about service levels rather than a system change, and it delivers the largest single reduction available. Cheap, immediate, and it front-loads the credibility that later phases need.",
          "Phase two, months four to six, enables the Now Assist features, connects the knowledge base to submission, and turns on assisted categorisation and routing. This is the phase that attacks the 30% directly. Phase three, months seven to nine, deploys RAG for self-service, automates status notifications, and adds recurring issue detection. Phase four, months ten to twelve, is analysis and governance rather than delivery.",
          "The ordering means the biggest technical change is not the first thing that happens, which is deliberate. If phase one fails to move the follow-up rate, the assumptions behind phase two are wrong and there is still time to find out cheaply.",
        ],
      },
      {
        heading: "Risks, and how each one is actually managed",
        body: [
          "Four risks carry real probability. Agent resistance to AI tooling is medium likelihood and high impact, and the mitigation is involving agents early and demonstrating that the system routes rather than decides. Categorisation errors will occur initially, which is why human override stays and corrections feed back as training signal.",
          "Low self-service adoption is countered by making self-service easier than raising a ticket, not by asking people to prefer it. And knowledge base content gaps have to be audited and filled before RAG goes anywhere near production, because retrieval-augmented generation grounded in stale articles produces confident wrong answers rather than no answer.",
          "Measurement is weekly for resolution time, misroute rate and follow-up rate, and monthly for deflection. A sponsor from IT leadership holds the mandate, a project manager tracks delivery, and a steering committee reviews the metrics monthly and can stop the thing.",
        ],
      },
    ],
    closing: [
      "The finding that mattered was not any single number. It was that the 48 hour gap between target and reality lived almost entirely in activities the requester would never pay for: manual sorting, queue time, rerouting and chasing information that should have been collected at the door.",
      "That reframing is what made the recommendation affordable. The technology to close most of the gap was already licensed and sitting unused, which meant the proposal was about configuration and sequencing rather than budget. The hardest part of the work was not designing the future state. It was proving that the process, not the people or the headcount, was the thing that had failed.",
      "The IT Help Desk is the technology lifeline for 45,000 people. Every day a ticket takes three times longer than it should, teaching gets disrupted and research gets delayed. The tools already existed. What was missing was the discipline to redesign the process before automating it.",
    ],
  },
  {
    slug: "study-space-design-thinking",
    seoTitle: "Design Thinking: Study Room Booking Redesign",
    seoDescription:
      "A design thinking case study: twenty participants, four research methods, and a booking redesign built around the students who had stopped trying.",
    title: "The Booking System Worked. Students Still Could Not Get a Room.",
    kicker: "Design thinking",
    discipline: "Design Thinking",
    date: "November 2025",
    isoDate: "2025-11-21",
    tags: [
      "Design Thinking",
      "User Research",
      "Journey Mapping",
      "Prototyping",
    ],
    cardLine:
      "The users who give up never file a complaint. Research has to find them.",
    sourceNote: BASELINE_NOTE,
    excerpt:
      "Snell Library has 50 group study rooms and a booking system students had learned to work around. Twenty participants, four research methods, and a redesign that started from the person who had already quit.",
    intro: [
      "Snell Library at Northeastern has 50 group study rooms. Getting one had become an exercise in insider knowledge: rooms showing as booked while sitting empty, the same groups securing slots every day while others got none, and no way to know whether anything was free without walking to the building to look.",
      "What makes this worth studying is that the library had already tried to fix it. It had moved to a new booking platform. It had introduced a 15 minute automatic cancellation to reduce no-shows. It had capped reservations at three a week to stop monopolisation. Three interventions, and the experience had not meaningfully improved.",
      "That pattern is diagnostic. When targeted fixes keep failing, the problem is usually not the thing being fixed. This one was a design problem: the system had been built around what is straightforward to administer rather than around how students actually study.",
    ],
    sections: [
      {
        heading: "Four groups, because the failure was not evenly distributed",
        body: [
          "Before any research, I identified four user groups whose experience of the same system diverges most sharply. This was not a demographic exercise, it was a way of making sure the research would reach the people the system fails hardest rather than the people most available to interview.",
          "Undergraduates are the largest group, booking at short notice and competing for peak slots. Graduate and doctoral students work longer sessions with tighter deadlines tied to research. International students, a substantial share of enrolment, often arrive from academic cultures where library booking works differently or does not exist, which makes the interface and its unwritten rules harder to navigate. Students with accessibility needs require specific room features that the system does not display at all, which is the difference between inconvenience and exclusion.",
        ],
      },
      {
        heading: "Four methods, because asking people is not enough",
        body: [
          "Semi-structured interviews were the primary method, chosen because a fixed questionnaire cannot follow the real story behind a surface complaint. I prepared a topic guide covering booking habits, pain points, workarounds and fairness, and kept enough flexibility to follow unexpected directions. Five students were interviewed individually.",
          "Direct observation ran alongside, watching students use the booking page and move through the library itself. People do not describe their own behaviour accurately, particularly frustrations they have normalised, so watching somebody search for a room produces evidence that self-reporting cannot.",
          "Digital ethnography reviewed publicly available complaint tickets and discussion in student communities, including course forums and the university subreddit. Students state their frustrations most honestly where nobody is formally interviewing them, and this channel served as a cross-check against the risk of having interviewed unrepresentative participants.",
          "Journey mapping sessions ran with three groups of four to five students each. Rather than describing their experience in the abstract, each group walked through the full process together, from realising they needed a room to either settling in or giving up, narrating each step and flagging where it broke. Together the methods covered twenty participants across all four user groups.",
        ],
        stats: [
          {
            value: "20",
            label:
              "Research participants across interviews and journey mapping",
          },
          {
            value: "4",
            label: "Methods, so behaviour could be checked against self-report",
          },
          { value: "50", label: "Group study rooms in scope, Boston campus" },
        ],
      },
      {
        heading: "What twenty students actually reported",
        body: [
          "Five findings held consistently across interviews, observation and the mapping sessions.",
          "Arriving to find your reserved room occupied was the single most common frustration, reported across every user group. One participant walked to the library twice in one week for the same group project and found the previous group still in the room both times. Observation confirmed it: during two visits at peak afternoon hours, rooms on the first floor showed as reserved on the wall display while groups sat inside past their end time. The 15 minute cancellation rule addresses no-shows, and does nothing about overstays, because nothing enforces an end time once a group is already inside.",
          'Not knowing what a room contains before booking it was reported by every participant without exception. One needed a display screen for a presentation rehearsal and spent twenty minutes moving between rooms to find one. Another needed an accessible floor with space for a mobility aid and had no way to filter for it. The interface lists rooms by number and floor: no features, no photographs, no capacity detail beyond a figure. One mapping group labelled the selection step on their own map with a single word, "guess".',
          "The midnight booking race shuts out anyone unaware of it. Slots open a week in advance, and during peak periods the desirable ones go within minutes. A frequent user described setting an alarm for 11:59pm. An international participant had no idea this was common practice and simply never got a room during exam weeks. That produces a two-tier system: people who know the quirks get rooms, people who do not go without.",
          'Walk-up availability is invisible unless you are standing in the building. Participants described walking over to check because no other option existed. One had called the front desk and been told staff could not check on their behalf. A mapping group named this step "the uncertainty walk", which several had normalised and all agreed was wasted time.',
        ],
      },
      {
        heading: "The finding that mattered most was emotional",
        body: [
          "The fifth finding was the most consistent and the most serious: the system felt unfair, and that feeling actively discouraged use.",
          "Even the participant who benefited from knowing the system acknowledged it was wrong, saying she was gaming it a little while other people simply did not know. The participant with an accessibility need had stopped trying to book on most days because it was not worth the stress. The international participant had started studying in a loud common area rather than dealing with the process at all.",
          "This is the point where the diagnosis stops being about efficiency. The service was not merely slow. It was driving away the students who needed it most, and doing so silently. Neither of those students had filed a complaint. They had disappeared from the system, and no booking log or ticket queue would ever surface them as a problem.",
        ],
      },
      {
        heading: "The perspective that complicated the design",
        body: [
          "Not everybody experienced the system badly, and representing that honestly changed the design rather than merely balancing the report.",
          "The frequent user considered the current system fine once you understand it, and was concerned that adding features would make it slower for people who already know what they want. That is a legitimate objection. Any redesign that adds friction for confident users in order to help newer ones risks replacing one problem with another.",
          "Two participants in the third mapping group, both third-year undergraduates booking casually, described the experience as annoying but manageable, and mostly found rooms by walking in off-peak. For them the urgency was genuinely lower.",
          "Both perspectives became design constraints. The tension between simplicity for experienced users and guidance for everyone else is the reason the final design has an escape hatch, and I would not have built one if I had only interviewed people who were struggling.",
        ],
      },
      {
        heading: "Framing the problem without prescribing the answer",
        body: [
          "Three patterns ran underneath the specific complaints. The problems were not felt equally: the same system produced radically different experiences depending on how much a user already knew. Every persona had developed a workaround, which in design research is the clearest available signal that the official process has failed and the user is absorbing the cost. And the barrier was not awareness of the service but information within it: students knew the rooms existed, they did not know what any room offered or whether booking would produce a usable space.",
          "Two point-of-view statements carried the framing forward. One centred on feature visibility: a second-year undergraduate booking for group study needs a way to find a room matching what her group actually needs, because the system shows only a number and a floor and leaves her to guess. The other centred on equity: a fourth-year student with an accessibility need requires relevant features surfaced before committing, because arriving at an unusable room has caused her to stop using the service entirely, which makes the library effectively inaccessible to her while being physically on campus.",
          "Seven How-Might-We questions followed, framed broadly enough to invite multiple answers: matching rooms to needs before commitment, making real-time availability visible remotely, reducing the advantage experienced users hold, giving accessibility users enough information to book confidently, reducing arrival mismatches, making walk-up less dependent on luck, and discouraging overstays without penalising legitimate extensions.",
        ],
      },
      {
        heading: "Checking the problem was worth solving before solving it",
        body: [
          "Before ideation, I assessed the scope through four lenses, which is the step that stops a redesign becoming a wish list.",
          "Desirability was strong: all four groups wanted better feature information and fairer access, and there was no evidence anybody wanted the current system, only that some had learned to tolerate it. Feasibility was moderate to high, and this was the important finding: the platform already supports custom room attributes and exposes an API for real-time data, and ten rooms already have occupancy sensors installed. The components existed. What was missing was a design layer making that information available at the point of booking.",
          "Viability was moderate, constrained by having to work inside existing infrastructure with no additional staffing. Sustainability was high, since a need-based flow requires no ongoing maintenance beyond normal updates, and reducing mismatched bookings would cut the complaint volume and desk interventions that the current design generates.",
        ],
      },
      {
        heading: "Twenty-four ideas, then four themes",
        body: [
          "Ideation separated generation from judgement deliberately, because evaluating early narrows the space before it has opened. Divergent thinking first, for quantity and range. Convergent thinking second, grouping and testing against the constraints. Twenty-four ideas came out of two sessions.",
          "They clustered into four themes. Need-based search pointed at replacing browse-and-guess with need-first filtering. Real-time availability addressed the invisibility of walk-up rooms, including a floor-plan view using the existing sensor data and door-mounted indicators. Fairness and onboarding addressed the structural advantage experienced users hold, through ideas like a randomised opening window and holding back a few rooms each day as walk-up only. Overstay and arrival reliability addressed the gap between holding a reservation and actually getting into the room, through QR check-in with automatic release and a one-tap extension offer before a booking ends.",
          "Each theme mapped to at least one of the seven questions, which confirmed the ideation had covered the problem rather than circling the most interesting part of it.",
        ],
      },
      {
        heading: "Two prototypes, and what changed between them",
        body: [
          "Prototyping in design thinking is not about building something polished, it is about making an idea tangible enough to test. Both prototypes tested one assumption: if students are asked what they need before they see any rooms, will they find it easier to decide and feel more confident the room will work?",
          'The low-fidelity version was hand-drawn paper: three screens, no colour, no branding, just boxes and arrows. A needs screen asking group size, required features, time and duration. A results screen listing only matching rooms with features highlighted and a match indicator. A confirmation screen with no hidden steps. An informal walk-through with three students found that two did not understand what "recording capability" meant in a study room, and that the match indicator was the most valued element on the page.',
          'Three changes went in before building the digital version. "Recording capability" became "Microphone / audio recording". The match indicator moved from a small label to a coloured bar at the top of each room card. And the accessibility filters were given their own dedicated section rather than being buried in a general checklist, responding directly to what the fourth-year participant had described.',
          'The medium-fidelity version was a clickable Figma prototype across four screens, and it added the escape hatch: a "Skip filters and browse all" link for users who prefer the current experience. That link exists because of the contradictory perspective in the research, not despite it.',
        ],
      },
      {
        heading: "Testing with five students, including the one who had quit",
        body: [
          "Testing used a think-aloud protocol alongside a structured task, so every session had the same starting point: find and book the best available quiet room with a display screen for three people this afternoon. Five participants covered the same group diversity as the research phase, including one who had never successfully booked during peak periods and one who had abandoned the system entirely.",
          "All five completed the needs screen without asking for clarification. The international participant, who had previously struggled with the live interface, moved through the form in under 90 seconds and compared it to booking a hotel. The participant with an accessibility need went straight to the accessibility section and described it as the first time she had seen this as an actual option rather than something she had to phone and ask about.",
          "Filtered results reduced perceived overwhelm substantially. Comparing three matching rooms against their memory of up to fifty shown at once, four of five described the filtered view as easier or less stressful. The frequent user was the exception: she found the shorter list restrictive and immediately used the skip link, which confirmed that the escape hatch was the right decision rather than a hedge.",
          "The match bar improved confidence at the point of commitment. Three participants named it specifically. One said she would have booked a particular room without hesitation on the accessibility badge and match strength alone, which is a direct contrast with arriving and discovering the room does not work. Another saw a 92% match and opened the detail screen to understand the remaining 8%, which was unexpected and useful.",
        ],
      },
      {
        heading: "Three changes the testing forced",
        body: [
          "Testing found real problems, and the specific value of a think-aloud protocol is that it surfaces hesitation the participant would never raise if simply asked whether they liked it.",
          "Two participants paused at the QR check-in instruction. One asked what happens if she forgets to scan. The other was unsure whether the code would arrive by email or exist only on that screen. Both are questions about consequence and delivery, and neither had occurred to me while designing the screen.",
        ],
        list: [
          {
            term: "Unclear consequence of a missed check-in",
            detail:
              "Added a line to the confirmation screen: if you do not check in within ten minutes the room is released, and your weekly booking count is not affected.",
          },
          {
            term: "Unclear delivery of the QR code",
            detail:
              "The code and check-in link are now explicitly stated as sent in the email confirmation, not only shown once on screen.",
          },
          {
            term: "Ambiguous group size question",
            detail:
              'One participant paused on "how many people", unsure whether it included her. Relabelled to "Total group size (including you)".',
          },
        ],
      },
      {
        heading: "The final design, and the pilot that tests it",
        body: [
          "The final design rests on one principle: students should be able to find, book and arrive at a suitable room without relying on luck, insider knowledge or a workaround. It is built inside the existing platform, needs no new hardware for the primary features, and adds no staffing.",
          "Three components, phased. The smart booking flow comes first: needs-first filtering, matching rooms shown as cards with photographs, features, match indicator and available slots, a dedicated accessibility section, and the skip link. The real-time availability display comes second, using the sensor data already present in ten rooms to show what is free for walk-up access, with manual check-in providing partial data elsewhere. The check-in and overstay nudge comes third: QR confirmation at the door within ten minutes, and an automated message ten minutes before a booking ends offering a one-tap extension if the next slot is free.",
          "The pilot covers floors one and two, roughly twenty of the highest-demand rooms, across a full fifteen week semester starting at the beginning of term so it captures both normal and peak conditions. All enrolled students, no curated subset, because the pilot should reflect real usage. Six metrics, each traceable to a specific research finding.",
        ],
        stats: [
          {
            value: "Under 10%",
            label:
              "Target booking mismatch rate, from about 35% today. Finding 2",
          },
          {
            value: "Over 65%",
            label:
              "Target walk-up success rate, from about 30% today. Finding 4",
          },
          {
            value: "Under 20",
            label:
              "Target weekly no-show and overstay incidents, from about 60",
          },
        ],
      },
      {
        heading: "What this design does not fix",
        body: [
          "No solution eliminates every problem, and being explicit about the remainder is more useful than presenting a redesign as complete.",
          "The midnight booking race is not resolved. The flow improves everything after a student is in the system, and changes nothing about when slots open or how fast they go. Fixing that needs a policy change, staggered openings or a daily walk-up allocation, which sits outside an interface redesign and requires library administration.",
          "Sensor coverage is partial. Ten of fifty rooms are equipped, so real-time availability will be incomplete until the rest are, and the pilot has to communicate that limitation openly rather than letting students assume full coverage. Presenting partial data as complete would rebuild exactly the trust problem the redesign is meant to solve.",
          "And adding steps has a cost. The new flow has more screens than the old one. For users who already know what they want, the filter step is friction even with the skip link available. The design prioritises the majority who benefit from guidance over the minority who do not need it, and that is a deliberate trade, not an oversight.",
        ],
      },
    ],
    closing: [
      "Three things from this project are difficult to appreciate without running the full cycle.",
      "The problem was never the technology. The platform is capable, the sensors were already installed, and most of the data needed for a better experience was already there. What was missing was a decision to design around student needs rather than administrative convenience. The most valuable output was not the prototype, it was the diagnosis.",
      "Workarounds are the most honest data in a research process. Every shortcut a student invented, arriving early, walking the floor, setting a midnight alarm, was a direct signal of where the design had failed. Those behaviours revealed more than any survey could, because they showed what people did once the official process stopped working.",
      "And designing for the most constrained user improved the experience for everyone. The student who had abandoned the system entirely shaped the most consequential decisions: the dedicated accessibility section, the room detail view, the feature visibility on cards. Every one of those made the experience better for the other two personas as well. Designing for the edge turned out to be designing for the majority.",
    ],
  },
  {
    slug: "course-evaluation-platform-replacement",
    seoTitle: "Course Evaluation Platform: $1.5M Project Plan",
    seoDescription:
      "A PMBOK project plan to replace a course evaluation system: stakeholder analysis, a 4,080 hour work breakdown, risk register and hybrid delivery.",
    title: "A 28% Response Rate Is Not a Participation Problem",
    kicker: "Project management",
    discipline: "Project Management",
    date: "December 2025",
    isoDate: "2025-12-02",
    tags: [
      "PMBOK",
      "Stakeholder Management",
      "Risk Management",
      "Change Management",
    ],
    cardLine:
      "The technology was the easy part. Three of five critical risks were political.",
    sourceNote: BASELINE_NOTE,
    excerpt:
      "An 18 month plan to replace a course evaluation system with a 28% response rate. Every planning decision came down to adoption, so the plan was built around the people who could block it.",
    intro: [
      "Northeastern's course evaluation system produces data almost nobody can use. A 28% response rate sits below the 35% threshold most researchers treat as the floor for statistical reliability, which means decisions about teaching quality are being made on feedback from fewer than one in three students.",
      "The rest compounds it. The platform was last updated in 2010, so its questions do not reflect hybrid formats, project-based learning or experiential education. The mobile experience causes 80% of students to abandon before finishing. Results arrive as static PDFs three to four weeks after term ends, too late to act on. Faculty regard the process as punitive. Students regard it as pointless.",
      "This is a full project plan for replacing it: $1.5 million, 18 months from January 2026 to June 2027, launching university-wide for Fall 2027. What the planning process actually produced was an argument that the technology was the straightforward part.",
    ],
    sections: [
      {
        heading: "Why more reminder emails were never going to work",
        body: [
          "Previous attempts had adjusted question wording and sent more reminder emails. Both treat participation as the problem. Neither moved the number, which is the clue.",
          "A 2023 Student Senate survey found students felt their feedback disappeared without impact, and that belief is a fully rational response to a system where results arrive after grades are posted and nothing visibly changes. The low response rate is not apathy, it is an accurate assessment of the return on effort. Attacking it with reminders asks students to behave irrationally.",
          "Peer institutions had already demonstrated what the ceiling actually is. MIT reports 75% with real-time analytics. Tufts runs a mobile-first platform at 65%. Harvard integrates mid-semester feedback with its learning management system. Boston University uses predictive models to flag at-risk courses by week four. Northeastern's 28% is not only below its own target, it is behind schools it competes with directly, which is what turns a quality problem into a strategic one.",
        ],
        stats: [
          {
            value: "28%",
            label: "Current response rate, against a 35% reliability threshold",
          },
          {
            value: "80%",
            label: "Students abandoning the evaluation on mobile",
          },
          {
            value: "21 days",
            label:
              "Processing time, so results land after they can be acted on",
          },
        ],
      },
      {
        heading: "The objection worth taking seriously",
        body: [
          "Some faculty argue that response rate is a poor proxy for quality, and that a smaller set of thoughtful responses beats a high volume of rushed ones. That deserves a real answer rather than dismissal, because it is largely correct.",
          "The plan addresses it by treating the instrument as part of the scope rather than a constant. Shorter, more relevant questions delivered at several points during a term, so higher participation also means better feedback rather than more of the same feedback. If the only change were a nicer interface on the same 2010 questionnaire, the objection would stand and the project would deserve to fail.",
          "This mattered beyond the argument itself. Writing the counter-position into the business case is what made the case credible to the group most able to stop it, and it set the pattern for the rest of the plan: every major decision documents the alternative that was rejected and why.",
        ],
      },
      {
        heading: "The business case, and the number I do not fully trust",
        body: [
          "Three strategic pillars connect. Educational excellence, because a modern platform gives faculty trend comparisons and mid-semester checks rather than a PDF after grades post. Student success, because visible responsiveness improves engagement. Operational efficiency, because the current system costs roughly $180,000 a year in manual processing and automation should reduce that by about 60%.",
          "The financial model projects a 447% return over five years with payback around 14 months. That headline is driven mostly by retention: a conservative 2% improvement represents roughly $4.6 million in retained tuition annually.",
          "I want to be precise about the confidence here, because these two components are not equally solid. The operational saving of about $108,000 a year is close to certain, it is labour that either happens or does not. The retention figure rests on an assumption that responsive teaching measurably improves persistence, which is plausible and not proven. The reason the case still holds is that even at half the projected improvement the return stays above 200%. A business case that only works at its most optimistic input is not a business case.",
        ],
      },
      {
        heading: "Scope, and the things deliberately excluded",
        body: [
          "In scope: a cloud platform, ten years of historical migration covering roughly 2.3 million records, integrations with the learning management system and the student information system, a mobile-responsive progressive web app, analytics dashboards with trend analysis, a mid-semester feedback module, training for 3,200 faculty, an engagement campaign for 28,000 students, and a privacy and data governance framework.",
          "The exclusions carry more information than the inclusions. Faculty tenure and promotion policy is out, because tying evaluation data to employment decisions would politicise the platform before it launched. Peer evaluation, grade management, alumni feedback and curriculum management are out because each has its own stakeholder set, and bundling them would create scope the budget and timeline cannot absorb.",
          "The temptation is always to solve every adjacent problem at once. The institution had its own ERP implementation that faculty still reference years later, and overloaded scope was a large part of why. Naming that precedent in the scope section was a way of making the exclusion decision defensible rather than arbitrary.",
        ],
      },
      {
        heading: "Three stakeholder tensions a power grid does not capture",
        body: [
          "Mapping stakeholders on power and interest is the standard move and it produced the standard output: the Provost supportive at maximum power and interest, Faculty Senate skeptical at the same coordinates, the faculty union resistant, department chairs supportive, Student Government supportive with less formal power, faculty champions enthusiastic with almost none.",
          "The grid is where the analysis starts, not where it finishes, because three of the real problems are relationships between cells rather than properties of cells.",
          "The first is the Provost against the union. The Provost wants data that improves teaching and supports accountability. The union wants certainty that the same data is never used punitively in tenure reviews or contract decisions. Both positions are legitimate, and the project cannot succeed by picking one. The resolution is a governance framework that structurally separates developmental feedback, visible to the individual for self-improvement, from institutional reporting, aggregated and anonymised for programme-level decisions. That distinction has to be written into the privacy policy and approved by both parties before development starts, not after.",
          "The second is standardisation against departmental autonomy. The Registrar and IT want one consistent platform: cheaper, easier to maintain and report on. Department chairs want discipline-specific questions, because an engineering course and a creative writing seminar are not evaluated on the same criteria. The platform has to do both, a core university-wide question set plus a configurable departmental section, and that is a scope decision with budget consequences that must be settled during requirements rather than discovered during testing.",
          "The third is the gap between Student Government's enthusiasm and general student indifference. Student Government leadership wants a partnership role and is genuinely supportive. The 28,000 students they represent largely do not care, and the 28% response rate is the evidence. They can amplify a message, and the actual drivers of student engagement will be platform design and visible proof that feedback changed something. Relying on them to solve adoption would be a mistake.",
        ],
      },
      {
        heading: "Putting the people who can block it inside the room",
        body: [
          "Governance runs on three tiers, and the design is a direct response to the biggest non-technical risk.",
          "The Steering Committee, meeting monthly, holds the Provost, the CIO, a Faculty Senate representative and a union representative. It approves scope changes, budget reallocations above $25,000 and milestone sign-offs. The Project Advisory Board meets fortnightly with department chairs from pilot colleges, a Student Government representative and the Registrar, providing operational input. The Project Team executes daily and reports weekly.",
          "The important choice is that Faculty Senate and the union hold formal governance seats rather than consultation meetings. They are not informed of decisions, they participate in making them. That is more expensive in calendar time and considerably cheaper in political risk, and it follows a governance principle that is easy to state and rarely followed: people who can block a project belong inside the tent.",
          "There is a counter-argument worth recording. The three faculty champions willing to pilot arguably matter more than anyone despite sitting near the bottom of the power grid, because grassroots adoption driven by respected peers may outweigh a mandate from the Provost. The engagement plan invests heavily in champion enablement for exactly that reason. Their grid position reflects formal authority, and formal authority is not the same thing as influence.",
        ],
      },
      {
        heading: "Where 4,080 hours actually go",
        body: [
          "The work breakdown decomposes into nine deliverable-based packages totalling 4,080 hours, satisfying the 100% rule: every piece of required work is accounted for and nothing outside scope is included.",
          "The weighting is the argument. Platform implementation and system integration together take 45%, because the student information system is 20 years old and integration is unpredictable, and because the platform has to be configured for 3,200 faculty across colleges with genuinely different needs. Training and change management take 15%, which is higher than most technology projects allocate, and the justification is the risk analysis: three of five critical risks are organisational. Underinvesting there is the most likely route to delivering a working platform nobody uses.",
          "Three allocations need defending. Vendor selection gets only 8% despite sitting on the critical path, because the selection criteria are established during requirements, so by the time demos begin the team already knows what it is looking for. Stretching it would delay everything downstream without improving the decision. Data migration gets 12% despite 2.3 million records, because the transfer is a scripted operation and most of the effort is validation and reconciliation, with the real risk being data quality, managed through an early audit in month four. And deployment is a separate 10% package because go-live is not the end: the pilot, the iteration on pilot results, and hypercare through the first full evaluation cycle all belong to deployment. Treating launch as the finish line rather than the start of adoption is the standard failure mode.",
          "I considered a phase-based structure instead, organised by initiate, plan, execute, close. It reads more simply and makes it harder to verify that all scope is covered, because one deliverable spans several phases. On a project where every college will ask whether its requirement is included, deliverable-based traceability was worth the extra complexity.",
        ],
      },
      {
        heading: "The critical path, and buying information early",
        body: [
          "Integration with the student information system sits on the critical path, because the platform cannot enter user acceptance testing without a working connection. If it slips, everything after it slips.",
          "That is why the schedule includes a proof of concept in month three. Its purpose is not to build anything usable, it is to surface integration problems while there are still 15 months to respond. The same logic sets the contingency trigger: if the proof of concept reveals complexity beyond estimate, $50,000 releases automatically rather than becoming a negotiation.",
          "Training rollout is also on the critical path, because faculty must be trained before term starts and training cannot compress below a certain duration when faculty availability is limited over summer. It sits in months 15 to 17 specifically to avoid the August crunch when people are writing syllabi.",
          "Several streams run parallel to save time. Change communication starts in month four and continues through month 18, deliberately not waiting for the platform to exist. Migration preparation begins in month six while configuration is still underway. Those streams carry 30 to 45 days of float. Critical path activities carry 10% contingency, and fast-tracking integration alongside configuration saves roughly six weeks against a purely sequential plan.",
        ],
      },
      {
        heading: "The budget split I argued against and then chose anyway",
        body: [
          "Software and licensing take 40% at $600,000, covering the licence, customisation and cloud infrastructure for more than 30,000 users. Integration development takes 20% at $300,000, which is high, and the reason is the 20 year old student information system: legacy systems do not expose clean modern APIs, so the work involves middleware bridging the new platform to old data structures.",
          "Change management takes 10% at $150,000, funding a part-time external consultant and the communication campaign. Project management literature commonly recommends 15 to 20% for change-heavy initiatives, so this is below best practice and it is a conscious trade. It is compensated by a higher training allocation and by the faculty champion programme, which uses existing university resources rather than consultants, and the contingency reserve provides a second source if resistance runs higher than modelled.",
          "I evaluated the opposite allocation: licensing down to 30%, change management up to 20%, on the argument that a platform nobody adopts is worthless regardless of features. That argument is sound. I rejected it because a lower software budget would have restricted the shortlist to platforms without native integration to the student information system, pushing cost into custom integration work and probably breaking the 20% integration allocation. The chosen split accepts higher licensing cost in exchange for lower integration risk.",
          "The contingency reserve is 10% at $150,000 with specific triggers rather than being a general buffer: $50,000 against integration complexity, $50,000 if faculty opposition exceeds 40%, funding expanded one-to-one consultation and pilot incentives, and $50,000 for scope adjustments through change control.",
        ],
      },
      {
        heading: "Ten risks, and the three that interact",
        body: [
          "Risk identification traced each risk to a specific constraint, assumption or dependency rather than working from a generic checklist, which is what keeps a register describing actual exposure. Ten risks across four categories: organisational, technical, compliance and operational.",
          "The headline finding is that the three highest-scoring risks are all organisational. Union opposition, low student adoption and budget overrun each score in the critical band, and what connects them is that none can be solved with technology. Union opposition needs political negotiation over months. Low adoption needs proof of impact visible to students, not another email campaign. Budget overrun needs disciplined scope control and early detection, not a larger reserve.",
          "The register alone hides the more dangerous property, which is that they cascade. If union opposition delays Faculty Senate approval, the timeline compresses, which raises the probability of budget overrun. If overrun triggers scope reduction, the features that drive student adoption are the ones most likely to be cut, which raises the probability of low adoption. Managing union engagement early, genuinely rather than symbolically, is therefore the single highest-leverage action available to the project manager, and that conclusion is invisible until you look at the interactions rather than the scores.",
          "Below them, integration failure and scope creep from departmental requests sit in the high band, managed through the month three proof of concept and formal change control respectively. Compliance breach, key resource turnover, change fatigue and vendor underperformance are medium, manageable through legal review, cross-training, initiative coordination and contract terms.",
        ],
      },
      {
        heading: "Why the escalation thresholds are deliberately twitchy",
        body: [
          "Every risk has a monitoring trigger: a measurable signal that it is materialising before it becomes a crisis. The project manager reviews them weekly.",
          "Union feedback exceeding 30% negative, checked monthly, triggers emergency engagement with union leadership and Provost involvement. Pilot response rate below 40% triggers gamification, in-class completion time and expanded incentives. Monthly cost variance above 5% freezes non-critical spending and forces a steering committee scope review. Integration delays beyond two weeks activate vendor support and the middleware contingency. More than three unapproved change requests in a month reinforces change control and presents a phase two backlog to requestors.",
          "The thresholds are set low enough to produce occasional false alarms, and that is the intent. The arithmetic is straightforward: a 30% negative union score detected in month three can be addressed with additional consultation costing around $10,000 in time. The same opposition discovered in month twelve during pilot rollout could delay launch by three months and cost upwards of $150,000 in schedule extension. Paying for a few false alarms is obviously cheaper than that.",
        ],
      },
      {
        heading: "Quality means two different things depending on who asks",
        body: [
          "For the technical team, quality means uptime, response time, data accuracy and security compliance. For faculty and students it means something harder to measure: does this feel easier than the old system, does it work on my phone, can I find what I need without calling the help desk. A platform with 99.9% uptime that faculty find confusing fails as thoroughly as one that is intuitive and crashes during evaluation week.",
          "The targets are specific, and two of them carry reasoning that changes how they must be contracted. 99.9% uptime means no more than 8.7 hours of downtime a year, and the raw number is misleading because evaluation activity is concentrated: roughly 80% of student completions happen within a two week window at the end of term. An hour of outage during that window is not equivalent to an hour in July, so the vendor agreement needs penalty clauses tied specifically to designated evaluation windows rather than annual averages.",
          "Sub-two-second response time addresses the 80% mobile abandonment directly, and performance testing simulates 10,000 concurrent mobile sessions rather than a demo environment with fifty test users. Data accuracy targets 99.99% with 100% completeness on all 2.3 million migrated records. Accessibility compliance is treated as a pass or fail gate rather than a scored metric, because there is no acceptable level of partial accessibility.",
          "Quality assurance runs four gates, each passed before the next phase. The third, user acceptance testing, is the one that matters most: it is the first time real faculty and students use the platform under realistic conditions, and the pilot must reach a 50% response rate to pass. Below that the platform is not ready for university-wide launch regardless of how well it performs technically.",
        ],
      },
      {
        heading: "Change readiness of 2.8 out of 5, and what follows from it",
        body: [
          "A readiness assessment through stakeholder interviews, past initiative review and cultural analysis scored 2.8 out of 5: moderate, with significant pockets of resistance.",
          "Three factors drive it down. Institutional memory of the failed ERP implementation still shapes how faculty see technology-driven change, and the people who lived through it are the people this project needs to convince. The current system, for all its problems, is familiar, and replacing a familiar bad system with an unfamiliar better one triggers loss aversion, which behavioural research consistently finds is a stronger motivator than prospective gain. And the union has a formal role in approving workload changes, which means resistance is not merely cultural, it has an institutional mechanism.",
          "The score is not a reason to delay. Waiting does not improve readiness and the competitive gap widens every term. What it does mean is that change management cannot be a secondary workstream running beside the real technical work. For this project, change management is the critical path for adoption in exactly the way integration is the critical path for delivery.",
        ],
      },
      {
        heading: "Kotter over ADKAR, and why the adaptation matters more",
        body: [
          "The change approach follows Kotter's eight-step process, selected over ADKAR and Lewin's unfreeze-change-refreeze because it emphasises coalition-building and sustained momentum, which map directly onto the two largest risks. ADKAR is stronger for individual behaviour change and weaker for institutional politics. Lewin's model is too abstract for an 18 month initiative with stakeholder groups moving at different speeds.",
          "The adaptation matters as much as the selection, because a university is not a corporation. Faculty are not employees who can be directed to adopt a tool. They are professionals with tenure protections, academic freedom and a governance structure granting them veto power. Urgency cannot be manufactured through top-down pressure, coalitions must include the people who can block the work, and quick wins have to be visible to skeptics rather than celebrated among supporters.",
          "Three adaptations are worth naming. Steps one through three compress into four months, faster than Kotter recommends, which is possible because urgency already exists: the response rate and the competitive gap are documented facts rather than arguments needing construction. The project does not need to create urgency, it needs to make existing urgency visible to people who have been tolerating the status quo.",
          "Step four, communicating the vision, spans 14 months rather than being a discrete phase, with the message evolving: month four introduces the vision, month eight shares design decisions, month twelve shows pilot results, month sixteen demonstrates the actual platform. And step six, quick wins, is timed deliberately to the pilot in months twelve to fourteen. If the pilot reaches a 55% response rate against the current 28%, that result is the most powerful change management tool available, because it is concrete, measurable and produced by real faculty and students rather than a vendor demo.",
        ],
      },
      {
        heading: "Resistance is not one problem",
        body: [
          "The most useful insight about resistance is that it is not uniform, and treating it as a single problem guarantees the wrong response. The faculty who actively oppose the change need a fundamentally different approach from the students who are simply indifferent.",
          "Faculty resistance is rooted in legitimate concerns about surveillance, workload and loss of control. Those are not objections to overcome, they are design inputs. The privacy policy is co-authored with union representatives rather than presented for approval afterwards. Training is designed with faculty input on format and timing rather than imposed during their busiest period. When resistant faculty see their concerns reflected in the actual product, some shift to cautious support. The plan assumes 10 to 15% remain resistant regardless, which is enough to prevent organised opposition without pretending everyone can be converted.",
          "Student indifference needs the opposite treatment. Students are not opposed to evaluations, they do not believe their input matters, and they are currently right. The conversion strategy is making impact visible: last term a specific number of students said a section was confusing, this term the professor restructured it, here is the before and after. That loop, input producing visible change, is the only sustainable driver. Gamification and in-class time help initial adoption. Long-term engagement depends on closing the loop.",
          "A top-down mandate would hit the adoption targets faster, and I rejected it for two reasons. Institutions that made evaluations mandatory show higher completion and lower response quality, because students rush rather than engage, which undermines the entire objective. And mandating faculty dashboard usage would convert a manageable union risk into a guaranteed crisis. The voluntary-first route is slower and produces adoption that survives.",
        ],
      },
      {
        heading: "Hybrid delivery, and where the boundary sits",
        body: [
          "Three methodologies were evaluated against the actual constraints rather than in the abstract.",
          "Pure waterfall gives the strongest budget and schedule control, and satisfies compliance requirements that need formal baselines rather than iterative drafts. It also assumes stable requirements, which these are not: faculty and students will have opinions once they see the platform, and the instrument itself should evolve based on pilot testing. Rigid sequencing would force the team to either ignore user feedback or process it through expensive change requests.",
          "Pure Agile gives the flexibility to iterate on interface and instrument design, which is essential for reaching 80% mobile completion, since that has to be tested with real students on real phones rather than approved in a requirements document. It also makes cost control difficult against a fixed $1.5 million, and Faculty Senate and the union expect formal documentation and milestone approvals rather than a product backlog and sprint demos. Delivering governance artefacts in Agile format would create political friction for no benefit.",
          "The hybrid runs both layers in parallel. The governance layer is waterfall: phase gates requiring steering committee approval, earned value tracking with monthly variance reporting, sequential review of compliance documentation, fixed weekly reporting to the Provost. The execution layer is Agile for the packages where user feedback decides success: platform configuration, mobile interface, dashboard design and instrument refinement, in two week sprints with faculty champions and Student Government in the sprint reviews.",
          "The boundary is not arbitrary. Activities with known, stable requirements go waterfall because there is nothing to iterate on: vendor selection, migration, integration, compliance. Activities where user experience decides the outcome go Agile because the only way to know whether a design works is to test it. That division also maps onto the risk categories, with the governance layer managing organisational and compliance risk through formal control and the execution layer managing technical and adoption risk through fast feedback.",
          "The standard objection to hybrid is real: teams never fully commit to either discipline and the handoffs add overhead. The mitigation is unambiguous ownership, the project manager owning the governance layer and the technical lead owning the sprint backlog, reconciled in a weekly integration meeting. The overhead is genuine and manageable, and forcing the whole project into one methodology would cost more than the coordination does.",
        ],
      },
    ],
    closing: [
      "Three themes ran through every section of this plan.",
      "The primary risk is organisational, not technical. Three of five critical risks involve people and politics, and only one involves technology. The plan reflects that by putting 15% of total effort into training and change management, giving Faculty Senate and the union formal governance seats, and building a resistance strategy with specific actions per segment. A project that solves the technical challenge and fails the organisational one delivers a platform nobody uses, which is a more expensive outcome than not starting.",
      "Every planning decision involved a trade-off, and naming them explicitly was more valuable than presenting the plan as a set of obvious choices. The budget favours licensing over change management because it reduces integration risk. The hybrid methodology accepts coordination overhead because neither pure approach fits. The scope excludes tenure policy because bundling it would politicise the platform before launch. These are judgement calls, and documenting the reasoning means a future decision-maker knows not just what was decided but why, which is the only way a plan survives contact with people who were not in the room.",
      "And the thread connecting design to adoption runs through all of it. The current system fails not because the technology is broken but because it was designed for administrative convenience. Everything in the plan, the governance structure, the risk mitigations, the communication cadence, the training cascade, the pilot, exists so that when the platform launches the institution is actually ready to use it. A technically excellent platform that faculty distrust and students ignore is a $1.5 million failure, and it would be a failure of planning rather than engineering.",
    ],
  },
  {
    slug: "returns-refunds-process-redesign",
    seoTitle: "E-Commerce Returns Process Redesign with BPMN",
    seoDescription:
      "Diagnosing a returns process that paid refunds before inspection: SIPOC, BPMN 2.0, five whys, TIMWOOD waste analysis and seven KPIs with owners.",
    title: "The Refund Fired Before Anyone Looked at the Box",
    kicker: "Process redesign",
    discipline: "Process Redesign",
    date: "December 2025",
    isoDate: "2025-12-11",
    tags: ["BPMN 2.0", "SIPOC", "Root Cause Analysis", "KPI Design"],
    cardLine:
      "A control gap created on purpose, by optimising the wrong metric.",
    sourceNote: SCENARIO_NOTE,
    excerpt:
      "An e-commerce returns process paying refunds before inspection, with 28% grading variance and a 22% cost increase. The worst control failure in it had been introduced deliberately.",
    intro: [
      "An e-commerce returns and refunds process was taking 12 to 14 days against a 5 day target, costing 22% more year on year, and paying out refunds on a substantial share of returns before anyone had opened the package.",
      "The last part is the one worth sitting with. The payment system triggered refunds on return shipping confirmation rather than inspection completion. Money left the business before the business verified what had come back.",
      "That is the kind of finding that looks like a bug and is not. It was an architectural decision, made deliberately, to improve customer satisfaction scores by reducing refund wait times. It worked at what it was asked to do, and it created a control gap that fraud walked straight through. Most of the interesting analysis in this project came from tracing symptoms back to decisions that were rational when somebody made them.",
    ],
    sections: [
      {
        heading: "SIPOC, and the failure output at every stage",
        body: [
          "Scoping started with a SIPOC across the full boundary, from return request initiated to refund posted and inventory updated: suppliers, inputs, process steps, outputs and customers for each of six stages, spanning thousands of returns a month across all product lines.",
          "The useful thing SIPOC did here was structural. Every stage produced its intended output alongside a failure output, and laying them side by side showed the breakdown was systematic rather than located in one broken step. Initiation produced a shipping label and also label generation delays that block the pipeline. Inspection produced a grading result and also inconsistency that makes outcomes unpredictable. Approval produced a decision and also decisions taken without visibility of inspection data. Payment produced a refund and also refunds firing before inspection completed.",
          "That framing matters because it changes what a fix has to be. A process with one broken step needs a repair. A process producing a failure output at every handoff needs a redesign of the handoffs themselves.",
        ],
      },
      {
        heading: "The ripple into everything else",
        body: [
          "Returns do not fail in isolation, and mapping the connected processes established why this was worth the investment rather than being a departmental irritation.",
          "Duplicate refunds and missed reversals back up accounting, so the books do not balance cleanly month to month. Unchecked returns sit in limbo, so sellable items go missing while damaged items stay on record and inventory counts drift. Slow refunds and wrong amounts drive customers away and raise complaint volume. Absent upfront fraud checks mean fraudulent returns are refunded before anyone catches them. Label problems delay returns before they even reach the warehouse. And without accurate return data, quality issues go unreported, so defective products cannot be identified or negotiated with suppliers.",
          "Eight stakeholder groups had a stake in the outcome, and each needed a different success measure: customers wanted resolution under five days, warehouse staff wanted a product checklist rather than a judgement call, service representatives wanted inspection results before approving anything, finance wanted zero duplicate payments, leadership wanted the cost increase reversed, IT wanted refunds to fire only after approval, the fraud team wanted risky returns flagged at intake, and carriers wanted alerts when labels ran late.",
        ],
      },
      {
        heading: "Four discovery methods, and what disagreement told me",
        body: [
          "Understanding why the process failed meant looking past documented procedure to what actually happens, so discovery was deliberately triangulated across four methods in sequence.",
          "Document and policy review established the intended baseline: the customer-facing return policy, internal inspection procedures, refund approval guidelines and documented service levels. System log analysis provided objective timestamped evidence from payment logs, warehouse logs, customer communication logs and order management reason codes. Direct observation captured the informal practices that neither documents nor systems record: how handoffs actually happen, where work waits, where staff exercise discretion and where they have invented workarounds. Stakeholder interviews then explained the reasoning behind the observed behaviour.",
          "The sequencing produced three categories of finding, and the third is the one that justifies using four methods instead of one. Where sources converged, the diagnosis was confident: logs showing early refunds, plus interviews revealing pressure to close cases, plus observation confirming inspectors were unaware of refund status. Where sources diverged, that divergence was itself the finding: policy specified a 24 hour inspection, and logs showed anything from 4 hours to 6 days. A single method would have reported either the policy or the average. Two methods disagreeing revealed unmanaged variability, which is a different problem with a different fix.",
        ],
      },
      {
        heading: "Seven findings, and one that was designed in",
        body: [
          "What looks on paper like a linear controlled workflow operates as a fragmented series of handoffs where each team optimises locally.",
          "Return initiation is fragmented across email, web form, phone and occasionally social media complaints escalated by marketing. Each channel captures different information at different completeness, so representatives spend significant time chasing details after the fact, and the gap cascades into every downstream decision.",
          "Label generation is a hidden bottleneck, semi-manual and dependent on origin channel, with backlogs of two to three days developing at peak. Customers waiting on labels contact support to check status, which adds service volume that further delays label processing. The loop is self-reinforcing.",
          "Warehouse inspection runs on informal criteria. A written standard exists in a document updated years ago, and inspectors have developed individual heuristics from experience, so identical items receive different grades. That makes outcomes unpredictable for customers and makes fraud detection dependent on individual vigilance rather than systematic control.",
          "The refund-before-inspection problem is systemic and, as established, intentional. Service representatives approve under competing pressures that override the decision matrix. Automated notifications are unreliable because the order management system, warehouse system and payment platform have no shared event bus, so each notifies independently, sometimes out of sequence and sometimes not at all. Customers report receiving refund confirmation before an item-received notice, or nothing at all for weeks, which drives status-check contacts estimated at a quarter to a third of all return inquiries. And fraud detection operates in isolation, receiving a weekly report of returns flagged by a scoring algorithm, by which point the refunds have usually already been paid.",
        ],
      },
      {
        heading: "What the logs proved",
        body: [
          "Qualitative findings become arguable without timestamps. Log analysis made four of them unarguable.",
          "The premature refund figure is worth stating carefully, because the source analysis reports it two ways. The formal KPI register, which has a stated measurement method comparing payment logs against inspection logs, puts refunds issued before inspection completion at 65 to 75% against a target of zero. A narrative section elsewhere describes roughly 18%. I have used the register figure throughout because it carries a defined data source and owner, and the discrepancy is exactly the kind of thing a formal measurement approach exists to settle.",
          "The other three were consistent. Inspection cycle time against a 24 to 48 hour target ran from 4 hours to 6 days, and that spread is the signature of unstandardised criteria rather than insufficient capacity. Items requiring re-inspection ran 12 to 18% against a target under 5%, which is rework generated by subjective initial decisions. And problem refunds successfully recovered ran below 30% against a target above 90%, which is the finding that makes premature payment expensive rather than merely untidy: once money has left, it mostly does not come back.",
        ],
        stats: [
          {
            value: "65% to 75%",
            label: "Refunds issued before inspection completed, target 0%",
          },
          {
            // The spread is the finding, so it leads: 6 days is 144 hours,
            // which is 36 times the 4 hour best case.
            value: "36x",
            label:
              "Spread in inspection cycle time, 4 hours to 6 days against a 24 to 48 hour target",
          },
          {
            value: "Under 30%",
            label: "Problem refunds recovered, against a target above 90%",
          },
        ],
      },
      {
        heading: "Putting a number on it, against cited benchmarks",
        body: [
          "Industry benchmarks provided the baseline the scenario had to be measured against, each traceable to a published source. E-commerce return rates run 16.9 to 24.5% of sales. Processing a single return costs 20 to 65% of item value, or roughly $10 to $20 per item in direct cost. Fraudulent returns were 15.14% of all consumer returns in 2024, contributing to $103 billion in total US losses.",
          "Decomposing the 22% year-on-year cost increase against those benchmarks located it. Processing labour ran above benchmark, driven by multi-channel intake, manual data entry and follow-up for missing information. Inspection and restocking ran above benchmark because inconsistent criteria cause re-inspection. Fraud losses ran above benchmark, estimated at 12 to 15% of return value against a 6 to 10% norm, driven by refunds preceding inspection and reactive detection. Service overhead ran above benchmark because a quarter to a third of contacts are status inquiries created by the communication gap.",
          "Modelled on a mid-sized retailer with $100 million revenue and a 20% return rate, meaning $20 million in returns, that increase translates to roughly $1.3 million in excess annual cost attributable to process dysfunction. Separately, with the fraud team estimating that 40 to 60% of fraudulent returns are preventable through real-time detection integrated into the flow, the preventable loss sits between $1.4 and $2.6 million a year.",
        ],
      },
      {
        heading: "Four root cause chains",
        body: [
          "Each major problem was pushed back through a Five Whys chain until it reached something addressable, and in every case the terminal cause was a design decision rather than a performance failure.",
          "Duplicate refunds: errors are found in monthly reconciliation, because no real-time duplicate detector exists, because service and payment run on separate systems, because the connection was never required, because the handoff step was never officially defined. The root cause is absent handoff rules between two teams.",
          "Refunds sent too early: money leaves before inspection, because the system pays immediately on request, because it was built for fast processing, because the customer experience team wanted instant refunds, because accuracy and fraud were never weighed against speed. The root cause is speed valued over accuracy in the original design.",
          "Inconsistent grading: the same item receives different ratings, because no standard checklist exists, because guidelines were never created, because nobody owned quality standards, because grading was treated as common knowledge. The root cause is absent written inspection standards.",
          "Fraud slipping through: fake returns get approved, because there is no fraud check at intake, because risk scoring was never added, because fraud was rare at launch, because the design was never updated as fraud grew. The root cause is fraud detection sitting outside the original design.",
        ],
      },
      {
        heading: "Seven wastes with measured damage",
        body: [
          "All seven TIMWOOD wastes were present, and each was quantified rather than asserted, because a waste analysis without measurement is a list of adjectives.",
          "Transportation: information bouncing between four systems that do not talk, losing data on about 15% of returns. Inventory: returned items sitting in receiving with no tracking, waiting 1.5 days on average before inspection. Motion: staff toggling between three programs to approve one refund, wasting roughly four minutes per approval on screen switching alone.",
          "Waiting: no customer updates and unclear warehouse instructions, producing an average of 3.2 days of pure waiting per return. Over-processing: the same refund processed more than once when duplicates are not caught, at a 3.2% duplicate rate. Over-production: confirmation emails going out before refunds complete, with about 12% sent early or wrong. Defects: different staff grading identical items differently, at 28% inconsistency.",
          "The 3.2 days of pure waiting is the figure that reframes the cycle time problem. Against a 12 to 14 day actual and a 5 day target, roughly a quarter of the elapsed time is neither work nor queue for work, it is nobody having been told anything.",
        ],
      },
      {
        heading: "Seven KPIs, each with a baseline, an owner and a cadence",
        body: [
          "Every KPI connects to a root cause, carries a current baseline, and names a data source, an owner and a reporting frequency. That last part is what separates a measurement framework from a scoreboard: a metric nobody owns does not get acted on.",
        ],
        list: [
          {
            term: "Refund cycle time",
            detail:
              "12 to 14 days now, target 5 or fewer. From payment and request logs, weekly, owned by the process owner. Addresses waiting waste and absent service levels.",
          },
          {
            term: "Premature refund rate",
            detail:
              "65 to 75% now, target 0%. Payment against inspection logs, weekly, owned by finance. Addresses payment triggering on request rather than approval.",
          },
          {
            term: "Inspection consistency",
            detail:
              "72% agreement on identical items now, target 95% or better. Monthly audit of identical items, owned by the warehouse manager. Addresses absent standardised criteria.",
          },
          {
            term: "Duplicate refund rate",
            detail:
              "3.2% now, target below 0.5%. Payment exception reports, weekly, owned by finance. Addresses the absence of a real-time duplicate check.",
          },
          {
            term: "Fraud detection rate",
            detail:
              "About 15% flagged before refund now, target 60% or better. Fraud case logs against total returns, monthly, owned by the fraud team lead. Addresses no screening at intake.",
          },
          {
            term: "Label service level compliance",
            detail:
              "About 60% generated within two hours now, target 95% or better. System timestamps, weekly, owned by IT. Addresses silent failures with no escalation.",
          },
          {
            term: "First-contact resolution",
            detail:
              "About 45% now, target 80% or better. Service ticket data, weekly, owned by the service manager. Addresses representatives working without complete data.",
          },
        ],
      },
      {
        heading: "Advanced BPMN, because the failures are in the exceptions",
        body: [
          "The initial model was a high-level flow, and it could not represent the things that were actually going wrong. Extending it with BPMN 2.0 constructs was what made the failure modes visible and therefore designable.",
          "Exclusive gateways mark every genuine decision: inspection outcome, refund approval, and in the future state fraud-risk routing across low, medium and high. Three subprocesses group related activity and assign ownership: return initiation and label generation including service level monitoring and escalation, warehouse inspection using a standardised rubric, and refund processing including approval validation and duplicate checking before payment fires.",
          "Timer events are the construct that changed the model most, because they make waiting measurable rather than invisible: two hours for label generation escalation, 24 hours for inspection queue escalation, 48 hours to flag refund processing delays, and a four hour retry on customer notifications. In the as-is process all of that waiting existed and none of it was tracked. Boundary error events capture system-level failures like label generation errors, synchronisation failures between inspection and service dashboards, and payment gateway timeouts. Message events carry the communication between teams and systems.",
          "Modelling at this level established that the six major exception paths were not edge cases. They were recurring structural failures, and the volume was genuinely surprising: four disconnected teams operating without a shared system of record, no enforced gates between inspection, approval and refund, and significant manual intervention through email, chat and personal tracking notes.",
        ],
      },
      {
        heading: "The future state, and its traceability",
        body: [
          "Six changes, each traced to a specific root cause and a specific KPI. That traceability is the deliverable as much as the design is, because a redesign nobody can connect back to evidence gets negotiated away in the first budget conversation.",
          "Fraud risk scoring at intake addresses the absence of screening: low-risk returns follow the standard path, medium and high-risk route through additional verification before inspection. It targets fraud detection from about 15% to 60% or better.",
          "A mandatory inspection-before-approval gate addresses the payment trigger. A strict gateway prevents refund approval from starting until the inspection subprocess is complete and recorded, which makes premature refunds structurally impossible rather than merely discouraged. That is the most important change in the design, and everything else builds on it.",
          "A SKU-level inspection rubric with quarterly training and monthly consistency audits addresses the 28% grading variance, targeting 95% agreement. A real-time duplicate check at the approval step addresses the separate-systems problem, targeting the duplicate rate below 0.5%. A unified dashboard with a shared system of record addresses informal handoffs and information loss at team boundaries, targeting first-contact resolution above 80%. And automatic approval for low-risk returns that pass inspection and match the original purchase amount frees representatives to work on exceptions rather than rubber-stamping routine cases.",
          "The last one deserves a note on sequencing. Automating the easy path is only safe once the gate exists. Automating first would have made the existing control gap faster, which is the classic way process automation makes things worse.",
        ],
      },
      {
        heading: "Rollout, risk and who owns it afterwards",
        body: [
          "Four phases, each building on the last. Preparation finalises the design, defines roles across service, warehouse, payment, fraud, finance and IT, and develops the inspection guidelines and training before anything changes. Pilot runs the redesign on a limited set of returns with the three key controls enabled, collecting feedback and fixing problems before scale. Full rollout deploys across all categories and channels while monitoring cycle time, refund accuracy and service level compliance. Continuous improvement reviews performance monthly, updates inspection standards as new products arrive, and tunes fraud thresholds and alerts.",
          "Four risks carry real weight. Resistance to change, where staff keep using old workarounds if new steps feel slow, mitigated by short training, clear job aids and intensive support in the first weeks. System limitations, where older payment software and separate tools make refund timing hard to change, mitigated by piloting first, changing in small increments and involving IT early with clear requirements. Data quality, where forms that do not capture the right information leave fraud scoring and approvals weak regardless of design, mitigated by required fields and validation so incomplete requests never enter the workflow. And inspection capacity, where insufficient staffing simply moves the bottleneck, mitigated by inspection service levels, queue alerts and temporary staffing at peak.",
          "Governance assigns a single process owner accountable end to end for monitoring metrics, resolving escalations and coordinating changes across teams. Regular reviews assess service level performance, error rates, fraud losses and customer experience. New employees are trained on the standardised procedures, and dashboards track cycle time, duplicates, consistency and fraud flags so that drift is visible before it becomes a cost increase.",
        ],
      },
    ],
    closing: [
      "The core problems were not isolated errors, they were design decisions that had outlived their reasoning. The refund trigger was set to fire early on purpose, to improve a satisfaction metric. Inspection standards were never written because grading was assumed to be common knowledge. Fraud screening was never added because fraud was rare when the process was built. None of these were mistakes at the time.",
      "That is the part worth carrying forward. Every one of them became a control failure through the passage of time and changing conditions, not through anybody doing their job badly. A process that is never revisited does not stay correct, it stays the same, which is a different thing.",
      "The redesign shifts the process from speed-driven behaviour to accuracy and control, and it does so while making straightforward returns faster through automation of the low-risk path. Those goals only look contradictory if you assume the gate and the automation are alternatives. Sequenced correctly, the gate is what makes the automation safe.",
    ],
  },
  {
    slug: "parking-permit-service-redesign",
    seoTitle: "Parking Permit Service Redesign Case Study",
    seoDescription:
      "Service design for a university parking permit system: seven interviews, 38 ideas, three prototype rounds and a 71% cut in support tickets.",
    title:
      "Thirty-Four Percent of Purchases Needed a Human. The Form Was Asking the Wrong Question.",
    kicker: "Service design",
    discipline: "Service Design",
    date: "December 2025",
    isoDate: "2025-12-18",
    tags: ["Design Thinking", "Prototyping", "Service Design", "Pilot Design"],
    cardLine:
      "Renaming eight permit codes drove the largest single improvement in the project.",
    sourceNote: SCENARIO_NOTE,
    excerpt:
      "A parking permit service generating 3,000 support tickets a semester on a 1988 mainframe. Three prior fixes had failed. The biggest win in the redesign required no code at all.",
    intro: [
      "Every semester, thousands of students at a 28,000-student university sit down to buy a parking permit and hit a wall. Eight permit types with names that mean nothing outside the Parking Office. A lot selector with no map. An account hold that only appears at the payment screen, after fifteen minutes of form-filling.",
      "So they call, they email, they turn up in person. Staff spend $400,000 a year answering questions the system should have answered itself. The appeal process for citations is worse: download a PDF, print it, fill it in by hand, scan it, email it to a generic inbox, wait fifteen days, and 82% of the time the answer is no with no explanation. Most students stop trying and pay.",
      "Three previous attempts to fix this had failed. A mobile app that lasted two weeks. A chatbot that gave incorrect information. A permit consolidation from twelve types to eight that changed nothing. Each was built on an assumption nobody tested, and that pattern is the actual subject of this study.",
    ],
    sections: [
      {
        heading: "Why three fixes failed",
        body: [
          "The three prior attempts share one flaw: they were solutions in search of a problem.",
          "The mobile app was built without testing whether the device was the barrier. It was not, the logic was. The chatbot was deployed before verifying whether the underlying information was correct, so it confidently distributed wrong answers faster than staff had been distributing them slowly. And reducing permit types from twelve to eight assumed the number was the problem, when the names were.",
          "That last one is the most instructive, because it is the closest to a real fix and it still achieved nothing. Somebody correctly identified that permit selection was confusing, reached for the most obvious lever, and pulled it without checking which variable actually drove the confusion. The redesign that followed spent its first phase doing nothing but establishing what students actually experience, specifically to avoid becoming the fourth attempt.",
        ],
      },
      {
        heading: "What the office saw, and what the research found",
        body: [
          "From inside the organisation this looks like a technology problem, and the evidence for that reading is genuinely strong. The portal is from 2005. The mainframe behind it is from 1988. The citation system from 2019 connects to neither.",
          "The three failed attempts all followed that logic: simplify the options, add a mobile layer, automate the responses. None worked.",
          "Observing and interviewing students directly makes the age of the technology look largely irrelevant. The portal could be rebuilt on the newest available platform and still fail if it presented eight cryptic options, still asked for lot preference without a map, and still revealed holds only at payment. Students do not think in terms of internal permit codes. They think about where they need to park, how far it is from their building, and whether they can afford it. The portal answers none of those questions until after something has gone wrong.",
        ],
        stats: [
          {
            value: "3,000+",
            label: "Support tickets a semester, costing $400,000 a year",
          },
          {
            value: "34%",
            label: "Permit purchases requiring manual staff intervention",
          },
          {
            value: "15 days",
            label: "Average citation appeal turnaround, with 18% success",
          },
        ],
      },
      {
        heading: "Seven interviews, nineteen surveys, two walkthroughs",
        body: [
          "Four methods, chosen to cross-check each other rather than to accumulate.",
          "Semi-structured interviews were primary: seven students, interviewed outside the Parking Office and Student Center over two days, following a topic guide covering permit selection, hold discovery, appeals and workarounds while staying conversational enough to surface the unexpected. Participants are coded I1 through I7 throughout.",
          "A ten-question survey distributed through a class channel returned nineteen responses, capturing selection outcomes, time spent, when holds were discovered and awareness of payment plan options. Direct observation meant completing the full permit purchase flow personally, from the notification email to the payment confirmation screen, which captured the actual sequence of screens and failure points rather than a recollection of them. Digital ethnography treated the available complaint data as a secondary source to validate the severity and frequency of what primary research had surfaced.",
          "Four user groups were identified before any research began, based on how differently the system fails each. Commuter students are the highest-volume buyers and generate the largest share of tickets. International students face a structural barrier no amount of plain language fixes: no US licence plate on arrival, and a required plate field with no alternative. Financial aid students need instalment plans that the portal does not surface visibly. Graduate students and faculty operate under different allocation rules and get shown options that do not apply to them.",
          "All participants were informed of the purpose, participation was voluntary, and no personally identifiable information was collected. Survey responses were anonymous, and no student IDs, financial records or academic information were gathered at any point.",
        ],
      },
      {
        heading: "Five themes from the research",
        body: [
          "The permit taxonomy is organised for the Parking Office, not for students. Every participant described confusion at selection. The names reflect how the office categorises permits internally and tell a student nothing about where they can park, how close it is, or what it costs. Survey data confirmed that only 58% of respondents selected the correct permit on their first attempt.",
          "Hold discovery at the payment step is the leading driver of ticket volume. Four of seven participants had experienced a hold appearing at payment after completing the full selection process, and all four described the same reaction: frustration that the system had not flagged it earlier. One spent twenty minutes filling everything out before discovering a library fine, then had to call in, and the whole thing took two hours.",
          "International students are structurally excluded. Both international participants described being completely unable to complete a purchase before receiving US plates. One was told to wait until the plates arrived, while still needing to get to campus. With roughly 4,000 international students enrolled, this is not a fringe case, it is systematic exclusion by a required form field.",
          "The appeal process was designed for 2005, not 2026. Five of seven participants had received at least one citation, and only two had appealed. The three who did not cited two reasons: the process required printing and scanning, and the 18% success rate made it feel pointless. The process was never designed to be accessible. It was designed to minimise appeals.",
          "And workarounds reveal where the system has failed completely. The most revealing finding was not what students said but what they did instead of using the system: one called the Parking Office before purchasing every year because he did not trust himself to pick correctly, another Googled the permit codes, and a financial aid student learned about payment plans only from a classmate. Workarounds are not user failures, they are design failures made visible.",
        ],
      },
      {
        heading: "Reframing, and the question that reorganised the problem",
        body: [
          "The core problem statement came out of the five themes: students trying to buy permits and resolve citations are navigating a system organised around internal administrative categories rather than their actual needs, producing widespread confusion, wasted time and thousands of avoidable support contacts.",
          "Six How-Might-We questions followed, each framed to invite multiple solution directions. How to help students pick the right permit based on where they need to park and what they can afford, without decoding internal codes. How to show where lots actually are before asking students to choose one. How to catch holds and eligibility problems at the start rather than after twenty minutes. How to make an appeal something a student can do from a phone in under five minutes with real confirmation. How to support students without plates yet or needing to spread payments, without a phone call. And how to reduce the office's ticket load by making self-service actually work first time.",
          "The first three target the purchase flow, the fourth targets appeals, and the last two are cross-cutting: they address the equity gaps and the systemic relationship between a poor user experience and high support cost. Framing that relationship explicitly is what let the redesign be argued in the Parking Director's terms rather than only in students' terms.",
        ],
      },
      {
        heading: "Thirty-eight ideas from three techniques",
        body: [
          "Ideation used three named techniques rather than one open session, because each opens a different part of the space.",
          "Brainstorming produced volume across all the questions, on the principle that quantity precedes quality. Crazy 8s, from the design sprint methodology, requires eight distinct sketches in eight minutes, and the time pressure forces divergence past the obvious: it produced colour-coded permit categories, progress bars and in-browser photo upload for appeals. Journey-based ideation anchored generation to each stage of the current-state journey map, which surfaced the specific gap between form completion and surprise hold discovery, and guaranteed every mapped pain point had at least one corresponding idea.",
          "Thirty-eight ideas came out across five question groups. Permit comprehension produced a step-by-step wizard, plain-language names, side-by-side comparison, tooltips, a best-match recommendation, a video explainer and colour coding. Lot selection produced an embedded campus map, a walk-time calculator, an availability heatmap, entrance photographs, filters by distance and accessibility, and a comparison slider. Hold surfacing produced a check at login, an alert 30 days before purchase season, a banner on the student portal, one-click resolution links and inline resolution time estimates. Appeals produced a fully online form, package-style status tracking, an automatic case number within 60 seconds, direct photo upload and automated decisions for low-dispute citations. And equity produced auto-surfaced instalment plans, a 30-day temporary permit for students without plates, multi-language support, screen-reader compliance and a faculty pathway split at login.",
        ],
      },
      {
        heading: "Five concepts, scored against criteria set in advance",
        body: [
          "The thirty-eight ideas consolidated into five concepts, then went through a weighted scoring matrix. The weights were established before scoring specifically to prevent bias toward a favoured concept: desirability at double weight, feasibility and viability at one and a half, ticket impact at double, and speed to deploy at single.",
          "The wizard scored 36 of 40 and was selected: a guided question-based interface replacing the static permit menu, asking four questions about living situation, commute frequency, special needs and days per week, then recommending a best-fit permit in plain language with price, description and a map preview. It also folds in a hold check as step zero.",
          "The hold dashboard scored 36 as well, and rather than treating that as a tie to break, I integrated it as step zero of the wizard. It was the highest-feasibility concept of the five, since hold data already exists across registration and billing and the concept required only a new query point in the flow. Combining them maximised impact with no added complexity.",
          "The visual lot explorer scored 30 and became a phase two candidate, since a full interactive map needs a mapping API and real-time occupancy data, with a static lot preview included in the wizard as an interim. The digital appeal tracker scored 31 and was scheduled as phase 1b, high impact and feasible but needing separate workflow configuration. The inclusive access bundle scored 25 and was split: the most critical equity items went into the core scope, the rest became phase two, because full delivery needs coordination with financial aid and the registrar.",
        ],
      },
      {
        heading:
          "Three rounds at rising fidelity, and the $110 that saved $12,000",
        body: [
          "Fidelity progressed low to high, with each level answering a different category of question, which matters when there is a hard semester deadline and a no-new-systems constraint.",
          'Round one was paper: a hand-drawn wizard, printed permit cards and a sticky-note appeal flow. Five days, 38 hours, $110. Eighteen students tested the wizard and twelve who had received citations tested the appeal flow. Seventy-eight percent selected the correct permit first try, four were confused by the "Remote" label, holds were not visible until step four of five, and 60% never discovered the financial aid payment option. Eighty-nine percent completed the appeal flow, and the main pain point was not knowing whether a submission had been received.',
          'That round is the one I would point to if asked what prototyping is for. Two afternoons and $110 of cardboard killed a planned SMS notification layer, worth about $12,000 to build, by establishing that students wanted clarity upfront rather than reactive alerts. It also renamed "Remote" to "Satellite Lot (Free Shuttle)", moved the hold check to step one, and surfaced the payment plan on the landing screen.',
          'Round two was a clickable Figma prototype: seven days, 60 hours, $340. Twenty-two students including six international and four financial aid, plus fourteen students and three staff on the appeal tracker. Ninety-two percent correct selection, average completion 2 minutes 41 seconds, and international students at 87% success against near-zero on the live portal. Payment plans were adopted by 73% of eligible students who were shown them. Issues found: lot map images too small on mobile, and the plate-entry field still blocking international students, which produced a full-screen map modal and an "I don\'t have a US plate yet" route into a temporary permit flow. On the appeal side, "Under Review" felt vague, so it gained a typical resolution window and an estimated decision date.',
          "Round three was functional: an HTML and JavaScript wizard sitting as a guided layer over a cloned portal, with a lightweight tool as the appeal tracking backend so the mainframe needed no changes. Fourteen days, 175 hours, $7,800, and more than 500 test sessions to validate performance under semester-rush volume.",
        ],
      },
      {
        heading: "The minimum lovable product argument",
        body: [
          "Two scopes were costed against each other, and framing the choice this way is what made it a decision rather than a preference.",
          "The minimum viable version was 30 days and $20,000: plain-language descriptions replacing the codes, the hold check moved to step one, basic digital appeal submission and an email confirmation on receipt. No interactive map, no international routing, no mobile optimisation, no status tracker, no staff panel. Its goal was narrow and legitimate: prove that plain language plus earlier hold disclosure reduces ticket volume.",
          "The minimum lovable version was 60 days and $38,000, adding the full wizard with interactive lot map, the international plate routing, prominently surfaced payment plans, the live three-status appeal tracker with estimated decision date, a staff admin dashboard and mobile-responsive design.",
          "Testing gave both a measured result rather than an estimate. The viable version delivered a 42% ticket reduction, 72% correct selection and 48% international completion. The lovable version delivered 71%, 94% and 83%. The additional $18,000 bought 69% more ticket reduction on the one metric the Parking Director had tied to the programme's institutional continuity. On that basis the delight layer was not a luxury, it was what converted a transaction into something students could actually complete.",
        ],
      },
      {
        heading: "A 60-day pilot with a hard deadline in the middle",
        body: [
          "The pilot covered all new and returning students buying permits for the coming semester, on $38,000 covering development, training, materials and contingency, with the constraint that no new systems were introduced: an overlay on the 2005 portal, a lightweight appeal backend, and all mainframe inventory logic untouched.",
          "The immovable fact was that full-volume rush begins on day 45, when 15,000 permits must be processable in two weeks. Everything in the schedule works backwards from that.",
          "Build and secure ran days 1 to 20: develop the overlay, security review with IT including privacy compliance, build the appeal tracker, configure the staff panel and draft training. Exit criteria were IT security sign-off, an accessibility audit pass and staff trained and signed off. Soft launch ran days 21 to 35 with a 500-student beta cohort spanning all four user groups, both old and new paths available, daily feedback and staff debriefs, requiring at least 70% beta adoption, a ticket rate below 15 per 100 students and zero data or payment errors.",
          "Rush ran days 36 to 50 with the wizard as primary path and the legacy path retained as failover, daily ticket monitoring, IT on call 8am to 8pm through the peak fortnight and real-time dashboard tracking. Evaluate and scale ran days 51 to 60: quantitative analysis, qualitative interviews with fifteen students and five staff, a stakeholder presentation and a scale-up playbook.",
          "Five risks were carried with explicit mitigations. Overlay failure under rush load, mitigated by retaining the full legacy path, load testing to twice expected peak before day 36 and a 30-minute IT response commitment. Mainframe sync errors, mitigated by reading in real time and never caching inventory, with automated alerts if sync lag exceeds 60 seconds. Staff resistance to the new appeal workflow, mitigated by co-designing the admin panel with staff and appointing two of them as appeal champions. Privacy concerns with the external appeal tool, mitigated by an enterprise agreement and storing only citation number and appeal text, never financial data. And low student awareness, mitigated by an email campaign two weeks out, QR codes at kiosks and transit stops, and orientation inclusion.",
        ],
      },
      {
        heading: "What the pilot produced",
        body: [
          "All six go/no-go criteria were exceeded. Ticket reduction of 71% against a 50% minimum. Appeal resolution at 3.2 days against a 3 day target. Student satisfaction 8.2 out of 10 against 7.5. Staff satisfaction 8.4 against 7.5. Uptime 99.6% during rush against 99%. International completion 83% against 60%.",
          "The financial case is straightforward. Current service spend of $400,000 a year decomposes into roughly $180,000 on manual permit interventions, $120,000 on appeal processing and $100,000 on general support inquiries. Projected spend after the redesign is about $132,000, giving annual savings of $268,000 against $38,000 one-time and $8,000 a year maintenance. Net first-year benefit of $222,000, payback around 51 days, and a five-year net benefit above $1.25 million.",
          "One outcome I did not predict: the appeal success rate rose from 18% to 31%. The redesign was built to make appealing accessible, not to make appeals more likely to succeed. It rose because a structured form with direct photo upload produces clearer submissions and better evidence than a hand-filled scanned PDF. Improving the input quality improved the decisions, which is a second-order effect worth looking for elsewhere.",
        ],
        stats: [
          {
            value: "71%",
            label: "Support ticket reduction, against a 50% target",
          },
          {
            value: "51 days",
            label: "Payback period on $38,000, with $268,000 annual savings",
          },
          {
            value: "83%",
            label: "International student completion, from near zero",
          },
        ],
      },
      {
        heading: "What I would do differently",
        body: [
          "Four things, and I would rather record them than present the project as having gone smoothly.",
          "Financial aid students should have been in round one, not round two. The payment plan discoverability problem surfaced two weeks later than it needed to, and the general rule is that the most constrained users surface the most important problems, so they should be recruited first rather than added for coverage.",
          "Privacy approval for the external appeal tool should have been day one, not day twelve. The legal review nearly pushed the project past the semester deadline. Compliance is not a step at the end of a process, it is a dependency with its own lead time.",
          "Build in 20% buffer. Legacy integration always finds something unplanned, and buffer time is not slack, it is honesty about complexity. And map the faculty permit rules earlier: deferring them to phase two will cost whoever picks this up about a month of rework, which is a cost I created by scoping around a hard problem rather than through it.",
        ],
      },
    ],
    closing: [
      "The permit system was not broken because the technology was old. It was broken because nobody had watched a student use it.",
      "The biggest improvements cost nothing. Renaming eight cryptic permit codes into plain English was a spreadsheet edit: no code, no meetings with IT, and it drove the single largest improvement in correct permit selection in the entire project. Showing holds on step one instead of step five was a query moved earlier. Confirming that a submission had been received was one automated email.",
      "Three things made the difference in how the work landed. Involving the staff who would use the admin panel in designing it stopped them resisting it, which was not a coincidence but a strategy. Concrete numbers from real students moved the conversation from whether to do this to when, faster than any presentation would have. And task completion climbing from 61% to 87% to 94% across three rounds is the whole argument for iteration: the final design is not what I started with, and that is the point.",
      "The result was 71% fewer support tickets, appeals resolved in 3.2 days, and 83% of international students completing a purchase they previously could not start, all running on infrastructure from 1988 and 2005 that nobody touched. The lesson is not that old systems can be fixed. It is that most broken services are not technology problems, they are listening problems.",
    ],
  },
  {
    slug: "invoice-automation-governance",
    seoTitle: "RPA Invoice Automation Project Governance",
    seoDescription:
      "Governance design for a $250,000 RPA pilot in accounts payable, built around the prior automation failure: RACI, gates, maturity and fraud controls.",
    title:
      "The Last Automation Attempt Failed. That Shaped Everything About This One.",
    kicker: "Delivery governance",
    discipline: "Delivery Governance",
    date: "January 2026",
    isoDate: "2026-01-09",
    tags: ["Governance", "RACI", "Risk Management", "Hybrid Delivery"],
    cardLine: "A bot with a flawed rule produces 7,000 errors, not 300.",
    sourceNote: SCENARIO_NOTE,
    excerpt:
      "A $250,000 RPA pilot in accounts payable, designed around a prior automation failure. Every governance decision traces to something that went wrong last time.",
    intro: [
      "An accounts payable team processes 10,000 invoices a month by hand. Eight people, five days average from receipt to approval, and a 3% error rate sending roughly 300 invoices back through the system every month. At the conservative end of the industry benchmark, $12 per invoice, that is over $1.4 million a year in processing cost alone.",
      "A previous automation attempt made things worse rather than better, and that history shapes everything about how this project is designed.",
      "The CFO approved $250,000 for a robotic process automation pilot over 20 weeks, targeting the 70% of invoices that are clean three-way matches under $5,000. What makes this a governance study rather than a technology one is that almost every design decision in it, the scope boundary, the RACI assignments, the escalation thresholds, the gate criteria, exists because of something specific that failed last time.",
    ],
    sections: [
      {
        heading: "Three structural problems, and one that matters more",
        body: [
          "The numbers understate the situation for three reasons.",
          "First, invoices arrive through three channels, email, physical mail and the vendor portal, in formats ranging from structured electronic data to scanned handwritten documents. There is no single intake point, no standard format and no automated extraction for most of what arrives, so every invoice needs a human to read it, key it and route it.",
          "Second, the approval matrix is genuinely complex: 47 distinct routing rules based on amount, department and spend category. That complexity is not arbitrary, it reflects real audit requirements and organisational structure, which means it cannot simply be simplified away. It also means experienced staff make routing errors and new staff take months to become useful.",
          "Third, and this is the one that governs the design: this is not the organisation's first attempt at accounts payable automation. A previous effort to automate expense report processing failed, and it failed by creating more work rather than less. Invoices that did not fit the automated workflow were pushed to a manual queue nobody had staffed, producing a backlog worse than the original manual process. That created institutional skepticism this project has to address rather than work around.",
        ],
        stats: [
          {
            value: "10,000",
            label: "Invoices a month, eight staff, five day average cycle",
          },
          {
            value: "47",
            label:
              "Routing rules governing approval by amount, department, category",
          },
          {
            value: "3%",
            label: "Error rate, sending roughly 300 invoices back each month",
          },
        ],
      },
      {
        heading: "The scope boundary was the most important decision",
        body: [
          "The pilot covers two departments and only invoices with a clean three-way match, where purchase order, receipt and invoice align, under $5,000. That segment is roughly 70% of total volume and the most rule-based and predictable part of it, which is what automation handles well.",
          "There is a serious argument for the opposite approach, and some of the accounts payable team made it: start with the hardest cases, the complex multi-approval invoices that consume the most staff time per unit, because the return per automated transaction is higher. On a per-invoice basis that is mathematically correct.",
          "It ignores the lesson from the previous failure. Starting with complex cases means more exceptions, more edge cases and a higher probability of exactly the backlog that killed the last attempt. The pilot targets volume and predictability precisely because a visible, reliable success on 70% of invoices builds the credibility needed to attempt the remaining 30% later.",
          "Getting this boundary wrong in either direction fails. Drawn too broadly, trying to automate invoices that do not fit clean rules, it repeats history. Drawn too narrowly, automating only the simplest cases, it produces underwhelming returns that do not justify the investment. Seventy percent is where automation is reliable enough to succeed while covering enough volume to demonstrate value.",
        ],
      },
      {
        heading: "The prior failure, reconstructed and mapped",
        body: [
          "Every stakeholder references the expense report failure: the accounts payable team as proof automation does not work, the CFO as the reason the pilot scope is limited, internal audit as the basis for their caution. Understanding exactly why it failed was the single most important input to this design.",
          "I reconstructed it through interviews with the accounts payable manager, review of the original project documentation, which amounted to a charter and a vendor contract, and conversations with three staff who worked through the transition. Five root causes came out, and each maps to a specific decision in this plan rather than to a general commitment to do better.",
        ],
        list: [
          {
            term: "Exception backlog overwhelmed the team",
            detail:
              "No exception handling was designed. Here, exception handling is a named work package with an accountable owner, and the scope is limited to the 70% most predictable invoices to hold the exception rate down from the start.",
          },
          {
            term: "Bot rules did not match actual workflows",
            detail:
              "Written policy differed from real practice, and no users were involved. Here, staff co-design the workflows, and process mapping comes from observation rather than documentation.",
          },
          {
            term: "Forty percent of users never adopted the tool",
            detail:
              "There was no change management: training was an email and a manual. Here, change management is a named function with a resistance plan and redeployment defined before launch.",
          },
          {
            term: "Nobody could tell whether it was working",
            detail:
              "No success criteria or go/no-go gates existed. Here, five specific criteria, a gate at week 12 and a gate at week 20, each with explicit pass or fail thresholds.",
          },
          {
            term: "No lessons were captured after it failed",
            detail:
              "No formal lessons-learned process existed. Here, a retrospective sits inside every phase gate, and the closing retrospective compares this project directly against the failed one.",
          },
        ],
      },
      {
        heading: "Three observations from that mapping",
        body: [
          "The most damaging root cause was not technical. It was the absence of exception handling design. The bot handled the happy path and had no rules for anything else, which created a manual queue worse than the process it replaced. That is why exception handling here is a named work package rather than a task inside bot development.",
          "Excluding the accounts payable staff from design created two separate problems that are easy to conflate. It created a trust gap, which is the change management issue everybody notices. It also created a knowledge gap, which is the more expensive one: written policies did not capture department-specific pre-approvals, travel thresholds or international workflows, so the bot was built against rules that were not the real rules. Staff co-design is not only good change management, their tacit knowledge of the 47 rules is irreplaceable.",
          "And no success criteria were defined before launch, so there was never an agreed threshold separating working from failing. Problems produced a slow drift into dysfunction rather than a clear decision point. That is the specific failure mode that gates exist to prevent.",
          "One reading of the failure needs pushing back on. Some staff treat it as proof that automation cannot work for complex finance processes. That is too broad. It demonstrates that automation without exception design, user involvement and success criteria does not work. The governance failed, not the technology, and the right conclusion is more discipline about automation rather than more fear of it.",
        ],
      },
      {
        heading: "Governance the organisation can actually sustain",
        body: [
          "Before designing any governance, I assessed what kind of governance this organisation can maintain. An overly complex framework imposed on a low-maturity organisation produces overhead nobody sustains: status reports nobody reads, steering committees that stop meeting, risk registers never updated.",
          "Assessed across five dimensions against a five-level maturity model, the organisation scored 2.2, placing it at level two of five. Basic practices exist, charters get written and budgets get tracked, but they are inconsistently applied, lessons are not formally captured and risk management is reactive. The expense report failure is the clearest evidence: it had a charter and a budget, and no risk register, no change plan and no lessons-learned process.",
          "Two dimensions deserve specific attention. Risk management scored 1.5, the lowest, and that is the most concerning score for an automation project specifically. Automation amplifies both benefits and errors. A bot processing 7,000 invoices a month with a flawed rule produces 7,000 errors, not the 300 a human team produces. An organisation without systematic risk identification and monitoring is not ready for that amplification, which is why building a risk register with monitoring triggers is treated as project scope rather than assumed capability.",
          "Change management scored 1.8, reflecting the absence of any formal process in the organisation's history. The expense report rollout was a training email and a user manual, with no stakeholder analysis, no resistance planning and no adoption tracking, and 40% of intended users never adopted it. This project invests in change management as a named function not because best practice recommends it but because the organisation's own history demonstrates the consequence.",
          "There is a reasonable objection: a level two organisation should build project management capability before attempting automation. That is theoretically sound and practically unworkable, because the funding is approved now. The answer is to design governance light enough for level two to sustain and use the pilot itself as the capability-building vehicle. Succeeding with a risk register, a change plan and a retrospective moves the organisation toward level three through practice rather than training.",
        ],
      },
      {
        heading: "Fewer stakeholders, higher intensity",
        body: [
          "This project touches fewer people than a platform replacement, and the people it touches are affected far more directly in their daily work. Somebody whose department adopts a new scheduling tool adjusts a workflow. A clerk whose invoices are automated faces a question about whether their role exists. That intensity is what makes stakeholder management disproportionately important relative to a $250,000 budget.",
          "Four tensions matter more than the power-interest grid that produced them.",
          "The CFO against the accounts payable team. The CFO sees efficiency, the team sees a threat to their jobs, and both readings are rational. Credibility here cannot be built through repeated commitments, only through actions: involving staff in bot design, and defining specific redeployment roles before go-live rather than promising them afterwards.",
          "Speed against control. The CFO wants proof of concept in 12 weeks. Internal audit wants a thorough workflow review before any invoice touches a bot. The resolution is parallel review: audit reviews workflows incrementally as they are configured rather than in one gate at the end, which is also why the audit liaison sits inside the governance tier rather than outside it as a reviewer.",
          "The ERP team's ambivalence. A major ERP upgrade is scheduled in 18 months, and that team is watching, because a failed pilot validates their argument that automation should wait for the ERP. The stakes therefore extend past accounts payable. And the pilot departments against everyone else, since non-pilot departments may resent staying on the five-day cycle, which the communication plan frames as a proof step toward university-wide benefit rather than a permanent advantage for two departments.",
          "The most underestimated stakeholder is the vendor. The engineers they assign and the quality of their support influence technical success more directly than any internal stakeholder. This project addresses that by giving the vendor a standing seat at the weekly technical standup and a defined escalation path to the CFO if support falls below the agreed level, treating them as a governance participant rather than a supplier.",
        ],
      },
      {
        heading: "Fraud controls, and the five points of automation I gave up",
        body: [
          "Fraud prevention belongs in the governance section rather than the technical one, because internal audit's concern is not whether the bot processes invoices faster. It is whether the bot creates fraud opportunities the manual process would have caught. That is a fair question: a human processor might notice something a rule was never written to check.",
          "Three vectors needed addressing. Duplicate payment, where the same invoice is submitted twice and a bot processes both unless explicitly told to check, handled by a duplicate rule comparing invoice number, vendor, amount and date against the last 90 days, with any match triggering a hold for human review. Fictitious vendor invoices, where an invoice from an unregistered vendor passes through unvalidated, handled by mandatory vendor ID validation against the ERP master file before anything enters the approval queue. And threshold manipulation, splitting a $6,000 invoice into two $3,000 invoices to stay under the approval threshold, which a bot cannot detect directly but can flag as a pattern: multiple invoices from one vendor inside a 48 hour window summing above $5,000 route to a human.",
          "These checks cost something real. They reduce straight-through processing from a theoretical ceiling around 85% to the 80% target. The CFO could reasonably see that as slowing down the thing the bot exists to speed up.",
          "I accepted that trade deliberately, and it is worth being explicit about why. The five points of straight-through processing are the price of audit confidence, and audit confidence is a precondition for the pilot being approved at all. An 85% automation rate that internal audit will not sign off is worth zero percent.",
        ],
      },
      {
        heading: "Decision rights, and three assignments worth defending",
        body: [
          "Governance runs three tiers, each with a distinct purpose and a deliberately small footprint. The sponsor tier is the CFO, engaged fortnightly for 15 minutes on three questions: are we on track, what needs my attention, is the return case still valid. The CFO does not attend weekly meetings or review technical detail.",
          "The governance tier is where most decisions happen: the project manager, the audit liaison and the accounts payable manager, meeting weekly for 30 minutes, owning the plan, the risk register and stakeholder engagement. The execution tier is the technical lead, the vendor and staff subject matter experts, meeting daily during active sprints, owning all technical decisions within approved scope and escalating only when a choice has budget, timeline or compliance implications.",
          "The RACI matrix distinguishes responsible from accountable, and the distinction is load-bearing: in every row exactly one person is accountable, which means exactly one person can be asked why something happened. Three assignments deserve explanation.",
          "The accounts payable manager is accountable for exception handling design, not the technical lead and not the vendor. The vendor knows the tool, the technical lead knows the architecture, and the manager knows the invoices. Exception handling is precisely where the last attempt failed, and it failed because the people who understood the actual workflows were not in charge of designing for them. This assignment ensures the design reflects reality and gives the manager ownership of the part of the project that most affects their team.",
          "Internal audit is consulted on workflow design and fraud controls rather than merely informed. The difference between those two is the difference between input and notification: audit's concerns about segregation of duties need to shape the workflow before it is built, not be discovered in a review afterwards.",
          "And the CFO is accountable for the go/no-go decision at each gate but only informed on technical architecture. The CFO does not need to understand how the bot connects to the ERP. Involving the sponsor in technical decisions slows the project without improving the outcome.",
        ],
      },
      {
        heading: "Escalation thresholds set deliberately low",
        body: [
          "Escalation is a routing mechanism, not an admission of failure, and the framework quantifies its triggers rather than leaving them to judgement. Not escalate when appropriate, but escalate when cost variance exceeds 5% or the timeline slips more than one week.",
          "Those thresholds are lower than most project teams would use, and the reason connects directly back to the maturity assessment. A level two organisation does not have the monitoring discipline to detect slow-developing problems. By the time a two-week slip is visible it may already be a four-week slip that was not being tracked accurately. Lower thresholds compensate for that gap, and they are an acknowledgement of a known weakness rather than an overreaction.",
          "Budget tracking uses earned value management, with cost or schedule performance below 0.95 triggering a steering committee review and below 0.85 triggering immediate CFO escalation. Change control is deliberately three steps rather than seven, so that it actually gets followed: a one-page request taking 15 minutes, an impact assessment within 48 hours, and a decision, where changes under $5,000 and under one week of impact are decided by the project manager alone and anything larger goes to the CFO. Approved changes are logged and reviewed at every fortnightly CFO briefing so scope creep stays visible rather than accumulating in a backlog.",
          "The orthodox objection is that every change should pass a formal change control board. On a 20 week pilot that creates a bottleneck costing more in delay than the changes themselves cost. The tiered threshold delegates low-impact decisions to the person closest to the work and reserves the sponsor's attention for decisions that need it.",
        ],
      },
      {
        heading: "Two gates, and why 70% becomes 80%",
        body: [
          "Delivery runs five phases across 20 weeks with two hard gates. Initiation in weeks 1 to 2. Discovery in weeks 3 to 6, documenting the current flow including all 47 rules, sorting them into automatable against requiring human judgement, and cataloguing every exception type with its frequency. Build and proof of concept in weeks 5 to 12. Pilot in weeks 13 to 20. Transition in weeks 19 to 20.",
          "Gate one at week 12 requires at least 70% straight-through processing in user acceptance testing, no audit compliance failures, all critical defects closed, and sign-off from both the CFO and internal audit. Gate two at week 20 requires cycle time at or below two days, straight-through processing at or above 80%, error rate at or below 0.5% against the 3% baseline, a full audit trail for every processed invoice, at least 60% of staff rating favourably on the redeployment readiness survey, and CFO approval of the updated return projection.",
          "The ten-point gap between the two thresholds is intentional and worth spelling out, because it looks like an inconsistency. User acceptance testing uses a controlled invoice sample curated to cover rule scenarios cleanly, which produces higher automation rates than unfiltered production volume. The 80% production target accounts for real-world variance: edge cases, unusual formats and routing combinations that do not appear in a controlled test set. The gap is the risk buffer between a laboratory result and a live operational standard, and treating a UAT number as a production forecast is how automation projects surprise themselves.",
          "Readiness is assessed across five dimensions before each transition, each rated green, amber or red: technical, compliance, organisational, infrastructure and financial. All green and the project manager authorises the transition. One or two amber and the steering committee grants conditional approval with a documented mitigation. Any red and the transition is blocked with a corrective plan due within five business days. The CFO holds final authority at gate two.",
        ],
      },
      {
        heading: "Change management, and the promise that had to be in writing",
        body: [
          "This is the highest-risk area of the project. The last automation did not fail because the technology broke, it failed because the people side was not handled, so the change plan runs alongside the technical build rather than after it.",
          "It is structured on the ADKAR model across five phases. Awareness in weeks 1 to 4, through a CFO town hall, a frequently asked questions document addressing job concerns directly, and the redeployment commitment in writing. Desire in weeks 4 to 8, through live bot demonstrations and change champions paired with staff. Knowledge in weeks 8 to 14, through role-based training with sandbox practice. Ability in weeks 14 to 20, through go-live with floor coaching and a help channel. Reinforcement in weeks 12 to 20, mapping freed capacity to higher-value work and offering upskilling paths.",
          "The commitment underneath all of it is specific rather than reassuring: no positions are eliminated. Three to four full-time equivalents freed by automation are redeployed to vendor management, spend analytics and bot oversight. Every affected team member has a documented transition plan by week 14, built jointly with their manager and HR.",
          "That commitment has to be in writing and it has to come from the CFO, because the organisation has already been promised things about automation once. The message to staff is that the bot takes over repetitive matching and routing so people can handle work requiring judgement: vendor disputes, spend analysis, process improvement and bot oversight. Nobody is being replaced, the tedious part of the job is.",
          "Adoption is measured rather than assumed, through a readiness survey at week 14 and again at week 20, with at least 60% favourable required to pass gate two. Making adoption a gate criterion rather than a hope is the mechanism that stops this project repeating the 40% non-adoption of the last one.",
        ],
      },
      {
        heading: "Quality, and rejecting risk-based testing",
        body: [
          "Quality runs six gates from requirements sign-off through to a return review at month twelve, each with named acceptance criteria and a named decider. Requirements sign-off requires all 47 rules validated by the accounts payable manager and confirmed by audit. Bot design review requires all invoice types covered with segregation of duties intact. UAT exit requires zero critical defects, cycle time at or below two days and straight-through processing at or above 80%.",
          "User acceptance testing uses real invoices in all formats, spend categories and edge cases from both pilot departments, with accounts payable staff as testers rather than IT. Test scripts map one to one against all 47 routing rules, including negative tests: duplicates, mismatched purchase orders, invoices near the $5,000 threshold and new vendors. Every bot action is logged with a timestamp, the triggering rule, the data read and the decision made, stored in tamper-evident format, with audit reviewing a sample during UAT to confirm the logs meet evidence standards before go-live.",
          "Common practice would argue for risk-based testing here: cover the highest-risk 20% of rules representing 80% of volume rather than testing all 47 individually. It is a reasonable default and I rejected it for one specific reason. The 47 rules include the fraud detection controls, where incomplete coverage creates audit liability rather than quality risk. A single untested fraud rule failing in production is not a defect, it is a compliance failure. Full rule coverage is non-negotiable in that specific context, and I would have accepted risk-based testing on a rule set without controls in it.",
        ],
      },
      {
        heading: "The handoff that broke last time",
        body: [
          "The transition from project delivery to operations was the breaking point in the previous attempt, so it is designed rather than assumed. Runbooks and exception handling guides are delivered to operations two weeks before the pilot ends. Operations shadows the project team through the final two weeks before taking ownership. A four week hypercare period follows handoff with daily monitoring from the vendor and project manager. And the accounts payable director and IT operations sign an operational acceptance document before the project formally closes.",
          "Steady-state support runs three levels: daily exception queue management owned by operations with same-day resolution, bot maintenance and rule updates owned by IT and the vendor within three business days, and major enhancements owned by a part-time dedicated developer scoped per request.",
          "The ERP upgrade at 18 months is the single largest threat to the long-term value of this work, and it gets explicit governance rather than informal coordination. Two risks need managing. System instability, if the ERP team begins schema changes or API modifications during the pilot, handled through a shared freeze calendar maintained jointly by both project managers, with conflicts surfaced monthly rather than discovered during a weekend deployment.",
          "And strategic redundancy, if the ERP upgrade includes native automation. The response is not to ignore that possibility but to plan for it. Bots are built modular, each handling one workflow step and communicating through existing APIs, so any single bot can be retired without disrupting the others. The process documentation produced during the pilot, the workflow maps, exception rules and routing logic, transfers directly into ERP configuration and reduces that team's discovery work substantially. Fifteen thousand dollars of the contingency reserve is earmarked specifically for post-upgrade reconfiguration.",
          "A legitimate counterargument says $250,000 on automation is redundant when an upgrade 18 months out may include it natively. ERP upgrades are historically late, and this organisation's own record confirms it. More importantly, even if native automation arrives on schedule, the pilot produces process documentation, exception design and change management experience that accelerates the ERP configuration. The $250,000 buys institutional capability, not just bots.",
        ],
      },
    ],
    closing: [
      "The financial case is straightforward and deliberately conservative. Using the $12 floor of the $12 to $40 benchmark range rather than a midpoint, 7,000 automated invoices a month produces about $1.01 million in annual processing savings, with error rework reduction from 3% to 0.5% adding roughly $108,000. Total projected annual benefit around $1.12 million against a $250,000 one-time investment, which puts payback near 2.7 months, well inside the CFO's twelve-month window.",
      "But the number that governs this project is not the return. It is 40%, the share of intended users who never adopted the last automation. That figure is why change management is a named function, why the accounts payable manager is accountable for exception design, why adoption is a gate criterion rather than an aspiration, and why the redeployment commitment is in writing from the sponsor.",
      "Governance here is intentionally lean, because a level two organisation running on half a full-time equivalent of project support cannot sustain a heavy framework, and a framework nobody maintains provides no control at all. What it does instead is put the thresholds low, the decision rights explicit and the gates hard.",
      "The prior failure is the most valuable asset this project has. It converted every abstract governance argument into a specific, locally credible one. Nobody needs convincing that exception handling matters, or that success criteria should be defined before launch, or that users should be involved in design. They watched what happened without them.",
    ],
  },
];

const f = (
  slug: string,
  width: number,
  height: number,
  tone: "light" | "dark",
  alt: string,
  caption: string,
): BlogFigure => ({
  src: `/blog/figures/${slug}.webp`,
  width,
  height,
  tone,
  alt,
  caption,
});

/**
 * Figures, keyed by post slug then by the exact heading of the section they sit
 * under. Every one is lifted from the original analysis rather than drawn for
 * the page, trimmed and converted to WebP but otherwise unaltered.
 *
 * Keying on the heading string rather than an index means reordering sections
 * cannot silently move a figure to the wrong argument, and `withDerived` throws
 * if a key here matches no heading.
 */
const FIGURES: Record<string, Record<string, BlogFigure[]>> = {
  "it-service-desk-ticket-resolution": {
    "Mapping what actually happens, not what is documented": [
      f(
        "service-desk-as-is-bpmn",
        2000,
        1099,
        "light",
        "Swimlane BPMN model of the current ticket resolution process across five lanes: User, Systems, Tier 1 Support, Tier 2 Support and Tier 3 Support. A loop runs from Reroute Ticket back to Review Ticket Description, and a second loop pauses the process to request additional information from the user.",
        "The as-is model, drawn from how tickets actually moved rather than from the process document. The two loops are the finding: Reroute Ticket returning to Review Ticket Description, and Provide Additional Information stopping the work entirely. Neither appears in the documented flow.",
      ),
    ],
    "Root cause, not symptom": [
      f(
        "service-desk-fishbone",
        1327,
        831,
        "light",
        "Fishbone diagram with the 30 percent ticket miscategorisation rate as the effect and six cause categories: People, Process, Technology, Information, Environment and Management, each carrying three contributing factors.",
        "Six categories, eighteen contributing factors. Technology and Information hold the ones that matter: no assisted categorisation, basic keyword matching, vague descriptions, no required fields. People contributes experience and workload, which is exactly why retraining triage staff would have missed.",
      ),
    ],
    "The capability was already bought and not switched on": [
      f(
        "service-desk-to-be-bpmn",
        2000,
        1101,
        "light",
        "Swimlane BPMN model of the redesigned process with a new AI and Automation lane containing knowledge base retrieval, ticket categorisation, queue routing and recurring pattern detection. A complexity gateway splits work into simple, standard, complex and critical paths.",
        "The to-be model. The new automation lane does the categorising and routing, the complexity gateway replaces the single queue with four paths, and the branch to No Ticket Needed is the self-service deflection. Every capability in that lane was already licensed and unused.",
      ),
    ],
  },

  "study-space-design-thinking": {
    "Four methods, because asking people is not enough": [
      f(
        "study-space-empathy-map",
        874,
        964,
        "light",
        "Empathy map for a composite Snell Library study space user, built from twenty research participants, divided into what the user thinks and feels, hears, sees, and says and does, with pains and gains listed underneath.",
        "The four methods synthesised into one composite user. The value of the format is the gap it exposes between the Say and Do quadrant and the Think and Feel one: students describe walking over to check as normal, and separately describe the system as unfair.",
      ),
    ],
    "What twenty students actually reported": [
      f(
        "study-space-as-is-journey",
        1804,
        973,
        "light",
        "Current state journey map across seven stages from realising a need to settling or giving up, with swimlanes for Student, the booking system and Library staff, and an emotion row running neutral, confused, frustrated, hopeful, resigned, stressed and defeated.",
        "Seven stages, three swimlanes, and an emotion row that carries the argument: hopeful at the point of booking, resigned on arrival. The pain points cluster at stages three to six, and the staff lane is almost empty, which is its own finding.",
      ),
    ],
    "Framing the problem without prescribing the answer": [
      f(
        "study-space-personas",
        1392,
        1031,
        "light",
        "Three persona cards. Maya, a second year undergraduate who books for group study. Arjun, a first year masters student dependent on specific room features. Priya, a fourth year undergraduate with accessibility needs, labelled a disengaged user. Each card lists a goal, a frustration, a workaround and a usage frequency.",
        "Composite profiles built from all twenty participants. The row that matters is Workaround: arrive ten minutes early, walk the floor, or stop booking altogether. Priya's card shaped the most decisions, because she had already left the system and would never have appeared in a complaint log.",
      ),
    ],
    "Two prototypes, and what changed between them": [
      f(
        "study-space-prototype",
        1100,
        650,
        "dark",
        "Four screens from the medium fidelity booking prototype: a needs input form with group size and feature checkboxes, a filtered results list showing three matching rooms with match bars, a room detail view, and a booking confirmation.",
        "The medium-fidelity round. The accessibility filters sit in their own labelled section rather than inside the general checklist, and the coloured match bar has moved to the top of each room card. Both changes came out of the paper prototype, before any of this was built.",
      ),
    ],
    "The final design, and the pilot that tests it": [
      f(
        "study-space-to-be-journey",
        1964,
        993,
        "light",
        "Future state journey map over the same seven stages and swimlanes as the current state map, with the emotion row now running neutral, calm, confident, informed, assured, relieved and satisfied.",
        "The same seven stages after the redesign, drawn on the same swimlanes so the two maps can be read against each other. Stages three to six move from frustrated, hopeful, resigned and stressed to confident, informed, assured and relieved.",
      ),
    ],
  },

  "course-evaluation-platform-replacement": {
    "Why more reminder emails were never going to work": [
      f(
        "course-eval-current-state",
        670,
        359,
        "dark",
        "Panel summarising current state problems in three groups: quantitative failures including a 28 percent response rate and 80 percent mobile abandonment, qualitative issues including punitive perception and a feedback black hole, and a competitive gap listing peer institution response rates. An arrow runs from 28 percent and 21 days to a target of 60 percent and 7 days.",
        "The two metrics that define the project and the gap the plan has to close. The right-hand column is what turns an internal quality problem into a strategic one.",
      ),
    ],
    "The business case, and the number I do not fully trust": [
      f(
        "course-eval-strategic-alignment",
        1322,
        772,
        "dark",
        "Strategic alignment diagram linking the evaluation platform to three pillars, educational excellence, student success and operational efficiency, above a value timeline running from immediate savings through years one to two and three to five, ending at a 447 percent return on investment with a 14 month payback.",
        "How the money is argued. The timeline matters more than the headline: the immediate band is the operational saving, which is close to certain, and the later bands carry the retention assumption, which is the part I would not defend as firmly.",
      ),
      f(
        "course-eval-roi",
        1320,
        760,
        "dark",
        "Return on investment panel showing 447 percent over five years, a 14 month payback, 8.2 million dollars net present value and 108 thousand dollars annual savings, above a table rating each value source by certainty, with retention improvement marked medium, operational savings high and reputation not quantified, followed by a sensitivity check.",
        "The figure I flagged in the text, with its own certainty column attached. Operational savings are rated high, retention medium, reputation not quantified at all. The sensitivity note is the important line: at half the projected retention lift the return still clears 200 percent.",
      ),
    ],
    "Putting the people who can block it inside the room": [
      f(
        "course-eval-charter",
        1320,
        770,
        "dark",
        "Project charter summary showing the project identifier, an 18 month timeline from January 2026 to June 2027 with a Fall 2027 launch, and a 1.5 million dollar budget, above a stakeholder approval matrix listing the Provost, Faculty Senate, faculty union, CIO and Student Government with what each must approve and by what method.",
        "The approval matrix is the governance argument in one table. Faculty Senate approves the privacy policy by formal vote and the union approves workload impact by written agreement, which is what putting a blocker inside the tent actually looks like on paper.",
      ),
    ],
    "Three stakeholder tensions a power grid does not capture": [
      f(
        "course-eval-stakeholder-grid",
        1223,
        944,
        "dark",
        "Stakeholder power and interest grid with four quadrants. Manage closely holds the Provost, Faculty Senate, faculty union and department chairs. Keep satisfied holds IT, Legal, the Registrar and Finance. Keep informed holds pilot departments, faculty champions, general faculty, students and the help desk. Monitor holds the board, alumni, parents and administrative staff.",
        "The grid the analysis starts from, and the reason it is not where the analysis ends. Every genuine problem in this project is a relationship between two cells rather than a property of one, which a quadrant cannot show.",
      ),
    ],
    "Where 4,080 hours actually go": [
      f(
        "course-eval-wbs",
        1438,
        821,
        "dark",
        "Work breakdown structure for the evaluation platform replacement, decomposed into nine work packages with hour counts and percentages, totalling 4,080 hours and 1.5 million dollars over 18 months.",
        "Nine deliverable-based packages. Platform implementation and integration take 45% between them because of the twenty year old student information system, and training and change management take 15%, which is higher than most technology projects allocate and follows directly from the risk analysis.",
      ),
      f(
        "course-eval-resources",
        1320,
        742,
        "dark",
        "Resource plan table listing each role with its full time equivalent allocation, duration, cost and key responsibility, covering project manager, business analyst, technical lead, change consultant, IT development team and other resources, totalling roughly 1.36 million dollars of staffing.",
        "The same 4,080 hours priced by role. Two allocations carry the risk: the IT development team at 40% because it is shared with other university work, and the change consultant at half time because the workload genuinely peaks rather than running flat.",
      ),
    ],
    "The critical path, and buying information early": [
      f(
        "course-eval-critical-path",
        1270,
        398,
        "dark",
        "Critical path diagram showing the longest chain of dependent activities: requirements, vendor selection, platform configuration, student information system integration, data migration, user acceptance testing and pilot, spanning 18 months with month markers on each link.",
        "The chain with no float in it. Integration with the student information system sits in the middle, which is why the plan buys information early with a proof of concept in month three rather than discovering the problem at testing.",
      ),
      f(
        "course-eval-timeline",
        1530,
        621,
        "light",
        "Gantt chart of the project timeline from January 2026 to June 2027, with bars for requirements, vendor selection, platform configuration, integration, data migration, testing and quality assurance, the pilot programme, training rollout and full deployment, plus a change management stream running in parallel throughout.",
        "The same plan as a schedule. The bar worth noticing is the parallel change management stream at the bottom: it starts in month four and runs to the end, deliberately not waiting for the platform to exist.",
      ),
    ],
    "The budget split I argued against and then chose anyway": [
      f(
        "course-eval-budget",
        1320,
        850,
        "dark",
        "Budget allocation table for 1.5 million dollars: software and licensing 600 thousand at 40 percent, integration development 300 thousand at 20 percent, data migration 200 thousand at 13 percent, change management 150 thousand at 10 percent, training 100 thousand at 7 percent and a contingency reserve of 150 thousand at 10 percent, with what each line includes.",
        "The split, including the one I argued against. Change management at 10% is below the 15 to 20% that the literature recommends for change-heavy work, and the contingency line carries its own trigger conditions rather than being a general buffer.",
      ),
    ],
    "Ten risks, and the three that interact": [
      f(
        "course-eval-risk-register",
        1498,
        1315,
        "dark",
        "Risk register listing ten risks with category, probability, impact, score, mitigation, contingency and owner. The top three by score are faculty union opposition blocking approval, student adoption below 40 percent, and budget overrun above 10 percent.",
        "Ten risks traced to a specific constraint, assumption or dependency rather than pulled from a checklist. Each carries a named owner and a separate contingency, which is what makes the register something that gets acted on rather than filed.",
      ),
      f(
        "course-eval-risk-matrix",
        997,
        808,
        "dark",
        "Five by five risk probability and impact matrix plotting ten numbered risks, with union opposition, low student adoption and budget overrun positioned in the critical red zone at the top right.",
        "The same ten risks positioned by probability and impact. The three in the critical zone are all organisational, and none can be solved with technology. What a matrix cannot show is that they cascade into one another.",
      ),
    ],
    "Quality means two different things depending on who asks": [
      f(
        "course-eval-quality-gates",
        1141,
        351,
        "dark",
        "Four sequential quality assurance gates: requirements sign-off at month three, integration testing at month nine, user acceptance and pilot at month fourteen requiring a 50 percent response rate, and go-live at month eighteen requiring accessibility compliance and completed training.",
        "Four gates, each needing steering committee approval before the project moves on. The third is the one that matters: the pilot has to reach a 50% response rate to pass, which means adoption is a gate rather than a hope.",
      ),
    ],
    "Change readiness of 2.8 out of 5, and what follows from it": [
      f(
        "course-eval-readiness",
        1238,
        384,
        "dark",
        "Change readiness assessment scoring 2.8 out of 5 overall, broken into five bar-charted dimensions: leadership sponsorship 4.2, technical infrastructure 3.5, stakeholder alignment 2.5, change history 1.8 and user willingness to adopt 2.0.",
        "Moderate readiness, with the weakness concentrated where it does most damage. Sponsorship is strong at 4.2. Change history is 1.8, and that number is the failed ERP implementation still shaping how faculty read any technology project.",
      ),
    ],
    "Kotter over ADKAR, and why the adaptation matters more": [
      f(
        "course-eval-training-cascade",
        1094,
        489,
        "dark",
        "Three tier training cascade model. Tier one, a two day intensive workshop for 15 to 20 faculty champions. Tier two, a half day hands-on session for 60 to 80 department representatives. Tier three, 30 minutes of self-paced online training for all 3,200 faculty, with depth of knowledge decreasing and reach increasing across the tiers.",
        "Why the cascade rather than centralised training. A department chair demonstrating the dashboard in a faculty meeting is more credible than a consultant running a session, so the champion tier is taught the objections as well as the software.",
      ),
    ],
    "Resistance is not one problem": [
      f(
        "course-eval-resistance-segments",
        1320,
        718,
        "dark",
        "Three resistance segments side by side: 30 percent opposed faculty, 50 percent undecided faculty and 60 percent disengaged students, each with its current belief, the target belief and the method for shifting it, followed by a note naming the neutral group as the conversion priority.",
        "Resistance split into segments with different beliefs and therefore different methods. The note at the bottom is the strategy: the undecided middle is the swing group, and if it is not moved the opposing group's narrative becomes the default.",
      ),
      f(
        "course-eval-resistance-conversion",
        1238,
        818,
        "dark",
        "Conversion plan for the same three segments, each with a root cause, a list of specific actions, a target and a measure. Opposed faculty is rooted in fear of surveillance and prior ERP trauma, undecided faculty in inertia, and disengaged students in a belief that feedback does not matter.",
        "The same three segments turned into commitments with measures attached. The root cause row is the part that changes behaviour: fear of surveillance is answered by a co-authored privacy policy and a written guarantee, not by better messaging.",
      ),
    ],
    "Hybrid delivery, and where the boundary sits": [
      f(
        "course-eval-hybrid-model",
        1094,
        603,
        "dark",
        "Two layer delivery model. A waterfall governance layer with four sequential gates for requirements, integration, pilot and go-live. An agile execution layer of ten two week sprints covering platform configuration, dashboard and mobile development and pilot iteration, synchronised weekly.",
        "Where the boundary sits, which is the whole decision. Waterfall governs anything carrying a fixed external commitment: budget gates, compliance documentation, milestone approvals. Agile runs the work whose requirements only become knowable once someone uses it.",
      ),
    ],
  },

  "returns-refunds-process-redesign": {
    "Advanced BPMN, because the failures are in the exceptions": [
      f(
        "returns-as-is-bpmn",
        1584,
        2400,
        "light",
        "As-is BPMN model of the returns process across four swimlanes: Payment System, Customer Service, Warehouse and Customer. Annotations mark no fraud check at intake, silent label failure, a queue with no service level enforced, no standard grading rubric, an informal handoff losing information, and an inventory update never confirmed as a checkpoint. A dashed exception path runs from the customer's request straight to Process Refund.",
        "The dashed path is the entire problem: it runs from Submits Request directly to Process Refund, bypassing inspection. Every annotation is a measured failure rather than a hypothetical, and the timer and error events are what make the waiting countable.",
      ),
    ],
    "The future state, and its traceability": [
      f(
        "returns-to-be-bpmn",
        1727,
        2400,
        "light",
        "To-be BPMN model of the redesigned returns process across the same four swimlanes, adding fraud risk scoring at intake with low, medium and high routing, a mandatory inspection complete gate before refund approval, a real time duplicate check, and automatic approval for low risk returns.",
        "The same four lanes with the sequence enforced. The inspection-complete gate makes a premature refund structurally impossible rather than discouraged, and the auto-approve branch is only safe because that gate exists ahead of it.",
      ),
    ],
  },

  "parking-permit-service-redesign": {
    "Why three fixes failed": [
      f(
        "parking-systems-architecture",
        1312,
        733,
        "light",
        "Diagram of three disconnected systems: a 1988 mainframe, a 2005 web portal and a 2019 citation system, with broken links between them, alongside a failed two week mobile app and a chatbot returning wrong information.",
        "The technical picture the Parking Office was working from, and it is entirely accurate. A 1988 mainframe, a 2005 portal, a 2019 citation system, none of them talking. It is also not the reason students could not buy a permit.",
      ),
    ],
    "What the office saw, and what the research found": [
      f(
        "parking-reframe",
        1031,
        576,
        "light",
        "Side by side comparison. On the left, the internal office perspective: permit codes, and an unreadable scan, print and mail appeal process taking two weeks with no confirmation. On the right, student reality: where can I park, how far is it, what will it cost, resolved through an app based experience.",
        "The reframe the project turned on. The office saw a technology problem and solved it three times. Students were asking where they could park, how far it was and what it cost, and the portal answered none of those until after something had gone wrong.",
      ),
    ],
    "Seven interviews, nineteen surveys, two walkthroughs": [
      f(
        "parking-empathy-map",
        1456,
        1588,
        "light",
        "Empathy map for the composite parking permit user, divided into what students think and feel, hear, see, and say and do, with pains and gains beneath. Pains include permit names serving administrative categories rather than students, holds appearing at the worst possible moment, international students being structurally excluded and appeals being inaccessible without a printer.",
        "The four methods reduced to one composite student. The Hear quadrant is the one that reframed the appeal problem: students were being told by other students not to bother appealing, which is how an 18% success rate becomes a self-fulfilling figure.",
      ),
    ],
    "Five themes from the research": [
      f(
        "parking-personas",
        1284,
        867,
        "light",
        "Three persona cards. Maria the daily commuter, aged 21, junior, commuting 45 minutes and working part time. Wei the international student, aged 23, a first year masters student newly arrived with no US plates. Jasmine the financial aid student, aged 20, a sophomore on financial aid working 15 hours a week. Each lists background, goals, frustrations and a quote.",
        "The three segments that surfaced most consistently. Wei's card contains the structural exclusion: no US plates yet, and a required plate field with no alternative, which blocked roughly 4,000 students a year on a form validation rule.",
      ),
    ],
    "Reframing, and the question that reorganised the problem": [
      f(
        "parking-design-challenge",
        1531,
        1023,
        "light",
        "Design challenge overview titled making parking simple, fast and fair for students, with six panels: choose the right permit based on needs and budget, see lots on a map before choosing, check eligibility early to avoid last minute issues, appeal in five minutes from a phone, payment and access support with flexible options, and reduce support load through faster self-service.",
        "The problem restated as six outcomes rather than six features. Framing the last panel as reducing support load is what let the redesign be argued in the Parking Office's own terms as well as the students'.",
      ),
    ],
    "Thirty-eight ideas from three techniques": [
      f(
        "parking-hmw-tree",
        1447,
        1257,
        "light",
        "How Might We question tree with the core problem at the top and five columns beneath, one per question, covering permit selection, lot locations, surfacing holds early, the appeal process and equity for diverse student populations, each column listing its generated ideas and an idea count.",
        "Thirty-eight ideas organised by the question that produced them, with counts per column. Laying it out this way is how you check that ideation covered the problem rather than circling the most interesting part of it.",
      ),
    ],
    "Five concepts, scored against criteria set in advance": [
      f(
        "parking-storyboard",
        1433,
        782,
        "light",
        "Eight step solution storyboard for the selected concept: login with an account scan for holds, readiness check with resolution links, wizard questions, permit recommendation in plain language, lot preview with map and walk time, payment with no surprise holds, confirmation, and appeal with an online form and status tracker.",
        "The selected concept as an eight step sequence. Steps one and two are the hold dashboard that scored equally with the wizard and was folded into it as step zero rather than shipped separately.",
      ),
    ],
    "Three rounds at rising fidelity, and the $110 that saved $12,000": [
      f(
        "parking-prototype",
        614,
        1243,
        "light",
        "Four mobile screens from the high fidelity prototype: a question asking who the student is parking as, a permit recommendation list written in plain language, a lot selection screen with a map, and a payment confirmation.",
        "The permit flow from the high-fidelity round. Look at the permit names: plain language, not the eight internal codes. That rename was a spreadsheet edit with no code behind it, and it drove the largest single improvement in the project.",
      ),
      f(
        "parking-appeal-prototype",
        623,
        1278,
        "light",
        "Four mobile screens from the citation appeal prototype: selecting a citation to appeal, choosing a reason from a pre-listed set, adding photographic evidence directly in the browser, and reviewing and submitting with an expected decision date.",
        "The appeal flow that replaced print, scan and email. The evidence step is the unplanned win: structured submissions with photographs produced clearer cases, and the appeal success rate rose from 18% to 31% without any change to the decision criteria.",
      ),
    ],
    "What the pilot produced": [
      f(
        "parking-current-vs-future",
        1255,
        1507,
        "light",
        "Five stage comparison of current against future state covering permit selection, lot selection, hold discovery, support contact and citation appeal, with current pain points and future outcomes listed against each stage, ending in target metrics.",
        "Stage by stage, before against after, with the figures attached to each. The right-hand column is the measured pilot result rather than a projection, which is why the conversation with the Parking Director changed.",
      ),
    ],
  },

  "invoice-automation-governance": {
    "Three structural problems, and one that matters more": [
      f(
        "invoice-current-state",
        1368,
        659,
        "dark",
        "Current state panel for accounts payable invoice processing in three groups: performance failures including a five day cycle time, a three percent error rate and twelve dollars per invoice across eight full time staff; structural problems including three intake channels, 47 routing rules and no standardised format; and institutional context including the prior automation failure and audit traceability requirements. An arrow runs from five days, three percent error and eight staff to two days, half a percent error and 80 percent straight-through processing.",
        "The baseline and the target in one panel. The third column is the one that governs the plan: prior automation failed, staff fear job loss, and an ERP upgrade lands in 18 months.",
      ),
      f(
        "invoice-strategic-alignment",
        1412,
        601,
        "dark",
        "Strategic alignment diagram for the automation pilot linking to three priorities, operational efficiency with three to four staff redeployed, compliance and control with a consistent audit trail, and ERP readiness with data for the upgrade scope, above an investment line of 250 thousand dollars with a twelve month return target.",
        "Three reasons to fund it, and the third is the one that survives the obvious objection. Even if the ERP upgrade ships native automation on schedule, the pilot produces the process documentation and exception design that the upgrade would otherwise have to discover.",
      ),
    ],
    "The scope boundary was the most important decision": [
      f(
        "invoice-charter",
        1498,
        272,
        "dark",
        "Project charter card with three panels: the project identifier for accounts payable invoice approval automation, a timeline of twelve weeks to proof of concept and twenty weeks to pilot with a twelve month return target, and a budget and scope line of 250 thousand dollars covering a two department pilot of three-way match invoices under five thousand dollars.",
        "The charter in three boxes, and the third box is the scope boundary. Two departments, three-way match, under five thousand dollars: the segment where automation is reliable enough to succeed while still covering 70% of volume.",
      ),
    ],
    "The prior failure, reconstructed and mapped": [
      f(
        "invoice-prior-failure",
        1060,
        1011,
        "dark",
        "Five whys chain for the failed expense report automation. Automation created more work, because exceptions piled up in a manual queue with no staff, because no exception handling rules were designed into the bot, because the vendor configured it from written policies rather than actual workflows, because accounts payable staff were not involved in the design process. Root cause: governance failure, not technology failure.",
        "The most important input to this plan. Five levels down, the answer is that nobody who understood the work was in the room when the bot was configured. That single conclusion sets the scope boundary, the accountability assignments and both gates.",
      ),
    ],
    "Governance the organisation can actually sustain": [
      f(
        "invoice-maturity",
        1498,
        616,
        "dark",
        "Project management maturity assessment scoring 2.2 out of 5, level two of five, with five bar-charted dimensions. Risk management scores lowest at 1.5 and change management at 1.8.",
        "2.2 out of 5 is what the governance had to be designed for, not what it ought to be. Risk management at 1.5 is the alarming one for an automation project, because a bot applies a flawed rule 7,000 times a month rather than 300.",
      ),
    ],
    "Fewer stakeholders, higher intensity": [
      f(
        "invoice-stakeholder-grid",
        1235,
        917,
        "dark",
        "Stakeholder power and interest grid with four quadrants. Manage closely holds the CFO as sponsor, internal audit, the accounts payable manager and pilot department heads. Keep satisfied holds the IT director and the ERP upgrade team. Keep informed holds the accounts payable team of eight, the automation vendor and suppliers. Monitor holds legal, procurement and non-pilot departments. A note records that the accounts payable team sits in keep informed by formal power but is treated as manage closely because of its influence on adoption.",
        "The note under the grid is the useful part. The accounts payable team holds almost no formal authority and complete practical veto over whether the thing gets used, and formal authority is not the same as influence.",
      ),
      f(
        "invoice-stakeholder-actions",
        1498,
        1264,
        "dark",
        "Four stakeholder panels, each pairing a current belief with a target belief and a list of actions. The accounts payable team's fear of replacement is answered with a role in exception mapping, defined redeployment and an upskilling plan. Internal audit's concern about new fraud vectors is answered with incremental review and co-designed detection rules. The sponsor's need for visible return is answered with a dashboard and a public redeployment commitment. The ERP team's watching posture is answered with shared pilot data and joint planning. A note records that 70 percent of stakeholder effort falls in the first eight weeks.",
        "Each group's actual belief, the belief the project needs, and what would move it. The note at the bottom is the sequencing decision: most of this work happens before week eight, because building support after the bot is configured is the same mistake as testing after development.",
      ),
    ],
    "Decision rights, and three assignments worth defending": [
      f(
        "invoice-governance-tiers",
        1236,
        790,
        "dark",
        "Three tier governance structure. Tier one sponsor, the CFO, fortnightly fifteen minute reviews covering go and no-go decisions. Tier two governance, the project manager with an audit liaison and the accounts payable manager, weekly for thirty minutes, where most decisions are made. Tier three execution, the technical lead with the vendor and subject matter experts, daily fifteen minute standups.",
        "Three tiers with deliberately small footprints, because a level two organisation running on half a full-time equivalent cannot sustain more. The audit liaison sitting in tier two rather than reviewing at the end is what resolves the speed against control tension.",
      ),
      f(
        "invoice-raci",
        1498,
        654,
        "dark",
        "RACI matrix across project decision areas and seven roles, marking who is responsible, accountable, consulted and informed for each, with exactly one accountable role per row.",
        "Exactly one A per row, which means exactly one person can be asked why something happened. The three worth defending: the accounts payable manager is accountable for exception design, internal audit is consulted rather than informed, and the CFO is informed on architecture rather than consulted.",
      ),
      f(
        "invoice-raci-detail",
        1564,
        979,
        "light",
        "Expanded RACI matrix broken down by project phase, from initiation and discovery through build and proof of concept, pilot and transition, assigning responsible, accountable, consulted and informed roles to each task within every phase.",
        "The same assignments at task level, phase by phase. Reading down a single column shows how one role's involvement rises and falls, which is what makes the half-time and 20% allocations in the resource plan defensible rather than optimistic.",
      ),
    ],
    "Escalation thresholds set deliberately low": [
      f(
        "invoice-escalation",
        1498,
        710,
        "dark",
        "Three escalation tiers with quantified triggers. Tier one execution resolves technical configuration and vendor questions same day. Tier two governance takes schedule slips beyond one week, cost variance above five percent, audit flags unresolved beyond five days or rising staff resistance, resolving within 48 hours. Tier three sponsor takes schedule slips beyond two weeks, cost variance above ten percent or scope change above five thousand dollars. A note explains that low thresholds compensate for weak monitoring maturity.",
        "Triggers as numbers rather than judgement calls. The note is the reasoning: a level two organisation cannot detect slow-developing problems, so by the time a two week slip is visible it may already be four, and low thresholds buy false alarms instead.",
      ),
    ],
    "Two gates, and why 70% becomes 80%": [
      f(
        "invoice-wbs",
        1529,
        903,
        "light",
        "Work breakdown structure for the automation pilot decomposed into five phases, initiation, discovery, build and proof of concept, pilot and transition, containing twenty work packages, with key critical path dependencies listed beneath.",
        "Five phases, twenty packages. The dependency list at the bottom is what the two gates enforce: rule extraction has to finish before bot development starts, and both testing and audit trail configuration have to close before the first department goes live.",
      ),
      f(
        "invoice-schedule",
        1441,
        1287,
        "light",
        "Gantt chart of the twenty week project schedule with the critical path highlighted, showing initiation, discovery, build and proof of concept, pilot and transition phases, with the week twelve proof of concept gate and week twenty pilot gate marked as milestones.",
        "Twenty weeks with the critical path picked out. Discovery and build overlap from week six, which saves about two weeks against running them in sequence, and the two department go-lives are staggered by three weeks so real exceptions surface before scope expands.",
      ),
      f(
        "invoice-timeline",
        1767,
        1240,
        "light",
        "Project timeline showing the two phases against week numbers, with six two week sprints marked across bot development and configuration, and the week twelve and week twenty gates drawn as vertical decision points.",
        "The same twenty weeks showing where the sprints sit. This is the hybrid model in one picture: sprints inside the phases, hard gates between them, and the gate dates fixed regardless of sprint velocity.",
      ),
      f(
        "invoice-budget",
        1564,
        914,
        "light",
        "Budget allocation for 250 thousand dollars shown as a donut chart with a line item breakdown: software and licensing 105 thousand at 42 percent, integration and development 80 thousand at 32 percent, training and change management 25 thousand at 10 percent, and project management with contingency 40 thousand at 16 percent including 15 thousand earmarked for ERP reconfiguration.",
        "Integration takes 32% because underfunding integration is what broke the last attempt. The contingency line carries 15 thousand ring-fenced for reconfiguring the bots after the ERP upgrade, which is a cost the project knows is coming.",
      ),
    ],
    "Change management, and the promise that had to be in writing": [
      f(
        "invoice-comms-plan",
        1560,
        1297,
        "light",
        "Communication plan table grouped into weekly execution, governance decision making, compliance audit trail, milestone one-time events and escalation, listing audience, frequency, channel, owner and content for each, with an escalation trigger panel requiring CFO notification within 24 hours for critical path slips, budget variance above ten percent, scope changes and audit findings.",
        "Who hears what, how often, from whom. The weekly accounts payable update is the one that matters most: its standing content is the redeployment commitment, repeated every week by the manager rather than announced once by the sponsor.",
      ),
    ],
    "Quality, and rejecting risk-based testing": [
      f(
        "invoice-kpis",
        1164,
        790,
        "light",
        "Key performance indicator table listing invoice cycle time, straight-through processing rate, error rate, audit compliance score, return on investment, staff adoption rate and exception rate, each with a baseline, a target, a measurement method and a reporting frequency.",
        "Seven indicators, each with a stated measurement method rather than just a target. Staff adoption sits in the same table as cycle time and error rate, which is what makes it a gate criterion instead of a sentiment.",
      ),
    ],
    "The handoff that broke last time": [
      f(
        "invoice-handoff",
        1767,
        1122,
        "light",
        "Operational handoff sequence across four steps from runbooks delivered in week eighteen through shadowing in weeks nineteen and twenty, a four week hypercare period, and formal close with a signed acceptance document. Below it, three steady-state support tiers covering daily operations, bot maintenance and major enhancements with response times, plus ERP upgrade support and three risk mitigation measures.",
        "The transition designed rather than assumed, because this is exactly where the last automation broke. Operations shadows the project team before owning it, hypercare runs four weeks past handoff, and nothing closes until an acceptance document is signed.",
      ),
    ],
  },
};

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
    for (const item of section.list ?? [])
      n += words(item.term) + words(item.detail);
    for (const stat of section.stats ?? [])
      n += words(stat.value) + words(stat.label);
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
  const byHeading = FIGURES[post.slug] ?? {};

  // A heading in FIGURES that matches nothing means a figure has been orphaned,
  // usually by an edit to the heading it was keyed on. Fail the build rather
  // than drop the diagram from the page without saying so.
  const headings = new Set(post.sections.map((s) => s.heading));
  for (const key of Object.keys(byHeading)) {
    if (!headings.has(key)) {
      throw new Error(
        `blog.ts: figure key "${key}" does not match any section heading in "${post.slug}"`,
      );
    }
  }

  return {
    ...post,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    sections: post.sections.map((section) =>
      byHeading[section.heading]
        ? { ...section, figures: byHeading[section.heading] }
        : section,
    ),
  };
}

export const posts: BlogPost[] = source.map(withDerived);

/** Newest first, so the index does not depend on array order being maintained. */
export const postsByDate = [...posts].sort((a, b) =>
  b.isoDate.localeCompare(a.isoDate),
);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
