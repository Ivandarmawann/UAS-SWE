# EcoMarket E-commerce Platform

## Overview

EcoMarket is a modern e-commerce platform built with React and Express, designed to connect buyers and sellers in a marketplace environment. The application features role-based authentication, product management, and order processing, with data stored in Google Sheets via Google Apps Script.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Next.js with App Router for SSR and deployment optimization
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Routing**: Next.js App Router for file-based routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **API Routes**: Next.js API Routes with App Router
- **Deployment**: Optimized for Vercel hosting
- **Development**: Next.js development server with hot reload
- **Data Layer**: Google Apps Script as backend API (no traditional database)

### UI Component System
- **Base**: Radix UI primitives for accessibility
- **Styling**: shadcn/ui components with Tailwind CSS
- **Theme**: CSS variables for consistent theming
- **Icons**: Lucide React for iconography

## Key Components

### Authentication System
- Role-based authentication (buyer/seller)
- JWT-like session management via localStorage
- Protected routes based on user roles
- Automatic redirection based on authentication state

### Product Management
- CRUD operations for products
- Image upload with base64 encoding
- Category-based filtering
- Stock management
- Status tracking (active/inactive)

### Order Processing
- Shopping cart functionality
- Order creation and tracking
- Seller-buyer relationship management
- Real-time stock updates

### User Interface
- Responsive design for mobile and desktop
- Dark/light theme support
- Loading states and error handling
- Toast notifications for user feedback

## Data Flow

### Authentication Flow
1. User registers/logs in through auth forms
2. Credentials validated via Google Apps Script
3. User data stored in localStorage
4. Protected routes check authentication status
5. Automatic redirection based on user role

### Product Management Flow
1. Sellers create/edit products through forms
2. Data validated with Zod schemas
3. Images converted to base64 for storage
4. Products stored in Google Sheets
5. Real-time updates via React Query

### Order Processing Flow
1. Buyers browse products with filtering
2. Orders created with quantity and pricing
3. Stock validation and updates
4. Order data stored in Google Sheets
5. Notifications sent to relevant parties

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight routing solution
- **zod**: Schema validation and type inference
- **drizzle-orm**: ORM for potential database migration

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- Next.js development server with hot reload
- TypeScript checking and error overlay
- App Router for modern React patterns
- Optimized for Vercel deployment

### Production Build
- Next.js builds optimized static and server-side rendered assets
- Automatic code splitting and optimization
- API routes for serverless functions
- Environment variable configuration for Vercel

### Database Strategy
- Currently uses Google Sheets via Apps Script
- Drizzle ORM configured for future PostgreSQL migration
- Schema definitions prepared for database transition
- Migration scripts ready for deployment

### Hosting
- Optimized for Vercel deployment
- Serverless functions for API routes
- Static site generation where applicable
- Environment variables managed through Vercel dashboard

## Changelog

- June 14, 2025. Initial setup with Google Apps Script integration
- June 14, 2025. Fixed CORS issues and API communication with Google Spreadsheet
- June 14, 2025. Fixed UI component errors (SelectItem value prop issues)
- June 14, 2025. Improved error handling and debugging for API calls
- June 14, 2025. Fixed product filtering issue - changed from userId to email matching for both seller and buyer dashboards
- June 14, 2025. Completed migration from Replit Agent to standard Replit environment
- June 14, 2025. Fixed infinite loop in BuyerDashboard by replacing useEffect with useMemo
- June 14, 2025. Resolved user ID mapping issues between login data and spreadsheet data
- June 14, 2025. Fixed seller dashboard to properly display products and orders using UUID mapping
- June 14, 2025. Migrated from Vite to Next.js App Router structure for Vercel hosting compatibility

## User Preferences

Preferred communication style: Simple, everyday language.