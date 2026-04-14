# TalentNG Frontend

A modern talent marketplace platform connecting talents, recruiters, and mentors. Built with Next.js 16, React 18, and TypeScript.

## Overview

TalentNG is a comprehensive platform that enables:
- **Talents** to showcase their skills, apply for opportunities, and connect with mentors
- **Recruiters** to post opportunities, discover talent, and manage applications
- **Mentors** to offer guidance, schedule sessions, and build their reputation

## Tech Stack

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4

### State & Data
- **State Management**: TanStack Query (React Query) v5
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: JWT with HTTP-only cookies

### UI Components
- **Component Library**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast)
- **Theming**: next-themes

### Testing
- **Unit/Integration**: Vitest + Testing Library
- **Visual Regression**: Playwright
- **Property-Based Testing**: fast-check
- **API Contract Testing**: Custom TypeScript tooling

### Development Tools
- **Linting**: ESLint 9 + TypeScript ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Bundle Analysis**: @next/bundle-analyzer

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Backend API**: TalentNG API server running (see backend repo)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration (Required)
NEXT_PUBLIC_TALENTNG_API_URL=http://localhost:3000/api/v1

# JWT Secret (Required for development)
JWT_SECRET=your-secret-key-here

# Development Credentials (Optional - for testing)
EMAIL=your-test-email@example.com
PASSWORD=your-test-password
```

See `.env.example` for a complete template.

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Set up git hooks
npm run prepare
```

### Development

```bash
# Start development server (localhost:8080)
npm run dev

# Start with mobile device access
npm run dev:mobile

# Get local IP for mobile testing
npm run mobile:ip

# Diagnose network issues
npm run mobile:diagnose
```

The app will be available at:
- **Desktop**: http://localhost:8080
- **Mobile**: http://[your-local-ip]:8080

### Building

```bash
# Type check
npm run typecheck

# Run tests
npm run test

# Build for production
npm run build

# Build with bundle analysis
npm run build:analyze

# Start production server
npm start
```

### Testing

```bash
# Run unit tests (single run)
npm run test

# Run tests in watch mode
npm run test:watch

# Run API contract tests
npm run test:api-contracts

# Run visual regression tests
npm run test:visual

# Run visual tests with UI
npm run test:visual:ui

# Update visual snapshots
npm run test:visual:update
```

### Code Quality

```bash
# Lint code
npm run lint

# Lint and auto-fix
npm run lint:fix

# Format code
npm run format.fix

# Run all checks
npm run audit:all
```

## Project Structure

```
talentng-frontend/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes (login, signup, etc.)
│   ├── (business)/          # Protected business routes (dashboard, profile, etc.)
│   ├── mentors/             # Public mentor discovery
│   ├── opportunities-public/ # Public opportunity listings
│   ├── recruiters/          # Public recruiter profiles
│   └── talents/             # Public talent discovery
├── components/              # React components
│   ├── discover-talent/     # Talent discovery features
│   ├── employer/            # Recruiter-specific components
│   ├── forms/               # Form components
│   ├── landing/             # Landing page sections
│   ├── layouts/             # Layout components (sidebars, modals)
│   ├── mentor/              # Mentor-specific components
│   ├── navigation/          # Navigation components
│   ├── onboarding/          # Onboarding flow
│   ├── performance/         # Performance monitoring
│   ├── public/              # Public-facing components
│   ├── support/             # Support ticket system
│   ├── talent/              # Talent-specific components
│   ├── ui/                  # Reusable UI primitives
│   └── verification/        # Business verification
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
│   ├── api/                 # API client and endpoints
│   ├── auth/                # Authentication utilities
│   ├── constants/           # App constants
│   ├── data/                # Static data and mock data
│   ├── mappers/             # Data transformation
│   ├── theme/               # Theme configuration
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── validations/         # Zod schemas
├── public/                  # Static assets
├── scripts/                 # Build and utility scripts
├── styles/                  # Global styles
├── tests/                   # Test files
│   └── visual-regression/   # Playwright visual tests
└── docs/                    # Documentation

```

## Key Features

### Multi-Role System
- Dynamic role switching (Talent, Recruiter, Mentor)
- Role-specific dashboards and navigation
- Granular permissions and access control

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Orientation-aware layouts

### Performance Optimizations
- Code splitting and lazy loading
- Image optimization
- Virtual scrolling for large lists
- Memoization strategies
- Bundle size monitoring

### Real-time Features
- Server-Sent Events (SSE) for notifications
- Live application status updates
- Real-time interview scheduling

### Accessibility
- WCAG 2.1 AA compliance efforts
- Keyboard navigation support
- Screen reader optimizations
- Touch target sizing (44x44px minimum)

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Prefer named exports over default exports

### Component Patterns
- Co-locate component files with their tests
- Use `.example.tsx` files for component documentation
- Keep components small and focused
- Extract reusable logic into custom hooks

### State Management
- Use TanStack Query for server state
- Use React Context for global UI state
- Avoid prop drilling with composition
- Keep state as local as possible

### Testing
- Write tests for critical user flows
- Use property-based testing for complex logic
- Maintain visual regression test coverage
- Test accessibility with Testing Library

### Git Workflow
- Write clear, descriptive commit messages
- Use conventional commit format when possible
- Keep commits focused and atomic
- Run pre-commit hooks (automatic via Husky)

## Deployment

### Production Build

```bash
# Run pre-deployment checks
npm run pre-deploy

# This runs:
# - Type checking
# - Unit tests
# - Production build
```

### Environment Configuration

Ensure all required environment variables are set in your deployment platform:
- `NEXT_PUBLIC_TALENTNG_API_URL` - Backend API URL
- `JWT_SECRET` - JWT signing secret

### Build Output

The production build creates an optimized bundle in `.next/`:
- Static pages are pre-rendered
- API routes are serverless functions
- Assets are optimized and cached

## Contributing

1. Create a feature branch from `main`
2. Make your changes following the code style guidelines
3. Write/update tests as needed
4. Run `npm run lint:fix` and `npm run format.fix`
5. Ensure all tests pass with `npm run test`
6. Submit a pull request with a clear description

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 8080
npx kill-port 8080
```

**Module not found errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Type errors after dependency update:**
```bash
# Regenerate TypeScript types
npm run typecheck
```

**Mobile device can't connect:**
```bash
# Check network configuration
npm run mobile:diagnose
```

## Documentation

Additional documentation is available in the `docs/` directory:
- API integration guides
- Component examples
- Testing procedures
- Performance optimization guides
- Responsive design patterns

## License

Proprietary - All rights reserved

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `docs/`
