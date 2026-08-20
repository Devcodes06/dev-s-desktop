# Dev's Desktop

BUILD PROMPT — WINDOWS 11 INSPIRED DEVELOPER PORTFOLIO

Build me a complete, responsive, self-hostable developer portfolio website designed as a modern Windows 11-inspired desktop environment.

This is NOT a normal portfolio website with a Windows-themed background.

The desktop itself is the portfolio UI.

The visitor should feel like they have opened my personal computer and are exploring my profile, projects, resume, skills, social accounts, and other information through desktop icons and application windows.

The design should be heavily inspired by the modern Windows 11 visual language:

Clean desktop

Centered taskbar

Start button

Search button

Rounded windows

Acrylic/glass-like surfaces

Subtle shadows

Modern context menus

System tray

Clock/date

Smooth animations

Clean typography

Minimal visual clutter

Do NOT simply copy Microsoft's proprietary assets or branding. Create an original Windows-11-inspired interface using CSS, SVGs, Lucide icons, and locally supplied assets.

1. CORE EXPERIENCE

When the website loads, show the desktop.

The desktop should contain:

User-selected wallpaper

Desktop icons

Windows-style taskbar at the bottom

Start button

Search

System tray

Wi-Fi/system icons

Battery icon

Volume icon

Current time

Current date

The taskbar should NOT have permanently pinned applications.

Only show:

Start

Search

Dynamic task buttons for currently opened portfolio windows

When no portfolio window is open, the taskbar should remain clean.

When a window opens, its taskbar button should appear automatically.

Example:

START | SEARCH | [My PC] [Projects] [About Me] Wi-Fi 🔊 🔋 10:32 AM
20-08-2026

The taskbar should behave similarly to a modern desktop operating system.

2. DESKTOP

The desktop should initially show these primary icons:

My PC

Resume

Projects

About Me

Tech Stack

Socials

Achievements

Contact

Paint / Gallery

Games

Recycle Bin

Terminal

Do not overcrowd the desktop.

Use a clean grid layout similar to a real operating-system desktop.

Desktop icons should include:

Custom/local icon

Label

Hover state

Selection state

Double-click interaction

Single click:

Select the icon.

Double click:

Open the application/window.

Allow desktop icons to look draggable on desktop-size screens.

3. MY PC

"My PC" should be one of the main portfolio experiences.

Opening My PC should display a modern Windows Explorer-inspired window.

Example structure:

My PC

Quick Access

📄 Resume
📁 Projects
📁 Certifications
📁 Achievements
📁 Education
📁 Experience
📁 About Me

Devices and drives

💻 Developer Drive (C:)

Inside Developer Drive:

/about
/projects
/resume
/skills
/education
/achievements
/contact
/socials

The user should be able to click folders and files.

For example:

Double-click "Resume.pdf"

→ Open resume viewer.

Double-click a project folder

→ Open the project details window.

The Explorer experience should be visually convincing but remain simple enough to navigate.

4. RESUME

Create a dedicated Resume application.

The Resume window should contain:

Professional resume preview

Download Resume button

Open in new tab button

Print button

File metadata such as:

filename

file type

last updated

size

Example:

Debargha_Resume.pdf
PDF Document
Updated: 2026

The resume itself will be provided later by me.

Do NOT invent resume information.

Use placeholder content until I provide the real information.

5. ABOUT ME

Create an "About Me" application.

This should feel like a modern Windows profile/system window rather than a generic portfolio section.

Include:

Profile photo

Name

Short introduction

Education

Current focus

Interests

Career direction

Personal tech interests

Possible structure:

ABOUT ME

[PROFILE PHOTO]

Hi, I'm Dev.

B.Tech Computer Science & Engineering student with a focus on technology, IoT, software development and building practical projects.

Currently Learning
...
...

Interests
...
...

Use cards, tabs, and sections instead of one giant paragraph.

The profile image will be provided by me.

Do not use AI-generated stock people.

6. PROJECTS

Projects are one of the most important sections.

Create a "Projects" desktop application that displays projects in a modern Explorer/card hybrid.

Each project should include:

Project name

Short description

Problem

Solution

Technologies

Features

Screenshots

GitHub link

Live demo if available

My contribution

Project status

Date/year

Example projects will be supplied by me.

Do NOT fabricate projects, links, metrics, users, performance numbers, or achievements.

The project system should be data-driven so I can add a new project by editing a single data object/file rather than rebuilding the UI.

7. CURRENT PROJECT CONTENT

Use the technology/project information I provide later.

Based on my existing technical background, the portfolio may include technologies such as:

Programming:

Java

JavaScript

Python

C/C++

Web:

HTML

CSS

React

Next.js

Node.js

Express.js

Tailwind CSS

Backend:

FastAPI

Flask

Database/Cloud:

MongoDB

Firebase

IoT / Embedded:

Arduino

Raspberry Pi

ESP8266

Sensors

Embedded systems

Tools:

Git

GitHub

Linux

VS Code

These are not hard restrictions.

I am open to learning additional technologies and frameworks.

Architect the portfolio so technologies can easily be added later.

Do not artificially claim proficiency levels such as:

React: 93%
Python: 87%

Avoid meaningless percentage skill bars.

Instead categorize technologies as:

Comfortable With
Working Knowledge
Currently Learning
Exploring

Only use these categories based on information I provide.

8. TECH STACK WINDOW

Create a "Tech Stack" application inspired by Windows Settings / Device Manager.

Categories should include:

Programming
Web Development
Backend
Databases
Cloud
IoT & Embedded
Tools
Currently Learning

Use clean icon cards.

Each technology should display:

Technology name
Category
Short description

Optional:

GitHub/project references where relevant.

Keep this section honest.

No fake certifications or fake expertise.

9. SOCIALS

Create a "Socials" application.

Include cards/buttons for:

GitHub

LinkedIn

Email

LeetCode

Other profiles I provide later

Each social account should use an appropriate icon.

Clicking a social account should open the real profile in a new browser tab.

Do NOT use fake URLs.

Until I provide the links, use clearly labeled placeholders.

10. ACHIEVEMENTS

Create an Achievements application.

Display:

Hackathons

Certifications

Awards

Competitions

Academic achievements

Important milestones

Each achievement should have:

Title
Organization
Date
Description
Certificate/image if available

Use a clean timeline/card layout.

11. CONTACT

Create a Contact application.

Show:

Email
GitHub
LinkedIn
Other relevant links

Optional contact form:

Name
Email
Message
Send

The contact form should NOT pretend to send messages if there is no backend.

For the first version, the form can either:

use a real self-hosted backend if implemented
OR

use a mailto fallback

Clearly indicate what happens when the user clicks Send.

12. PAINT / GALLERY

Create a small application called:

Paint

This is not intended to be a full Microsoft Paint clone.

Use it as a visual gallery for:

Project screenshots

Hackathon photos

IoT hardware photos

Raspberry Pi/Arduino projects

Certificates

Other portfolio images

Create a simple image viewer with:

Previous

Next

Zoom

Fullscreen

Image title

Description

All images should come from local assets supplied by me.

Do NOT load random external image URLs.

13. TERMINAL

Create an interactive terminal application.

Style:

Dark terminal
Monospace font
Cursor animation
Typing effects

Support commands such as:

help
about
skills
projects
resume
contact
socials
clear
whoami
github

Example:

C:\Users\Dev> whoami

Dev
Computer Science & Engineering Student
IoT / Software / Embedded Systems

Example:

C:\Users\Dev> projects

Available projects:

GreenShelf

Crop Yield Prediction

IoT Projects

...

Commands should actually navigate/open the corresponding portfolio applications where possible.

Add one or two harmless Easter eggs.

For example:

sudo hire-dev

Response:

Checking credentials...

Access granted.

Good decision.

Do not make the terminal overly complex.

14. GAMES

Add a Games application.

Include only a few small games:

Minesweeper

Snake

One additional simple game

The games should be playable directly inside the portfolio.

Store high scores using localStorage.

Do not let the games dominate the portfolio.

They are Easter eggs/personality features.

15. RECYCLE BIN

Create a Recycle Bin application.

This can be a fun Easter egg.

Possible content:

abandoned project ideas

old designs

funny developer mistakes

unused concepts

Example:

bug-final-final-v4.txt
portfolio-old-design.zip
definitely-not-production.exe

Keep this tasteful.

Do not put anything offensive or embarrassing.

16. START MENU

Implement a modern Windows 11-inspired Start Menu.

Click Start:

Open centered/floating rounded Start Menu.

Include:

Top:

Profile picture
Dev

Search/apps section

Recommended:

Resume
Projects
About Me
Contact

Pinned:

My PC
Terminal
Tech Stack
Socials
Games

Bottom:

Settings
Power

The Start Menu should have polished animations.

Power options can be an Easter egg.

For example:

Restart Portfolio

→ brief transition

→ desktop reload animation.

Do not actually shut down the browser.

17. SEARCH

The taskbar Search button should open a Windows-inspired search interface.

The visitor can search for:

projects
skills
technologies
certifications
achievements
resume
contact
socials

Search results should display matching portfolio content.

Example:

Search:

Raspberry Pi

Results:

Crop Yield Prediction
IoT Projects
Embedded Skills
Projects Gallery

Clicking a result should open the correct window.

18. WINDOW SYSTEM

This is extremely important.

Every major portfolio application should open inside a desktop-style window.

Windows need:

Title bar

App icon

Minimize button

Maximize button

Close button

Rounded corners

Shadows

Smooth opening animation

Support:

Drag

Resize where appropriate

Minimize

Maximize

Restore

Close

Windows should have a proper z-index/focus system.

Clicking a window brings it to the front.

Minimizing moves it to the taskbar.

Clicking its taskbar button restores it.

Double-clicking the title bar toggles maximize.

On mobile/tablet:

Do NOT force desktop behavior.

Switch to a responsive mobile interface.

The desktop OS experience should be primarily optimized for desktop/laptop screens.

19. RIGHT-CLICK DESKTOP MENU

Implement a custom desktop context menu.

Right-click empty desktop space:

New
Refresh
Display Settings
Personalize
Terminal

Refresh should trigger a small desktop refresh animation.

Personalize can optionally show:

Wallpaper
Theme
Clock format

Do not create unnecessary fake system settings.

20. TASKBAR

Taskbar should be:

Fixed

Bottom aligned

Slightly translucent

Rounded modern Windows-inspired styling

Centered Start/Search

Dynamic application buttons

System tray on right

System tray:

Wi-Fi
Volume
Battery
Current time
Current date

Do NOT pin:

Chrome
GitHub
Spotify
VS Code
etc.

The taskbar should only display open portfolio applications.

21. WALLPAPER

I will provide the main desktop wallpaper myself.

IMPORTANT:

Do NOT search the web for a wallpaper.

Do NOT download one automatically.

Use the image asset I upload.

Store it locally, for example:

/public/assets/wallpaper/

Create the desktop so changing the wallpaper later requires replacing only one asset/config value.

Support:

cover
center
no-repeat

Make sure text/icons remain readable against the wallpaper.

If the supplied wallpaper is visually busy, use a subtle desktop readability layer rather than destroying the original image.

22. VISUAL STYLE

The visual direction should be:

Modern Windows 11

developer portfolio

subtle futuristic aesthetic

clean UI

Use:

Rounded corners

Glass/translucent panels

Subtle blur

Soft shadows

Thin borders

Modern typography

Good spacing

Smooth micro-interactions

Do NOT make every component glassmorphism.

Avoid:

excessive gradients

glowing neon everywhere

giant text

flashy animations

particle backgrounds

excessive 3D effects

generic SaaS dashboard styling

The website should feel like an operating system, not a crypto landing page.

23. COLORS

Use the supplied wallpaper as the visual foundation.

Use adaptive neutral UI colors:

white

dark charcoal

translucent white

translucent dark

subtle blue accent

Allow dark/light UI adaptation if practical.

Default should work beautifully with the supplied wallpaper.

Maintain strong accessibility and text contrast.

24. TYPOGRAPHY

Use a modern readable system font stack.

Prefer:

Segoe UI / Inter / system-ui

Do not use a pixel font.

The goal is modern Windows 11, not Windows 95.

25. MICRO-INTERACTIONS

Add subtle animations:

Desktop icon hover

Icon selection

App launch

Window open

Window close

Start Menu open

Search open

Taskbar interaction

Minimize

Maximize

Context menu

Notification popups

Animations should be fast and smooth.

Do not make users wait through long animations.

26. NOTIFICATIONS

Create occasional Windows-inspired desktop notifications.

Examples:

"New Project Available"
"Resume Updated"
"Welcome to Dev's Desktop"
"Tip: Try the Terminal"
"Did you know?"

Notifications should not appear constantly.

They should feel like small Easter eggs.

Allow the notification to be dismissed.

27. PROFILE / PERSONALIZATION

Create a configuration file where I can easily update:

name
profile image
bio
email
social links
resume path
wallpaper path
projects
skills
education
achievements
certifications

The UI should consume this data rather than hard-coding information everywhere.

This is important because I will continuously update my portfolio.

28. TECHNICAL STACK

Build this as a modern web application.

Preferred:

React
TypeScript
Vite
Tailwind CSS
Lucide React

Use Framer Motion or another lightweight animation library only where it genuinely improves the UI.

Use local/static assets wherever possible.

The site must NOT depend on:

WordPress

Wix

Webflow

Framer

external CMS

external portfolio services

The final application must be fully self-hostable.

29. SELF-HOSTING

The finished project must be deployable using:

Docker

and should work behind:

Nginx / Caddy / reverse proxy

It should be possible to deploy it to:

VPS

Home server

Raspberry Pi if performance allows

Cloud VM

Any standard static hosting environment if backend functionality is not required

Do not create unnecessary backend infrastructure.

Keep the first version mostly static/client-side.

30. PERFORMANCE

Performance matters.

Do not sacrifice performance for visual effects.

Optimize:

image loading

animations

project screenshots

fonts

JavaScript bundles

Use lazy loading for gallery images.

Do not load every image on initial page load.

31. MOBILE EXPERIENCE

This is still a portfolio website.

A mobile visitor should not receive a broken desktop simulator.

On mobile:

Replace the desktop environment with a simplified responsive version.

Possible mobile structure:

Top bar
Profile
Apps
Projects
Resume
Skills
Contact
Socials

Keep the visual language consistent with the desktop version.

Desktop:

Operating-system experience.

Mobile:

Modern portfolio experience inspired by the same OS.

32. ACCESSIBILITY

Support:

Keyboard navigation
Visible focus states
ARIA labels
Readable contrast
Reduced motion preference

Add keyboard shortcuts where useful.

For example:

Ctrl + K
→ Search

Esc
→ Close active modal/window

Alt + Tab
→ Optional open-window switching

Do not make accessibility dependent on mouse interaction.

33. EASTER EGGS

Include a small number of hidden interactions.

Examples:

Terminal:
sudo hire-dev

Recycle Bin contains funny old project filenames.

Konami-code-style hidden interaction.

A "Do Not Click" button that produces a harmless fake system warning.

Shutdown/Restart portfolio animation.

Secret terminal command.

Do not make Easter eggs interfere with normal navigation.

34. CONTENT RULE

This rule is critical:

NEVER invent personal information.

Do not fabricate:

internships

jobs

company names

GitHub repositories

projects

awards

certifications

grades

statistics

users

revenue

performance numbers

skills I do not have

Use placeholders when information has not yet been provided.

Example:

[ADD LINK]
[ADD PROJECT DESCRIPTION]
[ADD CERTIFICATION]
[ADD PROFILE PHOTO]

I will provide the actual data.

35. FIRST VERSION PRIORITY

Build in this order:

PHASE 1

Desktop
Wallpaper
Desktop icons
Taskbar
Clock/date
Start Menu

PHASE 2

Window system
Dragging
Minimize
Maximize
Close
Taskbar application buttons

PHASE 3

My PC
Resume
About Me
Projects

PHASE 4

Tech Stack
Achievements
Socials
Contact

PHASE 5

Terminal
Paint/Gallery
Games
Recycle Bin

PHASE 6

Search
Notifications
Context menus
Easter eggs

PHASE 7

Responsive mobile UI
Accessibility
Performance optimization
Self-hosting setup
Docker configuration

Do not build everything as one giant component.

Use clean reusable components and a proper data-driven architecture.

36. IMPORTANT ASSET RULE

I will upload the visual assets myself.

Use my uploaded assets whenever available.

Do NOT replace my images with stock images.

Do NOT generate random profile photos.

Do NOT use random external URLs.

Create an assets directory such as:

/public/assets/

Suggested structure:

/public/assets/wallpaper/
/public/assets/profile/
/public/assets/projects/
/public/assets/certifications/
/public/assets/achievements/
/public/assets/gallery/
/public/assets/icons/

Make the application automatically use these local assets.

37. EXPECTED FINAL RESULT

The final result should feel like:

"I opened Dev's computer."

Not:

"I opened another developer portfolio."

The visitor should be able to immediately discover:

Who I am
What I build
What technologies I use
My projects
My resume
My achievements
My social profiles
How to contact me

while the desktop experience adds personality and memorability.

The interface should be polished enough for recruiters, but playful enough that developers will want to explore it.

Build the application with production-quality component structure, clean code, responsive behavior, and easy-to-edit portfolio data.

Start by implementing the desktop shell and window-management system first, then add portfolio applications progressively.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/368d6222-1847-44ca-8125-3440c29c20d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
