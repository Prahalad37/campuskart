# CampusKart - Institutional Shopping Platform

A production-ready Next.js 14 application for educational institutions built with TypeScript, TailwindCSS, and Supabase.

## Features

- 🎓 Institutional-focused design
- 📱 Mobile-first responsive layout
- 🔒 Secure Supabase backend
- ⚡ Fast performance (optimized for low-end devices)
- 🎨 Formal, trust-focused UI
- 📦 PWA-ready structure

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd Campus_Kart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from `DATABASE_SCHEMA.md`
   - Insert sample data for testing

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page (QR entry)
│   ├── s/[slug]/            # School page
│   ├── class-selection/     # Class selection
│   ├── products/            # Product bundle page
│   └── checkout/            # Checkout page
├── components/              # Reusable components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/                     # Utilities and helpers
│   ├── supabase.ts         # Supabase client & helpers
│   └── utils.ts            # General utilities
└── types/                   # TypeScript types
    └── index.ts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Database Schema

See `DATABASE_SCHEMA.md` for complete database structure and setup instructions.

### Main Tables

- **schools** - Educational institutions
- **classes** - Class/grade information
- **products** - Available products
- **class_products** - Junction table for class-product relationships
- **orders** - Customer orders

## Design System

### Color Palette

- Primary: `#0B1F3A` (Deep navy blue)
- Secondary: `#2E3A4A` (Medium gray-blue)
- Accent: `#C6A96B` (Gold)
- Background: `#F7F8FA` (Light gray)

### Typography

- Font: Inter (Google Fonts)
- Formal, institutional styling
- Mobile-optimized sizes

## Development Guidelines

1. **Always use TypeScript** - Leverage type safety
2. **Mobile-first** - Design for mobile, enhance for desktop
3. **Formal UI** - Maintain institutional, trust-focused design
4. **Performance** - Optimize for low-end Android devices
5. **Accessibility** - Follow WCAG guidelines

## Supabase Integration

The app uses Supabase for backend data. Helper functions are available in `src/lib/supabase.ts`:

- `getSchoolBySlug(slug)` - Fetch school by slug
- `getClassesBySchoolId(schoolId)` - Fetch classes for a school
- `getProductsByClassId(classId)` - Fetch products for a class
- `createOrder(orderData)` - Create a new order

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js 14:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for production) | No |

## Contributing

1. Follow the existing code style
2. Maintain the institutional UI aesthetic
3. Test on mobile devices
4. Update documentation as needed

## License

Proprietary - All rights reserved

## Support

For support, email: support@campuskart.com
