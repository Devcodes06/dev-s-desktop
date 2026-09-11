/**
 * SINGLE SOURCE OF TRUTH for the whole portfolio.
 * Update this file to change any content on the desktop.
 */

export const profile = {
  name: "Debargha Chowdhury",
  shortName: "Debargha",
  userName: "Dev",
  title: "Computer Science Undergraduate — IoT Specialization",
  tagline:
    "Backend development, IoT systems and software testing. B.Tech CSE (IoT) student building practical hardware-software projects.",
  summary:
    "Computer Science undergraduate (IoT Specialization) with backend development experience and a working foundation in software testing. Comfortable with JavaScript/TypeScript and REST APIs, with practical familiarity in unit, integration, and end-to-end testing using Mocha, Chai, and Postman. Quick learner with strong problem-solving fundamentals and genuine curiosity about hardware-software systems.",
  location: "Burdwan, West Bengal, India",
  phone: "+91 9641829986",
  email: "debarghachowdhury.work@gmail.com",
  photo: "/assets/profile/debargha.jpg",
  wallpaper: "/assets/wallpaper/windows-11.jpg",
};

export const resume = {
  url: "/assets/resume/Debargha_Chowdhury_Resume.pdf",
  fileName: "Debargha_Chowdhury_Resume.pdf",
  fileType: "PDF Document",
  updated: "2026",
  size: "173 KB",
};

export const socials = [
  {
    label: "GitHub",
    icon: "github",
    handle: "GitHub",
    url: "https://github.com/Devcodes06",
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    handle: "LinkedIn",
    url: "https://www.linkedin.com/in/debargha404/",
  },
  {
    label: "Email",
    icon: "mail",
    handle: profile.email,
    url: `mailto:${profile.email}`,
  },
  {
    label: "LeetCode",
    icon: "code",
    handle: "LeetCode",
    url: "https://leetcode.com/u/Debargha007/",
  },
  {
    label: "Instagram",
    icon: "instagram",
    handle: "Instagram",
    url: "https://www.instagram.com/debarghaofficial/",
  },
] as const;

export type Project = {
  id: string;
  name: string;
  year: string;
  status: string;
  short: string;
  problem: string;
  solution: string;
  contribution: string[];
  tech: string[];
  features: string[];
  github: string;
  demo: string;
  screenshot?: string;
};

export const projects: Project[] = [
  {
    id: "url-shortener",
    name: "Full-Stack URL Shortener & Link Management Platform",
    year: "2025",
    status: "Deployed",
    short:
      "URL shortener with JWT auth, AI-generated link metadata and a tested Express/MongoDB backend.",
    problem:
      "Long, unreadable URLs are hard to share and impossible to track, and most shorteners give no context about what a link actually points to.",
    solution:
      "A full-stack shortener built on Node.js/Express with an MVC architecture, JWT authentication and MongoDB storage, enriched with AI-generated link metadata via the Gemini API and deployed on Vercel.",
    contribution: [
      "Built the full stack: MVC backend, JWT authentication and MongoDB persistence.",
      "Integrated the Gemini API to generate link metadata automatically.",
      "Wrote unit tests with Mocha and Chai for slug generation, expiry logic and auth middleware, using mocking to isolate database calls.",
      "Built a Postman collection covering create, redirect and delete routes with status-code and response-body checks, plus manual exploration of edge cases (invalid slugs, expired links).",
    ],
    tech: ["Node.js", "Express.js", "MongoDB", "JWT", "Mocha", "Chai", "Postman", "Vercel"],
    features: [
      "JWT authentication",
      "AI-generated link titles and summaries",
      "Link expiry handling",
      "Unit + integration test suite",
      "Postman API collection",
    ],
    github: "",
    demo: "https://url-shortener-gray-two.vercel.app/",
    screenshot: "/assets/projects/url-shortener.png",
  },
  {
    id: "crop-yield",
    name: "Crop Yield Prediction System",
    year: "2025",
    status: "Prototype",
    short:
      "Raspberry Pi + ESP32 IoT system that reads soil and humidity data over RS485 and recommends suitable crops.",
    problem:
      "Small-scale farming decisions are often made without soil or moisture data, leading to poor crop selection.",
    solution:
      "An IoT system running on a Raspberry Pi with ESP32 sensor nodes communicating over RS485, feeding a FastAPI backend that recommends suitable crops from the collected readings.",
    contribution: [
      "Built the Raspberry Pi + ESP32 sensor pipeline with RS485 communication.",
      "Developed the FastAPI backend that turns sensor readings into crop recommendations.",
      "Diagnosed and fixed a sensor communication failure caused by a baud rate mismatch (9600) and added a regression check for that class of issue.",
      "Manually tested sensor-to-backend data flow across varying soil and moisture conditions.",
    ],
    tech: ["Raspberry Pi", "ESP32", "Python", "FastAPI", "RS485", "Sensors"],
    features: [
      "Live soil and humidity sensing",
      "RS485 sensor bus",
      "Crop recommendation API",
      "Regression check for baud-rate faults",
    ],
    github: "",
    demo: "",
  },
];

export type SkillCategory = {
  category: string;
  items: { name: string; note: string }[];
};

export const skills: SkillCategory[] = [
  {
    category: "Programming",
    items: [
      { name: "JavaScript", note: "Primary language for backend and web work" },
      { name: "TypeScript", note: "Typed APIs and application code" },
      { name: "Java", note: "OOP and coursework projects" },
      { name: "Python", note: "IoT backends and scripting" },
      { name: "C", note: "Fundamentals and embedded context" },
      { name: "Bash Scripting", note: "Command-line automation and scripting" },
    ],
  },
  {
    category: "Frontend / Web Development",
    items: [
      { name: "HTML", note: "Semantic page structure" },
      { name: "CSS", note: "Responsive interface styling" },
      { name: "EJS", note: "Server-rendered templates" },
      { name: "React", note: "Component-based web interfaces" },
      { name: "Bootstrap", note: "Responsive UI components" },
    ],
  },
  {
    category: "Testing & QA",
    items: [
      { name: "Mocha", note: "Unit and integration test runner" },
      { name: "Chai", note: "Assertions" },
      { name: "Sinon", note: "Mocking and test isolation" },
      { name: "Postman", note: "API collections and manual exploratory testing" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", note: "Server-side JavaScript runtime" },
      { name: "Express.js", note: "REST APIs with MVC architecture" },
      { name: "FastAPI", note: "Python APIs for IoT data" },
      { name: "JWT Authentication", note: "Token-based auth flows" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", note: "Document storage for app data" },
      { name: "MySQL", note: "Relational schemas and queries" },
      { name: "PostgreSQL", note: "Relational database systems" },
      { name: "Redis", note: "In-memory data store" },
      { name: "PL/SQL", note: "Procedural SQL programming" },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "Docker", note: "Containerised builds" },
      { name: "GitHub Actions", note: "CI workflows" },
      { name: "Vercel", note: "Deployment of full-stack projects" },
      { name: "Linux CLI", note: "Daily driver for development" },
      { name: "Nginx", note: "Web server and reverse proxy" },
    ],
  },
  {
    category: "IoT & Embedded",
    items: [
      { name: "Raspberry Pi", note: "Edge gateway for sensor systems" },
      { name: "ESP32", note: "Sensor nodes" },
      { name: "RS485", note: "Industrial sensor communication" },
      { name: "Arduino", note: "Microcontroller prototyping" },
      { name: "Sensor & Actuator Integration", note: "Integrating multiple sensors and actuators" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Git", note: "Version control" },
      { name: "GitHub", note: "Collaboration and hosting" },
      { name: "VS Code", note: "Editor" },
      { name: "Google Colab", note: "Cloud notebooks" },
      { name: "Kaggle", note: "Data science notebooks and datasets" },
      { name: "Wokwi", note: "Embedded systems simulation" },
      { name: "ThingSpeak", note: "IoT data visualization" },
      { name: "Cisco Packet Tracer", note: "Network simulation" },
    ],
  },
  {
    category: "Currently Learning",
    items: [
      { name: "[ADD TECHNOLOGY]", note: "Update this list as you pick things up" },
    ],
  },
];

export const education = [
  {
    degree: "B.Tech — Computer Science & Engineering (IoT Specialization)",
    place: "Meghnad Saha Institute of Technology, Kolkata, West Bengal",
    period: "2023 — 2027",
    detail:
      "Relevant coursework: Data Structures & Algorithms, OOP, Operating Systems, DBMS, Computer Networking, Software Engineering.",
  },
  {
    degree: "Higher Secondary & Secondary Education",
    place: "Burdwan CNS High School, Burdwan, West Bengal",
    period: "2021 — 2023",
    detail: "Class XII (2023), Class X (2021).",
  },
];

export const achievements = [
  {
    title: "Workshop on LLMs and Generative AI",
    org: "WB DSTBT-Sponsored Industrial Training Program",
    date: "Feb 2025",
    description: "Hands-on workshop covering large language models and generative AI systems.",
  },
  {
    title: "Salesforce Essentials",
    org: "Industrial Training & Internship",
    date: "Aug — Oct 2025",
    description: "Industrial training program covering Salesforce fundamentals.",
  },
  {
    title: "Node.js & Express.js Essentials",
    org: "NSDIP (under NITI Aayog, Govt. of India)",
    date: "Jan — Apr 2025",
    description: "Backend development program. Score: 87/100.",
  },
  {
    title: "Hackfest 2025",
    org: "Hackathon",
    date: "2025",
    description:
      "Led a 3-member team, coordinating problem ideation and prototype delivery under time constraints.",
  },
];

export type GalleryItem = { src: string; title: string; description: string };

/** Add local images here — e.g. import shot from "@/assets/shot.jpg.asset.json" */
export const gallery: GalleryItem[] = [
  {
    src: profile.photo,
    title: "Profile Photo",
    description: "[ADD MORE GALLERY IMAGES — project screenshots, hardware photos, certificates]",
  },
];

export const recycleBin = [
  { name: "bug-final-final-v4.txt", note: "It was a semicolon. It is always a semicolon." },
  { name: "portfolio-old-design.zip", note: "Three gradients too many." },
  { name: "definitely-not-production.exe", note: "Ran it once. Never again." },
  { name: "works-on-my-machine.log", note: "Baud rate: 9600. Sensor: unimpressed." },
  { name: "notes-2am.md", note: "Genius ideas, illegible handwriting." },
];
