import { Award } from "lucide-react";
import { achievements } from "@/data/portfolio";
import { AppScroll, SectionTitle } from "@/os/ui";

export default function AchievementsApp() {
  return (
    <AppScroll>
      <SectionTitle>Achievements</SectionTitle>
      <ol className="relative ml-3 border-l border-border pl-6">
        {achievements.map((a) => (
          <li key={a.title} className="mb-6 last:mb-0">
            <span className="absolute -left-[9px] grid h-4.5 w-4.5 place-items-center rounded-full border border-border bg-card">
              <Award className="h-2.5 w-2.5 text-primary" />
            </span>
            <p className="text-xs text-muted-foreground">{a.date}</p>
            <h3 className="mt-0.5 text-sm font-semibold">{a.title}</h3>
            <p className="text-xs text-muted-foreground">{a.org}</p>
            <p className="mt-1.5 text-sm leading-relaxed">{a.description}</p>
          </li>
        ))}
      </ol>
    </AppScroll>
  );
}
