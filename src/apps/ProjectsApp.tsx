import { useState } from "react";
import { Folder, Github, Globe, ArrowLeft, CalendarDays, BadgeCheck } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { AppScroll, Panel, SectionTitle, Chip, Placeholder } from "@/os/ui";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <AppScroll>
      <h1 className="text-xl font-semibold">{project.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" /> {project.year}
        </span>
        <span className="inline-flex items-center gap-1">
          <BadgeCheck className="h-3.5 w-3.5" /> {project.status}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <Panel>
          <SectionTitle>Problem</SectionTitle>
          <p className="text-sm leading-relaxed">{project.problem}</p>
        </Panel>
        <Panel>
          <SectionTitle>Solution</SectionTitle>
          <p className="text-sm leading-relaxed">{project.solution}</p>
        </Panel>
        <Panel>
          <SectionTitle>My contribution</SectionTitle>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
            {project.contribution.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Panel>
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel>
            <SectionTitle>Technologies</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </Panel>
          <Panel>
            <SectionTitle>Features</SectionTitle>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {project.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel>
          {project.screenshots?.length ? (
            <div className="grid gap-3">
              {project.screenshots.map((s) => (
                <figure key={s.src} className="overflow-hidden rounded-lg border border-border">
                  <img
                    src={s.src}
                    alt={`${project.name} screenshot`}
                    loading="lazy"
                    className="w-full"
                  />
                  <figcaption className="border-t border-border bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : project.screenshot ? (
            <img src={project.screenshot} alt={`${project.name} screenshot`} className="w-full rounded-md" />
          ) : (
            <Placeholder>[ADD PROJECT SCREENSHOTS]</Placeholder>
          )}
        </Panel>
        <div className="flex flex-wrap gap-2 pb-2">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          ) : (
            <Placeholder>[ADD GITHUB LINK]</Placeholder>
          )}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Globe className="h-4 w-4" /> View Live Project
            </a>
          ) : (
            <Placeholder>[ADD LIVE DEMO LINK]</Placeholder>
          )}
        </div>
      </div>
    </AppScroll>
  );
}

export default function ProjectsApp({ payload }: { payload?: unknown }) {
  const initial = typeof payload === "string" ? payload : null;
  const [selected, setSelected] = useState<string | null>(initial);
  const project = projects.find((p) => p.id === selected);

  if (project) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-3 py-2">
          <button
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <ProjectDetail project={project} />
        </div>
      </div>
    );
  }

  return (
    <AppScroll>
      <SectionTitle>Projects ({projects.length})</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Panel key={p.id} onClick={() => setSelected(p.id)} className="group">
            <div className="flex items-start gap-3">
              <Folder className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="text-sm font-semibold leading-snug">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.short}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </AppScroll>
  );
}
