export type InviteStatus = "aktiv" | "väntar" | "utgången";

export interface Invite {
  id: string;
  email: string;
  name?: string;
  organisation: string;
  docIds: string[];
  scopeLabel: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: InviteStatus;
  role: "Läsare" | "Kommentera";
}

export const mockInvites: Invite[] = [
  {
    id: "inv-1",
    email: "erik.hall@konsultbolaget.se",
    name: "Erik Hall",
    organisation: "Konsultbolaget AB",
    docIds: ["srv-app-prod-01", "srv-db-prod-02"],
    scopeLabel: "2 driftdokument",
    invitedBy: "Daniel Sjögren",
    invitedAt: "2026-07-28",
    expiresAt: "2026-08-27",
    status: "aktiv",
    role: "Läsare",
  },
  {
    id: "inv-2",
    email: "maja.li@nordicnet.se",
    name: "Maja Li",
    organisation: "NordicNet",
    docIds: ["vpn-access-guide"],
    scopeLabel: "VPN-åtkomst för externa konsulter",
    invitedBy: "Anna Lindberg",
    invitedAt: "2026-08-02",
    expiresAt: "2026-08-09",
    status: "väntar",
    role: "Läsare",
  },
  {
    id: "inv-3",
    email: "p.svensson@driftpartner.se",
    name: "Pontus Svensson",
    organisation: "Driftpartner Sverige",
    docIds: ["srv-backup-01", "srv-mon-01", "srv-web-prod-04"],
    scopeLabel: "Hela Driftdokumentation",
    invitedBy: "Karl Persson",
    invitedAt: "2026-06-15",
    expiresAt: "2026-07-15",
    status: "utgången",
    role: "Kommentera",
  },
  {
    id: "inv-4",
    email: "sofie.berg@kommunit.se",
    name: "Sofie Berg",
    organisation: "Kommun-IT",
    docIds: ["onboarding-new-user", "password-reset"],
    scopeLabel: "2 supportartiklar",
    invitedBy: "Marcus Ek",
    invitedAt: "2026-08-04",
    expiresAt: "2026-11-04",
    status: "aktiv",
    role: "Läsare",
  },
];

export function daysLeft(expiresAt: string, now = new Date("2026-08-06")) {
  const diff = new Date(expiresAt).getTime() - now.getTime();
  return Math.ceil(diff / 86_400_000);
}
