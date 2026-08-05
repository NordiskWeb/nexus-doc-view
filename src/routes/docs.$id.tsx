import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  Calendar,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Key,
  LifeBuoy,
  Network,
  Printer,
  Server,
  Share2,
  ShieldCheck,
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
import { getDocSections, type DetailBlock, type KeyValue } from "@/lib/mock-doc-detail";
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
      { name: "description", content: loaderData?.doc.excerpt ?? "Dokumentation för drift och support." },
      { property: "og:title", content: `${loaderData?.doc.title ?? "Dokument"} – Docify` },
      { property: "og:description", content: loaderData?.doc.excerpt ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(loaderData ? [] : [{ name: "robots", content: "noindex" } as const]),
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

function DocPage() {
  const { doc } = Route.useLoaderData();
  const sections = getDocSections(doc);
  const related = getDocsByType(doc.type)
    .filter((d) => d.id !== doc.id)
    .slice(0, 4);

  const isDrift = doc.type === "drift";
  const toc = [
    ...(isDrift ? [{ id: "tech", label: "Teknisk information" }] : []),
    ...sections.map((s) => ({ id: s.id, label: s.label })),
    { id: "related", label: "Relaterade dokument" },
  ];

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
        <article className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                isDrift
                  ? "bg-drift text-drift-foreground hover:bg-drift"
                  : "bg-support text-support-foreground hover:bg-support"
              }
            >
              {isDrift ? <Server className="mr-1 h-3 w-3" /> : <LifeBuoy className="mr-1 h-3 w-3" />}
              {isDrift ? "Driftdokumentation" : "Support"}
            </Badge>
            <Badge variant="outline">{doc.category}</Badge>
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              {isDrift ? "Verksamhetskritisk" : "Intern"}
            </Badge>
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
                <Printer className="h-4 w-4" />
                Skriv ut
              </Button>
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

          {isDrift && (
            <Card id="tech" className="mb-12 scroll-mt-24 overflow-hidden border-drift/20 bg-drift/[0.04]">
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

          <div className="space-y-14">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-semibold tracking-tight">{section.label}</h2>
                <div className="mt-5 space-y-6">
                  {section.blocks.map((block, i) => (
                    <Block key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-14">
            <h2 className="font-display text-2xl font-semibold">Taggar</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {doc.tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {t}
                </Badge>
              ))}
            </div>
          </section>

          <section id="related" className="mt-14 scroll-mt-24">
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
                      r.type === "drift" ? "bg-drift/10 text-drift" : "bg-support/10 text-support"
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
                  className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 rounded-xl border border-border bg-card/60 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dokumentinfo
              </p>
              <dl className="mt-3 space-y-2">
                <SideField label="Typ" value={isDrift ? "Driftdokument" : "Supportartikel"} />
                <SideField label="Kategori" value={doc.category} />
                <SideField label="Ansvarig" value={doc.driftforvaltare ?? doc.author} />
                <SideField label="Uppdaterad" value={doc.updatedAt} />
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Block({ block }: { block: DetailBlock }) {
  return (
    <div>
      {block.heading && (
        <h3 className="mb-3 font-display text-base font-semibold uppercase tracking-wider text-muted-foreground">
          {block.heading}
        </h3>
      )}

      {block.kind === "text" && block.text && (
        <p className="max-w-3xl leading-relaxed text-foreground/85">{block.text}</p>
      )}

      {block.kind === "list" && block.list && (
        <ul className="max-w-3xl space-y-2">
          {block.list.map((li, i) => (
            <li key={i} className="flex gap-3 text-foreground/85">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {li}
            </li>
          ))}
        </ul>
      )}

      {block.kind === "fields" && block.fields && <FieldGrid fields={block.fields} />}

      {block.kind === "items" && block.items && (
        <div className="grid gap-3 md:grid-cols-2">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{item.title}</p>
                {item.subtitle && (
                  <Badge variant="outline" className="text-[11px]">
                    {item.subtitle}
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              {item.fields && (
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
                  {item.fields.map((f) => (
                    <div key={f.label}>
                      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {f.label}
                      </dt>
                      <dd className={`truncate text-sm ${f.mono ? "font-mono" : ""}`}>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldGrid({ fields }: { fields: KeyValue[] }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 md:grid-cols-3">
      {fields.map((f) => (
        <div key={f.label} className="bg-card p-4">
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
          <dd className={`mt-1.5 text-sm font-medium ${f.mono ? "font-mono" : ""}`}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function SideField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-right text-xs font-medium">{value}</dd>
    </div>
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
