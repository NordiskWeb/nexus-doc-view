import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, PlusCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
          <SidebarTrigger />
          <div className="hidden flex-1 md:block">
            <GlobalSearch />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm" className="hidden gap-2 sm:inline-flex">
              <Link to="/new">
                <PlusCircle className="h-4 w-4" />
                Nytt dokument
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifieringar">
              <Bell className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-glow ring-2 ring-border" />
          </div>
        </header>
        <div className="md:hidden border-b border-border/60 px-4 py-3">
          <GlobalSearch />
        </div>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
