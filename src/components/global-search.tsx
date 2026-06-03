import { useNavigate } from "@tanstack/react-router";
import { LifeBuoy, Search, Server } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { mockDocs } from "@/lib/mock-docs";

interface Props {
  size?: "default" | "hero";
  placeholder?: string;
}

export function GlobalSearch({ size = "default", placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const support = useMemo(
    () => mockDocs.filter((d) => d.type === "support"),
    [],
  );
  const drift = useMemo(
    () => mockDocs.filter((d) => d.type === "drift"),
    [],
  );

  const go = (id: string) => {
    setOpen(false);
    navigate({ to: "/docs/$id", params: { id } });
  };

  const isHero = size === "hero";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          isHero
            ? "group relative flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-surface-elevated/80 px-5 py-4 text-left text-base shadow-elegant backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-glow"
            : "group flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        }
      >
        <Search
          className={
            isHero
              ? "h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary"
              : "h-4 w-4"
          }
        />
        <span className={isHero ? "flex-1 text-muted-foreground" : "flex-1"}>
          {placeholder ?? "Sök i all dokumentation..."}
        </span>
        <kbd
          className={
            isHero
              ? "hidden items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground sm:inline-flex"
              : "ml-auto hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex"
          }
        >
          <span>⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Sök i Support och Driftdokumentation..."
        />
        <CommandList>
          <CommandEmpty>Inga resultat hittades.</CommandEmpty>
          <CommandGroup heading="Support">
            {support.map((d) => (
              <CommandItem key={d.id} value={`${d.title} ${d.tags.join(" ")}`} onSelect={() => go(d.id)}>
                <LifeBuoy className="text-support" />
                <div className="flex flex-col">
                  <span>{d.title}</span>
                  <span className="text-xs text-muted-foreground">{d.category}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Driftdokumentation">
            {drift.map((d) => (
              <CommandItem key={d.id} value={`${d.title} ${d.serverIp} ${d.kommun}`} onSelect={() => go(d.id)}>
                <Server className="text-drift" />
                <div className="flex flex-col">
                  <span>{d.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {d.serverIp} · {d.kommun}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
