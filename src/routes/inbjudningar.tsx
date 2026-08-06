import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Mail, MoreHorizontal, RefreshCw, UserPlus, XCircle } from "lucide-react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { mockDocs } from "@/lib/mock-docs";
import { daysLeft, mockInvites, type InviteStatus } from "@/lib/mock-invites";

export const Route = createFileRoute("/inbjudningar")({
  head: () => ({
    meta: [
      { title: "Inbjudna användare – Docify" },
      {
        name: "description",
        content:
          "Överblick över externa användare som bjudits in, vilka dokument de har access till och hur länge.",
      },
      { property: "og:title", content: "Inbjudna användare – Docify" },
      {
        property: "og:description",
        content: "Se alla externa inbjudningar, deras åtkomst och giltighetstid.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InvitesPage,
});

const statusStyle: Record<InviteStatus, string> = {
  aktiv: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  väntar: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  utgången: "border-destructive/40 bg-destructive/10 text-destructive",
};

function InvitesPage() {
  const invites = mockInvites;
  const active = invites.filter((i) => i.status === "aktiv").length;
  const pending = invites.filter((i) => i.status === "väntar").length;
  const expired = invites.filter((i) => i.status === "utgången").length;

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
                <BreadcrumbPage>Inbjudna användare</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold md:text-4xl">Inbjudna användare</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Externa konsulter och partners med tidsbegränsad access till utvald dokumentation.
              </p>
            </div>
            <InviteDialog />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Aktiva" value={active} tone="text-emerald-500" />
            <Stat label="Väntar på svar" value={pending} tone="text-amber-500" />
            <Stat label="Utgångna" value={expired} tone="text-destructive" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface/60 hover:bg-surface/60">
                <TableHead>Användare</TableHead>
                <TableHead>Access till</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Inbjuden av</TableHead>
                <TableHead>Giltig till</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => {
                const left = daysLeft(invite.expiresAt);
                return (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {(invite.name ?? invite.email).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{invite.name ?? invite.email}</p>
                          <p className="truncate text-xs text-muted-foreground">{invite.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{invite.scopeLabel}</p>
                      <p className="text-xs text-muted-foreground">{invite.organisation}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invite.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{invite.invitedBy}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                        {invite.expiresAt}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {left > 0 ? `${left} dagar kvar` : `Gick ut för ${Math.abs(left)} dagar sedan`}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyle[invite.status]}>
                        {invite.status}
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
                          <DropdownMenuItem onSelect={() => toast("Inbjudan skickad igen (demo)")}>
                            <Mail className="mr-2 h-4 w-4" />
                            Skicka igen
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => toast("Access förlängd 30 dagar (demo)")}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Förläng 30 dagar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => toast("Access återkallad (demo)")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Återkalla access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Visuell prototyp – inga inbjudningar skickas ännu.
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

export function InviteDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Bjud in extern användare
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Bjud in extern användare</DialogTitle>
          <DialogDescription>
            Skicka en tidsbegränsad inbjudan via e-post till utvald dokumentation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">E-postadress</Label>
            <Input id="invite-email" type="email" placeholder="namn@företag.se" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Access till</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Välj dokument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-support">Hela Support</SelectItem>
                  <SelectItem value="all-drift">Hela Driftdokumentation</SelectItem>
                  {mockDocs.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Roll</Label>
              <Select defaultValue="reader">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reader">Läsare</SelectItem>
                  <SelectItem value="commenter">Kommentera</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Access gäller i</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dagar</SelectItem>
                  <SelectItem value="30">30 dagar</SelectItem>
                  <SelectItem value="90">90 dagar</SelectItem>
                  <SelectItem value="custom">Eget slutdatum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-until">Slutdatum</Label>
              <Input id="invite-until" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-msg">Meddelande (valfritt)</Label>
            <Textarea id="invite-msg" rows={3} placeholder="Hej! Här är dokumentationen du behöver…" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Avbryt
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setOpen(false);
              toast("Inbjudan skapad (demo – inget mejl skickas)");
            }}
          >
            <Mail className="h-4 w-4" />
            Skicka inbjudan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
