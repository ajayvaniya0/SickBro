# Wellbuddy

A personal health awareness coach built with React, TypeScript, and Google Gemini AI. Aligned with UN SDG 3: Good Health and Well-Being.

## Features

- **AI Health Coach**: Chat with an intelligent assistant for personalized health guidance
- **Goal-Based Plans**: Select from predefined health goals to generate actionable 7-day plans
- **Safe & Non-Diagnostic**: Built with safety guardrails — never provides medical diagnoses
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Automatic dark/light theme support

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4
- **Backend**: Express.js, TypeScript (tsx)
- **AI**: Google Gemini API (`@google/genai`)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wellbuddy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env
```

### Development

```bash
# Start frontend (Vite dev server)
npm run dev

# Start backend (Express server with hot reload)
npm run server:dev

# Run both together (in separate terminals)
npm run dev && npm run server:dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
wellbuddy/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── constants/          # App constants
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── server/                 # Backend source
│   └── src/
│       ├── index.ts        # Express server entry
│       ├── services/       # Backend services
│       ├── prompts/        # AI prompts
│       └── safety/         # Safety guardrails
├── public/                 # Static assets
└── dist/                   # Production build output
```

## Environment Variables

Create a `.env` file with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001                    # Optional: backend port
```

## Safety

This application is designed for health awareness and education only. It does **not** provide medical diagnoses, treatment recommendations, or replace professional medical advice. Always consult healthcare professionals for medical concerns.

## License

MIT