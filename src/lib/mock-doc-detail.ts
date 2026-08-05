import type { Doc } from "./mock-docs";

export interface KeyValue {
  label: string;
  value: string;
  mono?: boolean;
}

export interface DetailItem {
  title: string;
  subtitle?: string;
  body: string;
  fields?: KeyValue[];
}

export interface DetailBlock {
  kind: "text" | "list" | "items" | "fields";
  heading?: string;
  text?: string;
  list?: string[];
  items?: DetailItem[];
  fields?: KeyValue[];
}

export interface DetailSection {
  id: string;
  label: string;
  blocks: DetailBlock[];
}

/** Mockad detaljinnehåll baserat på metabox-strukturen (Driftdokument / Skapa artikel). */
export function getDocSections(doc: Doc): DetailSection[] {
  return doc.type === "drift" ? driftSections(doc) : supportSections(doc);
}

function driftSections(doc: Doc): DetailSection[] {
  return [
    {
      id: "allman",
      label: "Allmän data",
      blocks: [
        {
          kind: "text",
          text: `${doc.excerpt} Driftkortet uppdateras av driftteamet i samband med förändringar i miljön och granskas kvartalsvis.`,
        },
        {
          kind: "fields",
          heading: "Klassning & access",
          fields: [
            { label: "Klassning", value: "Verksamhetskritisk" },
            { label: "Kommun", value: doc.kommun ?? "—" },
            { label: "Access för artikel", value: "IT-drift, Servicedesk nivå 2" },
            { label: "Bifogade filer", value: "driftinstruktion.pdf, nätverksskiss.vsdx" },
          ],
        },
      ],
    },
    {
      id: "serverinfo",
      label: "Serverinfo",
      blocks: [
        {
          kind: "items",
          items: [
            {
              title: doc.serverName ?? doc.title,
              subtitle: "Primär nod",
              body:
                "Servern kör produktionslasten dygnet runt. Omstart sker endast under planerat underhållsfönster söndagar 02:00–04:00.",
              fields: [
                { label: "Server IP", value: doc.serverIp ?? "—", mono: true },
                { label: "Servertyp", value: "Virtuell (VMware)" },
                { label: "OS Version", value: doc.osVersion ?? "—" },
                { label: "Driftförvaltare", value: doc.driftforvaltare ?? doc.author },
                { label: "Access", value: doc.access ?? "—" },
                { label: "Server kommun", value: doc.kommun ?? "—" },
              ],
            },
            {
              title: `${doc.serverName ?? doc.title}-B`,
              subtitle: "Sekundär nod / failover",
              body: "Passiv nod som tar över vid fel på primär nod. Samma patchnivå hålls på båda noderna.",
              fields: [
                { label: "Server IP", value: "10.42.18.99", mono: true },
                { label: "Servertyp", value: "Virtuell (VMware)" },
                { label: "OS Version", value: doc.osVersion ?? "—" },
                { label: "Driftförvaltare", value: doc.driftforvaltare ?? doc.author },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "systeminfo",
      label: "Systeminformation",
      blocks: [
        {
          kind: "fields",
          fields: [
            { label: "Systemägare", value: "IT-avdelningen, enhet Infrastruktur" },
            { label: "Kontaktperson intern access", value: doc.author },
            { label: "Kontaktperson extern access", value: "Leverantörssupport, support@leverantor.se" },
          ],
        },
        {
          kind: "items",
          heading: "Vanliga fel och lösningar",
          items: [
            {
              title: "Tjänsten startar inte efter omstart",
              body:
                "Kontrollera att beroende tjänster har startat. Starta om tjänsten manuellt via services.msc och verifiera i händelseloggen.",
            },
            {
              title: "Hög diskbelastning nattetid",
              body:
                "Orsakas oftast av backupjobbet som överlappar indexering. Justera schemat eller kontakta backupansvarig.",
            },
          ],
        },
        {
          kind: "items",
          heading: "Extern DNS",
          items: [
            {
              title: "72.90.20.9, 72.90.20.10",
              body: "Publika adresser som pekar mot lastbalanseraren framför tjänsten.",
            },
          ],
        },
        {
          kind: "text",
          heading: "Systeminformation",
          text:
            "Systemet består av applikationsnod, databasnod och en lastbalanserare. All trafik krypteras med TLS 1.3 och certifikat förnyas automatiskt.",
        },
      ],
    },
    {
      id: "relationer",
      label: "Relationer",
      blocks: [
        {
          kind: "items",
          heading: "Server- / systemkopplingar",
          items: [
            {
              title: "SRV-DB-PROD-02",
              subtitle: doc.kommun ?? "",
              body: "Databaskoppling via SQL på port 1433. Applikationen är beroende av denna nod.",
            },
            {
              title: "SRV-AD-01",
              subtitle: doc.kommun ?? "",
              body: "AD-integration för autentisering och gruppbehörigheter.",
            },
          ],
        },
        {
          kind: "items",
          heading: "Webbplatser",
          items: [
            {
              title: "https://portal.kommun.se",
              body: "Publik portal som exponerar tjänsten mot verksamheten.",
            },
          ],
        },
        {
          kind: "items",
          heading: "Integrationer",
          items: [
            { title: "Teis", body: "Överför ärendedata nattligen till verksamhetssystemet." },
            { title: "Metakatalog", body: "Synkroniserar användare och organisationsstruktur." },
          ],
        },
        {
          kind: "items",
          heading: "Gruppberoenden",
          items: [{ title: "InstansEDP", body: "AD-grupp som styr behörighet till applikationen." }],
        },
        {
          kind: "items",
          heading: "Tjänster, konton och jobb",
          items: [
            { title: "PRTG", body: "Övervakning körs med servicekontot svc-prtg." },
            { title: "Reboot_Win", body: "Schemalagd omstart söndagar 02:00." },
          ],
        },
        {
          kind: "items",
          heading: "GPO:er",
          items: [{ title: "specops_computers", body: "Styr lokala säkerhetsinställningar och patchfönster." }],
        },
      ],
    },
    {
      id: "sakerhet",
      label: "Säkerhet & leverantör",
      blocks: [
        {
          kind: "fields",
          fields: [
            { label: "Klassning", value: "Verksamhetskritisk" },
            { label: "GDPR-klassat", value: "Ja – innehåller personuppgifter" },
            { label: "Loggning", value: "Central logginsamling, granskas månadsvis" },
          ],
        },
        {
          kind: "items",
          heading: "Kontaktuppgifter till leverantör",
          items: [
            {
              title: "Manage Engine",
              body: "support@manageengine.com · +46 8 123 45 67 · Avtalsnummer 4471-B",
            },
          ],
        },
        {
          kind: "text",
          heading: "Övriga uppgifter",
          text: "Lösenord finns i KeePass under IT-Drift/Servrar/Produktion. Åtkomst begärs av driftförvaltare.",
        },
      ],
    },
    {
      id: "noteringar",
      label: "Noteringar / Kommentarer",
      blocks: [
        {
          kind: "items",
          items: [
            {
              title: "Change CHG-2041",
              body: "Minnesutökning till 32 GB genomförd 2026-05-12. Ingen påverkan på tjänsten.",
            },
            {
              title: "Planerad uppgradering",
              body: "OS-uppgradering planeras till Q4. Avstämning med verksamheten krävs.",
            },
          ],
        },
      ],
    },
  ];
}

function supportSections(doc: Doc): DetailSection[] {
  return [
    {
      id: "grund",
      label: "Grundinformation",
      blocks: [
        { kind: "text", text: doc.excerpt },
        {
          kind: "fields",
          fields: [
            { label: "Dokumenttyp", value: "Supportkort" },
            { label: "Kategori", value: doc.category },
            { label: "Sammanfattning", value: doc.excerpt },
          ],
        },
      ],
    },
    {
      id: "klassning",
      label: "Klassning & access",
      blocks: [
        {
          kind: "fields",
          fields: [
            { label: "Klassning", value: "Intern" },
            { label: "Kommun", value: "Uppsala, Västerås, Örebro" },
            { label: "Access", value: "Servicedesk, IT-drift" },
          ],
        },
      ],
    },
    {
      id: "system",
      label: "Systembeskrivning",
      blocks: [
        {
          kind: "text",
          text:
            "Systemet används av verksamheten för dagligt arbete och förvaltas centralt av IT. Leverantören ansvarar för uppdateringar enligt avtal.",
        },
        {
          kind: "text",
          heading: "Lösenordshantering",
          text: "Lösenordsbyte sköts av Servicedesk. Konton låses efter fem misslyckade försök och låses upp av nivå 1.",
        },
      ],
    },
    {
      id: "forvaltare",
      label: "Systemförvaltare",
      blocks: [
        {
          kind: "items",
          items: [
            { title: doc.author, subtitle: "Uppsala", body: "070-123 45 78 · " + doc.author.toLowerCase().replace(" ", ".") + "@kommun.se" },
            { title: "Petra Ohlsson", subtitle: "Västerås", body: "070-987 65 43 · petra.ohlsson@kommun.se" },
          ],
        },
      ],
    },
    {
      id: "installation",
      label: "Installation & behörigheter",
      blocks: [
        {
          kind: "text",
          heading: "Installation",
          text: "Distribueras via programgruppen APP-Klient. Manuella installationsfiler finns på \\\\fs01\\install\\.",
        },
        {
          kind: "list",
          heading: "Behörigheter / krav",
          list: [
            "Medlemskap i AD-gruppen APP-Users krävs.",
            "VPN eller anslutning via intranät.",
            "Klienten måste vara placerad i rätt OU.",
          ],
        },
      ],
    },
    {
      id: "lathund",
      label: "Lathund",
      blocks: [
        {
          kind: "list",
          heading: "Steg för steg",
          list: [
            "Kontrollera att användaren har rätt behörigheter.",
            "Starta klienten och logga in med tjänstekontot.",
            "Genomför åtgärden enligt rutin och verifiera resultatet.",
            "Dokumentera i ärendet och stäng med rätt kategori.",
          ],
        },
        {
          kind: "text",
          text: "Vid avvikelser: eskalera till nivå 2 och bifoga loggutdrag samt skärmbild.",
        },
      ],
    },
    {
      id: "noteringar",
      label: "Noteringar",
      blocks: [
        {
          kind: "items",
          items: [
            { title: "Vid felkod #KB20039", body: "Rensa den lokala cachen och starta om klienten." },
          ],
        },
      ],
    },
  ];
}
