import { useState } from "react";
import { GraduationCap, MapPin, Mail, Cpu } from "lucide-react";
import { profile, education, skills } from "@/data/portfolio";
import { AppScroll, Panel, SectionTitle, Chip } from "@/os/ui";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Education", "Focus"] as const;

export default function AboutApp() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const learning = skills.find((s) => s.category === "Currently Learning");

  return (
    <AppScroll>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <img
          src={profile.photo}
          alt={`Portrait of ${profile.name}`}
          loading="lazy"
          className="h-28 w-28 rounded-full border border-border object-cover shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-semibold">Hi, I'm {profile.shortName}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">{profile.title}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {profile.email}
            </span>
          </div>
        </div>
      </div>

      <div role="tablist" className="mt-6 flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-t-md px-3 py-2 text-sm transition-colors",
              tab === t
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-6">
        {tab === "Overview" && (
          <>
            <Panel>
              <SectionTitle>Summary</SectionTitle>
              <p className="text-sm leading-relaxed">{profile.summary}</p>
            </Panel>
            <div className="grid gap-4 sm:grid-cols-2">
              <Panel>
                <SectionTitle>Interests</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <Chip>Backend development</Chip>
                  <Chip>Software testing / QA</Chip>
                  <Chip>IoT & embedded systems</Chip>
                  <Chip>Hardware-software integration</Chip>
                </div>
              </Panel>
              <Panel>
                <SectionTitle>Soft skills</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  <Chip>Problem solving</Chip>
                  <Chip>Adaptability</Chip>
                  <Chip>Team collaboration</Chip>
                  <Chip>Technical communication</Chip>
                </div>
              </Panel>
            </div>
          </>
        )}

        {tab === "Education" &&
          education.map((e) => (
            <Panel key={e.degree}>
              <div className="flex items-start gap-3">
                <GraduationCap className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold">{e.degree}</h3>
                  <p className="text-xs text-muted-foreground">
                    {e.place} · {e.period}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{e.detail}</p>
                </div>
              </div>
            </Panel>
          ))}

        {tab === "Focus" && (
          <>
            <Panel>
              <SectionTitle>Current focus</SectionTitle>
              <p className="text-sm leading-relaxed">
                Backend engineering with Node.js and FastAPI, test automation with Mocha/Chai and
                Postman, and IoT systems built around Raspberry Pi and ESP32 sensor networks.
              </p>
            </Panel>
            <Panel>
              <SectionTitle>Currently learning</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {learning?.items.map((i) => <Chip key={i.name}>{i.name}</Chip>)}
              </div>
            </Panel>
            <Panel>
              <div className="flex items-start gap-3">
                <Cpu className="mt-0.5 h-5 w-5 text-primary" />
                <p className="text-sm leading-relaxed">
                  Career direction: backend / QA engineering roles where software meets real
                  hardware.
                </p>
              </div>
            </Panel>
          </>
        )}
      </div>
    </AppScroll>
  );
}
