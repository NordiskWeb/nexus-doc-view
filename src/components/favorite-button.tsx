import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  title?: string;
  className?: string;
  withLabel?: boolean;
  size?: "icon" | "sm";
}

export function FavoriteButton({ id, title, className, withLabel, size = "icon" }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(id);

  return (
    <Button
      type="button"
      variant={withLabel ? "outline" : "ghost"}
      size={withLabel ? "sm" : size}
      aria-pressed={active}
      aria-label={active ? "Ta bort från favoriter" : "Lägg till i favoriter"}
      className={cn(withLabel && "gap-2", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        toast(
          active
            ? `${title ?? "Dokumentet"} borttaget från favoriter`
            : `${title ?? "Dokumentet"} tillagt i favoriter`,
        );
      }}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          active ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
        )}
      />
      {withLabel && (active ? "Favorit" : "Favorisera")}
    </Button>
  );
}
