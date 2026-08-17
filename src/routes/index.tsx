import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  FileText,
  LifeBuoy,
  PlusCircle,
  Server,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { GlobalSearch } from "@/components/global-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockDocs } from "@/lib/mock-docs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Docify – Modern dokumentationsplattform" },
      {
        name: "description",
        content:
          "Central plattform för support- och driftdokumentation. Sök, läs och skapa med en modern, snabb upplevelse.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const recent = [...mockDocs]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-10 text-center md:py-16">
          <Badge variant="secondary" className="mb-4 gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="h-3 w-3" />
            Allt på ett ställe
          </Badge>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Dokumentation som
            <span className="ml-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              flyter snabbt.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
            Hitta svar i support- och driftdokumentationen direkt – på ett ställe.
            Skapa, dela och håll all kunskap aktuell.
          </p>

          <div className="mx-auto mt-6 max-w-2xl">
            <GlobalSearch size="hero" placeholder="Sök i Support och Driftdokumentation..." />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Försök med:</span>
              {["VPN", "Backup", "Uppsala", "SRV-DB-PROD"].map((s) => (
                <button
                  key={s}
                  className="rounded-full border border-border bg-surface px-3 py-1 transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two big cards */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <CategoryCard
            to="/support"
            tone="support"
            icon={LifeBuoy}
            title="Support"
            description="Guider, felsökning och rutiner för IT-supporten."
            count={mockDocs.filter((d) => d.type === "support").length}
          />
          <CategoryCard
            to="/drift"
            tone="drift"
            icon={Server}
            title="Driftdokumentation"
            description="Servrar, infrastruktur, IP-adresser och driftansvar per kommun."
            count={mockDocs.filter((d) => d.type === "drift").length}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/new">
              <PlusCircle className="h-4 w-4" />
              Ny supportdokumentation
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/new">
              <PlusCircle className="h-4 w-4" />
              Ny driftdokumentation
            </Link>
          </Button>
        </div>
      </section>

      {/* Recent + popular */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader
              icon={Clock}
              title="Senast uppdaterade"
              subtitle="De senaste ändringarna i kunskapsbasen."
            />
            <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
              {recent.map((doc) => (
                <Link
                  key={doc.id}
                  to="/docs/$id"
                  params={{ id: doc.id }}
                  className="group flex items-center gap-3 p-3 transition-colors hover:bg-accent/40"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      doc.type === "support"
                        ? "bg-support/10 text-support"
                        : "bg-drift/10 text-drift"
                    }`}
                  >
                    {doc.type === "support" ? (
                      <LifeBuoy className="h-4 w-4" />
                    ) : (
                      <Server className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-medium">{doc.title}</h3>
                      <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">
                        {doc.category}
                      </Badge>
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {doc.excerpt}
                    </p>
                  </div>
                  <div className="hidden text-xs text-muted-foreground md:block">
                    {doc.updatedAt}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              icon={TrendingUp}
              title="Populärt"
              subtitle="Mest besökta den här veckan."
            />
            <Card className="mt-3">
              <CardContent className="p-2">
                <ul className="divide-y divide-border">
                  {mockDocs.slice(0, 5).map((doc, i) => (
                    <li key={doc.id}>
                      <Link
                        to="/docs/$id"
                        params={{ id: doc.id }}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/40"
                      >
                        <span className="font-display text-lg font-semibold tabular-nums text-muted-foreground/60">
                          0{i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type === "support" ? "Support" : "Drift"} · {doc.category}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function CategoryCard({
  to,
  tone,
  icon: Icon,
  title,
  description,
  count,
}: {
  to: string;
  tone: "support" | "drift";
  icon: typeof FileText;
  title: string;
  description: string;
  count: number;
}) {
  const toneClass =
    tone === "support"
      ? "from-support/15 to-support/0 border-support/20 hover:border-support/50"
      : "from-drift/15 to-drift/0 border-drift/20 hover:border-drift/50";
  const iconBg =
    tone === "support" ? "bg-support text-support-foreground" : "bg-drift text-drift-foreground";

  return (
    <Link
      to={to}
      className={`group relative flex flex-col gap-5 overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all hover:shadow-elegant md:p-8 ${toneClass}`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        <Badge variant="outline" className="bg-background/60 backdrop-blur">
          {count} dokument
        </Badge>
      </div>
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
        Öppna {title.toLowerCase()}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof FileText;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h2 className="font-display text-xl font-semibold">{title}</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
