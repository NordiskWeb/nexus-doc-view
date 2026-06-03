import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, FileText, LifeBuoy, Save, Send, Server, Tag, X } from "lucide-react";
import { useState } from "react";

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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "Skapa nytt dokument – Docify" },
      { name: "description", content: "Skapa ny support- eller driftdokumentation." },
    ],
  }),
  component: NewDoc,
});

function NewDoc() {
  const [type, setType] = useState<"support" | "drift">("drift");
  const [tags, setTags] = useState<string[]>(["produktion", "kritisk"]);
  const [tagInput, setTagInput] = useState("");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <AppShell>
      <div className="border-b border-border/60 bg-surface/40">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Översikt</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Skapa nytt dokument</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold md:text-4xl">
                Skapa nytt dokument
              </h1>
              <p className="mt-2 text-muted-foreground">
                Fyll i informationen nedan. Du kan spara som utkast och publicera senare.
              </p>
            </div>
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Avbryt
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        {/* Type selector */}
        <div className="grid gap-3 md:grid-cols-2">
          <TypeCard
            active={type === "support"}
            onClick={() => setType("support")}
            icon={LifeBuoy}
            tone="support"
            title="Supportdokumentation"
            description="Guider, rutiner och felsökning för support."
          />
          <TypeCard
            active={type === "drift"}
            onClick={() => setType("drift")}
            icon={Server}
            tone="drift"
            title="Driftdokumentation"
            description="Servrar, infrastruktur och driftansvar."
          />
        </div>

        <Card className="mt-8">
          <CardContent className="space-y-8 p-6 md:p-8">
            {/* Basic */}
            <Section title="Grundinformation" description="Titel och kort beskrivning.">
              <Field label="Titel" required>
                <Input placeholder="t.ex. SRV-APP-PROD-05 eller VPN-åtkomst för konsulter" />
              </Field>
              <Field label="Kort beskrivning">
                <Textarea
                  rows={2}
                  placeholder="En mening som beskriver vad dokumentet handlar om..."
                />
              </Field>
            </Section>

            {type === "drift" && (
              <>
                <Separator />
                <Section
                  title="Teknisk information"
                  description="Identifiering, nätverk och OS för servern."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Servernamn">
                      <Input placeholder="SRV-APP-PROD-05" className="font-mono" />
                    </Field>
                    <Field label="Server IP">
                      <Input placeholder="10.42.18.42" className="font-mono" />
                    </Field>
                    <Field label="Access">
                      <Input placeholder="RDP via bastion / SSH (key)" />
                    </Field>
                    <Field label="OS Version">
                      <Input placeholder="Windows Server 2022" />
                    </Field>
                    <Field label="Kommun">
                      <Input placeholder="Uppsala" />
                    </Field>
                    <Field label="Driftförvaltare">
                      <Input placeholder="För- och efternamn" />
                    </Field>
                  </div>
                </Section>
              </>
            )}

            <Separator />

            <Section title="Innehåll" description="Skriv huvudinnehållet i markdown.">
              <Textarea
                rows={12}
                className="font-mono text-sm"
                placeholder={`# Översikt

Beskriv syftet med denna server eller guide.

## Rutiner
- Steg 1
- Steg 2

## Felsökning
...`}
              />
            </Section>

            <Separator />

            <Section title="Taggar & kategorier" description="Hjälper andra hitta dokumentet.">
              <Field label="Kategori">
                <Input placeholder="Applikationsserver / Onboarding / Backup..." />
              </Field>
              <Field label="Taggar">
                <div className="rounded-md border border-input bg-background p-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {t}
                        <button
                          type="button"
                          onClick={() => setTags(tags.filter((x) => x !== t))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder="Lägg till tagg och tryck Enter"
                      className="flex-1 min-w-[180px] bg-transparent px-2 py-1 text-sm outline-none"
                    />
                  </div>
                </div>
              </Field>
            </Section>
          </CardContent>
        </Card>

        {/* Sticky action bar */}
        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-end gap-2 rounded-xl border border-border bg-card/95 p-3 shadow-elegant backdrop-blur">
          <p className="mr-auto text-xs text-muted-foreground">
            <FileText className="mr-1 inline h-3.5 w-3.5" />
            Senast sparad: aldrig
          </p>
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Spara som utkast
          </Button>
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Publicera
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function TypeCard({
  active,
  onClick,
  icon: Icon,
  tone,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Server;
  tone: "support" | "drift";
  title: string;
  description: string;
}) {
  const accent =
    tone === "support"
      ? "bg-support text-support-foreground"
      : "bg-drift text-drift-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-all ${
        active
          ? "border-primary bg-accent/40 shadow-elegant"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div
        className={`mt-1 h-4 w-4 rounded-full border-2 transition-all ${
          active ? "border-primary bg-primary" : "border-border"
        }`}
      />
    </button>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-8">
      <div>
        <h3 className="font-display font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
