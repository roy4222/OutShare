# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OutShare** is a personalized portfolio platform for outdoor enthusiasts - an "outdoor version of Linktree" where users can showcase their trips, equipment, and social media presence.

**Core Features:**
- User profiles with customizable details (avatar, bio, social links)
- Trip documentation with images, markdown descriptions, and equipment tracking
- Gear inventory with categorization and specifications
- Trip-gear relationships for detailed planning
- Google OAuth authentication via Supabase Auth
- Multi-language support (Traditional Chinese)

**Tech Stack:**
- **Frontend**: Next.js 15.5.2 (App Router), React 19, Tailwind CSS v4, Shadcn/ui
- **Backend**: Supabase Auth (OAuth), PostgreSQL (Supabase-hosted)
- **ORM**: Prisma 6.17.1 (migrating to Drizzle - see `docs/PRISMA_TO_DRIZZLE_MIGRATION.md`)
- **Deployment**: Cloudflare Pages/Workers with OpenNext.js
- **Planned**: Cloudflare R2 for image storage, Imgproxy for optimization

## Directory Structure

```
app/
├── (protected)/          # Protected routes (require auth)
│   ├── AuthGuard.tsx    # Auth wrapper component
│   ├── layout.tsx       # Protected layout
│   ├── TripDashboard/   # Trip management
│   ├── GearDashboard/   # Equipment management
│   └── ProfileEdit/     # Profile editing
├── api/                 # API Routes
│   ├── trips/          # Trip CRUD endpoints
│   ├── profiles/       # Profile endpoints
│   └── equipment/      # Equipment CRUD endpoints
├── auth/               # OAuth flows
│   ├── callback/       # OAuth callback handler
│   └── auth-code-error/
├── profile/[username]/ # Public profile view
└── page.tsx            # Home/login page

lib/
├── supabase/           # Supabase client setup (auth only)
│   ├── client.ts       # Browser client
│   ├── server.ts       # Server client
│   └── middleware.ts   # Session update
├── db/
│   └── schema.ts       # Drizzle schema (in progress)
├── services/prisma/    # Business logic layer
│   ├── trips.service.ts
│   ├── equipment.service.ts
│   └── profiles.service.ts
├── hooks/              # React hooks
│   ├── useAuth.ts      # Auth state management
│   ├── useTrips.ts     # Fetch trips
│   ├── useEquipment.ts # Fetch equipment
│   ├── useProfile.ts   # Fetch profile
│   └── useProtectedUser.tsx # Protected route context
├── mappers/            # Data transformers (DB → Domain)
├── types/              # TypeScript definitions
├── prisma.ts           # Prisma client singleton
└── utils.ts            # Utility functions (cn for CSS)

components/features/
├── layout/             # Navbar, Sidebar, TabLayout
├── profile/            # ProfileHeader, ProfileEditForm, SocialLinks
├── trips/              # TripCard, TripDetail, TripDialog, TripList
├── equipment/          # EquipmentCard, EquipmentList, EquipmentGroup
└── dashboard/          # GearCategoryModal

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Database migrations
```

## Architecture Patterns

### Layered 3-Tier Architecture

```
Components/Pages (UI Layer)
    ↓ useState, useEffect
Custom Hooks (Data Fetching)
    ↓ fetch API
API Routes (Business Logic)
    ↓ auth check, validation
Prisma Services (Database Access)
    ↓ database queries
Prisma Client → PostgreSQL
    ↓ return data
Mappers (Transform DB → Domain)
    ↓ return to hook
Component renders UI
```

**Key Principles:**
1. **Separation of Concerns**: Components handle UI only, hooks handle data fetching, services handle business logic
2. **Authentication-First**: Middleware refreshes session on every request, protected routes use AuthGuard
3. **Type Safety**: Prisma generates types, mappers transform DB records to domain models
4. **Error Handling**: Services return `{ data, error }` tuple pattern

### Database Schema (Prisma)

**Core Models:**
- **Profile**: User profiles (user_id PK from Supabase Auth)
  - Fields: username, display_name, bio, avatar_url, social_links (JSONB), gear_dashboard_title
  - Relations: trips[], gear[]

- **Trip**: Travel records
  - Fields: id, user_id, title, description, location, duration, date, images[], tags[], slug
  - Relations: profile, trip_gear[]

- **Gear**: Equipment inventory
  - Fields: id, user_id, name, category, description, image_url, specs (JSONB), tags[]
  - Relations: profile, trip_gear[]

- **TripGear**: Junction table for trip-gear many-to-many relationship
  - Fields: id, trip_id, gear_id
  - Unique constraint: [trip_id, gear_id]

## Authentication System

**Files:**
- `lib/supabase/client.ts` - Browser client for auth (signInWithOAuth, signOut, getUser)
- `lib/supabase/server.ts` - Server client for auth in API routes
- `middleware.ts` - Session refresh on every request
- `lib/hooks/useAuth.ts` - React hook for auth state
- `lib/hooks/useProtectedUser.tsx` - Context for protected routes

**Flow:**
1. User clicks "使用 Google 帳號登入" → Google OAuth → callback to `/auth/callback`
2. Middleware refreshes session on every request
3. Protected routes use `AuthGuard` component
4. API routes verify user with `createClient().auth.getUser()`

**Important Notes:**
- **Supabase client is for AUTH ONLY** - use Prisma services for database queries
- Use `lib/supabase/client.ts` in browser components
- Use `lib/supabase/server.ts` in API routes and server components
- Session cookies automatically handled by Supabase SSR middleware

## API Design

### API Routes Pattern

All routes in `/app/api/` follow REST conventions:

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/trips` | GET | List trips | No |
| `/api/trips` | POST | Create trip | **Yes** |
| `/api/trips/[id]` | PUT/DELETE | Update/delete trip | **Yes** (ownership check) |
| `/api/equipment` | GET/POST | List/create equipment | GET: No, POST: **Yes** |
| `/api/equipment/[id]` | PUT/DELETE | Update/delete equipment | **Yes** (ownership check) |
| `/api/profiles` | GET/PUT | Get/update current user profile | **Yes** |
| `/api/profiles/[username]` | GET | Get public profile | No |

**Standard Pattern:**
1. Parse query parameters or request body
2. Verify authentication (for protected endpoints)
3. Validate input
4. Call Prisma service with userId
5. Return `{ data }` or `{ error }` JSON response

**Service Return Pattern:**
```typescript
const { data, error } = await getTripList({ userId });
if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}
return NextResponse.json({ data });
```

## Data Fetching with Custom Hooks

**Available Hooks:**
- `useAuth({ requireAuth?, redirectTo? })` - Auth state (user, loading, signOut, refetch)
- `useRequireAuth()` - Auth required variant (redirects if not logged in)
- `useTrips({ userId? })` - Fetch trips (trips, isLoading, error)
- `useEquipment({ userId?, tripId? })` - Fetch equipment
- `useProfile()` - Fetch current user profile
- `useProfileByUsername(username)` - Fetch public profile
- `useProfileEditor(userId)` - Profile edit form state
- `useProtectedUser()` - Get authenticated user from context (in protected routes)

**Pattern:**
```typescript
export function useTrips(options = {}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTrips() {
      try {
        const response = await fetch('/api/trips');
        const { data } = await response.json();
        if (isMounted) setTrips(data || []);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTrips();
    return () => { isMounted = false }; // Cleanup
  }, []);

  return { trips, isLoading, error };
}
```

**Best Practices:**
- Always check `isMounted` before setState to prevent memory leaks
- Separate states for loading, error, and data
- Return cleanup function from useEffect
- Never call hooks conditionally (always at top level)

## Component Architecture

**Server Components (default):**
- Better initial load performance
- Can't use React hooks
- Use for static content, layouts

**Client Components (`'use client'`):**
- Required for hooks, browser APIs, interactivity
- Use for forms, buttons, dialogs, data fetching

**Protected Page Pattern:**
```typescript
// Server component
export default function GearDashboard() {
  return (
    <div>
      <Navbar />
      <AuthGuard>
        <GearContent />
      </AuthGuard>
    </div>
  );
}

// Client component with hooks
'use client';
function GearContent() {
  const user = useProtectedUser(); // From context
  const { equipment } = useEquipment({ userId: user.id });
  return <EquipmentList equipment={equipment} />;
}
```

## Common Development Tasks

### Build & Run Commands

```bash
# Development
pnpm dev                # Start dev server (localhost:3000)
pnpm build              # Build for production
pnpm lint               # Run ESLint
pnpm start              # Start production server (after build)

# Database (Prisma)
pnpm prisma:generate    # Generate Prisma client
pnpm prisma:push        # Sync schema to database (dev)
pnpm prisma:migrate     # Create migration (npx prisma migrate dev --name <name>)
pnpm prisma:studio      # Open Prisma Studio GUI
pnpm db:sync            # Pull schema from DB and generate client

# Supabase (local development)
pnpm supabase:start     # Start local Supabase
pnpm supabase:stop      # Stop local Supabase
pnpm supabase:reset     # Reset local database

# Deployment (Cloudflare)
pnpm preview            # Preview production build
pnpm deploy             # Deploy to Cloudflare Pages
pnpm cf-typegen         # Generate Cloudflare Worker types
```

### Setup Local Development

```bash
# 1. Clone and install
git clone <repo> && cd outdoor-trails-hub
pnpm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with Supabase credentials

# 3. Sync database
npx prisma db push

# 4. Start dev server
pnpm dev
```

### Add New API Endpoint

1. Create `/app/api/[resource]/route.ts`
2. Import Prisma service: `import { getResourceList } from '@/lib/services/prisma'`
3. Implement GET/POST handlers
4. Add auth check for protected endpoints:
   ```typescript
   const supabase = await createClient();
   const { data: { user }, error } = await supabase.auth.getUser();
   if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   ```
5. Call service with ownership check:
   ```typescript
   const { data, error } = await createResource(body, user.id);
   ```

### Update Database Schema

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_field
# 3. Review migration file in prisma/migrations/
# 4. Commit migration to git
```

### Add New React Hook

1. Create `/lib/hooks/use[Feature].ts`
2. Use `useState` and `useEffect` for data fetching
3. Return object with `{ data, isLoading, error }`
4. Export from `/lib/hooks/index.ts`

### Add New Component

1. Create `/components/features/[feature]/[Component].tsx`
2. Define TypeScript interfaces for props
3. Add `'use client'` if component needs hooks
4. Use proper typing:
   ```typescript
   export interface TripCardProps {
     trip: Trip;
     onClick?: () => void;
   }
   export function TripCard({ trip, onClick }: TripCardProps) { ... }
   ```

## Important Do's and Don'ts

### ✅ DO

**Database Queries:**
```typescript
// Use Prisma Services for all database queries
import { getProfileByUserId } from '@/lib/services/prisma';
const { data, error } = await getProfileByUserId(userId);
```

**Authentication:**
```typescript
// Use Supabase client for auth operations
const { error } = await supabase.auth.signOut();
const { data: { user } } = await supabase.auth.getUser();
```

**Protected Routes:**
```typescript
// Use AuthGuard in protected route layout
export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}

// Use useProtectedUser in protected components
const user = useProtectedUser();
```

**Ownership Checks:**
```typescript
// Always verify user owns the resource before update/delete
const existing = await prisma.trip.findUnique({
  where: { id },
  select: { user_id: true }
});

if (existing.user_id !== userId) {
  throw new Error('Unauthorized');
}
```

### ❌ DON'T

**Database Queries:**
```typescript
// Don't use Supabase client for database queries
const { data, error } = await supabase
  .from('profiles')
  .select('*'); // ❌ Use Prisma instead
```

**Authentication:**
```typescript
// Don't query auth.users table directly
const { data } = await supabase.from('auth.users').select('*'); // ❌
```

**Protected Routes:**
```typescript
// Don't manually check auth in each component
const { data: { user } } = await supabase.auth.getUser(); // ❌
if (!user) redirect('/'); // ❌ Use AuthGuard instead
```

## State Management

**No global state library (Redux/Zustand)** - uses:
1. React's `useState` for component-level state
2. Context API for auth state (`ProtectedUserProvider`)
3. Custom hooks for data fetching logic

**Auth State:**
```typescript
const { user, loading, signOut } = useAuth({ requireAuth: true });
```

**Data State:**
```typescript
const { trips, isLoading, error } = useTrips({ userId });
```

**Form State:**
```typescript
const { formState, isSaving, saveProfile } = useProfileEditor(userId);
```

## Ongoing Migration

**Prisma → Drizzle ORM:**
- See `docs/PRISMA_TO_DRIZZLE_MIGRATION.md` for full migration plan
- Drizzle schema defined in `lib/db/schema.ts`
- Drizzle is lighter, better for Cloudflare Workers
- Migration in progress - both ORMs may coexist temporarily

## Image Storage (Planned)

Currently: Image URLs stored in database
Planned: Cloudflare R2 (storage) + Imgproxy (optimization)

**R2 Configuration:**
- Bucket: `outdoor-trails-hub-cache`
- Currently used for Next.js ISR cache only
- Future: Direct image upload endpoint `/api/upload`

## Testing

Run the application and verify:
1. Google OAuth login flow works
2. Protected routes redirect to `/` when not authenticated
3. CRUD operations work (create trip, update profile, delete equipment)
4. Ownership checks prevent unauthorized access
5. Public profile pages accessible without auth

## Build Configuration

**Cloudflare Pages:**
- Build command: `npx prisma generate && next build`
- Framework: Next.js (OpenNext.js adapter)
- Node compatibility: `nodejs_compat` flag enabled
- Environment variables: Set in Cloudflare Pages dashboard

**Important Files:**
- `next.config.ts` - Next.js configuration
- `wrangler.jsonc` - Cloudflare Workers config
- `open-next.config.ts` - OpenNext adapter for Cloudflare
- `middleware.ts` - Session refresh middleware (runs on every request)

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
