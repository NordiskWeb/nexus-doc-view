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
