import { useState } from "react";
import {
  ChevronRight,
  Folder,
  FileText,
  HardDrive,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import { useWindows } from "@/os/store";
import type { AppId } from "@/os/apps";
import { projects } from "@/data/portfolio";
import { Panel } from "@/os/ui";

type Entry = {
  name: string;
  kind: "folder" | "file";
  target?: { app: AppId; payload?: unknown; title?: string };
  children?: Entry[];
};

const DRIVE: Entry[] = [
  { name: "about", kind: "folder", target: { app: "about" } },
  {
    name: "projects",
    kind: "folder",
    children: projects.map((p) => ({
      name: `${p.id}`,
      kind: "folder" as const,
      target: { app: "projects" as AppId, payload: p.id, title: p.name },
    })),
  },
  { name: "resume", kind: "folder", target: { app: "resume" } },
  { name: "skills", kind: "folder", target: { app: "techstack" } },
  { name: "education", kind: "folder", target: { app: "about" } },
  { name: "achievements", kind: "folder", target: { app: "achievements" } },
  { name: "contact", kind: "folder", target: { app: "contact" } },
  { name: "socials", kind: "folder", target: { app: "socials" } },
];

const QUICK: Entry[] = [
  { name: "Resume.pdf", kind: "file", target: { app: "resume" } },
  { name: "Projects", kind: "folder", target: { app: "projects" } },
  { name: "Certifications", kind: "folder", target: { app: "achievements" } },
  { name: "Achievements", kind: "folder", target: { app: "achievements" } },
  { name: "Education", kind: "folder", target: { app: "about" } },
  { name: "About Me", kind: "folder", target: { app: "about" } },
];

export default function MyPCApp() {
  const { openApp } = useWindows();
  const [path, setPath] = useState<string[]>([]);

  const listing = path.reduce<Entry[]>((acc, seg) => {
    const found = acc.find((e) => e.name === seg);
    return found?.children ?? acc;
  }, DRIVE);

  const activate = (e: Entry) => {
    if (e.children) setPath((p) => [...p, e.name]);
    else if (e.target) openApp(e.target.app, e.target.payload, e.target.title);
  };

  const inDrive = path.length > 0 || path.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-2 text-sm">
        <button
          onClick={() => setPath((p) => p.slice(0, -1))}
          disabled={path.length === 0}
          className="rounded-md p-1 hover:bg-accent disabled:opacity-40"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <nav className="flex items-center gap-1 text-muted-foreground">
          <button onClick={() => setPath([])} className="rounded px-1.5 py-0.5 hover:bg-accent">
            This PC
          </button>
          {path.map((p, idx) => (
            <span key={p} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              <button
                onClick={() => setPath((cur) => cur.slice(0, idx + 1))}
                className="rounded px-1.5 py-0.5 hover:bg-accent"
              >
                {p}
              </button>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="scroll-thin w-52 shrink-0 overflow-y-auto border-r border-border bg-secondary/40 p-2">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick access
          </p>
          {QUICK.map((q) => (
            <button
              key={q.name}
              onDoubleClick={() => activate(q)}
              onClick={() => activate(q)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
            >
              {q.kind === "file" ? (
                <FileText className="h-4 w-4 text-primary" />
              ) : (
                <Folder className="h-4 w-4 text-primary" />
              )}
              {q.name}
            </button>
          ))}
        </aside>

        <div className="scroll-thin min-w-0 flex-1 overflow-y-auto p-4">
          {path.length === 0 && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Devices and drives
              </p>
              <Panel className="mb-5 max-w-sm">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-8 w-8 text-primary" />
                  <div className="w-full">
                    <p className="text-sm font-medium">Developer Drive (C:)</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/4 rounded-full bg-primary" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Mostly node_modules, honestly
                    </p>
                  </div>
                </div>
              </Panel>
            </>
          )}
          {inDrive && (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {path.length ? path[path.length - 1] : "Developer Drive (C:)"}
              </p>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
                {listing.map((e) => (
                  <button
                    key={e.name}
                    onDoubleClick={() => activate(e)}
                    onClick={() => activate(e)}
                    className="flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors hover:bg-accent focus-visible:bg-accent"
                  >
                    {e.kind === "file" ? (
                      <FileText className="h-8 w-8 text-primary" />
                    ) : (
                      <Folder className="h-8 w-8 text-primary" />
                    )}
                    <span className="line-clamp-2 text-xs">{e.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {path.length === 0 && (
            <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Monitor className="h-3.5 w-3.5" /> Double-click a folder to explore.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
