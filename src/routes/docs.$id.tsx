import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Key,
  LifeBuoy,
  Network,
  Server,
  Share2,
  Tag,
  User,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { getDoc, getDocsByType } from "@/lib/mock-docs";

export const Route = createFileRoute("/docs/$id")({
  loader: ({ params }) => {
    const doc = getDoc(params.id);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.doc.title ?? "Dokument"} – Docify` },
      { name: "description", content: loaderData?.doc.excerpt ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="font-display text-3xl">Dokumentet hittades inte</h1>
        <Button asChild className="mt-6">
          <Link to="/">Tillbaka till start</Link>
        </Button>
      </div>
    </AppShell>
  ),
  errorComponent: ({ reset }) => (
    <AppShell>
      <div className="mx-auto max-w-xl py-24 text-center">
        <h1 className="font-display text-3xl">Något gick fel</h1>
        <Button className="mt-6" onClick={reset}>Försök igen</Button>
      </div>
    </AppShell>
  ),
  component: DocPage,
});

const toc = [
  { id: "overview", label: "Översikt" },
  { id: "tech", label: "Teknisk information" },
  { id: "access", label: "Åtkomst & säkerhet" },
  { id: "procedures", label: "Rutiner" },
  { id: "troubleshooting", label: "Felsökning" },
  { id: "related", label: "Relaterade dokument" },
];

function DocPage() {
  const { doc } = Route.useLoaderData();
  const related = getDocsByType(doc.type)
    .filter((d) => d.id !== doc.id)
    .slice(0, 4);

  const isDrift = doc.type === "drift";

  return (
    <AppShell>
      <div className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Översikt</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={isDrift ? "/drift" : "/support"}>
                    {isDrift ? "Driftdokumentation" : "Support"}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[40ch] truncate">{doc.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1fr_240px]">
        {/* Main content */}
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                isDrift
                  ? "bg-drift text-drift-foreground hover:bg-drift"
                  : "bg-support text-support-foreground hover:bg-support"
              }
            >
              {isDrift ? (
                <Server className="mr-1 h-3 w-3" />
              ) : (
                <LifeBuoy className="mr-1 h-3 w-3" />
              )}
              {isDrift ? "Driftdokumentation" : "Support"}
            </Badge>
            <Badge variant="outline">{doc.category}</Badge>
          </div>

          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{doc.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {doc.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Uppdaterad {doc.updatedAt}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Dela
              </Button>
              <Button size="sm" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Redigera
              </Button>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Tech info card for drift */}
          {isDrift && (
            <Card id="tech" className="mb-10 overflow-hidden border-drift/20 bg-drift/[0.04]">
              <CardContent className="p-0">
                <div className="border-b border-drift/15 bg-drift/[0.06] px-6 py-3">
                  <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-drift">
                    <Network className="h-4 w-4" />
                    Teknisk information
                  </h2>
                </div>
                <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-3">
                  <TechField icon={Server} label="Servernamn" value={doc.serverName} mono />
                  <TechField icon={Globe} label="Server IP" value={doc.serverIp} mono />
                  <TechField icon={Key} label="Access" value={doc.access} />
                  <TechField icon={FileText} label="OS Version" value={doc.osVersion} />
                  <TechField icon={User} label="Driftförvaltare" value={doc.driftforvaltare} />
                  <TechField icon={Globe} label="Kommun" value={doc.kommun} />
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Content sections */}
          <section id="overview" className="prose-doc">
            <h2>Översikt</h2>
            <p>
              {doc.excerpt} Denna dokumentation samlar all viktig information om {doc.title}
              {" "}och hur den används i vår drift- och supportmiljö. Sidan uppdateras
              regelbundet av driftteamet för att säkerställa att informationen är aktuell.
            </p>

            <h2 id="procedures">Rutiner</h2>
            <ol>
              <li>Kontrollera att du har rätt behörigheter innan du loggar in.</li>
              <li>Använd alltid jump host eller bastion för fjärranslutning.</li>
              <li>Dokumentera ändringar i ändringsloggen och uppdatera denna sida.</li>
              <li>Notifiera berörda intressenter inför planerat underhåll.</li>
            </ol>

            <h2 id="access">Åtkomst & säkerhet</h2>
            <p>
              Åtkomst hanteras via Active Directory-grupper. Endast personer i gruppen
              <code> OPS-Admins</code> kan logga in med förhöjda rättigheter. All åtkomst
              loggas och granskas månadsvis.
            </p>

            <h2 id="troubleshooting">Felsökning</h2>
            <ul>
              <li>Kontrollera nätverksanslutning och DNS innan något annat.</li>
              <li>Verifiera tjänsternas status med övervakningsverktyget.</li>
              <li>Eskalera till driftförvaltare vid kritiska incidenter.</li>
            </ul>

            <h2>Taggar</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {doc.tags.map((t: string) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {t}
                </Badge>
              ))}
            </div>
          </section>

          {/* Related */}
          <section id="related" className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Relaterade dokument</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/docs/$id"
                  params={{ id: r.id }}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      r.type === "drift"
                        ? "bg-drift/10 text-drift"
                        : "bg-support/10 text-support"
                    }`}
                  >
                    {r.type === "drift" ? (
                      <Server className="h-4 w-4" />
                    ) : (
                      <LifeBuoy className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium group-hover:text-primary">{r.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{r.excerpt}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* TOC sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              På den här sidan
            </p>
            <nav className="space-y-1 border-l border-border">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="-ml-px flex items-center gap-1 border-l border-transparent py-1 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function TechField({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Server;
  label: string;
  value?: string;
  mono?: boolean;
}) {
  return (
    <div className="p-5">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className={`mt-1.5 truncate text-sm font-medium ${mono ? "font-mono" : ""}`}>
        {value ?? "—"}
      </dd>
    </div>
  );
}
