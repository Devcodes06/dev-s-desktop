import { Moon, Sun, Clock } from "lucide-react";
import { useSettings } from "@/os/settings";
import { profile } from "@/data/portfolio";
import { AppScroll, Panel, SectionTitle } from "@/os/ui";
import { cn } from "@/lib/utils";

export default function PersonalizeApp() {
  const { theme, setTheme, clock24, setClock24 } = useSettings();

  const toggle = "rounded-md border border-border px-3 py-1.5 text-sm transition-colors";

  return (
    <AppScroll>
      <SectionTitle>Personalization</SectionTitle>
      <Panel className="mb-4">
        <p className="mb-3 text-sm font-medium">Appearance</p>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={cn(toggle, theme === "light" && "bg-accent font-medium")}
          >
            <Sun className="mr-1.5 inline h-4 w-4" /> Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(toggle, theme === "dark" && "bg-accent font-medium")}
          >
            <Moon className="mr-1.5 inline h-4 w-4" /> Dark
          </button>
        </div>
      </Panel>

      <Panel className="mb-4">
        <p className="mb-3 text-sm font-medium">
          <Clock className="mr-1.5 inline h-4 w-4" /> Clock format
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setClock24(false)}
            className={cn(toggle, !clock24 && "bg-accent font-medium")}
          >
            12-hour
          </button>
          <button
            onClick={() => setClock24(true)}
            className={cn(toggle, clock24 && "bg-accent font-medium")}
          >
            24-hour
          </button>
        </div>
      </Panel>

      <Panel>
        <p className="mb-3 text-sm font-medium">Wallpaper</p>
        <img
          src={profile.wallpaper}
          alt="Current desktop wallpaper"
          loading="lazy"
          className="w-full max-w-sm rounded-md border border-border object-cover"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Replace the wallpaper by swapping the asset referenced in{" "}
          <code className="rounded bg-muted px-1">src/data/portfolio.ts</code>.
        </p>
      </Panel>
    </AppScroll>
  );
}
