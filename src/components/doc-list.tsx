import { Link } from "@tanstack/react-router";
import { ChevronRight, LayoutGrid, List, PlusCircle, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Doc, DocType } from "@/lib/mock-docs";
import { getDocsByType, mockDocs } from "@/lib/mock-docs";
import { Search } from "lucide-react";

interface Props {
  type: DocType;
}

const driftFilters = [
  "Access",
  "Server IP",
  "Servernamn",
  "Skapad av",
  "Kommun",
  "Driftförvaltare",
  "OS Version",
];

const supportFilters = ["Kategori", "Skapad av", "Taggar", "Senast uppdaterad"];

export function DocList({ type }: Props) {
  const docs = getDocsByType(type);
  const [view, setView] = useState<"table" | "grid">(type === "drift" ? "table" : "grid");
  const [query, setQuery] = useState("");

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.serverIp?.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  const filters = type === "drift" ? driftFilters : supportFilters;
  const title = type === "drift" ? "Driftdokumentation" : "Support";
  const description =
    type === "drift"
      ? "Servrar, infrastruktur och driftansvar per kommun."
      : "Guider, rutiner och felsökning för supportteamet.";

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
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
                <Badge
                  variant="outline"
                  className={
                    type === "drift"
                      ? "border-drift/40 bg-drift/10 text-drift"
                      : "border-support/40 bg-support/10 text-support"
                  }
                >
                  {filtered.length} dokument
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
            </div>
            <Button asChild className="gap-2">
              <Link to="/new">
                <PlusCircle className="h-4 w-4" />
                Skapa ny {type === "drift" ? "driftdokumentation" : "supportdokumentation"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Filters bar */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Sök i ${title.toLowerCase()}...`}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              {filters.map((f) => (
                <Select key={f}>
                  <SelectTrigger className="h-9 w-auto min-w-[120px] gap-1 bg-background">
                    <SelectValue placeholder={f} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Alla</SelectItem>
                    <SelectItem value="a">{f} A</SelectItem>
                    <SelectItem value="b">{f} B</SelectItem>
                  </SelectContent>
                </Select>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
                className="h-7 px-2"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="h-7 px-2"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* List */}
        {view === "table" ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-surface/60 hover:bg-surface/60">
                  <TableHead>Titel</TableHead>
                  {type === "drift" && (
                    <>
                      <TableHead>Server IP</TableHead>
                      <TableHead>Kommun</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>Driftförvaltare</TableHead>
                    </>
                  )}
                  {type === "support" && (
                    <>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Skapad av</TableHead>
                    </>
                  )}
                  <TableHead className="hidden md:table-cell">Uppdaterad</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={doc.id} className="group cursor-pointer">
                    <TableCell className="font-medium">
                      <Link to="/docs/$id" params={{ id: doc.id }} className="hover:text-primary">
                        {doc.title}
                      </Link>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{doc.excerpt}</p>
                    </TableCell>
                    {type === "drift" && (
                      <>
                        <TableCell className="font-mono text-xs">{doc.serverIp}</TableCell>
                        <TableCell>{doc.kommun}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {doc.osVersion}
                        </TableCell>
                        <TableCell>{doc.driftforvaltare}</TableCell>
                      </>
                    )}
                    {type === "support" && (
                      <>
                        <TableCell>
                          <Badge variant="secondary">{doc.category}</Badge>
                        </TableCell>
                        <TableCell>{doc.author}</TableCell>
                      </>
                    )}
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {doc.updatedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <FavoriteButton id={doc.id} title={doc.title} />
                        <Link to="/docs/$id" params={{ id: doc.id }}>
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                        </Link>
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc) => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function DocCard({ doc }: { doc: Doc }) {
  return (
    <Link to="/docs/$id" params={{ id: doc.id }}>
      <Card className="group h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={
                doc.type === "drift"
                  ? "border-drift/40 bg-drift/10 text-drift"
                  : "border-support/40 bg-support/10 text-support"
              }
            >
              {doc.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{doc.updatedAt}</span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-primary">
            {doc.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{doc.excerpt}</p>
          {doc.type === "drift" && (
            <dl className="mt-auto grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
              <Meta label="IP" value={doc.serverIp ?? "—"} mono />
              <Meta label="Kommun" value={doc.kommun ?? "—"} />
              <Meta label="OS" value={doc.osVersion ?? "—"} />
              <Meta label="Förvaltare" value={doc.driftforvaltare ?? "—"} />
            </dl>
          )}
          {doc.type === "support" && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              {doc.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">
                  #{t}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={`truncate ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
