# Shree Hari Mitti ke Bartan 🏺

A modern ecommerce platform for pottery and handicraft products built with React, TypeScript, Vite, and Supabase.

## 🌐 Live Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-success?style=for-the-badge)](https://sumo0207.github.io/Shree-Hari-Mitti-ke-Bartan/)

**Live Website:**  
https://sumo0207.github.io/Shree-Hari-Mitti-ke-Bartan/

**GitHub Repository:**  
https://github.com/Sumo0207/Shree-Hari-Mitti-ke-Bartan

## 🎯 Project Overview

This project is a full-stack web application with separate admin and customer-facing websites, all connected to a Supabase backend database.

## 📁 Project Structure

```
.
├── admin/              # Admin dashboard application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/      # Admin pages (Dashboard, Users, Products, etc.)
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React Context for state management
│   │   └── lib/        # Utilities and Supabase integration
│   ├── package.json
│   └── vite.config.ts
│
├── web/                # Customer-facing website
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/      # Website pages
│   │   ├── components/ # React components
│   │   ├── contexts/   # Auth, Language, Theme, Settings contexts
│   │   ├── hooks/      # Custom React hooks
│   │   ├── locales/    # Multi-language support
│   │   └── lib/        # Utilities and API integration
│   ├── package.json
│   └── vite.config.ts
│
├── supabase/           # Supabase configuration
│   ├── config.toml     # Supabase configuration file
│   └── migrations/     # Database migration files
│
├── package.json        # Root package.json
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sumo0207/Shree-Hari-Mitti-ke-Bartan.git
   cd Shree-Hari-Mitti-ke-Bartan
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install admin dependencies**
   ```bash
   cd admin
   npm install
   cd ..
   ```

4. **Install web dependencies**
   ```bash
   cd web
   npm install
   cd ..
   ```

5. **Setup environment variables**
   
   Create `.env.local` files in both `admin/` and `web/` directories:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Applications

**Admin Dashboard**
```bash
cd admin
npm run dev
```

**Customer Website**
```bash
cd web
npm run dev
```

## 🗄️ Database Setup

The project uses Supabase for backend services. Database migrations are located in `supabase/migrations/`.

To apply migrations:
```bash
npx supabase migration up
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components + shadcn/ui

## 📦 Key Features

- **Admin Dashboard**
  - User management
  - Product management
  - Categories management
  - Gallery management
  - Testimonials management
  - Settings management
  - Analytics dashboard

- **Customer Website**
  - Product showcase
  - Multi-language support
  - User authentication
  - Shopping cart functionality
  - Testimonials section
  - Enquiry forms
  - Responsive design

## 🔐 Environment Variables

Both applications use environment variables to connect to Supabase. **Never commit `.env` files to version control!**

### Example Environment Files

Example environment files are provided for reference:

**Admin Dashboard** (`admin/.env.Example`)
```env
VITE_SUPABASE_URL=        # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=   # Your Supabase anonymous API key
```

**Customer Website** (`web/.env.example`)
```env
VITE_SUPABASE_PROJECT_ID=       # Your Supabase project ID
VITE_SUPABASE_PUBLISHABLE_KEY=  # Your Supabase publishable key
VITE_SUPABASE_URL=              # Your Supabase project URL
```

### Setup Instructions

1. Copy the example file to `.env.local`:
   ```bash
   # For Admin
   cd admin
   cp .env.Example .env.local
   
   # For Web
   cd ../web
   cp .env.example .env.local
   cd ..
   ```

2. Fill in your Supabase credentials in each `.env.local` file:
   - Get your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings
   - For the web app, also provide `VITE_SUPABASE_PROJECT_ID` and `VITE_SUPABASE_PUBLISHABLE_KEY`

3. Never commit `.env.local` files - they are already in `.gitignore`

### Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes (Both) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key for client-side requests | Yes (Admin) |
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Yes (Web) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Yes (Web) |

## 📝 Available Scripts

### Root Level
```bash
npm install    # Install all dependencies
```

### Admin
```bash
cd admin
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

### Web
```bash
cd web
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## 🎨 Styling

Both applications use Tailwind CSS for styling with custom configuration:
- `tailwind.config.js` (admin)
- `tailwind.config.ts` (web)

## 🌍 Multi-Language Support

The web application supports multiple languages. Language files are located in `web/src/locales/`.

## 📚 Component Structure

### Admin Components
- **Layout**: Navigation, sidebars
- **UI**: Buttons, inputs, cards, modals

### Web Components
- **Navigation**: Navbar, footer
- **Forms**: Login, enquiry, testimonials
- **UI**: Product cards, category cards
- **Animations**: Pottery wheel animation, page transitions

## 🔗 Git Workflow

1. Create a feature branch
2. Make changes
3. Commit with clear messages
4. Push to GitHub
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Sumo0207

## 📧 Contact

For questions or support, please contact the project maintainer.

---

**Happy coding! 🎨** 
