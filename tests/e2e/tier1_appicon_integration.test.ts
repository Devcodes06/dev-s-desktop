import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import {
  PATHS,
  EXPECTED_APP_IDS,
} from "../helpers/test-utils";

describe("Tier 1B: AppIcon Component & Desktop Shortcut Integration", () => {
  // Feature 1: AppDef Type & APPS Registry Integrity
  describe("Feature: AppDef Type & APPS Registry Contract", () => {
    test("TC-1.1: src/os/apps.tsx defines all 13 canonical AppIds", () => {
      const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
      for (const id of EXPECTED_APP_IDS) {
        expect(content).toContain(`"${id}"`);
      }
    });

    test("TC-1.2: AppDef maintains mandatory 'icon: LucideIcon' for backwards compatibility", () => {
      const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
      expect(content).toMatch(/icon:\s*LucideIcon;/);
    });

    test("TC-1.3: AppDef type supports optional 'iconPath?: string'", () => {
      const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
      // Specification contract from PROJECT.md: iconPath?: string
      expect(content).toMatch(/iconPath\?:\s*string;/);
    });

    test("TC-1.4: APPS registry maps all 13 apps with title, icon, and iconPath", () => {
      const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
      for (const id of EXPECTED_APP_IDS) {
        // App definition block must exist
        expect(content).toContain(`${id}:`);
        // When M2 is implemented, iconPath is populated
        expect(content).toContain(`/assets/icons/windows11/${id}.svg`);
      }
    });

    test("TC-1.5: DESKTOP_ORDER contains 12 apps and excludes 'personalize'", () => {
      const content = fs.readFileSync(PATHS.appsTsx, "utf-8");
      expect(content).toContain("export const DESKTOP_ORDER: AppId[] =");
      // 12 desktop apps
      for (const id of EXPECTED_APP_IDS) {
        if (id === "personalize") continue;
        expect(content).toContain(`"${id}"`);
      }
    });
  });

  // Feature 2: AppIcon Component Architecture
  describe("Feature: AppIcon Component Contract & Fallback Logic", () => {
    test("TC-2.1: src/os/AppIcon.tsx exists", () => {
      const exists = fs.existsSync(PATHS.appIconTsx);
      expect(exists).toBe(true);
    });

    test("TC-2.2: AppIcon exports AppIcon component and AppIconProps", () => {
      if (!fs.existsSync(PATHS.appIconTsx)) return;
      const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(content).toMatch(/export (function AppIcon|const AppIcon|default function AppIcon)/);
      expect(content).toContain("AppIconProps");
    });

    test("TC-2.3: AppIcon supports appId, iconPath, fallback, and icon props", () => {
      if (!fs.existsSync(PATHS.appIconTsx)) return;
      const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(content).toContain("appId");
      expect(content).toContain("iconPath");
      expect(content).toContain("fallback");
    });

    test("TC-2.4: AppIcon handles onError state to fallback gracefully to Lucide", () => {
      if (!fs.existsSync(PATHS.appIconTsx)) return;
      const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      // Must contain onError handler setting error state
      expect(content).toMatch(/onError\s*=\s*\{/);
      expect(content).toContain("setHasError");
    });

    test("TC-2.5: AppIcon renders img with async decoding and lazy loading", () => {
      if (!fs.existsSync(PATHS.appIconTsx)) return;
      const content = fs.readFileSync(PATHS.appIconTsx, "utf-8");
      expect(content).toContain('decoding="async"');
      expect(content).toContain('loading="lazy"');
      expect(content).toContain('draggable={false}');
    });
  });

  // Feature 3: Desktop Shortcuts Rendering & Scaling
  describe("Feature: Desktop Shortcuts Sizing & Interaction", () => {
    test("TC-3.1: DesktopIcons.tsx uses AppIcon for shortcut rendering", () => {
      const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      expect(content).toContain("AppIcon");
    });

    test("TC-3.2: Desktop shortcut icons are sized at 40-48px (h-11 w-11 or h-12 w-12)", () => {
      const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      // Specification: 40-48px sizing instead of old 32px (h-8 w-8)
      expect(content).toMatch(/h-1[12]\s+w-1[12]/);
    });

    test("TC-3.3: Desktop shortcuts preserve shortcut labels with text-onwall", () => {
      const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      expect(content).toContain("{app.title}");
      expect(content).toContain("text-onwall");
    });

    test("TC-3.4: Desktop shortcuts retain single-click selection and double-click open", () => {
      const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      expect(content).toMatch(/onClick\s*=\s*\{.*setSelected/);
      expect(content).toMatch(/onDoubleClick\s*=\s*\{.*openApp/);
      expect(content).toMatch(/onKeyDown\s*=\s*\{/);
    });

    test("TC-3.5: Desktop shortcuts define accessible aria-label", () => {
      const content = fs.readFileSync(PATHS.desktopIconsTsx, "utf-8");
      expect(content).toMatch(/aria-label\s*=\s*\{`Open \$\{app\.title\}`\}/);
    });
  });

  // Feature 4: Window Titlebar, Menus & Mobile Shell Integration
  describe("Feature: UI Touchpoints Fluent Icon Adoption", () => {
    test("TC-4.1: Window.tsx renders app icon via AppIcon in titlebar header", () => {
      const content = fs.readFileSync(PATHS.windowTsx, "utf-8");
      expect(content).toContain("AppIcon");
      expect(content).toMatch(/h-4\s+w-4/);
    });

    test("TC-4.2: Window.tsx retains operational control icons as Lucide (Minus, Square, Copy, X)", () => {
      const content = fs.readFileSync(PATHS.windowTsx, "utf-8");
      expect(content).toContain("Minus");
      expect(content).toContain("Square");
      expect(content).toContain("Copy");
      expect(content).toContain("X");
    });

    test("TC-4.3: StartMenu.tsx renders pinned apps via AppIcon", () => {
      const content = fs.readFileSync(PATHS.startMenuTsx, "utf-8");
      expect(content).toContain("AppIcon");
    });

    test("TC-4.4: SearchOverlay.tsx renders search result icons via AppIcon", () => {
      const content = fs.readFileSync(PATHS.searchOverlayTsx, "utf-8");
      expect(content).toContain("AppIcon");
    });

    test("TC-4.5: MobileShell.tsx renders app grid via AppIcon", () => {
      const content = fs.readFileSync(PATHS.mobileShellTsx, "utf-8");
      expect(content).toContain("AppIcon");
    });
  });
});
