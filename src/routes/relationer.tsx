import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Database,
  Network,
  Server,
  Share2,
  Workflow,
  Search,
  ArrowRight,
  Route as RouteIcon,
  Layers,
  AlertTriangle,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  findPath,
  getNeighborhood,
  getNode,
  getRelations,
  kommunList,
  mostConnected,
  nodeDegree,
  nodeTypeLabel,
  relationEdges,
  relationNodes,
  typeCounts,
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

const allTypes = Object.keys(nodeTypeLabel) as RelationNodeType[];

function RelationerPage() {
  const [selectedId, setSelectedId] = useState("app02");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<RelationNodeType | "alla">("alla");
  const [kommunFilter, setKommunFilter] = useState<string>("alla");
  const [depth, setDepth] = useState<1 | 2>(1);
  const [pathTarget, setPathTarget] = useState<string>("srv-mon-01");

  const selected = getNode(selectedId)!;
  const relations = useMemo(() => getRelations(selectedId), [selectedId]);
  const neighborhood = useMemo(() => getNeighborhood(selectedId, 2), [selectedId]);
  const indirect = neighborhood.filter((n) => n.distance === 2);
  const counts = useMemo(() => typeCounts(), []);
  const top = useMemo(() => mostConnected(5), []);
  const kommuner = useMemo(() => kommunList(), []);
  const path = useMemo(() => findPath(selectedId, pathTarget), [selectedId, pathTarget]);

  const filtered = relationNodes.filter((n) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || n.label.toLowerCase().includes(q) || (n.kommun ?? "").toLowerCase().includes(q);
    const matchT = typeFilter === "alla" || n.type === typeFilter;
    const matchK = kommunFilter === "alla" || n.kommun === kommunFilter;
    return matchQ && matchT && matchK;
  });

  const graphRelations = depth === 1 ? relations : neighborhood.map((n) => ({
    node: n.node,
    label: n.distance === 1 ? (relations.find((r) => r.node.id === n.node.id)?.label ?? "") : "indirekt",
  }));

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        <header className="mb-5">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Överblick
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">Relationer</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Utforska hur servrar, system, databaser, tjänster och integrationer hänger ihop —
            i fokusvy, som helhetskarta eller i tabellform.
          </p>
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-6">
          <StatCard label="Noder" value={relationNodes.length} icon={Layers} />
          <StatCard label="Kopplingar" value={relationEdges.length} icon={Share2} />
          {allTypes.map((t) => (
            <StatCard
              key={t}
              label={nodeTypeLabel[t]}
              value={counts[t]}
              icon={typeIcon[t]}
              onClick={() => setTypeFilter(typeFilter === t ? "alla" : t)}
              active={typeFilter === t}
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök server, system eller kommun…"
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alla">Alla typer</SelectItem>
                  {allTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {nodeTypeLabel[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={kommunFilter} onValueChange={setKommunFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Kommun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alla">Alla kommuner</SelectItem>
                  {kommuner.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="max-h-[420px] space-y-1 overflow-y-auto rounded-xl border border-border/60 bg-card p-2">
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
                    <span
                      className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] ${
                        active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {nodeDegree(node.id)}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">Inga träffar.</p>
              )}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-sm">Mest kopplade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pb-3">
                {top.map(({ node, degree }) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent"
                  >
                    <span className="truncate">{node.label}</span>
                    <span className="ml-auto font-mono text-muted-foreground">{degree}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-5">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="font-display text-lg">{selected.label}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{nodeTypeLabel[selected.type]}</Badge>
                  {selected.kommun && <Badge variant="outline">{selected.kommun}</Badge>}
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
                <Tabs defaultValue="fokus">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <TabsList>
                      <TabsTrigger value="fokus">Fokusvy</TabsTrigger>
                      <TabsTrigger value="karta">Helhetskarta</TabsTrigger>
                      <TabsTrigger value="matris">Matris</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
                      {([1, 2] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDepth(d)}
                          className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                            depth === d
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {d} steg
                        </button>
                      ))}
                    </div>
                  </div>

                  <TabsContent value="fokus">
                    <RelationGraph
                      center={selected}
                      relations={graphRelations}
                      onSelect={setSelectedId}
                    />
                  </TabsContent>

                  <TabsContent value="karta">
                    <FullMap selectedId={selectedId} onSelect={setSelectedId} />
                  </TabsContent>

                  <TabsContent value="matris">
                    <RelationMatrix onSelect={setSelectedId} selectedId={selectedId} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base">
                    Direkta kopplingar ({relations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
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
                  {relations.length === 0 && (
                    <p className="py-4 text-sm text-muted-foreground">Inga kopplingar registrerade.</p>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-5">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-display text-base">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      Påverkan i andra ledet ({indirect.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1.5">
                    {indirect.map(({ node }) => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedId(node.id)}
                        className="rounded-full border border-border/60 px-2.5 py-1 text-xs transition-colors hover:border-primary/50 hover:bg-accent"
                      >
                        {node.label}
                      </button>
                    ))}
                    {indirect.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Inga ytterligare beroenden i andra ledet.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 font-display text-base">
                      <RouteIcon className="h-4 w-4 text-muted-foreground" />
                      Hitta kedja
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={pathTarget} onValueChange={setPathTarget}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Välj målnod" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationNodes.map((n) => (
                          <SelectItem key={n.id} value={n.id}>
                            {n.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {path ? (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        {path.map((step, i) => (
                          <span key={step.node.id} className="flex items-center gap-1.5">
                            {i > 0 && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <ArrowRight className="h-3 w-3" />
                                <span className="italic">{step.label}</span>
                                <ArrowRight className="h-3 w-3" />
                              </span>
                            )}
                            <button
                              onClick={() => setSelectedId(step.node.id)}
                              className="rounded-md bg-secondary px-2 py-1 font-medium text-secondary-foreground hover:bg-accent"
                            >
                              {step.node.label}
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Ingen känd kedja mellan noderna.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  onClick,
  active,
}: {
  label: string;
  value: number;
  icon: typeof Server;
  onClick?: () => void;
  active?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
        active ? "border-primary bg-primary/10" : "border-border/60 bg-card hover:bg-accent/40"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-semibold leading-none">{value}</span>
        <span className="block truncate text-[11px] text-muted-foreground">{label}</span>
      </span>
    </Comp>
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
              strokeDasharray={p.label === "indirekt" ? "2 6" : "4 4"}
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
              <text y={14} textAnchor="middle" className="fill-foreground text-[10px] font-medium">
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

function FullMap({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const width = 1100;
  const colGap = width / (allTypes.length + 1);
  const rowGap = 76;

  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    allTypes.forEach((type, ci) => {
      const nodes = relationNodes.filter((n) => n.type === type);
      nodes.forEach((n, ri) => {
        pos[n.id] = { x: colGap * (ci + 1), y: 90 + ri * rowGap };
      });
    });
    return pos;
  }, [colGap]);

  const maxRows = Math.max(
    ...allTypes.map((t) => relationNodes.filter((n) => n.type === t).length),
  );
  const height = 120 + maxRows * rowGap;

  const neighborIds = new Set(getNeighborhood(selectedId, 1).map((n) => n.node.id));

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 bg-muted/30">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[520px] w-full min-w-[860px]">
        {allTypes.map((t, i) => (
          <text
            key={t}
            x={colGap * (i + 1)}
            y={40}
            textAnchor="middle"
            className="fill-muted-foreground text-[12px] font-semibold uppercase tracking-wider"
          >
            {nodeTypeLabel[t]}
          </text>
        ))}

        {relationEdges.map((e, i) => {
          const a = positions[e.from];
          const b = positions[e.to];
          if (!a || !b) return null;
          const highlight = e.from === selectedId || e.to === selectedId;
          const mx = (a.x + b.x) / 2;
          return (
            <path
              key={`e-${i}`}
              d={`M ${a.x} ${a.y} Q ${mx} ${(a.y + b.y) / 2 - 30} ${b.x} ${b.y}`}
              fill="none"
              className={highlight ? "stroke-primary" : "stroke-border"}
              strokeWidth={highlight ? 2 : 1}
              opacity={highlight ? 0.9 : 0.35}
            />
          );
        })}

        {relationNodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          const isSel = n.id === selectedId;
          const isNb = neighborIds.has(n.id);
          return (
            <g
              key={n.id}
              transform={`translate(${p.x}, ${p.y})`}
              onClick={() => onSelect(n.id)}
              className="cursor-pointer"
            >
              <rect
                x={-78}
                y={-16}
                width={156}
                height={32}
                rx={16}
                className={
                  isSel
                    ? "fill-primary stroke-primary"
                    : isNb
                      ? "fill-card stroke-primary/60"
                      : "fill-card stroke-border"
                }
                strokeWidth={1.5}
                opacity={isSel || isNb ? 1 : 0.75}
              />
              <text
                y={4}
                textAnchor="middle"
                className={`text-[11px] font-medium ${
                  isSel ? "fill-primary-foreground" : "fill-foreground"
                }`}
              >
                {n.label.length > 20 ? `${n.label.slice(0, 19)}…` : n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RelationMatrix({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="max-h-[520px] overflow-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nod</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Kommun</TableHead>
            <TableHead className="text-right">Kopplingar</TableHead>
            <TableHead>Kopplad till</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relationNodes.map((n) => {
            const rels = getRelations(n.id);
            return (
              <TableRow
                key={n.id}
                onClick={() => onSelect(n.id)}
                className={`cursor-pointer ${n.id === selectedId ? "bg-accent/60" : ""}`}
              >
                <TableCell className="font-medium">{n.label}</TableCell>
                <TableCell className="text-muted-foreground">{nodeTypeLabel[n.type]}</TableCell>
                <TableCell className="text-muted-foreground">{n.kommun ?? "—"}</TableCell>
                <TableCell className="text-right font-mono">{rels.length}</TableCell>
                <TableCell className="max-w-[320px] truncate text-xs text-muted-foreground">
                  {rels.map((r) => r.node.label).join(", ") || "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
