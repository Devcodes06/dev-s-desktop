import { describe, test, expect } from "bun:test";
import * as fs from "fs";
import * as path from "path";
import {
  PATHS,
  EXPECTED_ICON_FILES,
  EXPECTED_APP_IDS,
  validateSvgHygiene,
} from "../helpers/test-utils";

describe("Tier 1A: Icon Assets Provisioning, Hygiene & Provenance", () => {
  // Feature 1: Icon Assets Provisioning
  describe("Feature: Icon Directory & 15 SVG Assets Provisioning", () => {
    test("TC-1.1: Target directory public/assets/icons/windows11/ exists", () => {
      const dirExists = fs.existsSync(PATHS.publicIcons);
      expect(dirExists).toBe(true);
    });

    test("TC-1.2: All 13 application SVG icons exist in icon directory", () => {
      for (const appId of EXPECTED_APP_IDS) {
        const svgFile = path.join(PATHS.publicIcons, `${appId}.svg`);
        const exists = fs.existsSync(svgFile);
        expect(exists).toBe(true);
      }
    });

    test("TC-1.3: Start and Search SVG icons exist in icon directory", () => {
      const startFile = path.join(PATHS.publicIcons, "start.svg");
      const searchFile = path.join(PATHS.publicIcons, "search.svg");
      expect(fs.existsSync(startFile)).toBe(true);
      expect(fs.existsSync(searchFile)).toBe(true);
    });

    test("TC-1.4: Exactly 15 required SVG icon files are present", () => {
      if (!fs.existsSync(PATHS.publicIcons)) {
        throw new Error(`Directory ${PATHS.publicIcons} does not exist yet.`);
      }
      const files = fs.readdirSync(PATHS.publicIcons);
      const svgFiles = files.filter((f) => f.endsWith(".svg"));
      for (const requiredIcon of EXPECTED_ICON_FILES) {
        expect(svgFiles).toContain(requiredIcon);
      }
    });

    test("TC-1.5: SVG files are non-empty with minimum size threshold (>100 bytes)", () => {
      for (const fileName of EXPECTED_ICON_FILES) {
        const filePath = path.join(PATHS.publicIcons, fileName);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          expect(stats.size).toBeGreaterThan(100);
        }
      }
    });
  });

  // Feature 2: SVG Safety & XML Hygiene
  describe("Feature: SVG Security & XML Hygiene Compliance", () => {
    test("TC-2.1: Every SVG contains a valid viewBox attribute", () => {
      for (const fileName of EXPECTED_ICON_FILES) {
        const filePath = path.join(PATHS.publicIcons, fileName);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, "utf-8");
        const hygiene = validateSvgHygiene(content);
        expect(hygiene.viewBox).toBeDefined();
        expect(typeof hygiene.viewBox).toBe("string");
      }
    });

    test("TC-2.2: Security Hygiene: Zero <script> tags in any SVG asset", () => {
      for (const fileName of EXPECTED_ICON_FILES) {
        const filePath = path.join(PATHS.publicIcons, fileName);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, "utf-8");
        const hygiene = validateSvgHygiene(content);
        expect(hygiene.errors.filter((e) => e.includes("<script>"))).toHaveLength(0);
      }
    });

    test("TC-2.3: Security Hygiene: Zero <foreignObject> tags in any SVG asset", () => {
      for (const fileName of EXPECTED_ICON_FILES) {
        const filePath = path.join(PATHS.publicIcons, fileName);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, "utf-8");
        const hygiene = validateSvgHygiene(content);
        expect(hygiene.errors.filter((e) => e.includes("<foreignObject>"))).toHaveLength(0);
      }
    });

    test("TC-2.4: Security Hygiene: Zero inline event handlers (on*) in any SVG asset", () => {
      for (const fileName of EXPECTED_ICON_FILES) {
        const filePath = path.join(PATHS.publicIcons, fileName);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, "utf-8");
        const hygiene = validateSvgHygiene(content);
        expect(hygiene.errors.filter((e) => e.includes("Inline event handler"))).toHaveLength(0);
      }
    });

    test("TC-2.5: Offline Determinism: Zero external HTTP/HTTPS resource references", () => {
      for (const fileName of EXPECTED_ICON_FILES) {
        const filePath = path.join(PATHS.publicIcons, fileName);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, "utf-8");
        const hygiene = validateSvgHygiene(content);
        expect(hygiene.errors.filter((e) => e.includes("Remote HTTP/HTTPS"))).toHaveLength(0);
      }
    });
  });

  // Feature 3: Neutral Start Icon Compliance
  describe("Feature: Neutral Start Icon Mandate", () => {
    test("TC-3.1: Start icon does not contain Windows 4-pane trademark logo", () => {
      const startFile = path.join(PATHS.publicIcons, "start.svg");
      if (!fs.existsSync(startFile)) return;
      const content = fs.readFileSync(startFile, "utf-8");
      const hygiene = validateSvgHygiene(content, true);
      expect(hygiene.isNeutralStartIcon).toBe(true);
    });

    test("TC-3.2: Start icon uses neutral Fluent UI 'apps' grid representation", () => {
      const manifestFile = PATHS.manifest;
      if (!fs.existsSync(manifestFile)) return;
      const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf-8"));
      const startEntry = manifest.icons?.start;
      expect(startEntry).toBeDefined();
      expect(startEntry.fluentName).toBe("apps");
    });
  });

  // Feature 4: Provenance & Licensing Metadata
  describe("Feature: Provenance & MIT License Verification", () => {
    test("TC-4.1: icon-manifest.json exists and is valid JSON", () => {
      expect(fs.existsSync(PATHS.manifest)).toBe(true);
      const content = fs.readFileSync(PATHS.manifest, "utf-8");
      const parsed = JSON.parse(content);
      expect(typeof parsed).toBe("object");
      expect(parsed.license).toBe("MIT");
    });

    test("TC-4.2: icon-manifest.json maps all 13 app IDs plus start and search", () => {
      if (!fs.existsSync(PATHS.manifest)) return;
      const manifest = JSON.parse(fs.readFileSync(PATHS.manifest, "utf-8"));
      expect(manifest.icons).toBeDefined();
      for (const appId of EXPECTED_APP_IDS) {
        expect(manifest.icons[appId]).toBeDefined();
        expect(manifest.icons[appId].localPath).toBe(`/assets/icons/windows11/${appId}.svg`);
        expect(manifest.icons[appId].upstreamUrl).toMatch(/^https:\/\/raw\.githubusercontent\.com\/microsoft\/fluentui-system-icons\//);
      }
      expect(manifest.icons.start).toBeDefined();
      expect(manifest.icons.search).toBeDefined();
    });

    test("TC-4.3: SOURCES.md exists and documents upstream repository", () => {
      expect(fs.existsSync(PATHS.sources)).toBe(true);
      const content = fs.readFileSync(PATHS.sources, "utf-8");
      expect(content).toContain("https://github.com/microsoft/fluentui-system-icons");
      expect(content).toContain("MIT License");
      expect(content).toContain("Microsoft Corporation");
    });

    test("TC-4.4: LICENSE-MICROSOFT-FLUENT.txt contains official MIT License text", () => {
      expect(fs.existsSync(PATHS.license)).toBe(true);
      const content = fs.readFileSync(PATHS.license, "utf-8");
      expect(content).toContain("MIT License");
      expect(content).toContain("Copyright (c) Microsoft Corporation");
      expect(content).toContain("Permission is hereby granted, free of charge");
    });
  });
});
