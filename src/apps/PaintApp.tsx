import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { gallery } from "@/data/portfolio";

export default function PaintApp() {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(1);
  const item = gallery[i];

  if (!item) return <p className="p-6 text-sm text-muted-foreground">[ADD GALLERY IMAGES]</p>;

  const go = (d: number) => {
    setI((n) => (n + d + gallery.length) % gallery.length);
    setZoom(1);
  };

  const fullscreen = () => {
    const el = document.getElementById("gallery-stage");
    if (el?.requestFullscreen) void el.requestFullscreen();
  };

  const btn =
    "rounded-md p-2 text-sm transition-colors hover:bg-accent disabled:opacity-40";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-border bg-secondary/60 px-3 py-1.5">
        <button className={btn} onClick={() => go(-1)} aria-label="Previous image">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className={btn} onClick={() => go(1)} aria-label="Next image">
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="mx-2 text-xs text-muted-foreground">
          {i + 1} / {gallery.length}
        </span>
        <button
          className={btn}
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          className={btn}
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button className={btn} onClick={fullscreen} aria-label="Fullscreen">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      <div
        id="gallery-stage"
        className="grid min-h-0 flex-1 place-items-center overflow-auto bg-muted p-4"
      >
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          style={{ transform: `scale(${zoom})` }}
          className="max-h-full max-w-full rounded-md object-contain shadow-sm transition-transform"
        />
      </div>
      <div className="border-t border-border px-4 py-2.5">
        <p className="text-sm font-medium">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}
