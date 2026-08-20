import { Github, Linkedin, Mail, Code2, ExternalLink } from "lucide-react";
import { socials } from "@/data/portfolio";
import { AppScroll, Panel, Placeholder, SectionTitle } from "@/os/ui";

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail, code: Code2 } as const;

export default function SocialsApp() {
  return (
    <AppScroll>
      <SectionTitle>Find me online</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {socials.map((s) => {
          const Icon = ICONS[s.icon as keyof typeof ICONS] ?? ExternalLink;
          const content = (
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{s.label}</p>
                {s.url ? (
                  <p className="truncate text-xs text-muted-foreground">{s.handle}</p>
                ) : (
                  <Placeholder>{s.handle}</Placeholder>
                )}
              </div>
              {s.url && <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />}
            </div>
          );
          return s.url ? (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
            >
              {content}
            </a>
          ) : (
            <Panel key={s.label}>{content}</Panel>
          );
        })}
      </div>
    </AppScroll>
  );
}
