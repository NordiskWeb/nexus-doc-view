export type RelationNodeType = "server" | "system" | "databas" | "tjanst" | "integration";

export interface RelationNode {
  id: string;
  label: string;
  type: RelationNodeType;
  kommun?: string;
  docId?: string;
  description?: string;
}

export interface RelationEdge {
  from: string;
  to: string;
  /** Beskriver hur noderna hänger ihop, t.ex. "kör", "replikerar till" */
  label: string;
}

export const relationNodes: RelationNode[] = [
  {
    id: "app02",
    label: "APP02",
    type: "server",
    kommun: "Uppsala",
    docId: "srv-app-prod-01",
    description: "Applikationsserver för verksamhetssystem.",
  },
  {
    id: "srv-app-prod-01",
    label: "SRV-APP-PROD-01",
    type: "server",
    kommun: "Uppsala",
    docId: "srv-app-prod-01",
    description: "Produktionsserver för verksamhetssystem.",
  },
  {
    id: "srv-db-prod-02",
    label: "SRV-DB-PROD-02",
    type: "databas",
    kommun: "Västerås",
    docId: "srv-db-prod-02",
    description: "MS SQL AlwaysOn-databaskluster.",
  },
  {
    id: "srv-web-prod-04",
    label: "SRV-WEB-PROD-04",
    type: "server",
    kommun: "Örebro",
    docId: "srv-web-prod-04",
    description: "Webbserver bakom load balancer.",
  },
  {
    id: "srv-backup-01",
    label: "SRV-BACKUP-01",
    type: "server",
    kommun: "Uppsala",
    docId: "srv-backup-01",
    description: "Veeam backupsystem.",
  },
  {
    id: "srv-mon-01",
    label: "SRV-MON-01",
    type: "server",
    kommun: "Västerås",
    docId: "srv-mon-01",
    description: "Grafana och Prometheus.",
  },
  {
    id: "verksamhetssystem",
    label: "Verksamhetssystem",
    type: "system",
    description: "Kommunens centrala verksamhetssystem.",
  },
  {
    id: "kommunportalen",
    label: "Kommunportalen",
    type: "system",
    description: "Publik portal för invånartjänster.",
  },
  {
    id: "ad",
    label: "Active Directory",
    type: "tjanst",
    docId: "password-reset",
    description: "Katalogtjänst för konton och behörigheter.",
  },
  {
    id: "vpn-gw",
    label: "VPN-Gateway",
    type: "tjanst",
    docId: "vpn-access-guide",
    description: "Fjärråtkomst för konsulter och personal.",
  },
  {
    id: "int-ekonomi",
    label: "Integration: Ekonomi",
    type: "integration",
    description: "Filöverföring till ekonomisystemet nattetid.",
  },
  {
    id: "int-earkiv",
    label: "Integration: e-Arkiv",
    type: "integration",
    description: "Export av ärenden till e-arkivet.",
  },
];

export const relationEdges: RelationEdge[] = [
  { from: "app02", to: "srv-app-prod-01", label: "ingår i kluster med" },
  { from: "app02", to: "srv-db-prod-02", label: "läser/skriver mot" },
  { from: "app02", to: "verksamhetssystem", label: "kör" },
  { from: "app02", to: "srv-backup-01", label: "säkerhetskopieras av" },
  { from: "app02", to: "srv-mon-01", label: "övervakas av" },
  { from: "app02", to: "ad", label: "autentiserar mot" },
  { from: "app02", to: "int-ekonomi", label: "exponerar" },
  { from: "srv-app-prod-01", to: "srv-db-prod-02", label: "läser/skriver mot" },
  { from: "srv-app-prod-01", to: "verksamhetssystem", label: "kör" },
  { from: "srv-app-prod-01", to: "srv-mon-01", label: "övervakas av" },
  { from: "srv-app-prod-01", to: "srv-backup-01", label: "säkerhetskopieras av" },
  { from: "srv-web-prod-04", to: "kommunportalen", label: "kör" },
  { from: "srv-web-prod-04", to: "srv-db-prod-02", label: "läser mot" },
  { from: "srv-web-prod-04", to: "srv-mon-01", label: "övervakas av" },
  { from: "srv-web-prod-04", to: "vpn-gw", label: "nås via" },
  { from: "srv-db-prod-02", to: "srv-backup-01", label: "säkerhetskopieras av" },
  { from: "srv-db-prod-02", to: "int-earkiv", label: "levererar data till" },
  { from: "srv-db-prod-02", to: "srv-mon-01", label: "övervakas av" },
  { from: "verksamhetssystem", to: "int-ekonomi", label: "integreras med" },
  { from: "verksamhetssystem", to: "int-earkiv", label: "integreras med" },
  { from: "ad", to: "vpn-gw", label: "autentiserar" },
  { from: "srv-backup-01", to: "srv-mon-01", label: "övervakas av" },
];

export const nodeTypeLabel: Record<RelationNodeType, string> = {
  server: "Server",
  system: "System",
  databas: "Databas",
  tjanst: "Tjänst",
  integration: "Integration",
};

export const getNode = (id: string) => relationNodes.find((n) => n.id === id);

export interface RelationLink {
  node: RelationNode;
  label: string;
}

export function getRelations(id: string): RelationLink[] {
  const links: RelationLink[] = [];
  for (const edge of relationEdges) {
    if (edge.from === id) {
      const node = getNode(edge.to);
      if (node) links.push({ node, label: edge.label });
    } else if (edge.to === id) {
      const node = getNode(edge.from);
      if (node) links.push({ node, label: `${edge.label} (omvänd)` });
    }
  }
  return links;
}

/* ---------- Analysfunktioner ---------- */

export const adjacency: Record<string, { id: string; label: string }[]> = (() => {
  const map: Record<string, { id: string; label: string }[]> = {};
  for (const n of relationNodes) map[n.id] = [];
  for (const e of relationEdges) {
    map[e.from]?.push({ id: e.to, label: e.label });
    map[e.to]?.push({ id: e.from, label: `${e.label} (omvänd)` });
  }
  return map;
})();

export const nodeDegree = (id: string) => adjacency[id]?.length ?? 0;

export function typeCounts(): Record<RelationNodeType, number> {
  const counts = {
    server: 0,
    system: 0,
    databas: 0,
    tjanst: 0,
    integration: 0,
  } as Record<RelationNodeType, number>;
  for (const n of relationNodes) counts[n.type] += 1;
  return counts;
}

/** Alla noder inom `depth` steg från startnoden, med avstånd. */
export function getNeighborhood(id: string, depth = 2): { node: RelationNode; distance: number }[] {
  const seen = new Map<string, number>([[id, 0]]);
  let frontier = [id];
  for (let d = 1; d <= depth; d++) {
    const next: string[] = [];
    for (const cur of frontier) {
      for (const nb of adjacency[cur] ?? []) {
        if (!seen.has(nb.id)) {
          seen.set(nb.id, d);
          next.push(nb.id);
        }
      }
    }
    frontier = next;
  }
  const out: { node: RelationNode; distance: number }[] = [];
  for (const [nid, distance] of seen) {
    if (nid === id) continue;
    const node = getNode(nid);
    if (node) out.push({ node, distance });
  }
  return out.sort((a, b) => a.distance - b.distance || a.node.label.localeCompare(b.node.label));
}

/** Kortaste kedjan mellan två noder (BFS), inkl. relationsetiketter. */
export function findPath(from: string, to: string): { node: RelationNode; label?: string }[] | null {
  if (from === to) {
    const n = getNode(from);
    return n ? [{ node: n }] : null;
  }
  const prev = new Map<string, { id: string; label: string }>();
  const visited = new Set([from]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nb of adjacency[cur] ?? []) {
      if (visited.has(nb.id)) continue;
      visited.add(nb.id);
      prev.set(nb.id, { id: cur, label: nb.label });
      if (nb.id === to) {
        const chain: { node: RelationNode; label?: string }[] = [];
        let step: string | undefined = to;
        let lbl: string | undefined;
        while (step) {
          const node = getNode(step);
          if (node) chain.unshift({ node, label: lbl });
          const p = prev.get(step);
          lbl = p?.label;
          step = p?.id;
        }
        return chain;
      }
      queue.push(nb.id);
    }
  }
  return null;
}

/** Noder sorterade efter antal kopplingar. */
export function mostConnected(limit = 5) {
  return [...relationNodes]
    .map((node) => ({ node, degree: nodeDegree(node.id) }))
    .sort((a, b) => b.degree - a.degree)
    .slice(0, limit);
}

/** Noder utan några kopplingar alls. */
export const orphanNodes = () => relationNodes.filter((n) => nodeDegree(n.id) === 0);

export const kommunList = () =>
  Array.from(new Set(relationNodes.map((n) => n.kommun).filter(Boolean))) as string[];
