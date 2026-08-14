import type { DocType } from "./mock-docs";

export interface Draft {
  id: string;
  title: string;
  type: DocType;
  excerpt: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  /** 0-100 hur komplett utkastet är */
  completion: number;
  missing: string[];
}

export const mockDrafts: Draft[] = [
  {
    id: "draft-mfa-rollout",
    title: "MFA-utrullning för externa konsulter",
    type: "support",
    excerpt:
      "Utkast till guide för hur externa konsulter aktiverar MFA och kopplar Authenticator-appen.",
    category: "Åtkomst",
    author: "Anna Lindberg",
    createdAt: "2026-08-02",
    updatedAt: "2026-08-11",
    completion: 70,
    missing: ["Skärmbilder", "Systemförvaltare"],
  },
  {
    id: "draft-srv-app-prod-05",
    title: "SRV-APP-PROD-05",
    type: "drift",
    excerpt:
      "Nytt driftkort för kommande applikationsserver i Uppsala. Serverinfo delvis ifylld.",
    category: "Applikationsserver",
    author: "Daniel Sjögren",
    createdAt: "2026-07-28",
    updatedAt: "2026-08-13",
    completion: 45,
    missing: ["IP-adress", "Relationer", "Säkerhet & leverantör"],
  },
  {
    id: "draft-backup-restore",
    title: "Återläsning från Veeam – steg för steg",
    type: "support",
    excerpt: "Påbörjad lathund för hur drift återläser filer och hela VM från backup.",
    category: "Backup",
    author: "Karl Persson",
    createdAt: "2026-07-19",
    updatedAt: "2026-08-05",
    completion: 25,
    missing: ["Innehåll", "Klassning & access", "Ansvarig"],
  },
  {
    id: "draft-srv-db-test-01",
    title: "SRV-DB-TEST-01",
    type: "drift",
    excerpt: "Driftkort för ny testdatabasserver. Väntar på OS-version och driftförvaltare.",
    category: "Databasserver",
    author: "Linda Almgren",
    createdAt: "2026-08-09",
    updatedAt: "2026-08-14",
    completion: 60,
    missing: ["OS-version", "Driftförvaltare"],
  },
  {
    id: "draft-skrivare-policy",
    title: "Policy för säker utskrift",
    type: "support",
    excerpt: "Utkast om follow-me-print och hantering av känsliga dokument i utskriftskön.",
    category: "Hårdvara",
    author: "Johan Berg",
    createdAt: "2026-06-30",
    updatedAt: "2026-07-22",
    completion: 15,
    missing: ["Systembeskrivning", "Innehåll", "Taggar"],
  },
];
