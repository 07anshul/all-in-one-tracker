export interface LayoutNode {
  id: string;
}

export interface LayoutEdge {
  from: string;
  to: string;
  weak?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export function computeLayout(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  width: number,
  height: number
): Map<string, Point> {
  const n = nodes.length;
  const idIndex = new Map(nodes.map((node, i) => [node.id, i]));
  const pos: Point[] = nodes.map((_, i) => {
    const angle = (i / Math.max(n, 1)) * Math.PI * 2;
    const r = Math.min(width, height) * 0.3;
    return { x: width / 2 + r * Math.cos(angle), y: height / 2 + r * Math.sin(angle) };
  });
  const vel: Point[] = nodes.map(() => ({ x: 0, y: 0 }));

  const REPULSION = 9000;
  const SPRING_STRONG = 0.03;
  const SPRING_WEAK = 0.01;
  const IDEAL_STRONG = 130;
  const IDEAL_WEAK = 190;
  const CENTER = 0.008;
  const DAMPING = 0.8;
  const MARGIN = 44;

  for (let iter = 0; iter < 400; iter++) {
    const force: Point[] = nodes.map(() => ({ x: 0, y: 0 }));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const distSq = Math.max(dx * dx + dy * dy, 1);
        const dist = Math.sqrt(distSq);
        const f = REPULSION / distSq;
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        force[i].x += fx;
        force[i].y += fy;
        force[j].x -= fx;
        force[j].y -= fy;
      }
    }

    for (const edge of edges) {
      const i = idIndex.get(edge.from);
      const j = idIndex.get(edge.to);
      if (i === undefined || j === undefined || i === j) continue;
      const dx = pos[j].x - pos[i].x;
      const dy = pos[j].y - pos[i].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const ideal = edge.weak ? IDEAL_WEAK : IDEAL_STRONG;
      const strength = edge.weak ? SPRING_WEAK : SPRING_STRONG;
      const diff = dist - ideal;
      const fx = (dx / dist) * diff * strength;
      const fy = (dy / dist) * diff * strength;
      force[i].x += fx;
      force[i].y += fy;
      force[j].x -= fx;
      force[j].y -= fy;
    }

    for (let i = 0; i < n; i++) {
      force[i].x += (width / 2 - pos[i].x) * CENTER;
      force[i].y += (height / 2 - pos[i].y) * CENTER;
      vel[i].x = (vel[i].x + force[i].x * 0.01) * DAMPING;
      vel[i].y = (vel[i].y + force[i].y * 0.01) * DAMPING;
      pos[i].x += vel[i].x;
      pos[i].y += vel[i].y;
      pos[i].x = Math.max(MARGIN, Math.min(width - MARGIN, pos[i].x));
      pos[i].y = Math.max(MARGIN, Math.min(height - MARGIN, pos[i].y));
    }
  }

  const result = new Map<string, Point>();
  nodes.forEach((node, i) => result.set(node.id, pos[i]));
  return result;
}
