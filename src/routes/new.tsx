import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  LifeBuoy,
  Plus,
  Save,
  Send,
  Server,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "Skapa nytt dokument – Docify" },
      { name: "description", content: "Skapa ny support- eller driftdokumentation." },
    ],
  }),
  component: NewDoc,
});

const KOMMUNER = ["Heby", "Älvkarleby", "Knivsta", "Tierp", "Östhammar"];
const GRUPPER = ["IT-Infrastruktur", "Servicedesk", "Verksamhet", "Externa konsulter"];
const KLASSNING = ["A-klassat", "B-klassat", "C-klassat", "Vet ej"];
const OS_VERSIONS = [
  "Windows Server 2019",
  "Windows Server 2022",
  "Ubuntu 22.04 LTS",
  "Ubuntu 24.04 LTS",
  "Debian 12",
  "RHEL 9",
];

type SectionDef = { id: string; label: string };

function NewDoc() {
  const [type, setType] = useState<"support" | "drift">("drift");

  const sections: SectionDef[] = useMemo(
    () =>
      type === "drift"
        ? [
            { id: "allman", label: "Allmän data" },
            { id: "serverinfo", label: "Serverinfo" },
            { id: "systeminfo", label: "Systeminformation" },
            { id: "relationer", label: "Relationer" },
            { id: "sakerhet", label: "Säkerhet & leverantör" },
            { id: "noteringar", label: "Noteringar / Kommentarer" },
          ]
        : [
            { id: "grund", label: "Grundinformation" },
            { id: "klassning", label: "Klassning & access" },
            { id: "system", label: "Systembeskrivning" },
            { id: "forvaltare", label: "Systemförvaltare" },
            { id: "installation", label: "Installation & behörigheter" },
            { id: "lathund", label: "Lathund / Innehåll" },
            { id: "noteringar", label: "Noteringar" },
          ],
    [type],
  );

  return (
    <AppShell>
      <div className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Översikt</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Skapa nytt dokument</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold md:text-4xl">
                Skapa nytt dokument
              </h1>
              <p className="mt-2 text-muted-foreground">
                Fyll i informationen nedan. Du kan spara som utkast och publicera senare.
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Avbryt
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="grid gap-3 md:grid-cols-2">
          <TypeCard
            active={type === "support"}
            onClick={() => setType("support")}
            icon={LifeBuoy}
            tone="support"
            title="Supportdokumentation"
            description="Skapa artikel: supportkort, lathund eller guide."
          />
          <TypeCard
            active={type === "drift"}
            onClick={() => setType("drift")}
            icon={Server}
            tone="drift"
            title="Driftdokumentation"
            description="Servrar, infrastruktur, relationer och säkerhet."
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Section nav */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 space-y-1 rounded-xl border border-border/60 bg-card/60 p-2">
              <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Sektioner
              </p>
              {sections.map((s, i) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-6">
            {type === "drift" ? <DriftForm /> : <SupportForm />}
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-border bg-card/95 p-3 shadow-elegant backdrop-blur">
          <p className="mr-auto text-xs text-muted-foreground">
            <FileText className="mr-1 inline h-3.5 w-3.5" />
            Senast sparad: aldrig
          </p>
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Spara som utkast
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Publicera
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

/* ----------------------- DRIFT FORM ----------------------- */

function DriftForm() {
  return (
    <>
      <FormSection
        id="allman"
        index={1}
        title="Allmän data"
        description="Titel, sammanfattning och åtkomst."
      >
        <Field label="Titel" required>
          <Input placeholder="t.ex. SRV-APP-PROD-05" />
        </Field>
        <Field
          label="Systembeskrivning"
          required
          hint="Beskriv kort vad detta system gör/är till för. Max 80 tecken."
        >
          <Textarea rows={2} maxLength={80} placeholder="T.ex.: Driftkort för vår helpdesk, SD+" />
        </Field>
        <Field
          label="Vilken kommun använder systemet?"
          required
          hint="Du kan välja fler kommuner om systemet används i mer än 1 kommun."
        >
          <CheckboxGrid options={KOMMUNER} />
        </Field>
        <Field
          label="Vilka ska ha access till denna artikel?"
          required
          hint="Välj de grupper som ska ha access att se denna artikel."
        >
          <CheckboxGrid options={GRUPPER} />
        </Field>
        <Field label="Ladda upp filer" hint="T.ex. manualer (max 30 filer).">
          <FileDropzone />
        </Field>
      </FormSection>

      <FormSection
        id="serverinfo"
        index={2}
        title="Serverinfo"
        description="En eller flera servrar som hör till systemet."
      >
        <Repeater addLabel="Lägg till server" titleField="Servernamn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Servernamn" required>
                  <Input placeholder="Välj i listan eller lägg till nytt..." className="font-mono" />
                </Field>
                <Field label="Server IP">
                  <Input placeholder="172.0.0.1" className="font-mono" />
                </Field>
                <Field label="Servertyp">
                  <RadioGroup defaultValue="virtuell" className="flex gap-6 pt-2">
                    <RadioOption value="fysisk" label="Fysisk" />
                    <RadioOption value="virtuell" label="Virtuell" />
                  </RadioGroup>
                </Field>
                <Field label="OS Version">
                  <Input list="os-versions" placeholder="Välj eller skriv..." />
                  <datalist id="os-versions">
                    {OS_VERSIONS.map((o) => (
                      <option key={o} value={o} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Driftförvaltare" hint="Vem/vilka förvaltar denna server/system.">
                  <Input placeholder="Sök användare..." />
                </Field>
                <Field label="Server kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Serverinformation">
                <Textarea rows={4} placeholder="Övrig information om servern..." />
              </Field>
            </>
          )}
        </Repeater>
      </FormSection>

      <FormSection
        id="systeminfo"
        index={3}
        title="Systeminformation"
        description="Ägarskap, kontaktpersoner och vanliga fel."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Systemägare">
            <Textarea rows={2} placeholder="Vem är systemägare?" />
          </Field>
          <Field label="Kontaktperson intern access">
            <Input placeholder="Sök & välj i listan" />
          </Field>
          <Field label="Kontaktperson extern access">
            <Textarea rows={2} placeholder="Namn / företag / kontaktuppgifter" />
          </Field>
        </div>

        <SubHeading title="Vanliga fel och lösningar" />
        <Repeater addLabel="Lägg till FAQ" titleField="Rubrik">
          {() => (
            <>
              <Field label="Rubrik" hint="Kort rubrik så man snabbt förstår vad felet är.">
                <Input placeholder="T.ex: Servern blåskärmar vid uppstart" />
              </Field>
              <Field label="Beskriv felet och lösningen">
                <Textarea rows={4} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="Extern DNS" />
        <Repeater addLabel="Lägg till extern DNS" titleField="Extern IP">
          {() => (
            <>
              <Field label="Extern IP-adress" hint="Separera flera adresser med kommatecken.">
                <Input placeholder="72.90.20.9, 72.90.20.10" className="font-mono" />
              </Field>
              <Field label="Övrig information för extern DNS">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <Field label="Systeminformation">
          <Textarea rows={6} placeholder="Övergripande information om systemet..." />
        </Field>
      </FormSection>

      <FormSection
        id="relationer"
        index={4}
        title="Relationer"
        description="Kopplingar, integrationer och beroenden."
      >
        <SubHeading title="Server- / systemkopplingar" />
        <Repeater addLabel="Lägg till koppling" titleField="Servernamn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Servernamn">
                  <Input placeholder="Välj server eller lägg till ny..." />
                </Field>
                <Field label="Tillhör kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Vad för typ av koppling är detta?" hint="T.ex. databas/AD-integration">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="Webbplatser" />
        <Repeater addLabel="Lägg till webbplats" titleField="Webbadress">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Servernamn">
                  <Input placeholder="Välj server..." />
                </Field>
                <Field label="Webbadress">
                  <Input type="url" placeholder="https://prtg.osthammar.se" className="font-mono" />
                </Field>
              </div>
              <Field label="Tillhör kommun">
                <CheckboxGrid options={KOMMUNER} compact />
              </Field>
              <Field label="Beskriv vad denna portal gör">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="Integrationer" />
        <Repeater addLabel="Lägg till integration" titleField="Integrationsnamn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Integrationsnamn">
                  <Input placeholder="Teis" />
                </Field>
                <Field label="Tillhör kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Vad gör denna integration?">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="Gruppberoenden" />
        <Repeater addLabel="Lägg till grupp" titleField="Gruppnamn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Gruppnamn">
                  <Input placeholder="InstansEDP" className="font-mono" />
                </Field>
                <Field label="Tillhör kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Vad gör denna grupp?">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="Tjänster, konton och jobb" />
        <Repeater addLabel="Lägg till tjänst/konto" titleField="Tjänstenamn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Tjänstenamn">
                  <Input placeholder="PRTG" />
                </Field>
                <Field label="Tillhör kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Vilket konto används för denna tjänst?">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="Schemalagda jobb" />
        <Repeater addLabel="Lägg till jobb" titleField="Jobbnamn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Jobbnamn">
                  <Input placeholder="Reboot_Win" className="font-mono" />
                </Field>
                <Field label="Tillhör kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Vad gör detta jobb?">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <SubHeading title="GPO:er" />
        <Repeater addLabel="Lägg till GPO" titleField="GPO-namn">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="GPO-namn">
                  <Input placeholder="specops_computers" className="font-mono" />
                </Field>
                <Field label="Tillhör kommun">
                  <CheckboxGrid options={KOMMUNER} compact />
                </Field>
              </div>
              <Field label="Vad gör denna GPO?">
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>
      </FormSection>

      <FormSection
        id="sakerhet"
        index={5}
        title="Säkerhet & leverantör"
        description="Klassning, GDPR och leverantörsuppgifter."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Vilken klassning är det på systemet?">
            <ButtonGroup options={KLASSNING} />
          </Field>
          <Field label="Är innehållet på servern GDPR-klassat?">
            <div className="flex items-center gap-3 pt-2">
              <Switch id="gdpr" />
              <Label htmlFor="gdpr" className="text-sm text-muted-foreground">
                Ja, innehåller personuppgifter
              </Label>
            </div>
          </Field>
        </div>

        <SubHeading title="Kontaktuppgifter till leverantör" />
        <Repeater addLabel="Lägg till leverantör" titleField="Leverantörsnamn">
          {() => (
            <>
              <Field label="Leverantörsnamn">
                <Input placeholder="Manage Engine" />
              </Field>
              <Field
                label="Vilka kontaktuppgifter finns?"
                hint="Fyll i uppgifter som finns, t.ex. e-post & telefonnummer."
              >
                <Textarea rows={3} />
              </Field>
            </>
          )}
        </Repeater>

        <Field
          label="Övriga uppgifter"
          hint="T.ex. sökväg till KeePass eller annan bra info att veta."
        >
          <Textarea rows={4} />
        </Field>
      </FormSection>

      <FormSection
        id="noteringar"
        index={6}
        title="Noteringar / Kommentarer"
        description="Block med kompletterande info som visas längst ner på artikeln."
      >
        <Repeater addLabel="Lägg till block" titleField="Rubrik" defaultOpen={false}>
          {() => (
            <>
              <Field
                label="Rubrik"
                hint="Används endast här på redigeringssidan för att sortera noteringar."
              >
                <Input />
              </Field>
              <Field
                label="Noteringar"
                hint="Visas längst ner på artikeln, t.ex. referens till en Change."
              >
                <Textarea rows={6} />
              </Field>
            </>
          )}
        </Repeater>
      </FormSection>
    </>
  );
}

/* ----------------------- SUPPORT (Skapa artikel) ----------------------- */

function SupportForm() {
  const [tags, setTags] = useState<string[]>(["vpn", "åtkomst"]);
  const [tagInput, setTagInput] = useState("");
  const [docType, setDocType] = useState("Supportkort");

  return (
    <>
      <FormSection id="grund" index={1} title="Grundinformation" description="Titel, typ och taggar.">
        <Field label="Titel" required>
          <Input placeholder="t.ex. VPN-åtkomst för externa konsulter" />
        </Field>
        <Field label="Vad för typ av dokument skapar du?">
          <RadioGroup
            value={docType}
            onValueChange={setDocType}
            className="flex flex-wrap gap-6 pt-1"
          >
            {["Supportkort", "Lathund", "Guide", "Annat"].map((o) => (
              <RadioOption key={o} value={o} label={o} />
            ))}
          </RadioGroup>
        </Field>
        <Field
          label="Sammanfattning"
          required
          hint='Beskriv KORT vad denna artikel beskriver. Max 80 tecken.'
        >
          <Textarea
            rows={2}
            maxLength={80}
            placeholder={'T.ex. "Supportkort för systemet …" eller "Instruktioner för hur du byter certifikat på XXX"'}
          />
        </Field>
        <Field label="Taggar">
          <TagInput tags={tags} setTags={setTags} value={tagInput} setValue={setTagInput} />
        </Field>
      </FormSection>

      <FormSection
        id="klassning"
        index={2}
        title="Klassning & access"
        description="Klassning, kommun och åtkomstgrupper."
      >
        <Field label="Vilken klassning har systemet?" required hint="Bocka i vilken klassning systemet har.">
          <RadioGroup defaultValue="Vet ej" className="flex flex-wrap gap-6 pt-1">
            {KLASSNING.map((o) => (
              <RadioOption key={o} value={o} label={o} />
            ))}
          </RadioGroup>
        </Field>
        <Field
          label="Vilken kommun använder systemet?"
          required
          hint="Du kan välja fler kommuner om systemet finns i fler än en kommun."
        >
          <CheckboxGrid options={KOMMUNER} />
        </Field>
        <Field
          label="Vilka ska ha access till denna artikel?"
          required
          hint="Välj de grupper som ska ha access att se denna artikel."
        >
          <CheckboxGrid options={GRUPPER} />
        </Field>
      </FormSection>

      <FormSection
        id="system"
        index={3}
        title="Systembeskrivning"
        description="Vad systemet gör och hur det används."
      >
        <Field
          label="Beskrivning av system"
          hint="Till vad används systemet? Vilka kommuner/verksamheter använder det? Leverantör?"
        >
          <Textarea rows={6} />
        </Field>
        <Field label="Lösenordshantering" hint="Vilka sköter byte av lösenord?">
          <Textarea rows={4} />
        </Field>
      </FormSection>

      <FormSection
        id="forvaltare"
        index={4}
        title="Systemförvaltare"
        description="Kontaktpersoner per kommun."
      >
        <Repeater addLabel="Lägg till förvaltare" titleField="Kontaktperson">
          {() => (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Kommun">
                  <RadioGroup className="flex flex-col gap-1 pt-1">
                    {KOMMUNER.map((k) => (
                      <RadioOption key={k} value={k} label={k} />
                    ))}
                  </RadioGroup>
                </Field>
                <Field label="Kontaktperson" hint="Namn på personen">
                  <Input placeholder="Anna Andersson" />
                </Field>
                <Field label="Telefon eller mail" hint="Hur når vi kontaktpersonen?">
                  <Input placeholder="0701234578" />
                </Field>
              </div>
            </>
          )}
        </Repeater>
        <Field label="Övrig info systemförvaltare">
          <Textarea rows={3} placeholder="Finns det övrig info?" />
        </Field>
      </FormSection>

      <FormSection
        id="installation"
        index={5}
        title="Installation & behörigheter"
        description="Hur systemet installeras och vilka behörigheter som krävs."
      >
        <Field
          label="Installation"
          hint="T.ex. programgrupp och sökväg till installationsfiler för manuell installation."
        >
          <Textarea rows={4} />
        </Field>
        <Field
          label="Behörigheter / krav"
          hint="Behörighetsgrupper? Speciell placering i AD? Krävs VPN/intranät?"
        >
          <Textarea rows={4} />
        </Field>
      </FormSection>

      <FormSection
        id="lathund"
        index={6}
        title="Lathund / Innehåll"
        description="Huvudinnehållet i artikeln."
      >
        <Field
          label="Skriv lathund"
          hint="Gör lathunden så tydlig som möjligt. Använd radbryt och rubriker."
        >
          <Textarea
            rows={14}
            className="font-mono text-sm"
            placeholder={`# Översikt\n\nBeskriv kort vad guiden gör.\n\n## Steg 1\n...\n\n## Steg 2\n...`}
          />
        </Field>
      </FormSection>

      <FormSection
        id="noteringar"
        index={7}
        title="Noteringar"
        description="Kortare noteringar som komplement till artikeln."
      >
        <Repeater addLabel="Lägg till notering" titleField="Rubrik">
          {() => (
            <>
              <Field label="Rubrik" required hint="Håll kort vad noteringen gäller.">
                <Input placeholder="Vid felkod #KB20039" />
              </Field>
              <Field label="Notering" required hint="Håll det kort.">
                <Textarea rows={4} />
              </Field>
            </>
          )}
        </Repeater>
      </FormSection>
    </>
  );
}

/* ----------------------- Reusable bits ----------------------- */

function TypeCard({
  active,
  onClick,
  icon: Icon,
  tone,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Server;
  tone: "support" | "drift";
  title: string;
  description: string;
}) {
  const accent =
    tone === "support" ? "bg-support text-support-foreground" : "bg-drift text-drift-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all",
        active
          ? "border-primary bg-accent/40 shadow-elegant"
          : "border-border bg-card hover:border-primary/40",
      )}
    >
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accent)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          "mt-1 h-4 w-4 rounded-full border-2 transition-all",
          active ? "border-primary bg-primary" : "border-border",
        )}
      />
    </button>
  );
}

function FormSection({
  id,
  index,
  title,
  description,
  children,
}: {
  id: string;
  index: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card id={id} className="scroll-mt-24 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 border-b border-border/60 bg-surface/40 px-6 py-4 text-left transition-colors hover:bg-surface/60"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {index}
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>
      {open && <CardContent className="space-y-5 p-6 md:p-8">{children}</CardContent>}
    </Card>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <div className="pt-2">
      <Separator className="mb-4" />
      <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <div className="pt-0.5">{children}</div>
    </div>
  );
}

function RadioOption({ value, label }: { value: string; label: string }) {
  const id = `radio-${value}`;
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

function CheckboxGrid({ options, compact }: { options: string[]; compact?: boolean }) {
  return (
    <div
      className={cn(
        "grid gap-2",
        compact ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      )}
    >
      {options.map((o) => {
        const id = `cb-${o}`;
        return (
          <label
            key={o}
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-card/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-accent/30"
          >
            <Checkbox id={id} />
            <span>{o}</span>
          </label>
        );
      })}
    </div>
  );
}

function ButtonGroup({ options }: { options: string[] }) {
  const [active, setActive] = useState(options[0]);
  return (
    <div className="inline-flex flex-wrap rounded-md border border-border bg-card/40 p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setActive(o)}
          className={cn(
            "rounded px-3 py-1.5 text-sm transition-all",
            active === o
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function TagInput({
  tags,
  setTags,
  value,
  setValue,
}: {
  tags: string[];
  setTags: (t: string[]) => void;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="rounded-md border border-input bg-background p-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((t) => (
          <Badge key={t} variant="secondary" className="gap-1">
            <Tag className="h-3 w-3" />
            {t}
            <button
              type="button"
              onClick={() => setTags(tags.filter((x) => x !== t))}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              e.preventDefault();
              setTags([...tags, value.trim()]);
              setValue("");
            }
          }}
          placeholder="Lägg till tagg och tryck Enter"
          className="min-w-[180px] flex-1 bg-transparent px-2 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}

function FileDropzone() {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card/40 p-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/20">
      <Upload className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm font-medium">Dra och släpp filer här</p>
      <p className="text-xs text-muted-foreground">eller klicka för att välja från datorn</p>
      <input type="file" multiple className="hidden" />
    </label>
  );
}

function Repeater({
  children,
  addLabel,
  titleField,
  defaultOpen = true,
}: {
  children: (index: number) => React.ReactNode;
  addLabel: string;
  titleField?: string;
  defaultOpen?: boolean;
}) {
  const [items, setItems] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);

  return (
    <div className="space-y-3">
      {items.map((id, idx) => (
        <RepeaterItem
          key={id}
          index={idx + 1}
          titleField={titleField}
          defaultOpen={defaultOpen}
          onRemove={items.length > 1 ? () => setItems(items.filter((i) => i !== id)) : undefined}
        >
          {children(idx)}
        </RepeaterItem>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => {
          setItems([...items, nextId]);
          setNextId(nextId + 1);
        }}
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}

function RepeaterItem({
  children,
  index,
  titleField,
  onRemove,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  index: number;
  titleField?: string;
  onRemove?: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/40">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-surface/30 px-4 py-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left text-sm font-medium"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open ? "rotate-0" : "-rotate-90",
            )}
          />
          <span className="text-muted-foreground">#{index}</span>
          {titleField && <span className="text-foreground/80">{titleField}</span>}
        </button>
        {onRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      {open && <div className="space-y-4 p-4 md:p-5">{children}</div>}
    </div>
  );
}
