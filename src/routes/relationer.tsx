import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Network, Server, Share2, Workflow, Search } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getNode,
  getRelations,
  nodeTypeLabel,
  relationNodes,
  type RelationNode,
  type RelationNodeType,
} from "@/lib/mock-relations";

export const Route = createFileRoute("/relationer")({
  head: () => ({
    meta: [
      { title: "Relationer — Docify dokumentation" },
      {
        name: "description",
        content:
          "Grafisk överblick över hur servrar, system, databaser och integrationer hänger ihop i driftmiljön.",
      },
      { property: "og:title", content: "Relationer — Docify dokumentation" },
      {
        property: "og:description",
        content: "Se grafiskt vilka servrar och system som är kopplade till varandra.",
      },
    ],
  }),
  component: RelationerPage,
});

const typeIcon: Record<RelationNodeType, typeof Server> = {
  server: Server,
  system: Workflow,
  databas: Database,
  tjanst: Share2,
  integration: Network,
};

function RelationerPage() {
  const [selectedId, setSelectedId] = useState("app02");
  const [query, setQuery] = useState("");

  const selected = getNode(selectedId)!;
  const relations = useMemo(() => getRelations(selectedId), [selectedId]);

  const filtered = relationNodes.filter((n) =>
    n.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Överblick
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Relationer</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Välj en server, ett system eller en tjänst för att se allt den är kopplad till. Klicka
            på en nod i grafen för att navigera vidare i kedjan.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök server eller system…"
                className="pl-9"
              />
            </div>
            <div className="max-h-[520px] space-y-1 overflow-y-auto rounded-xl border border-border/60 bg-card p-2">
              {filtered.map((node) => {
                const Icon = typeIcon[node.type];
                const active = node.id === selectedId;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="truncate">{node.label}</span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Inga träffar.
                </p>
              )}
            </div>
          </aside>

          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-display text-lg">{selected.label}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{nodeTypeLabel[selected.type]}</Badge>
                  {selected.docId && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/docs/$id" params={{ id: selected.docId }}>
                        Öppna dokument
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <RelationGraph
                  center={selected}
                  relations={relations}
                  onSelect={(id) => setSelectedId(id)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">
                  Kopplingar ({relations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                {relations.map(({ node, label }) => {
                  const Icon = typeIcon[node.type];
                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedId(node.id)}
                      className="flex items-start gap-3 rounded-lg border border-border/60 p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent/50"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{node.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {nodeTypeLabel[node.type]} · {label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function RelationGraph({
  center,
  relations,
  onSelect,
}: {
  center: RelationNode;
  relations: { node: RelationNode; label: string }[];
  onSelect: (id: string) => void;
}) {
  const width = 900;
  const height = 520;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 90;

  const points = relations.map((rel, i) => {
    const angle = (i / Math.max(relations.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return {
      ...rel,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * 0.86,
    };
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/30">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[420px] w-full min-w-[640px]">
        {points.map((p) => (
          <g key={`edge-${p.node.id}`}>
            <line
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              className="stroke-border"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <text
              x={(cx + p.x) / 2}
              y={(cy + p.y) / 2 - 6}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {p.label}
            </text>
          </g>
        ))}

        {points.map((p) => {
          const Icon = typeIcon[p.node.type];
          return (
            <g
              key={p.node.id}
              transform={`translate(${p.x}, ${p.y})`}
              onClick={() => onSelect(p.node.id)}
              className="cursor-pointer"
            >
              <circle r={34} className="fill-card stroke-border" strokeWidth={1.5} />
              <foreignObject x={-12} y={-20} width={24} height={24}>
                <div className="flex h-6 w-6 items-center justify-center text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
              </foreignObject>
              <text
                y={14}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-medium"
              >
                {p.node.label.length > 14 ? `${p.node.label.slice(0, 13)}…` : p.node.label}
              </text>
            </g>
          );
        })}

        <g transform={`translate(${cx}, ${cy})`}>
          <circle r={54} className="fill-primary/10 stroke-primary/40" strokeWidth={1.5} />
          <circle r={44} className="fill-primary stroke-primary" strokeWidth={1.5} />
          <text
            y={5}
            textAnchor="middle"
            className="fill-primary-foreground text-[11px] font-semibold"
          >
            {center.label.length > 14 ? `${center.label.slice(0, 13)}…` : center.label}
          </text>
        </g>
      </svg>
    </div>
  );
}
