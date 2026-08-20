import { Download, ExternalLink, Printer, FileText } from "lucide-react";
import { resume } from "@/data/portfolio";

function Action({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Download;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-accent"
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

export default function ResumeApp() {
  const open = () => window.open(resume.url, "_blank", "noopener,noreferrer");

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5">
        <FileText className="h-5 w-5 text-primary" />
        <div className="mr-auto">
          <p className="text-sm font-medium leading-tight">{resume.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {resume.fileType} · Updated {resume.updated} · {resume.size}
          </p>
        </div>
        <Action
          icon={Download}
          label="Download"
          onClick={() => {
            const a = document.createElement("a");
            a.href = resume.url;
            a.download = resume.fileName;
            a.click();
          }}
        />
        <Action icon={ExternalLink} label="Open in new tab" onClick={open} />
        <Action icon={Printer} label="Print" onClick={open} />
      </div>
      <object
        data={resume.url}
        type="application/pdf"
        className="min-h-0 flex-1 bg-muted"
        aria-label="Resume preview"
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Inline PDF preview isn't supported in this browser.
          </p>
          <Action icon={ExternalLink} label="Open resume" onClick={open} />
        </div>
      </object>
    </div>
  );
}
