export type DocType = "support" | "drift";

export interface Doc {
  id: string;
  title: string;
  type: DocType;
  excerpt: string;
  updatedAt: string;
  author: string;
  category: string;
  access?: string;
  serverIp?: string;
  serverName?: string;
  kommun?: string;
  driftforvaltare?: string;
  osVersion?: string;
  tags: string[];
}

export const mockDocs: Doc[] = [
  {
    id: "vpn-access-guide",
    title: "VPN-åtkomst för externa konsulter",
    type: "support",
    excerpt: "Steg-för-steg-guide för att konfigurera VPN-klient och få åtkomst till interna system.",
    updatedAt: "2026-05-28",
    author: "Anna Lindberg",
    category: "Åtkomst",
    tags: ["vpn", "säkerhet", "åtkomst"],
  },
  {
    id: "onboarding-new-user",
    title: "Onboarding av nya användare",
    type: "support",
    excerpt: "Komplett checklista för att lägga upp och utbilda nya användare i systemen.",
    updatedAt: "2026-05-24",
    author: "Marcus Ek",
    category: "Onboarding",
    tags: ["användare", "onboarding"],
  },
  {
    id: "password-reset",
    title: "Återställa lösenord i Active Directory",
    type: "support",
    excerpt: "Hur supporten återställer lösenord och hanterar låsta konton.",
    updatedAt: "2026-05-20",
    author: "Sara Holm",
    category: "Konton",
    tags: ["lösenord", "ad"],
  },
  {
    id: "printer-troubleshoot",
    title: "Felsökning av nätverksskrivare",
    type: "support",
    excerpt: "Vanliga problem och lösningar för nätverksskrivare i kommunens kontorsmiljöer.",
    updatedAt: "2026-05-16",
    author: "Johan Berg",
    category: "Hårdvara",
    tags: ["skrivare", "nätverk"],
  },
  {
    id: "srv-app-prod-01",
    title: "SRV-APP-PROD-01",
    type: "drift",
    excerpt: "Produktionsserver för verksamhetssystem i Uppsala kommun. Kör nyckelapplikationer dygnet runt.",
    updatedAt: "2026-05-30",
    author: "Daniel Sjögren",
    category: "Applikationsserver",
    access: "RDP via bastion",
    serverIp: "10.42.18.21",
    serverName: "SRV-APP-PROD-01",
    kommun: "Uppsala",
    driftforvaltare: "Daniel Sjögren",
    osVersion: "Windows Server 2022",
    tags: ["produktion", "kritisk", "app-server"],
  },
  {
    id: "srv-db-prod-02",
    title: "SRV-DB-PROD-02",
    type: "drift",
    excerpt: "Primär databasserver med MS SQL för verksamhetssystem. Hög tillgänglighet via AlwaysOn.",
    updatedAt: "2026-05-29",
    author: "Linda Almgren",
    category: "Databasserver",
    access: "SSH via jump host",
    serverIp: "10.42.18.34",
    serverName: "SRV-DB-PROD-02",
    kommun: "Västerås",
    driftforvaltare: "Linda Almgren",
    osVersion: "Windows Server 2022",
    tags: ["databas", "produktion", "alwayson"],
  },
  {
    id: "srv-web-prod-04",
    title: "SRV-WEB-PROD-04",
    type: "drift",
    excerpt: "Webbserver bakom load balancer för publika kommunportalen. Nginx + Node.js.",
    updatedAt: "2026-05-27",
    author: "Eva Norén",
    category: "Webbserver",
    access: "SSH (key)",
    serverIp: "10.42.20.14",
    serverName: "SRV-WEB-PROD-04",
    kommun: "Örebro",
    driftforvaltare: "Eva Norén",
    osVersion: "Ubuntu 24.04 LTS",
    tags: ["web", "produktion", "nginx"],
  },
  {
    id: "srv-backup-01",
    title: "SRV-BACKUP-01",
    type: "drift",
    excerpt: "Centralt backupsystem med Veeam. Hanterar dagliga snapshots av alla produktionsmiljöer.",
    updatedAt: "2026-05-22",
    author: "Karl Persson",
    category: "Backup",
    access: "RDP via bastion",
    serverIp: "10.42.30.5",
    serverName: "SRV-BACKUP-01",
    kommun: "Uppsala",
    driftforvaltare: "Karl Persson",
    osVersion: "Windows Server 2019",
    tags: ["backup", "veeam"],
  },
  {
    id: "srv-mon-01",
    title: "SRV-MON-01",
    type: "drift",
    excerpt: "Monitoreringsserver med Grafana och Prometheus för all infrastruktur.",
    updatedAt: "2026-05-18",
    author: "Sofia Vik",
    category: "Övervakning",
    access: "SSH (key)",
    serverIp: "10.42.30.18",
    serverName: "SRV-MON-01",
    kommun: "Västerås",
    driftforvaltare: "Sofia Vik",
    osVersion: "Ubuntu 22.04 LTS",
    tags: ["monitoring", "grafana"],
  },
];

export const getDoc = (id: string) => mockDocs.find((d) => d.id === id);
export const getDocsByType = (type: DocType) => mockDocs.filter((d) => d.type === type);
