import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  CalendarClock,
  Download,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  certStatus,
  daysUntil,
  mockCertificates,
  type CertStatus,
} from "@/lib/mock-certificates";

export const Route = createFileRoute("/certifikat")({
  head: () => ({
    meta: [
      { title: "Certifikat – Docify" },
      {
        name: "description",
        content:
          "Håll koll på alla certifikat: förnyelsedatum, ansvarig, system, domän och vilka som ska påminnas via e-post.",
      },
      { property: "og:title", content: "Certifikat – Docify" },
      {
        property: "og:description",
        content: "Överblick över certifikat, utgångsdatum och e-postpåminnelser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CertificatesPage,
});

const statusStyle: Record<CertStatus, string> = {
  giltigt: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  snart: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  kritiskt: "border-orange-500/40 bg-orange-500/10 text-orange-500",
  utgånget: "border-destructive/40 bg-destructive/10 text-destructive",
};

function CertificatesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("alla");

  const certs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCertificates
      .filter((c) =>
        q
          ? [c.name, c.domain, c.system, c.owner, c.issuer].some((v) =>
              v.toLowerCase().includes(q),
            )
          : true,
      )
      .filter((c) => (status === "alla" ? true : certStatus(c) === status))
      .sort((a, b) => daysUntil(a.expiresAt) - daysUntil(b.expiresAt));
  }, [query, status]);

  const counts = useMemo(() => {
    const all = mockCertificates.map((c) => certStatus(c));
    return {
      total: all.length,
      soon: all.filter((s) => s === "snart" || s === "kritiskt").length,
      critical: all.filter((s) => s === "kritiskt").length,
      expired: all.filter((s) => s === "utgånget").length,
    };
  }, []);

  return (
    <AppShell>
      <div className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Översikt</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Certifikat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold md:text-4xl">Certifikat</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Alla certifikat med förnyelsedatum, ansvarig, system, domän och e-postpåminnelser.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toast("Export till CSV (demo)")}
              >
                <Download className="h-4 w-4" />
                Exportera
              </Button>
              <CertificateDialog />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Totalt" value={counts.total} tone="text-foreground" />
            <Stat label="Förnyas inom 45 dagar" value={counts.soon} tone="text-amber-500" />
            <Stat label="Kritiskt (≤14 dagar)" value={counts.critical} tone="text-orange-500" />
            <Stat label="Utgångna" value={counts.expired} tone="text-destructive" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök på namn, domän, system eller ansvarig…"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alla">Alla statusar</SelectItem>
              <SelectItem value="giltigt">Giltigt</SelectItem>
              <SelectItem value="snart">Förnyas snart</SelectItem>
              <SelectItem value="kritiskt">Kritiskt</SelectItem>
              <SelectItem value="utgånget">Utgånget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface/60 hover:bg-surface/60">
                <TableHead>Certifikat</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Ansvarig</TableHead>
                <TableHead>Förnyelsedatum</TableHead>
                <TableHead>Påminnelser</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {certs.map((cert) => {
                const left = daysUntil(cert.expiresAt);
                const st = certStatus(cert);
                const total = Math.max(
                  1,
                  Math.round(
                    (new Date(cert.expiresAt).getTime() - new Date(cert.issuedAt).getTime()) /
                      86_400_000,
                  ),
                );
                const pct = Math.min(100, Math.max(0, ((total - left) / total) * 100));
                return (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{cert.name}</p>
                          <p className="truncate font-mono text-xs text-muted-foreground">
                            {cert.domain}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{cert.system}</p>
                      <p className="text-xs text-muted-foreground">
                        {cert.type} · {cert.environment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{cert.owner}</p>
                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                    </TableCell>
                    <TableCell className="min-w-[170px]">
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                        {cert.expiresAt}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {left >= 0 ? `${left} dagar kvar` : `Gick ut för ${Math.abs(left)} dagar sedan`}
                        {cert.autoRenew ? " · auto-förnyas" : ""}
                      </p>
                      <Progress value={pct} className="mt-2 h-1" />
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="flex flex-wrap gap-1">
                        {cert.reminderDays.map((d) => (
                          <Badge key={d} variant="secondary" className="gap-1 text-[10px]">
                            <BellRing className="h-3 w-3" />
                            {d} d
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {cert.notifyEmails.join(", ")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyle[st]}>
                        {st}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Åtgärder">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => toast("Testpåminnelse skickad (demo)")}>
                            <BellRing className="mr-2 h-4 w-4" />
                            Skicka testpåminnelse
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => toast("Markerat som förnyat (demo)")}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Markera som förnyat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => toast("Certifikat borttaget (demo)")}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Ta bort
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {certs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Inga certifikat matchar din sökning.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Visuell prototyp – inga påminnelser skickas ännu.
        </p>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-baseline justify-between p-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={`font-display text-2xl font-semibold ${tone}`}>{value}</span>
      </CardContent>
    </Card>
  );
}

function CertificateDialog() {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<number[]>([60, 30, 7]);
  const [reminderInput, setReminderInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const addReminder = () => {
    const n = parseInt(reminderInput, 10);
    if (!Number.isNaN(n) && n > 0 && !reminders.includes(n)) {
      setReminders([...reminders, n].sort((a, b) => b - a));
    }
    setReminderInput("");
  };

  const addEmail = () => {
    const v = emailInput.trim();
    if (v && !emails.includes(v)) setEmails([...emails, v]);
    setEmailInput("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nytt certifikat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Nytt certifikat</DialogTitle>
          <DialogDescription>
            Registrera certifikatet och vilka som ska påminnas innan det går ut.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cert-name">Namn</Label>
              <Input id="cert-name" placeholder="Wildcard *.kommun.se" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-domain">Domän</Label>
              <Input id="cert-domain" placeholder="*.kommun.se" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-system">System</Label>
              <Input id="cert-system" placeholder="Webbplattform" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-owner">Ansvarig</Label>
              <Input id="cert-owner" placeholder="Namn Namnsson" />
            </div>
            <div className="space-y-2">
              <Label>Typ</Label>
              <Select defaultValue="ssl">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssl">SSL/TLS</SelectItem>
                  <SelectItem value="code">Kodsignering</SelectItem>
                  <SelectItem value="client">Klientcertifikat</SelectItem>
                  <SelectItem value="smime">S/MIME</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Miljö</Label>
              <Select defaultValue="prod">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prod">Produktion</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="dev">Utveckling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-issuer">Utfärdare</Label>
              <Input id="cert-issuer" placeholder="DigiCert" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-expires">Förnyelsedatum</Label>
              <Input id="cert-expires" type="date" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium">Auto-förnyas</p>
              <p className="text-xs text-muted-foreground">
                Certifikatet förnyas automatiskt (t.ex. ACME/Let's Encrypt).
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="cert-reminder">Påminn X dagar innan utgång</Label>
            <div className="flex gap-2">
              <Input
                id="cert-reminder"
                type="number"
                min={1}
                value={reminderInput}
                onChange={(e) => setReminderInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addReminder();
                  }
                }}
                placeholder="t.ex. 30"
              />
              <Button type="button" variant="outline" onClick={addReminder}>
                Lägg till
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {reminders.map((d) => (
                <Badge key={d} variant="secondary" className="gap-1">
                  {d} dagar innan
                  <button
                    type="button"
                    aria-label={`Ta bort påminnelse ${d} dagar`}
                    onClick={() => setReminders(reminders.filter((r) => r !== d))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {reminders.length === 0 && (
                <span className="text-xs text-muted-foreground">Inga påminnelser valda.</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-emails">Mottagare av påminnelser</Label>
            <div className="flex gap-2">
              <Input
                id="cert-emails"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEmail();
                  }
                }}
                placeholder="namn@kommun.se"
              />
              <Button type="button" variant="outline" onClick={addEmail}>
                Lägg till
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {emails.map((e) => (
                <Badge key={e} variant="secondary" className="gap-1">
                  {e}
                  <button
                    type="button"
                    aria-label={`Ta bort ${e}`}
                    onClick={() => setEmails(emails.filter((x) => x !== e))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {emails.length === 0 && (
                <span className="text-xs text-muted-foreground">Inga mottagare tillagda.</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cert-notes">Noteringar</Label>
            <Textarea id="cert-notes" rows={3} placeholder="Var används certifikatet, rutiner vid förnyelse…" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Avbryt
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast("Certifikat sparat (demo)");
            }}
          >
            Spara certifikat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
