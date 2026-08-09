"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ProjectDiagram } from "@/content/project-details";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Architecture diagrams for the project pages, drawn from a node and edge spec
 * so all ten share one renderer and one visual language.
 *
 * Pure SVG on a deterministic grid rather than HTML boxes with measured
 * connectors. Measuring would mean refs, a resize observer, and a paint before
 * the edges know where to go; a fixed grid means the geometry is known at render
 * time on the server as well as the client. The cost is that labels cannot
 * reflow, which is why the spec carries explicit line breaks.
 *
 * Data flows left to right across lanes. Each lane is a column, and nodes are
 * centred vertically within their own column so short columns sit against the
 * middle of tall ones.
 */
const NODE_W = 138;
const NODE_H = 54;
const COL_GAP = 58;
const ROW_GAP = 18;
const PAD = 10;
/** Room above the grid for the lane headings. */
const LANE_H = 30;
/** Sample count per edge for the travelling packet. */
const PACKET_STEPS = 14;
const PACKET_SECONDS = 2.2;

type Point = { x: number; y: number };

/** Fill and stroke per node kind, so the diagram reads without a legend. */
const KIND: Record<
  NonNullable<ProjectDiagram["nodes"][number]["kind"]>,
  { fill: string; stroke: string; strokeOpacity: number; text: string }
> = {
  source: {
    fill: "var(--surface)",
    stroke: "var(--border)",
    strokeOpacity: 1,
    text: "fill-muted",
  },
  process: {
    fill: "var(--surface-raised)",
    stroke: "var(--accent)",
    strokeOpacity: 0.4,
    text: "fill-foreground",
  },
  store: {
    fill: "var(--surface-raised)",
    stroke: "var(--border)",
    strokeOpacity: 1,
    text: "fill-foreground",
  },
  model: {
    fill: "var(--surface-raised)",
    stroke: "var(--accent)",
    strokeOpacity: 0.65,
    text: "fill-accent",
  },
  serve: {
    fill: "var(--surface)",
    stroke: "var(--accent)",
    strokeOpacity: 0.3,
    text: "fill-foreground",
  },
};

/** Cubic bezier sampled at t, used to fly a packet along the drawn curve. */
function bezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

export function ArchitectureDiagram({ diagram }: { diagram: ProjectDiagram }) {
  const reduceMotion = useReducedMotion();
  const id = useId();

  const { lanes, nodes, edges, caption } = diagram;

  // Nodes per column, so each column can be centred against the tallest.
  const perCol = lanes.map(
    (_, col) => nodes.filter((n) => n.col === col).length,
  );
  const maxRows = Math.max(...perCol, 1);
  const contentH = maxRows * NODE_H + (maxRows - 1) * ROW_GAP;

  const viewW = lanes.length * NODE_W + (lanes.length - 1) * COL_GAP + PAD * 2;
  const viewH = LANE_H + contentH + PAD * 2;

  const placed = nodes.map((node) => {
    const count = perCol[node.col];
    const colH = count * NODE_H + (count - 1) * ROW_GAP;
    const startY = LANE_H + PAD + (contentH - colH) / 2;
    return {
      ...node,
      x: PAD + node.col * (NODE_W + COL_GAP),
      y: startY + node.row * (NODE_H + ROW_GAP),
    };
  });

  const byId = new Map(placed.map((n) => [n.id, n]));

  const routed = edges.flatMap((edge, i) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return [];

    // Two routings, because two relationships. Across lanes, leave the right
    // face and arrive at the left face, pulling the control points horizontally
    // so row crossings read as curves rather than diagonals.
    //
    // Within a lane the horizontal routing would have to exit right and double
    // back to a left face sitting behind it, drawing a loop. Those edges are
    // legitimate (a sequential crew is four nodes in one lane), so they connect
    // vertically instead, bottom face to top face.
    const sameLane = from.col === to.col;
    let start: Point;
    let end: Point;
    let c1: Point;
    let c2: Point;

    if (sameLane) {
      const down = to.row > from.row;
      start = { x: from.x + NODE_W / 2, y: down ? from.y + NODE_H : from.y };
      end = { x: to.x + NODE_W / 2, y: down ? to.y : to.y + NODE_H };
      const pull = Math.max(8, Math.abs(end.y - start.y) * 0.4);
      c1 = { x: start.x, y: start.y + (down ? pull : -pull) };
      c2 = { x: end.x, y: end.y - (down ? pull : -pull) };
    } else {
      start = { x: from.x + NODE_W, y: from.y + NODE_H / 2 };
      end = { x: to.x, y: to.y + NODE_H / 2 };
      const pull = Math.max(22, (end.x - start.x) * 0.45);
      c1 = { x: start.x + pull, y: start.y };
      c2 = { x: end.x - pull, y: end.y };
    }

    const samples = Array.from({ length: PACKET_STEPS + 1 }, (_, k) =>
      bezier(start, c1, c2, end, k / PACKET_STEPS),
    );

    return [
      {
        key: `${edge.from}-${edge.to}-${i}`,
        d: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`,
        cx: samples.map((s) => Number(s.x.toFixed(2))),
        cy: samples.map((s) => Number(s.y.toFixed(2))),
        index: i,
      },
    ];
  });

  return (
    <figure className="mt-8">
      {/* Phones read the same graph stacked.
          The drawn diagram cannot survive a 375px screen in either direction:
          panning hides 345px of it with no affordance, and scaling to fit puts
          the labels near 4px. Below md it becomes a vertical list instead, one
          group per lane, which keeps the left-to-right flow as a top-to-bottom
          one and every label at full size. What it gives up is the individual
          edges, which are the part that cannot be read at that width anyway. */}
      <ol className="md:hidden">
        {lanes.map((lane, col) => {
          const inLane = nodes.filter((node) => node.col === col);
          const isLast = col === lanes.length - 1;

          return (
            <li key={lane} className="relative pb-5 pl-7 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-[3.5px] top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-accent"
              />
              {/* Padding sits inside the item, so a rail pinned to its bottom
                  reaches the next lane's dot without hardcoding the gap. */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[3.5px] top-4 w-px -translate-x-1/2 bg-subtle/30"
                />
              )}

              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                {lane}
              </p>

              <ul className="mt-2.5 flex flex-wrap gap-2">
                {inLane.map((node) => (
                  <li
                    key={node.id}
                    className="rounded-lg border border-border bg-surface px-3 py-2"
                  >
                    <span className="block text-[13px] leading-snug">
                      {node.label.replace(/\n/g, " ")}
                    </span>
                    {node.note && (
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">
                        {node.note}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      {/* Panned rather than shrunk from md up, where there is enough width for
          the labels to survive the scale. */}
      <div className="hidden md:block md:overflow-x-auto">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          role="img"
          aria-label={caption}
          className="h-auto w-full min-w-[42rem]"
        >
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 4 L 0 7" fill="none" stroke="var(--subtle)" />
            </marker>
          </defs>

          {lanes.map((lane, col) => (
            <motion.text
              key={lane}
              x={PAD + col * (NODE_W + COL_GAP)}
              y={16}
              fontSize={9}
              letterSpacing={1.4}
              className="fill-subtle font-mono"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={{ duration: 0.5, delay: col * 0.06 }}
            >
              {lane.toUpperCase()}
            </motion.text>
          ))}

          {routed.map((edge) => (
            <g key={edge.key}>
              <motion.path
                d={edge.d}
                fill="none"
                stroke="var(--subtle)"
                strokeOpacity={0.5}
                markerEnd={`url(#${id}-arrow)`}
                initial={
                  reduceMotion ? undefined : { pathLength: 0, opacity: 0 }
                }
                whileInView={
                  reduceMotion ? undefined : { pathLength: 1, opacity: 1 }
                }
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + edge.index * 0.07,
                  ease: EASE,
                }}
              />
              {!reduceMotion && (
                <motion.circle
                  r={2.4}
                  fill="var(--accent)"
                  initial={{ cx: edge.cx[0], cy: edge.cy[0], opacity: 0 }}
                  whileInView={{
                    cx: edge.cx,
                    cy: edge.cy,
                    opacity: [0, 1, 1, 0],
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: PACKET_SECONDS,
                    delay: 1 + edge.index * 0.18,
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: "easeInOut",
                  }}
                />
              )}
            </g>
          ))}

          {placed.map((node, i) => {
            const style = KIND[node.kind ?? "process"];
            const lines = node.label.split("\n");
            return (
              <motion.g
                key={node.id}
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                whileInView={
                  reduceMotion ? undefined : { opacity: 1, scale: 1 }
                }
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={9}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeOpacity={style.strokeOpacity}
                />
                {lines.map((line, k) => (
                  <text
                    key={line}
                    x={node.x + NODE_W / 2}
                    y={
                      node.y +
                      NODE_H / 2 +
                      (k - (lines.length - 1) / 2) * 13 +
                      (node.note ? -5 : 0)
                    }
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    className={`${style.text} font-sans`}
                  >
                    {line}
                  </text>
                ))}
                {node.note && (
                  <text
                    x={node.x + NODE_W / 2}
                    y={node.y + NODE_H - 13}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={8.5}
                    letterSpacing={0.5}
                    className="fill-subtle font-mono"
                  >
                    {node.note.toUpperCase()}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-4 text-[13px] leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
