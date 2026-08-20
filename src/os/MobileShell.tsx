import { useState } from "react";
import { ArrowLeft, Wifi, BatteryMedium, Signal } from "lucide-react";
import { APPS, DESKTOP_ORDER, type AppId } from "./apps";
import { profile } from "@/data/portfolio";

export default function MobileShell() {
  const [open, setOpen] = useState<AppId | null>(null);
  const app = open ? APPS[open] : null;
  const Body = app?.component;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-chrome px-4 py-2 text-xs backdrop-blur-xl">
        <span className="font-medium">{app ? app.title : `${profile.userName}'s Portfolio`}</span>
        <span className="ml-auto flex items-center gap-1.5 text-muted-foreground">
          <Signal className="h-3.5 w-3.5" />
          <Wifi className="h-3.5 w-3.5" />
          <BatteryMedium className="h-3.5 w-3.5" />
        </span>
      </header>

      {app && Body ? (
        <>
          <button
            onClick={() => setOpen(null)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to apps
          </button>
          <div className="min-h-0 flex-1">
            <Body />
          </div>
        </>
      ) : (
        <main className="flex-1">
          <section
            className="relative bg-cover bg-center px-5 py-10"
            style={{ backgroundImage: `url(${profile.wallpaper})` }}
          >
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" aria-hidden />
            <div className="relative flex items-center gap-4">
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                loading="lazy"
                className="h-20 w-20 rounded-full border border-border object-cover shadow-sm"
              />
              <div>
                <h1 className="text-lg font-semibold">{profile.name}</h1>
                <p className="text-xs text-muted-foreground">{profile.title}</p>
              </div>
            </div>
            <p className="relative mt-4 text-sm leading-relaxed">{profile.tagline}</p>
          </section>

          <section className="p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Apps
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {DESKTOP_ORDER.map((id) => {
                const a = APPS[id];
                return (
                  <button
                    key={id}
                    onClick={() => setOpen(id)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center transition-colors active:bg-accent"
                  >
                    <a.icon className="h-6 w-6 text-primary" strokeWidth={1.6} />
                    <span className="text-[11px] leading-tight">{a.title}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
