# Prompt Optimizer AI

A premium, SaaS-style **Prompt Engineering & Optimization** platform built with React + Vite. Created as a B.Tech Cyber Security mini project, it combines prompt optimization tooling with intelligent security analysis (prompt injection, jailbreak, and PII/sensitive-data detection).

## Features

- **Optimizer** – Rewrite and enhance prompts across multiple modes (clarity, creativity, precision, etc.)
- **Analyzer** – Score prompts on clarity, specificity, structure, and security risk
- **Security Scanning** – Detects prompt injection attempts, jailbreak patterns, and sensitive information (PII) leakage
- **Templates** – Searchable, filterable library of reusable prompt templates
- **History** – Automatic log of past prompt sessions
- **Saved Library** – Bookmark and organize favorite prompts
- **Comparison** – Side-by-side comparison of prompt variants
- **AI Chat** – Conversational interface for iterative prompt refinement
- **Dashboard** – Usage analytics and visual insights
- **Settings** – Theme (dark/light), preferences, and data management

## Tech Stack

- React 18 + Vite 5
- React Router DOM
- Framer Motion (animations)
- Recharts (analytics charts)
- Lucide React (icons)
- React Hot Toast (notifications)
- React Markdown
- Local Storage for persistence (no backend required)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/hadhiabdulla/prompt-optimizer-ai.git

# Move into the project folder
cd prompt-optimizer-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Other Commands

```bash
npm run build      # Create a production build
npm run preview    # Preview the production build locally
npm run lint        # Run ESLint
```

## Project Structure

```
src/
  components/   # Reusable UI components (Sidebar, Topbar, CommandPalette, ScoreRing)
  context/      # Global app state (AppContext)
  data/         # Static data (prompt templates)
  pages/        # Main application pages (Optimizer, Analyzer, Templates, History, etc.)
  utils/        # Shared helper functions
  App.jsx       # Root component with routing/layout
  main.jsx      # Application entry point
```

## Notes

- All data is stored locally in the browser (no external database or API keys required), making the app extremely portable — just clone, install, and run on any machine.
- Designed with a modern glassmorphism UI supporting both dark and light themes.
