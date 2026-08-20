import {
  Monitor,
  FileText,
  FolderKanban,
  User,
  Cpu,
  Share2,
  Award,
  Mail,
  Image as ImageIcon,
  Gamepad2,
  Trash2,
  TerminalSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import MyPCApp from "@/apps/MyPCApp";
import ResumeApp from "@/apps/ResumeApp";
import AboutApp from "@/apps/AboutApp";
import ProjectsApp from "@/apps/ProjectsApp";
import TechStackApp from "@/apps/TechStackApp";
import SocialsApp from "@/apps/SocialsApp";
import AchievementsApp from "@/apps/AchievementsApp";
import ContactApp from "@/apps/ContactApp";
import PaintApp from "@/apps/PaintApp";
import GamesApp from "@/apps/GamesApp";
import RecycleBinApp from "@/apps/RecycleBinApp";
import TerminalApp from "@/apps/TerminalApp";
import PersonalizeApp from "@/apps/PersonalizeApp";

export type AppId =
  | "mypc"
  | "resume"
  | "projects"
  | "about"
  | "techstack"
  | "socials"
  | "achievements"
  | "contact"
  | "paint"
  | "games"
  | "recyclebin"
  | "terminal"
  | "personalize";

export type AppDef = {
  title: string;
  icon: LucideIcon;
  component: ComponentType<{ payload?: unknown }>;
  width: number;
  height: number;
  onDesktop?: boolean;
};

export const APPS: Record<AppId, AppDef> = {
  mypc: { title: "My PC", icon: Monitor, component: MyPCApp, width: 880, height: 560, onDesktop: true },
  resume: { title: "Resume", icon: FileText, component: ResumeApp, width: 820, height: 640, onDesktop: true },
  projects: {
    title: "Projects",
    icon: FolderKanban,
    component: ProjectsApp,
    width: 860,
    height: 580,
    onDesktop: true,
  },
  about: { title: "About Me", icon: User, component: AboutApp, width: 760, height: 580, onDesktop: true },
  techstack: {
    title: "Tech Stack",
    icon: Cpu,
    component: TechStackApp,
    width: 820,
    height: 540,
    onDesktop: true,
  },
  socials: { title: "Socials", icon: Share2, component: SocialsApp, width: 640, height: 440, onDesktop: true },
  achievements: {
    title: "Achievements",
    icon: Award,
    component: AchievementsApp,
    width: 700,
    height: 540,
    onDesktop: true,
  },
  contact: { title: "Contact", icon: Mail, component: ContactApp, width: 780, height: 560, onDesktop: true },
  paint: {
    title: "Paint / Gallery",
    icon: ImageIcon,
    component: PaintApp,
    width: 760,
    height: 560,
    onDesktop: true,
  },
  games: { title: "Games", icon: Gamepad2, component: GamesApp, width: 700, height: 520, onDesktop: true },
  recyclebin: {
    title: "Recycle Bin",
    icon: Trash2,
    component: RecycleBinApp,
    width: 660,
    height: 440,
    onDesktop: true,
  },
  terminal: {
    title: "Terminal",
    icon: TerminalSquare,
    component: TerminalApp,
    width: 720,
    height: 460,
    onDesktop: true,
  },
  personalize: {
    title: "Settings",
    icon: Settings,
    component: PersonalizeApp,
    width: 640,
    height: 520,
  },
};

export const DESKTOP_ORDER: AppId[] = [
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
];
