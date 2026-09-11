import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

type Toast = { id: number; title: string; body: string };

const QUEUE: Omit<Toast, "id">[] = [
  { title: "Welcome to Dev's Desktop", body: "Double-click an icon to open an app." },
  { title: "Tip: Try the Terminal", body: "Type 'help' — there may be a secret command." },
  { title: "Did you know?", body: "Press Ctrl + K to search the whole portfolio." },
  { title: "Resume available", body: "Open the Resume app to view or download it." },
];

export default function Notifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (delay: number) => {
      timers.push(
        setTimeout(() => {
          const item = QUEUE[i++];
          if (!item) return;
          const id = Date.now() + i;
          setToasts((t) => [...t, { ...item, id }]);
          timers.push(setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 7000));
          if (i < QUEUE.length) schedule(45000);
        }, delay),
      );
    };
    schedule(2500);
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      aria-live="polite"
      style={{ bottom: "calc(var(--taskbar-height, 56px) + 24px)" }}
      className="pointer-events-none fixed right-4 z-9997 flex w-80 flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast pointer-events-auto rounded-lg p-3.5 mica-strong shadow-flyout"
        >
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-4 w-4 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{t.title}</p>
              <p className="text-xs text-muted-foreground">{t.body}</p>
            </div>
            <button
              onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
              aria-label="Dismiss notification"
              className="ml-auto rounded p-1 hover:bg-accent"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
