# Windows 11 Developer Desktop Portfolio

A personal portfolio web application designed as an interactive, fully functional Windows 11 desktop experience. Built with modern web technologies including React 19, TypeScript, TanStack Start/Router, Vite, and Tailwind CSS.

---

## 🌟 Features

- **Authentic Windows 11 Desktop Experience:**
  - Draggable, resizable, stackable window management with minimize, maximize, and focus capabilities.
  - Centered taskbar with dynamic running window indicators and live system tray.
  - Windows 11 Start Menu with pinned applications and power actions.
  - Instant global search overlay (`Ctrl+K`).
  - Right-click desktop context menu and custom wallpaper support.
  - Light & Dark mode theming with 12h/24h clock toggle (`PersonalizeApp`).

- **Interactive Applications:**
  - **About Me:** Professional summary, education timeline, interests, and current AI/ML learning focus.
  - **Projects:** Interactive showcase of full-stack and IoT projects including **Snip** (AI URL Shortener) and **KrishiDrishti** (IoT crop diagnosis & soil telemetry) with live demos and repository links.
  - **Resume Viewer:** Built-in PDF preview with direct download, print, and open-in-new-tab functionality.
  - **Games:** 5 playable games in a unified launcher — Minesweeper, 2048, Memory Match, Snake, and Tic Tac Toe.
  - **Paint:** Canvas-based drawing whiteboard with customizable brush sizes, color palette, and image export.
  - **Terminal:** Simulated interactive command-line interface with custom commands (`help`, `about`, `projects`, `skills`, `clear`, etc.).
  - **Contact Form:** Clean two-column contact window integrated with Web3Forms for direct inbox message delivery.
  - **Dev Humor Notifications:** Periodic floating desktop toasts featuring programming humor.

- **Design & Performance:**
  - Microsoft Fluent UI system icons with SVG safety and automated Lucide fallbacks.
  - Tailwind CSS v4 styling with OKLCH design tokens, Mica blur, and acrylic glassmorphism effects.
  - Clean responsive layout with dedicated mobile shell for smaller viewports.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling:** [Vite 8](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router) & [TanStack Start](https://tanstack.com/start)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Microsoft Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons) & [Lucide Icons](https://lucide.dev/)
- **Form Service:** [Web3Forms](https://web3forms.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Devcodes06/dev-s-desktop.git
   cd dev-s-desktop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (optional for local dev, used for contact form):
   ```env
   VITE_WEB3FORMS_KEY=your_web3forms_access_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to explore the desktop.

### Production Build

To build the application for production:

```bash
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
