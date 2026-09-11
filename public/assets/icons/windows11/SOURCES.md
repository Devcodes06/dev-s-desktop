# Icon Provenance and Source Documentation

All icons in this directory are derived from the official Microsoft Fluent UI System Icons repository under the MIT License.

- **Upstream Repository**: https://github.com/microsoft/fluentui-system-icons
- **License**: MIT License (see `LICENSE-MICROSOFT-FLUENT.txt`)
- **Copyright**: Microsoft Corporation

## Safety and Provenance Policy
1. **Source Authenticity**: Icons are exclusively sourced from Microsoft's official Fluent UI System Icons repository. No icons are extracted from Windows DLL/EXE binaries, third-party scraping sites, search engines, or unverified mirrors.
2. **Start Icon Neutrality**: The Windows/Microsoft corporate logo is NOT used for the Start button. A neutral grid launcher icon (`apps` / `ic_fluent_apps_24_filled.svg`) is used instead to avoid proprietary trademark infringement.
3. **Zero Runtime Network Requests**: All icons are statically bundled and served locally from `/assets/icons/windows11/`. No remote requests are executed during client rendering.
4. **SVG Hygiene & Security**:
   - Valid XML syntax with `xmlns="http://www.w3.org/2000/svg"`.
   - Explicit `viewBox` on every SVG.
   - Zero `<script>` tags.
   - Zero `<foreignObject>` tags.
   - Zero external `href` or `xlink:href` resource references.
   - Zero inline event handlers (`onload`, `onclick`, `onerror`).

## Per-Asset Mapping Table

| Icon File | Application ID | Fluent Name | Upstream Asset Directory | Upstream Raw URL |
|-----------|----------------|-------------|--------------------------|------------------|
| `mypc.svg` | `mypc` | `desktop` | `assets/Desktop/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Desktop/SVG/ic_fluent_desktop_24_filled.svg |
| `resume.svg` | `resume` | `document_person` | `assets/Document Person/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Document%20Person/SVG/ic_fluent_document_person_24_filled.svg |
| `projects.svg` | `projects` | `folder_briefcase` | `assets/Folder Briefcase/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Folder%20Briefcase/SVG/ic_fluent_folder_briefcase_24_filled.svg |
| `about.svg` | `about` | `person` | `assets/Person/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Person/SVG/ic_fluent_person_24_filled.svg |
| `techstack.svg` | `techstack` | `developer_board` | `assets/Developer Board/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Developer%20Board/SVG/ic_fluent_developer_board_24_filled.svg |
| `socials.svg` | `socials` | `share_android` | `assets/Share Android/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Share%20Android/SVG/ic_fluent_share_android_24_filled.svg |
| `achievements.svg` | `achievements` | `trophy` | `assets/Trophy/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Trophy/SVG/ic_fluent_trophy_24_filled.svg |
| `contact.svg` | `contact` | `mail` | `assets/Mail/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Mail/SVG/ic_fluent_mail_24_filled.svg |
| `paint.svg` | `paint` | `color` | `assets/Color/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Color/SVG/ic_fluent_color_24_filled.svg |
| `games.svg` | `games` | `games` | `assets/Games/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Games/SVG/ic_fluent_games_24_filled.svg |
| `recyclebin.svg` | `recyclebin` | `delete` | `assets/Delete/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Delete/SVG/ic_fluent_delete_24_filled.svg |
| `terminal.svg` | `terminal` | `window_console` | `assets/Window Console/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Window%20Console/SVG/ic_fluent_window_console_24_filled.svg |
| `personalize.svg` | `personalize` | `settings` | `assets/Settings/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Settings/SVG/ic_fluent_settings_24_filled.svg |
| `start.svg` | `start` | `apps` | `assets/Apps/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Apps/SVG/ic_fluent_apps_24_filled.svg |
| `search.svg` | `search` | `search` | `assets/Search/SVG/` | https://raw.githubusercontent.com/microsoft/fluentui-system-icons/main/assets/Search/SVG/ic_fluent_search_24_filled.svg |
