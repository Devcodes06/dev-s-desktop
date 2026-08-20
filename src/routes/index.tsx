import { createFileRoute } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import { WindowProvider } from "@/os/store";
import { SettingsProvider } from "@/os/settings";
import Desktop from "@/os/Desktop";
import MobileShell from "@/os/MobileShell";
import { profile } from "@/data/portfolio";

const title = `${profile.name} — Developer Desktop Portfolio`;
const description =
  "Explore Debargha Chowdhury's portfolio as a Windows 11-inspired desktop: projects, resume, IoT work, tech stack and contact details.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const isMobile = useIsMobile();

  return (
    <SettingsProvider>
      <WindowProvider>
        <h1 className="sr-only">
          {profile.name} — {profile.title}
        </h1>
        {isMobile ? <MobileShell /> : <Desktop />}
      </WindowProvider>
    </SettingsProvider>
  );
}
