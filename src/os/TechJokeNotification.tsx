import { useEffect, useRef, useState } from "react";

const JOKES = [
  "Wait — who pushed .env to the repo? (it was me. yesterday.)",
  "It works on my machine. Shipping my machine.",
  "One more console.log and it'll be fixed. That was 47 console.logs ago.",
  "The bug is fixed. I have no idea why. Deploying.",
  "I'll write tests later. (narrator: he did not write tests later.)",
  "npm install... 847 packages added, 3 vulnerabilities, 1 existential crisis.",
  "Just a quick 5-minute fix. — sent 3 hours ago.",
  "Closes laptop. Opens laptop. Bug is gone. Does not question it.",
  "The docs say it's straightforward. The docs lied.",
  "git commit -m 'final fix'   git commit -m 'actual final fix'   git commit -m 'ok THIS is the last one i promise'",
  "Oh it's a CSS issue. I'm going home.",
  "Stack Overflow is down. I have forgotten how to code.",
  "99 bugs in the code, fix one, push it up — 127 bugs in the code.",
  "Interviewer: explain recursion. Me: see 'explain recursion'.",
];

function shuffle(arr: string[]): string[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function TechJokeNotification() {
  const [visible, setVisible] = useState(false);
  const [joke, setJoke] = useState("");
  const queueRef = useRef<string[]>(shuffle(JOKES));
  const indexRef = useRef(0);

  useEffect(() => {
    function getNextJoke(): string {
      if (indexRef.current >= queueRef.current.length) {
        queueRef.current = shuffle(JOKES);
        indexRef.current = 0;
      }
      return queueRef.current[indexRef.current++] ?? "";
    }

    const timerRef = { current: 0 as unknown as ReturnType<typeof setTimeout> };

    function scheduleNext() {
      // Fires every 2–5 minutes at random
      const delay = Math.floor(Math.random() * (300000 - 120000 + 1)) + 120000;
      timerRef.current = setTimeout(() => {
        setJoke(getNextJoke());
        setVisible(true);
        // Auto-dismiss after 6 seconds
        setTimeout(() => setVisible(false), 6000);
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => clearTimeout(timerRef.current);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "72px",   // sits just above the taskbar (--taskbar-height is 56px + 16px gap)
        right: "16px",
        zIndex: 99999,
        maxWidth: "320px",
      }}
      className="bg-card border border-border shadow-lg rounded-xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2"
    >
      <span className="text-xl select-none">💻</span>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Dev Humor
        </span>
        <span className="text-sm text-foreground leading-snug break-words">{joke}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-muted-foreground hover:text-foreground text-xs leading-none self-start shrink-0"
        aria-label="Dismiss joke"
      >
        ✕
      </button>
    </div>
  );
}
