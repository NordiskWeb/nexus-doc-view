export type CertType = "SSL/TLS" | "Kodsignering" | "Klientcertifikat" | "S/MIME";

export interface Certificate {
  id: string;
  name: string;
  domain: string;
  system: string;
  owner: string;
  issuer: string;
  type: CertType;
  issuedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  reminderDays: number[];
  notifyEmails: string[];
  environment: "Produktion" | "Test" | "Utveckling";
  notes?: string;
}

export const TODAY = new Date("2026-08-13");

export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    name: "Wildcard *.kommun.se",
    domain: "*.kommun.se",
    system: "Webbplattform",
    owner: "Anna Lindberg",
    issuer: "DigiCert",
    type: "SSL/TLS",
    issuedAt: "2025-09-01",
    expiresAt: "2026-08-25",
    autoRenew: false,
    reminderDays: [60, 30, 7],
    notifyEmails: ["anna.lindberg@kommun.se", "drift@kommun.se"],
    environment: "Produktion",
    notes: "Används på samtliga publika webbplatser bakom lastbalanserare.",
  },
  {
    id: "cert-2",
    name: "intranet.kommun.se",
    domain: "intranet.kommun.se",
    system: "Intranät (SharePoint)",
    owner: "Marcus Ek",
    issuer: "Let's Encrypt",
    type: "SSL/TLS",
    issuedAt: "2026-06-20",
    expiresAt: "2026-09-18",
    autoRenew: true,
    reminderDays: [14, 3],
    notifyEmails: ["marcus.ek@kommun.se"],
    environment: "Produktion",
  },
  {
    id: "cert-3",
    name: "API Gateway mTLS",
    domain: "api.kommun.se",
    system: "API Gateway",
    owner: "Daniel Sjögren",
    issuer: "Intern PKI",
    type: "Klientcertifikat",
    issuedAt: "2024-10-05",
    expiresAt: "2026-08-16",
    autoRenew: false,
    reminderDays: [30, 14, 5],
    notifyEmails: ["daniel.sjogren@kommun.se", "sakerhet@kommun.se"],
    environment: "Produktion",
    notes: "Kritiskt – integrationer slutar fungera direkt vid utgång.",
  },
  {
    id: "cert-4",
    name: "Kodsignering Windows-klient",
    domain: "—",
    system: "Klientpaketering",
    owner: "Karl Persson",
    issuer: "Sectigo",
    type: "Kodsignering",
    issuedAt: "2024-03-11",
    expiresAt: "2026-07-30",
    autoRenew: false,
    reminderDays: [90, 30],
    notifyEmails: ["karl.persson@kommun.se"],
    environment: "Produktion",
  },
  {
    id: "cert-5",
    name: "test.kommun.se",
    domain: "test.kommun.se",
    system: "Testmiljö",
    owner: "Sofie Berg",
    issuer: "Let's Encrypt",
    type: "SSL/TLS",
    issuedAt: "2026-07-02",
    expiresAt: "2026-12-01",
    autoRenew: true,
    reminderDays: [30],
    notifyEmails: ["sofie.berg@kommun.se"],
    environment: "Test",
  },
  {
    id: "cert-6",
    name: "e-tjanster.kommun.se",
    domain: "e-tjanster.kommun.se",
    system: "E-tjänsteplattform",
    owner: "Anna Lindberg",
    issuer: "DigiCert",
    type: "SSL/TLS",
    issuedAt: "2026-01-15",
    expiresAt: "2027-01-15",
    autoRenew: true,
    reminderDays: [60, 30, 14],
    notifyEmails: ["anna.lindberg@kommun.se", "e-tjanster@kommun.se"],
    environment: "Produktion",
  },
];

export function daysUntil(date: string, now: Date = TODAY) {
  return Math.ceil((new Date(date).getTime() - now.getTime()) / 86_400_000);
}

export type CertStatus = "giltigt" | "snart" | "kritiskt" | "utgånget";

export function certStatus(cert: Certificate, now: Date = TODAY): CertStatus {
  const d = daysUntil(cert.expiresAt, now);
  if (d < 0) return "utgånget";
  if (d <= 14) return "kritiskt";
  if (d <= 45) return "snart";
  return "giltigt";
}
