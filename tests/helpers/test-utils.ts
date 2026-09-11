import * as fs from "fs";
import * as path from "path";

/**
 * Root directory of the dev-s-desktop workspace
 */
export const PROJECT_ROOT =
  typeof __dirname !== "undefined"
    ? path.resolve(__dirname, "../../")
    : process.cwd();

/**
 * Paths to key project directories
 */
export const PATHS = {
  root: PROJECT_ROOT,
  publicIcons: path.join(PROJECT_ROOT, "public/assets/icons/windows11"),
  manifest: path.join(PROJECT_ROOT, "public/assets/icons/windows11/icon-manifest.json"),
  sources: path.join(PROJECT_ROOT, "public/assets/icons/windows11/SOURCES.md"),
  license: path.join(PROJECT_ROOT, "public/assets/icons/windows11/LICENSE-MICROSOFT-FLUENT.txt"),
  appsTsx: path.join(PROJECT_ROOT, "src/os/apps.tsx"),
  appIconTsx: path.join(PROJECT_ROOT, "src/os/AppIcon.tsx"),
  desktopIconsTsx: path.join(PROJECT_ROOT, "src/os/DesktopIcons.tsx"),
  taskbarTsx: path.join(PROJECT_ROOT, "src/os/Taskbar.tsx"),
  windowTsx: path.join(PROJECT_ROOT, "src/os/Window.tsx"),
  startMenuTsx: path.join(PROJECT_ROOT, "src/os/StartMenu.tsx"),
  searchOverlayTsx: path.join(PROJECT_ROOT, "src/os/SearchOverlay.tsx"),
  desktopTsx: path.join(PROJECT_ROOT, "src/os/Desktop.tsx"),
  stylesCss: path.join(PROJECT_ROOT, "src/styles.css"),
  mobileShellTsx: path.join(PROJECT_ROOT, "src/os/MobileShell.tsx"),
};

/**
 * 13 Canonical Application IDs from ORIGINAL_REQUEST.md and apps.tsx
 */
export const EXPECTED_APP_IDS = [
  "mypc",
  "resume",
  "projects",
  "about",
  "techstack",
  "socials",
  "achievements",
  "contact",
  "paint",
  "games",
  "recyclebin",
  "terminal",
  "personalize",
] as const;

/**
 * 15 Required SVG Icon file names
 */
export const EXPECTED_ICON_FILES = [
  "mypc.svg",
  "resume.svg",
  "projects.svg",
  "about.svg",
  "techstack.svg",
  "socials.svg",
  "achievements.svg",
  "contact.svg",
  "paint.svg",
  "games.svg",
  "recyclebin.svg",
  "terminal.svg",
  "personalize.svg",
  "start.svg",
  "search.svg",
] as const;

/**
 * Validation result for SVG security & hygiene
 */
export interface SvgValidationResult {
  valid: boolean;
  errors: string[];
  viewBox?: string;
  hasExplicitFill: boolean;
  isNeutralStartIcon?: boolean;
}

/**
 * Validates SVG content for XML hygiene, safety, and lack of external references
 */
export function validateSvgHygiene(svgContent: string, isStartIcon = false): SvgValidationResult {
  const errors: string[] = [];

  // 1. Basic XML structure
  if (!svgContent.trim().startsWith("<svg") || !svgContent.includes("</svg>")) {
    errors.push("Missing outer <svg> or </svg> tag");
  }

  // 2. viewBox attribute
  const viewBoxMatch = svgContent.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (!viewBoxMatch) {
    errors.push("Missing required 'viewBox' attribute");
  }

  // 3. Script element prohibition
  if (/<script\b[^>]*>/i.test(svgContent) || /<\/script>/i.test(svgContent)) {
    errors.push("Security violation: <script> tag detected in SVG");
  }

  // 4. foreignObject prohibition
  if (/<foreignObject\b[^>]*>/i.test(svgContent)) {
    errors.push("Security violation: <foreignObject> tag detected in SVG");
  }

  // 5. Inline event handlers prohibition
  if (/\bon\w+\s*=/i.test(svgContent)) {
    errors.push("Security violation: Inline event handler (e.g. onload, onclick) detected");
  }

  // 6. External network references prohibition
  if (/href\s*=\s*["']https?:\/\//i.test(svgContent) || /xlink:href\s*=\s*["']https?:\/\//i.test(svgContent)) {
    errors.push("Offline violation: Remote HTTP/HTTPS href reference detected");
  }

  // 7. Explicit fill check (ensures icons do not render black on dark wallpapers)
  const hasExplicitFill = /fill\s*=\s*["'](?!none)[^"']+["']/i.test(svgContent) ||
                          /style\s*=\s*["'][^"']*fill\s*:\s*(?!none)[^;"']+/i.test(svgContent);

  // 8. Start icon neutrality check
  // Windows logo typically consists of 4 distinct square/quadrilateral paths with specific coordinates.
  // Fluent 'apps' icon consists of 4 or 9 rounded squares or a 3x3 / 2x2 launcher grid.
  let isNeutralStartIcon = true;
  if (isStartIcon) {
    // If the SVG explicitly contains trademark references to "WindowsLogo" or proprietary 4-pane angled flags
    if (/windows-logo|microsoft-logo|ms-logo/i.test(svgContent)) {
      errors.push("Trademark safety violation: Windows logo detected in Start icon. Must use neutral grid icon.");
      isNeutralStartIcon = false;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    viewBox: viewBoxMatch?.[1],
    hasExplicitFill,
    isNeutralStartIcon,
  };
}

/**
 * Taskbar Centering Geometry Calculation
 * Simulates 3-column CSS Grid `grid-cols-[1fr_auto_1fr]`
 */
export interface TaskbarGeometry {
  totalWidth: number;
  centerGroupWidth: number;
  trayWidth: number;
  col1Width: number;
  col2Offset: number;
  geometricMidpoint: number;
  centerGroupMidpoint: number;
  isCentered: boolean;
  isCollidingWithTray: boolean;
  rightMarginRemaining: number;
}

export function computeTaskbarGridGeometry(
  totalWidth: number,
  centerGroupWidth: number,
  trayWidth: number
): TaskbarGeometry {
  const freeSpace = Math.max(0, totalWidth - centerGroupWidth);
  const col1Width = freeSpace / 2;
  const col2Offset = col1Width;
  const geometricMidpoint = totalWidth / 2;
  const centerGroupMidpoint = col2Offset + centerGroupWidth / 2;
  const rightMarginRemaining = totalWidth - (col2Offset + centerGroupWidth);
  const isCollidingWithTray = rightMarginRemaining < trayWidth;
  const isCentered = Math.abs(geometricMidpoint - centerGroupMidpoint) < 0.001;

  return {
    totalWidth,
    centerGroupWidth,
    trayWidth,
    col1Width,
    col2Offset,
    geometricMidpoint,
    centerGroupMidpoint,
    isCentered,
    isCollidingWithTray,
    rightMarginRemaining,
  };
}

/**
 * Window Spawn Clamping Math (as implemented in src/os/store.tsx:71-76)
 */
export function computeWindowSpawnBounds(
  appWidth: number,
  appHeight: number,
  vw: number,
  vh: number
): { w: number; h: number } {
  const w = Math.min(appWidth, vw - 80);
  const h = Math.min(appHeight, vh - 140);
  return { w, h };
}

/**
 * Window Drag Clamping Math (as implemented in src/os/Window.tsx:22-23)
 */
export function computeWindowDragClamp(
  clientX: number,
  clientY: number,
  dx: number,
  dy: number,
  vw: number,
  vh: number,
  taskbarHeight = 56
): { x: number; y: number } {
  const x = Math.max(0, Math.min(vw - 120, clientX - dx));
  const y = Math.max(0, Math.min(vh - taskbarHeight - 40, clientY - dy));
  return { x, y };
}

/**
 * Window Resize Clamping Math (as implemented in src/os/Window.tsx:28-31)
 */
export function computeWindowResizeClamp(
  clientX: number,
  clientY: number,
  rx: number,
  ry: number,
  initialW: number,
  initialH: number
): { w: number; h: number } {
  const w = Math.max(360, initialW + (clientX - rx));
  const h = Math.max(240, initialH + (clientY - ry));
  return { w, h };
}

/**
 * Maximized Window Geometry Math (as implemented in src/os/Window.tsx:56)
 */
export function computeMaximizedGeometry(vh: number, taskbarHeight = 56) {
  return {
    left: 0,
    top: 0,
    width: "100%",
    heightPx: vh - taskbarHeight,
    cssCalcHeight: `calc(100dvh - ${taskbarHeight}px)`,
  };
}
