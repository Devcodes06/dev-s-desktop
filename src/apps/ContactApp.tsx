import { useState } from "react";
import { Mail, Send, MapPin, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { profile, socials } from "@/data/portfolio";
import { AppScroll, Panel, Placeholder, SectionTitle } from "@/os/ui";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const ACCESS_KEY =
  (import.meta.env["VITE_WEB3FORMS_KEY"] as string | undefined) ||
  "8e1f5cce-d07f-4209-a8bd-a3633410ffda";

type FormErrors = {
  name?: string | undefined;
  email?: string | undefined;
  message?: string | undefined;
};

export default function ContactApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const validate = () => {
    const errs: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    if (!validate()) {
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus("success");
        setStatusMessage("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setErrors({});
      } else {
        setStatus("error");
        setStatusMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch {
      setStatus("error");
      setStatusMessage("Failed to send message. Please check your connection and try again.");
    }
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

        <form onSubmit={submit} noValidate className="space-y-3">
          <SectionTitle>Send a message</SectionTitle>
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="c-name">
              Name
            </label>
            <input
              id="c-name"
              className={field}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                if (status !== "idle" && status !== "sending") setStatus("idle");
              }}
              required
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="c-email">
              Email
            </label>
            <input
              id="c-email"
              type="email"
              className={field}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (status !== "idle" && status !== "sending") setStatus("idle");
              }}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="c-msg">
              Message
            </label>
            <textarea
              id="c-msg"
              rows={5}
              className={field}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                if (status !== "idle" && status !== "sending") setStatus("idle");
              }}
              required
            />
            {errors.message && (
              <p className="mt-1 text-xs text-destructive">{errors.message}</p>
            )}
          </div>

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {status === "sending" ? "Sending..." : "Send"}
          </button>
          <p className="text-xs text-muted-foreground">
            Your message is sent directly to my inbox.
          </p>
        </form>
      </div>
    </AppScroll>
  );
}
