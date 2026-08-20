import { useState } from "react";
import { Mail, Send, MapPin, Phone } from "lucide-react";
import { profile, socials } from "@/data/portfolio";
import { AppScroll, Panel, Placeholder, SectionTitle } from "@/os/ui";

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `From: ${name} (${email})\n\n${message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `Portfolio message from ${name || "a visitor"}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <AppScroll>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <SectionTitle>Reach me</SectionTitle>
          <Panel>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a className="hover:underline" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {profile.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {profile.location}
              </p>
            </div>
          </Panel>
          <Panel>
            <SectionTitle>Profiles</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) =>
                s.url ? (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent"
                  >
                    {s.label}
                  </a>
                ) : (
                  <Placeholder key={s.label}>{s.label}: {s.handle}</Placeholder>
                ),
              )}
            </div>
          </Panel>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <SectionTitle>Send a message</SectionTitle>
          <label className="block text-xs font-medium" htmlFor="c-name">
            Name
          </label>
          <input
            id="c-name"
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label className="block text-xs font-medium" htmlFor="c-email">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="block text-xs font-medium" htmlFor="c-msg">
            Message
          </label>
          <textarea
            id="c-msg"
            rows={5}
            className={field}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Send
          </button>
          <p className="text-xs text-muted-foreground">
            This form has no backend — Send opens your email client with the message pre-filled.
          </p>
        </form>
      </div>
    </AppScroll>
  );
}
