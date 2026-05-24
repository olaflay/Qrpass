# QRPass

A modern QR-based QRPass generator built for small and medium-sized events.  
Create branded digital passes, manage attendees, generate QR codes, and export downloadable PNG/PDF passes from a fast, mobile-first interface.

---

## Features

- QR-based digital passes
- PNG/PDF pass exports
- Real-time pass preview
- Event branding customization
- Attendee management
- CSV attendee uploads
- QR verification states
- Mobile-first responsive UI
- Dark/light mode support
- Multi-event dashboard

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui

### Backend
- Supabase
- PostgreSQL

### Deployment
- Vercel

---

## Local Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd QRPass
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

### 4. Run Development Server

```bash
npm run dev
```

Application runs on:

```txt
http://localhost:3000
```

---

## Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```txt
QRPass/
│
├── app/                     # Next.js app router
├── components/              # Reusable UI components
├── features/                # Feature-based modules
├── lib/                     # Utilities/helpers
├── hooks/                   # Custom hooks
├── services/                # API/services
├── styles/                  # Global styles
├── types/                   # TypeScript types
├── public/                  # Static assets
│
├── docs/
│   ├── PRD.md
│   ├── styles.md
│   ├── architecture.md
│   ├── components.md
│   ├── ux-flow.md
│   ├── acceptance-criteria.md
│   └── todo.md
│
└── README.md
```

---

## Core Functionality

### Event Creation
Users can:
- create events
- customize branding
- upload banner images
- choose pass templates

---

### Attendee Management
Users can:
- manually add attendees
- upload CSV files
- edit attendee records
- regenerate passes

---

### QR Pass Generation
Each attendee receives:
- unique QR code
- unique pass ID
- branded digital pass

---

### Export System
Passes can be exported as:
- PNG
- PDF

---

### Verification System
QR codes support:
- valid state
- used state
- invalid state

---

## Documentation

- `PRD.md` — Product requirements
- `styles.md` — UI/UX design system
- `architecture.md` — Technical architecture
- `components.md` — Component system
- `ux-flow.md` — UX flows and interactions
- `acceptance-criteria.md` — QA requirements
- `todo.md` — Project execution checklist

---

## Notes

- Built with a mobile-first approach
- Optimized for fast event setup workflows
- Focused on premium UX and visual quality
- Designed as a scalable SaaS MVP

---

## Future Improvements

- Apple Wallet integration
- Google Wallet support
- Email delivery system
- Event analytics
- Multi-admin collaboration
- White-label event branding

---

## License

MIT