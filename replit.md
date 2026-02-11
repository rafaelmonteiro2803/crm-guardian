# CRM Supabase

## Overview
A CRM (Customer Relationship Management) system built with React, Vite, and Supabase. It manages clients, sales pipeline opportunities, sales records, and payment titles.

## Tech Stack
- **Frontend**: React 18 with Vite 5
- **Styling**: Tailwind CSS 3 with PostCSS/Autoprefixer
- **Icons**: Lucide React
- **Backend/Database**: Supabase (external service)
- **Language**: JavaScript (JSX)

## Project Structure
- `src/App.jsx` - Main application component (single-file CRM app)
- `src/main.jsx` - React entry point
- `src/index.css` - Tailwind CSS imports and global styles
- `index.html` - HTML entry point
- `vite.config.js` - Vite configuration (port 5000, all hosts allowed)
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key

## Running
- Dev server: `npm run dev` (port 5000)
- Build: `npm run build`
- Preview: `npm run preview`
