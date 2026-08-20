import { useEffect, useRef, useState } from "react";
import { useWindows } from "@/os/store";
import { profile, projects, skills, socials } from "@/data/portfolio";

type Line = { text: string; tone?: "cmd" | "err" | "ok" };

const PROMPT = "C:\\Users\\Dev>";

export default function TerminalApp() {
  const { openApp } = useWindows();
  const [lines, setLines] = useState<Line[]>([
    { text: `${profile.name} — Portfolio Terminal [Version 1.0.0]` },
    { text: "Type 'help' to see available commands." },
    { text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const push = (...out: (string | Line)[]) =>
    setLines((l) => [...l, ...out.map((o) => (typeof o === "string" ? { text: o } : o))]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push({ text: `${PROMPT} ${raw}`, tone: "cmd" });
    if (!cmd) return;
    setHistory((h) => [raw, ...h]);

    switch (cmd) {
      case "help":
        push(
          "Available commands:",
          "about:\u00a0 \u00a0 \u00a0 \u00a0open the About Me app",
          "skills:\u00a0 \u00a0 \u00a0 list technologies",
          "projects:\u00a0 \u00a0 list projects",
          "resume:\u00a0 \u00a0 \u00a0 open the resume viewer",
          "contact:\u00a0 \u00a0 \u00a0open contact details",
          "socials:\u00a0 \u00a0 \u00a0list social profiles",
          "whoami:\u00a0 \u00a0 \u00a0 short bio",
          "github:\u00a0 \u00a0 \u00a0 open GitHub profile",
          "clear:\u00a0 \u00a0 \u00a0 \u00a0clear the terminal",
          "",
        );
        break;
      case "about":
        push(profile.summary, "");
        openApp("about");
        break;
      case "whoami":
        push(profile.shortName, profile.title, "IoT / Backend / Software Testing", "");
        break;
      case "skills":
        skills.forEach((s) => push(`${s.category}: ${s.items.map((i) => i.name).join(", ")}`));
        push("");
        break;
      case "projects":
        push("Available projects:");
        projects.forEach((p) => push(`  - ${p.name} (${p.year})`));
        push("", "Opening Projects...");
        openApp("projects");
        break;
      case "resume":
        push("Opening resume viewer...", "");
        openApp("resume");
        break;
      case "contact":
        push(`Email: ${profile.email}`, `Phone: ${profile.phone}`, "");
        openApp("contact");
        break;
      case "socials":
        socials.forEach((s) => push(`  ${s.label}: ${s.url || s.handle}`));
        push("");
        openApp("socials");
        break;
      case "github": {
        const gh = socials.find((s) => s.label === "GitHub");
        if (gh?.url) window.open(gh.url, "_blank", "noopener,noreferrer");
        else push("[ADD GITHUB LINK] — not configured yet.", "");
        break;
      }
      case "clear":
        setLines([]);
        break;
      case "sudo hire-dev":
        push(
          { text: "Checking credentials..." },
          { text: "Verifying caffeine levels... OK" },
          { text: "Access granted.", tone: "ok" },
          { text: "Good decision.", tone: "ok" },
          { text: "" },
        );
        break;
      case "sudo":
        push({ text: "Nice try. Permission denied (but respect).", tone: "err" }, "");
        break;
      case "coffee":
        push("Brewing... ☕ error: coffee machine not found on this host.", "");
        break;
      case "exit":
        push("You can just close the window, you know.", "");
        break;
      default:
        push({ text: `'${raw}' is not recognized as a command.`, tone: "err" }, "");
    }
  };

  return (
    <div
      className="scroll-thin h-full overflow-y-auto bg-terminal p-4 font-mono text-[13px] leading-relaxed text-terminal-foreground"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          className={
            l.tone === "err"
              ? "text-destructive"
              : l.tone === "cmd"
                ? "opacity-70"
                : l.tone === "ok"
                  ? "font-semibold"
                  : ""
          }
        >
          {l.text || "\u00a0"}
        </div>
      ))}
      <div className="flex items-center gap-2">
        <span className="shrink-0 opacity-80">{PROMPT}</span>
        <input
          ref={inputRef}
          aria-label="Terminal input"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(input);
              setInput("");
              setHIdx(-1);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.min(hIdx + 1, history.length - 1);
              if (n >= 0) {
                setHIdx(n);
                setInput(history[n] ?? "");
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.max(hIdx - 1, -1);
              setHIdx(n);
              setInput(n === -1 ? "" : (history[n] ?? ""));
            }
          }}
          className="w-full bg-transparent outline-none"
          spellCheck={false}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
