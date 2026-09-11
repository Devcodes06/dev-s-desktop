# E2E Test Infrastructure & Specification

## 1. Test Philosophy & Principles

The E2E test suite for `dev-s-desktop` is designed with the following core principles:

1. **Requirement-Driven & Opaque-Box**:
   Tests are written against the specifications in `ORIGINAL_REQUEST.md` and `PROJECT.md`, rather than testing internal implementation details. Tests verify visible files, assets, DOM layout contracts, CSS properties, geometry mathematics, and component export interfaces.

2. **Progressive Testability & Defect Isolation**:
   Tests are organized across 4 distinct tiers, progressing from fundamental asset hygiene and component contracts up to end-to-end user workflows. Failures precisely isolate whether a defect is an asset flaw, an integration bug, a layout geometry regression, or an interaction breakdown.

3. **Deterministic & Offline Execution**:
   Zero external runtime network requests are permitted. All vector assets, metadata, schemas, and logic models are tested locally and deterministically.

4. **Non-Destructive & Protected Scope**:
   Test code exclusively resides under `tests/`. The test suite never mutates implementation code in `src/` or protected portfolio content.

---

## 2. Test Architecture & Tier Organization

The test suite is structured into four comprehensive tiers:

```
tests/
├── e2e/
│   ├── tier1_icon_assets.test.ts          # Tier 1A: 15 Fluent SVGs, XML hygiene, manifest, license
│   ├── tier1_appicon_integration.test.ts  # Tier 1B: AppIcon contract, fallback, desktop shortcuts
│   ├── tier1_taskbar_layout.test.ts       # Tier 1C: 3-column CSS grid, button states, clock, tray
│   ├── tier2_boundaries_and_corner_cases.test.ts # Tier 2: Viewports (1024-1920), clamps, fallbacks
│   ├── tier3_cross_feature_combinations.test.ts  # Tier 3: Pairwise interactions, centering, flyouts
│   └── tier4_workflows.test.ts            # Tier 4: Real-world desktop boot, multitasking, maximize
├── helpers/
│   ├── test-utils.ts                      # Shared assertions, SVG parser, geometry calculators
│   └── window-store-sim.ts                # Pure simulation model of Window store state transitions
└── run-all.ts                             # Unified test runner with rich console reporting
```

### Tier Breakdown & Coverage Matrix

| Tier | Focus Area | Minimum Cases | Verification Target |
|---|---|---|---|
| **Tier 1A** | Icon Assets & Provenance | >= 8 | 15 SVGs in `public/assets/icons/windows11/`, valid XML, `viewBox`, no scripts/foreignObjects/external refs, neutral Start icon, `icon-manifest.json`, `SOURCES.md`, `LICENSE-MICROSOFT-FLUENT.txt`. |
| **Tier 1B** | AppIcon & Desktop Shortcuts | >= 8 | `AppIcon` component contract, Lucide fallback on error/missing path, `APPS` registry paths, 40–48px desktop shortcuts (`h-11 w-11`), preserved titles, double-click launch contract. |
| **Tier 1C** | Taskbar Layout, Dynamic Buttons, Tray | >= 12 | 3-column CSS grid (`grid-cols-[1fr_auto_1fr]`), right-aligned tray (`justify-self-end shrink-0`), `--taskbar-height: 56px` consolidation, dynamic button lifecycle, centered underline, minimized dimmed styling, 12h/24h clock, operational Lucide tray icons. |
| **Tier 2** | Boundaries & Corner Cases | >= 12 | Missing asset fallbacks, invalid path handling, extreme viewport sizes (1024x768 to 1920x1080), window clamp math, resize bounds (min 360x240), rapid toggle resilience, body `overflow-x: hidden`. |
| **Tier 3** | Cross-Feature Combinations | >= 10 | Pairwise interactions: multi-window taskbar centering math, active window focus transitions, desktop shortcuts + search overlay launches, flyout stacking above maximized windows. |
| **Tier 4** | Real-World Application Workflows | >= 8 | Complete user journeys: desktop boot -> open apps -> taskbar dynamic buttons -> minimize/restore -> maximize geometry clamp -> close app -> zero scrollbars. |

---

## 3. Test Runner Invocation

The test suite is fully automated and runnable using **Bun**:

### Standard Bun Test Runner
To run all test suites using Bun's built-in test runner:
```bash
bun test tests/e2e/
```

To run a specific tier:
```bash
bun test tests/e2e/tier1_icon_assets.test.ts
bun test tests/e2e/tier1_appicon_integration.test.ts
bun test tests/e2e/tier1_taskbar_layout.test.ts
bun test tests/e2e/tier2_boundaries_and_corner_cases.test.ts
bun test tests/e2e/tier3_cross_feature_combinations.test.ts
bun test tests/e2e/tier4_workflows.test.ts
```

### Standalone Unified Runner
For detailed colored reporting, per-tier grouping, and instant diagnostic summaries:
```bash
bun tests/run-all.ts
```

---

## 4. Coverage Thresholds & Quality Gates

The test suite enforces the following acceptance gates:

1. **Feature Coverage**: 100% of the 13 application IDs, Start icon, Search icon, taskbar layout grid, and window bounds have dedicated assertions.
2. **Hygiene Security Gate**: 0 `<script>`, 0 `<foreignObject>`, and 0 remote URLs across all SVGs.
3. **Responsive Geometry Gate**: Zero horizontal overflow and mathematical center alignment verified across all 4 mandatory viewports:
   - `1920x1080` (Full HD Desktop)
   - `1440x900` (Standard Laptop)
   - `1366x768` (Budget/Compact Laptop)
   - `1024x768` (Minimum Desktop Viewport)
4. **Mobile Independence Gate**: Viewports `< 768px` verified to activate `MobileShell` without desktop taskbar collision.
5. **Backwards Compatibility Gate**: Zero breaking changes to `APPS` registry consumers, ensuring `icon: LucideIcon` fallback is universally preserved.
