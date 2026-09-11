import {
  Monitor,
  FileText,
  FolderKanban,
  User,
  Cpu,
  Share2,
  Award,
  Mail,
  Palette,
  Gamepad2,
  Trash2,
  TerminalSquare,
  Settings,
  Play,
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
import VideoApp from "@/apps/VideoApp";

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
  | "personalize"
  | "video";

export type AppDef = {
  title: string;
  icon: LucideIcon;
  iconPath?: string;
  component: ComponentType<{ payload?: unknown }>;
  width: number;
  height: number;
  onDesktop?: boolean;
};

export const APPS: Record<AppId, AppDef> = {
  mypc: {
    title: "My PC",
    icon: Monitor,
    iconPath: "/assets/icons/windows11/mypc.svg",
    component: MyPCApp,
    width: 880,
    height: 560,
    onDesktop: true,
  },
  resume: {
    title: "Resume",
    icon: FileText,
    iconPath: "/assets/icons/windows11/resume.svg",
    component: ResumeApp,
    width: 820,
    height: 640,
    onDesktop: true,
  },
  projects: {
    title: "Projects",
    icon: FolderKanban,
    iconPath: "/assets/icons/windows11/projects.svg",
    component: ProjectsApp,
    width: 860,
    height: 580,
    onDesktop: true,
  },
  about: {
    title: "About Me",
    icon: User,
    iconPath: "/assets/icons/windows11/about.svg",
    component: AboutApp,
    width: 760,
    height: 580,
    onDesktop: true,
  },
  techstack: {
    title: "Tech Stack",
    icon: Cpu,
    iconPath: "/assets/icons/windows11/techstack.svg",
    component: TechStackApp,
    width: 820,
    height: 540,
    onDesktop: true,
  },
  socials: {
    title: "Socials",
    icon: Share2,
    iconPath: "/assets/icons/windows11/socials.svg",
    component: SocialsApp,
    width: 640,
    height: 440,
    onDesktop: true,
  },
  achievements: {
    title: "Achievements",
    icon: Award,
    iconPath: "/assets/icons/windows11/achievements.svg",
    component: AchievementsApp,
    width: 700,
    height: 540,
    onDesktop: true,
  },
  contact: {
    title: "Contact",
    icon: Mail,
    iconPath: "/assets/icons/windows11/contact.svg",
    component: ContactApp,
    width: 780,
    height: 560,
    onDesktop: true,
  },
  paint: {
    title: "Paint",
    icon: Palette,
    iconPath: "/assets/icons/windows11/paint.svg",
    component: PaintApp,
    width: 760,
    height: 560,
    onDesktop: true,
  },
  games: {
    title: "Games",
    icon: Gamepad2,
    iconPath: "/assets/icons/windows11/games.svg",
    component: GamesApp,
    width: 700,
    height: 520,
    onDesktop: true,
  },
  recyclebin: {
    title: "Recycle Bin",
    icon: Trash2,
    iconPath: "/assets/icons/windows11/recyclebin.svg",
    component: RecycleBinApp,
    width: 660,
    height: 440,
    onDesktop: true,
  },
  terminal: {
    title: "Terminal",
    icon: TerminalSquare,
    iconPath: "/assets/icons/windows11/terminal.svg",
    component: TerminalApp,
    width: 720,
    height: 460,
    onDesktop: true,
  },
  personalize: {
    title: "Settings",
    icon: Settings,
    iconPath: "/assets/icons/windows11/personalize.svg",
    component: PersonalizeApp,
    width: 640,
    height: 520,
  },
  video: {
    title: "Video",
    icon: Play,
    component: VideoApp,
    width: 720,
    height: 480,
    onDesktop: true,
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
  "video",
];
