# KaraLab - AI-Powered Karaoke Practice Platform

## Project Overview

KaraLab is a personal karaoke laboratory platform that combines YouTube karaoke video search with AI-powered vocal evaluation. Users can search, queue, play karaoke videos, practice with real-time microphone visualization, record performances, and receive AI feedback on their singing.

**Target Users**: Individual karaoke enthusiasts practicing at home

**Core Value**: AI-driven vocal feedback to improve singing skills

## Tech Stack

### Frontend
- **SvelteKit 2.0**: Full-stack framework with file-based routing
- **Svelte 5**: UI framework with runes API ($state, $props, $derived, $effect)
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS**: Utility-first styling

### APIs & Services
- **YouTube Data API v3**: Video search and metadata
- **Google Gemini API**: AI-powered vocal evaluation
- **Web Audio API**: Microphone capture and audio visualization

### Storage
- **localStorage**: Queue persistence and user preferences
- **IndexedDB**: (via browser) Recording storage

## Project Architecture

### Directory Structure

```

src/
├── routes/              \# SvelteKit routes (pages \& API endpoints)
│   ├── api/            \# Server-side API routes (+server.ts)
│   ├── search/         \# Search page with YouTube integration
│   ├── player/         \# Video player with queue integration
│   ├── practice/       \# Practice mode with mic visualization
│   ├── recordings/     \# Recording history with AI scores
│   ├── playlists/      \# Playlist management
│   ├── queue/          \# Queue management
│   └── settings/       \# User preferences
├── lib/
│   ├── components/     \# Reusable Svelte components
│   ├── stores/         \# Svelte stores for global state
│   ├── utils/          \# Helper functions
│   └── types.ts        \# TypeScript type definitions
├── app.css             \# Global Tailwind imports
└── app.html            \# HTML template

```

## Key Features Implementation

### YouTube Search \& Filtering

- Filter karaoke/instrumental vs vocal versions using keyword matching
- Sort by relevance, view count, or upload date
- Implement debounced search to reduce API calls
- Cache search results to minimize quota usage


### Queue System

- Persistent queue using localStorage
- Drag-and-drop reordering
- Auto-play next song on completion
- Queue operations: add, remove, reorder, clear


### Recording \& AI Evaluation

- Use MediaRecorder API to capture audio
- Store recordings in IndexedDB with metadata (date, song info)
- Send audio to Google Gemini API for evaluation
- Display AI feedback with scores and improvement suggestions


### Audio Visualization

- Use Web Audio API AnalyserNode for real-time frequency data
- Canvas-based visualization

## Build \& Deployment

### Development

```bash
pnpm dev              # Start dev server (localhost:5173)
pnpm check            # Type checking
pnpm lint             # ESLint
pnpm format           # Prettier formatting
```

### Production

```bash
pnpm build            # Build for production
pnpm preview          # Preview production build
```