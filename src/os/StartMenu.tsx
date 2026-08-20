import { useState } from "react";
import { Power, Settings, Search } from "lucide-react";
import { APPS, type AppId } from "./apps";
import { useWindows } from "./store";
import { profile } from "@/data/portfolio";

const PINNED: AppId[] = ["mypc", "terminal", "techstack", "socials", "games", "paint"];
const RECOMMENDED: AppId[] = ["resume", "projects", "about", "contact"];

export default function StartMenu({
  onClose,
  onSearch,
  onRestart,
}: {
  onClose: () => void;
  onSearch: () => void;
  onRestart: () => void;
}) {
  const { openApp } = useWindows();
  const [q, setQ] = useState("");

  const launch = (id: AppId) => {
    openApp(id);
    onClose();
  };

  const filtered = (list: AppId[]) =>
    list.filter((id) => APPS[id].title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div
      role="dialog"
      aria-label="Start menu"
      className="animate-flyout fixed bottom-16 left-1/2 z-9998 w-[min(620px,92vw)] -translate-x-1/2 rounded-xl p-5 mica-strong shadow-flyout"
    >
      <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search apps"
          aria-label="Search apps"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Pinned
      </p>
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
        {filtered(PINNED).map((id) => {
          const app = APPS[id];
          return (
            <button
              key={id}
              onClick={() => launch(id)}
              className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center transition-colors hover:bg-accent"
            >
              <app.icon className="h-6 w-6 text-primary" strokeWidth={1.6} />
              <span className="text-[11px] leading-tight">{app.title}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Recommended
      </p>
      <div className="grid gap-1 sm:grid-cols-2">
        {filtered(RECOMMENDED).map((id) => {
          const app = APPS[id];
          return (
            <button
              key={id}
              onClick={() => launch(id)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent"
            >
              <app.icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
              <span className="text-sm">{app.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center border-t border-border pt-3">
        <button
          onClick={() => launch("about")}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        >
          <img
            src={profile.photo}
            alt=""
            loading="lazy"
            className="h-7 w-7 rounded-full object-cover"
          />
          {profile.userName}
        </button>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => launch("personalize")}
            aria-label="Settings"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-accent"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => {
              onClose();
              onRestart();
            }}
            aria-label="Restart portfolio"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-accent"
          >
            <Power className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
      <button
        onClick={() => {
          onClose();
          onSearch();
        }}
        className="mt-2 text-xs text-muted-foreground hover:underline"
      >
        Search the whole portfolio (Ctrl + K)
      </button>
    </div>
  );
}
