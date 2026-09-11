import { useCallback } from "react";
import { Play } from "lucide-react";

const VIDEO_URL = "https://youtu.be/dQw4w9WgXcQ?si=YmcOIozjMmUJOIv2";

export default function VideoApp() {
  const handleOpen = useCallback(() => {
    window.open(VIDEO_URL, "_blank", "noopener,noreferrer");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4 sm:p-6">
      <div
        role="button"
        tabIndex={0}
        aria-label="Play video in new tab"
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        className="group relative flex aspect-video w-full max-w-2xl cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-neutral-900 shadow-xl transition-all duration-300 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      >
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />



        {/* Centered white play triangle overlay with subtle hover scale */}
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
          <Play className="h-8 w-8 translate-x-0.5 fill-white text-white sm:h-10 sm:w-10" />
        </div>
      </div>
    </div>
  );
}
