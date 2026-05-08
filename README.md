# 🛰️ Space & News Dashboard

A responsive dashboard that tracks the **International Space Station (ISS)** in real time, shows **top news headlines**, and includes a **restricted chatbot** that can only answer from the dashboard data.

## Features
- **ISS live tracking**: position, speed, map path, refresh + auto-update every 15s
- **ISS speed chart**: line chart of last 30 speed samples
- **News dashboard**: category tabs, search, sort, caching
- **News distribution chart**: doughnut chart by category (click slice to switch category)
- **Restricted chatbot**: uses `mistralai/Mistral-7B-Instruct-v0.2` and only answers from ISS + News data
- **Dark/light mode**: persists via localStorage

## Tech stack
- **React + Vite**
- **TailwindCSS**
- **Chart.js + react-chartjs-2**
- **Leaflet + react-leaflet**
- **Hugging Face Inference API**

## Run locally
1. Install deps:

```bash
npm install
```

2. Create `.env`:
   - Copy `.env.example` → `.env`
   - Fill in required variables

3. Start dev server:

```bash
npm run dev
```

## Environment variables
- **`VITE_NEWS_API_KEY`**: GNews API token
- **`VITE_HF_TOKEN`**: Hugging Face Inference API token

## Deployment (Vercel)
- `vercel.json` is included for SPA rewrites.
- In the Vercel dashboard set:
  - `VITE_NEWS_API_KEY`
  - `VITE_HF_TOKEN`

### Live demo
- **Coming soon**: (add your link here)

