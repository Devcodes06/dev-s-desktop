import { useState, useEffect, type ImgHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { APPS, type AppId } from "./apps";
import { cn } from "@/lib/utils";

export interface AppIconProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** Optional AppId to automatically resolve iconPath, fallback icon, and alt from APPS */
  appId?: AppId | undefined;
  /** Explicit path to the SVG asset in public (e.g. /assets/icons/windows11/mypc.svg) */
  iconPath?: string | undefined;
  /** Lucide fallback icon component */
  fallback?: LucideIcon | undefined;
  /** Lucide icon alias for backwards compatibility */
  icon?: LucideIcon | undefined;
  /** Tailwind classes for sizing, positioning, filters */
  className?: string | undefined;
  /** Alt text for accessibility (defaults to app title if appId is provided) */
  alt?: string | undefined;
}

export function AppIcon({
  appId,
  iconPath,
  fallback,
  icon,
  className,
  alt,
  ...rest
}: AppIconProps) {
  const [hasError, setHasError] = useState(false);

  const registeredApp = appId ? APPS[appId] : undefined;
  const targetPath = iconPath ?? registeredApp?.iconPath;
  const FallbackIcon = fallback ?? icon ?? registeredApp?.icon;
  const resolvedAlt = alt ?? registeredApp?.title ?? "";

  // Reset error state if the icon source changes
  useEffect(() => {
    setHasError(false);
  }, [targetPath]);

  if (!targetPath || hasError) {
    if (FallbackIcon) {
      return (
        <FallbackIcon
          className={className}
          aria-hidden="true"
          strokeWidth={1.5}
        />
      );
    }
    return null;
  }

  // Ensure path is properly formatted with base URL
  const base =
    (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  const finalSrc = `${cleanBase}${cleanPath}`;

  return (
    <img
      src={finalSrc}
      alt={resolvedAlt}
      onError={() => setHasError(true)}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn("select-none object-contain pointer-events-none", className)}
      {...rest}
    />
  );
}

export default AppIcon;
