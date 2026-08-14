import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileEdit, LifeBuoy, PlusCircle, Search, Server, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { mockDrafts } from "@/lib/mock-drafts";

export const Route = createFileRoute("/utkast")({
  head: () => ({
    meta: [
      { title: "Utkast – Docify dokumentation" },
      {
        name: "description",
        content:
          "Påbörjade men ännu inte publicerade support- och driftdokument, med status och vad som saknas.",
      },
      { property: "og:title", content: "Utkast – Docify dokumentation" },
      {
        property: "og:description",
        content:
          "Påbörjade men ännu inte publicerade support- och driftdokument, med status och vad som saknas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DraftsPage,
});

type Filter = "alla" | "support" | "drift";

function DraftsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("alla");
  const [removed, setRemoved] = useState<string[]>([]);

  const drafts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockDrafts
      .filter((d) => !removed.includes(d.id))
      .filter((d) => (filter === "alla" ? true : d.type === filter))
      .filter(
        (d) =>
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.excerpt.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [query, filter, removed]);

  const filters: { key: Filter; label: string }[] = [
    { key: "alla", label: "Alla" },
    { key: "support", label: "Support" },
    { key: "drift", label: "Drift" },
  ];

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
                <BreadcrumbPage>Utkast</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-semibold md:text-4xl">Utkast</h1>
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                  {drafts.length} pågående
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Dokument som påbörjats men ännu inte publicerats. Se vad som saknas innan de kan gå
                live.
              </p>
            </div>
            <Button asChild>
              <Link to="/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Skapa nytt
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Sök bland utkast…"
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-surface/60 p-1">
            {filters.map((f) => (
              <Button
                key={f.key}
                size="sm"
                variant={filter === f.key ? "secondary" : "ghost"}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        {drafts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileEdit className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold">Inga utkast</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Allt är publicerat. Börja ett nytt dokument när du är redo.
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link to="/new">Skapa nytt dokument</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <Card key={draft.id} className="group h-full transition-all hover:border-primary/40">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={
                        draft.type === "drift"
                          ? "border-drift/40 bg-drift/10 text-drift"
                          : "border-support/40 bg-support/10 text-support"
                      }
                    >
                      {draft.type === "drift" ? (
                        <Server className="mr-1 h-3 w-3" />
                      ) : (
                        <LifeBuoy className="mr-1 h-3 w-3" />
                      )}
                      {draft.category}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                      Utkast
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold leading-snug">
                      {draft.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {draft.excerpt}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Färdigställt</span>
                      <span className="font-medium text-foreground">{draft.completion}%</span>
                    </div>
                    <Progress value={draft.completion} className="h-1.5" />
                  </div>

                  {draft.missing.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {draft.missing.map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-border bg-surface/60 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          Saknas: {m}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">
                      Ändrad {draft.updatedAt} · {draft.author}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Fortsätt redigera"
                        onClick={() => toast.info("Redigering av utkast kommer snart")}
                      >
                        <FileEdit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Ta bort utkast"
                        onClick={() => {
                          setRemoved((r) => [...r, draft.id]);
                          toast.success("Utkastet togs bort");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
