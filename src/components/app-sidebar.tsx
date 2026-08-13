import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Home,
  LifeBuoy,
  Server,
  PlusCircle,
  FileText,
  Settings,
  Star,
  Clock,
  UserPlus,
  Share2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useFavorites } from "@/hooks/use-favorites";

const main = [
  { title: "Översikt", url: "/", icon: Home },
  { title: "Support", url: "/support", icon: LifeBuoy },
  { title: "Driftdokumentation", url: "/drift", icon: Server },
  { title: "Relationer", url: "/relationer", icon: Share2 },
  { title: "Certifikat", url: "/certifikat", icon: ShieldCheck },
  { title: "Skapa ny", url: "/new", icon: PlusCircle },
];


const library = [
  { title: "Senast uppdaterade", url: "/support", icon: Clock },
  { title: "Alla dokument", url: "/support", icon: FileText },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const { favorites } = useFavorites();
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-glow">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold leading-tight">Docify</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Dokumentation
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigera</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Bibliotek</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/favoriter")}>
                  <Link to="/favoriter">
                    <Star />
                    <span>Favoriter</span>
                    {favorites.length > 0 && (
                      <span className="ml-auto rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium group-data-[collapsible=icon]:hidden">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/inbjudningar")}>
                  <Link to="/inbjudningar">
                    <UserPlus />
                    <span>Inbjudna användare</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {library.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Inställningar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
