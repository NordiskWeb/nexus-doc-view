import { Link, createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, Server, Star, Trash2 } from "lucide-react";

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
import { useFavorites } from "@/hooks/use-favorites";
import { mockDocs } from "@/lib/mock-docs";

export const Route = createFileRoute("/favoriter")({
  head: () => ({
    meta: [
      { title: "Favoriter – Docify dokumentation" },
      {
        name: "description",
        content: "Dina favoritmarkerade support- och driftdokument samlade på ett ställe.",
      },
      { property: "og:title", content: "Favoriter – Docify dokumentation" },
      {
        property: "og:description",
        content: "Dina favoritmarkerade support- och driftdokument samlade på ett ställe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites, remove } = useFavorites();
  const docs = mockDocs.filter((d) => favorites.includes(d.id));

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
                <BreadcrumbPage>Favoriter</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold md:text-4xl">Favoriter</h1>
            <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-amber-500">
              {docs.length} sparade
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Dokument du markerat med stjärna. Ta bort dem när de inte längre är aktuella.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {docs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10">
                <Star className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="font-display text-xl font-semibold">Inga favoriter ännu</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Klicka på stjärnan på ett dokument för att spara det här.
              </p>
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/support">Bläddra i Support</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/drift">Bläddra i Drift</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => (
              <Card key={doc.id} className="group h-full transition-all hover:border-primary/40">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className={
                        doc.type === "drift"
                          ? "border-drift/40 bg-drift/10 text-drift"
                          : "border-support/40 bg-support/10 text-support"
                      }
                    >
                      {doc.type === "drift" ? (
                        <Server className="mr-1 h-3 w-3" />
                      ) : (
                        <LifeBuoy className="mr-1 h-3 w-3" />
                      )}
                      {doc.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ta bort från favoriter"
                      onClick={() => remove(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                  <Link to="/docs/$id" params={{ id: doc.id }} className="flex-1">
                    <h2 className="font-display text-lg font-semibold leading-snug hover:text-primary">
                      {doc.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{doc.excerpt}</p>
                  </Link>
                  <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                    Uppdaterad {doc.updatedAt} · {doc.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
