import { FileX2 } from "lucide-react";
import { recycleBin } from "@/data/portfolio";
import { AppScroll, SectionTitle } from "@/os/ui";

export default function RecycleBinApp() {
  return (
    <AppScroll>
      <SectionTitle>Deleted items ({recycleBin.length})</SectionTitle>
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 font-medium">Name</th>
            <th className="py-2 font-medium">Reason for deletion</th>
          </tr>
        </thead>
        <tbody>
          {recycleBin.map((f) => (
            <tr key={f.name} className="border-b border-border/60 last:border-0 hover:bg-accent/50">
              <td className="flex items-center gap-2 py-2.5">
                <FileX2 className="h-4 w-4 text-muted-foreground" />
                {f.name}
              </td>
              <td className="py-2.5 text-muted-foreground">{f.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-5 text-xs text-muted-foreground">
        Restoring these is not recommended by anyone, including me.
      </p>
    </AppScroll>
  );
}
