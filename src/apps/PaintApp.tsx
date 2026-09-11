import { useEffect, useRef, useState } from "react";
import { Download, Eraser, Pencil, Trash2 } from "lucide-react";

const COLORS = ["#111827", "#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b"];

type Tool = "pen" | "eraser";

export default function PaintApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(5);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    };
  };

  const begin = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const { x, y } = point(event);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(x, y);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = size * 2;
    context.strokeStyle = tool === "eraser" ? "#ffffff" : color;
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
    setHasDrawing(true);
  };

  const stop = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "debargha-whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const toolButton = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
      active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
    }`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-secondary/30">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-secondary/60 px-3 py-2">
        <button className={toolButton(tool === "pen")} onClick={() => setTool("pen")} aria-pressed={tool === "pen"}>
          <Pencil className="h-4 w-4" /> Pen
        </button>
        <button className={toolButton(tool === "eraser")} onClick={() => setTool("eraser")} aria-pressed={tool === "eraser"}>
          <Eraser className="h-4 w-4" /> Eraser
        </button>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <div className="flex items-center gap-1" aria-label="Pen colors">
          {COLORS.map((swatch) => (
            <button
              key={swatch}
              onClick={() => {
                setColor(swatch);
                setTool("pen");
              }}
              aria-label={`Use ${swatch} pen`}
              aria-pressed={tool === "pen" && color === swatch}
              className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 ${
                color === swatch && tool === "pen" ? "border-primary ring-2 ring-primary/30" : "border-white/80"
              }`}
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
        <label className="ml-1 flex items-center gap-2 text-xs text-muted-foreground">
          Size
          <input
            type="range"
            min="1"
            max="20"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-20 accent-primary"
            aria-label="Brush size"
          />
        </label>
        <div className="ml-auto flex items-center gap-1">
          <button
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-destructive/15 disabled:opacity-40"
            onClick={clear}
            disabled={!hasDrawing}
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-sm text-primary-foreground transition-colors hover:brightness-105 disabled:opacity-40"
            onClick={download}
            disabled={!hasDrawing}
          >
            <Download className="h-4 w-4" /> Save
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 p-3 sm:p-4">
        <div className="h-full overflow-hidden rounded-lg border border-border bg-white shadow-inner">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="h-full w-full touch-none cursor-crosshair"
            onPointerDown={begin}
            onPointerMove={draw}
            onPointerUp={stop}
            onPointerCancel={stop}
            onPointerLeave={stop}
            aria-label="Drawing canvas"
          />
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        A blank canvas for ideas, diagrams, and debugging doodles. Works on my machine™.
      </div>
    </div>
  );
}
