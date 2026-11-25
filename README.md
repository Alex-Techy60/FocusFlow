# FocusFlow

**FocusFlow** is a personal productivity and daily planning web application built with React and Vite. Plan your day, manage a reusable task library, organize tasks by category, set up daily schedule sessions, track productivity trends over time, browse past days in history, and personalize your profile — all persisted locally in your browser.

---

## Features

- **Dashboard (Today's Plan)**
  - View, filter (`Pending`, `Completed`, `All`), and toggle today's planned tasks.
  - Quick-add new tasks directly to today's plan or pick existing tasks from your library.
  - Live circular progress ring and quick summary stats (`Planned`, `Done`, `Remaining`).
- **My Tasks (Task Library)**
  - Maintain a master library of all saved tasks with title, description, category, and priority (`High`, `Medium`, `Low`).
  - Search and filter by category or priority, edit or delete tasks, and add any task to today's plan with one click.
- **Categories**
  - Tasks grouped across `Work`, `Study`, `Personal`, `Health`, and `General` with expand/collapse cards, today's completion progress bar, quick-add inside each category, and `+ Today` shortcuts.
- **Sessions**
  - Create custom daily schedule blocks (e.g., *Work: 09:00 – 15:00*, *Study: 16:00 – 18:00*) with color coding, multiple time slots, and active days of the week, plus a weekly overview grid.
- **Progress**
  - Global productivity dashboard with summary cards (`Total Tasks`, `Days Tracked`, `Avg Completion`, `Current Streak`, `Best Day`), a 30-day completion bar chart, and a day-by-day breakdown table.
- **History**
  - Pick any date or jump to any active day to review and update that day's task list and completion rate.
- **Profile**
  - View and edit personal details (`Full Name`, `Age`, `Email`, `Profession`, `Bio`) with lifetime productivity stats.
- **Dynamic Collapsible Sidebar & Responsive UI**
  - Smoothly collapse/expand the sidebar on desktop and slide-over drawer navigation on mobile.
  - All data is automatically saved to `localStorage`.

---

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 8
- **Linter:** Oxlint
- **State & Persistence:** React Context API + `localStorage`
- **Styling:** Vanilla CSS with responsive grid/flexbox layouts

---

## Project Structure

```text
src/
├── assets/                  # SVG icons
├── components/
│   ├── layout/              # Header, Sidebar, Layout & Layout.css
│   ├── progress/            # Circular ProgressBar component & CSS
│   └── tasks/               # TaskSection, TaskList, TaskItem & Task.css
├── context/
│   └── AppContext.jsx       # Global state & localStorage persistence
├── pages/
│   ├── Dashboard.jsx        # Today's Plan view
│   ├── MyTasks.jsx          # Master task library
│   ├── Categories.jsx       # Category-grouped tasks
│   ├── Sessions.jsx         # Daily schedule blocks & weekly overview
│   ├── Progress.jsx         # Productivity stats, chart & breakdown
│   ├── History.jsx          # Date browser & past task lists
│   └── Profile.jsx          # User profile & overview
├── App.jsx                  # Root component & page routing
├── App.css                  # Shared UI styles
├── index.css                # Base reset & typography
└── main.jsx                 # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle into `dist/` |
| `npm run lint` | Run Oxlint across the codebase |
| `npm run preview` | Preview the production build locally |
