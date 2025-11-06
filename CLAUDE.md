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
- **ORM**: Drizzle ORM (migrated from Prisma - see `docs/PRISMA_TO_DRIZZLE_MIGRATION.md`)
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
│   ├── schema.ts       # Drizzle schema
│   └── index.ts        # Drizzle client singleton
├── services/db/        # Business logic layer (Drizzle)
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
├── validation/         # Input validation schemas
└── utils.ts            # Utility functions (cn for CSS)

components/
├── features/           # Feature-specific components
│   ├── layout/         # Navbar, Sidebar, TabLayout
│   ├── profile/        # ProfileHeader, ProfileEditForm, SocialLinks
│   ├── trips/          # TripCard, TripDetail, TripDialog, TripList
│   ├── equipment/      # EquipmentCard, EquipmentList, EquipmentGroup
│   └── dashboard/      # GearCategoryModal
├── shared/             # Shared/reusable components
│   └── modals/         # Modal components
└── ui/                 # Shadcn/ui components

drizzle/                # Drizzle migrations folder
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
Drizzle Services (Database Access)
    ↓ database queries
Drizzle Client → PostgreSQL
    ↓ return data
Mappers (Transform DB → Domain)
    ↓ return to hook
Component renders UI
```

**Key Principles:**
1. **Separation of Concerns**: Components handle UI only, hooks handle data fetching, services handle business logic
2. **Authentication-First**: Middleware refreshes session on every request, protected routes use AuthGuard
3. **Type Safety**: Drizzle provides full TypeScript inference, mappers transform DB records to domain models
4. **Error Handling**: Services return `{ data, error }` tuple pattern

### Database Schema (Drizzle)

**Core Tables:**
- **profiles**: User profiles (user_id PK from Supabase Auth)
  - Fields: user_id, username, display_name, bio, avatar_url, social_links (JSONB), gear_dashboard_title, created_at, updated_at
  - Relations: trips[], gear[]

- **trip**: Travel records
  - Fields: id, user_id, title, description, location, duration, date, images[], tags[], slug, created_at, updated_at
  - Relations: profile, trip_gear[]

- **gear**: Equipment inventory
  - Fields: id, user_id, name, category, description, image_url, specs (JSONB), tags[], created_at, updated_at
  - Relations: profile, trip_gear[]

- **trip_gear**: Junction table for trip-gear many-to-many relationship
  - Fields: id, trip_id, gear_id
  - Unique constraint: [trip_id, gear_id]

**Schema Location**: [lib/db/schema.ts](lib/db/schema.ts)

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
- **Supabase client is for AUTH ONLY** - use Drizzle services for database queries
- Use `lib/supabase/client.ts` in browser components
- Use `lib/supabase/server.ts` in API routes and server components
- Session cookies automatically handled by Supabase SSR middleware
- Profile creation is automatic via Supabase database trigger on auth.users insert

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
3. Validate input (using schemas from `lib/validation/`)
4. Call Drizzle service with userId
5. Return `{ data }` or `{ error }` JSON response

**Service Return Pattern:**
```typescript
const { data, error } = await getTripList({ userId });
if (error) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}
return NextResponse.json({ data });
```

**Service Import Pattern:**
```typescript
import { getTripList, createTrip } from '@/lib/services/db';
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
pnpm start              # Build and start OpenNext.js Cloudflare server

# Database (Drizzle)
pnpm db:push            # Sync schema to database (drizzle-kit push)
pnpm db:generate        # Generate migrations (drizzle-kit generate)
pnpm db:studio          # Open Drizzle Studio GUI (drizzle-kit studio)
pnpm db:migrate         # Run migrations (drizzle-kit migrate)

# Supabase (local development)
pnpm supabase:start     # Start local Supabase
pnpm supabase:stop      # Stop local Supabase
pnpm supabase:status    # Check local Supabase status
pnpm supabase:reset     # Reset local database

# Deployment (Cloudflare)
pnpm preview            # Build and preview production build
pnpm deploy             # Build and deploy to Cloudflare Pages
pnpm upload             # Build and upload to Cloudflare
pnpm cf-typegen         # Generate Cloudflare Worker types
```

### Setup Local Development

```bash
# 1. Clone and install
git clone <repo> && cd outdoor-trails-hub
pnpm install

# 2. Setup environment
# Create .env.local with Supabase credentials:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Sync database
pnpm db:push

# 4. Start dev server
pnpm dev
```

### Add New API Endpoint

1. Create `/app/api/[resource]/route.ts`
2. Import Drizzle service: `import { getResourceList } from '@/lib/services/db'`
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
# 1. Edit lib/db/schema.ts
# 2. Generate migration
pnpm db:generate
# 3. Review migration file in drizzle/ folder
# 4. Push to database
pnpm db:push
# 5. Commit schema and migration to git
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
// Use Drizzle Services for all database queries
import { getProfileByUserId } from '@/lib/services/db';
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
import { db } from '@/lib/db';
import { trip } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const existing = await db.query.trip.findFirst({
  where: eq(trip.id, id),
  columns: { user_id: true }
});

if (!existing || existing.user_id !== userId) {
  throw new Error('Unauthorized');
}
```

### ❌ DON'T

**Database Queries:**
```typescript
// Don't use Supabase client for database queries
const { data, error } = await supabase
  .from('profiles')
  .select('*'); // ❌ Use Drizzle services instead
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

## Migration History

**Prisma → Drizzle ORM (COMPLETED):**
- See `docs/PRISMA_TO_DRIZZLE_MIGRATION.md` for migration details
- Drizzle schema: [lib/db/schema.ts](lib/db/schema.ts)
- Drizzle client: [lib/db/index.ts](lib/db/index.ts)
- Benefits: Lighter bundle, better for Cloudflare Workers, faster startup
- All services migrated to Drizzle in `lib/services/db/`

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
- Build command: `next build`
- Framework: Next.js (OpenNext.js adapter)
- Node compatibility: `nodejs_compat` flag enabled
- Environment variables: Set in Cloudflare Pages dashboard (DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

**Important Files:**
- `next.config.ts` - Next.js configuration
- `wrangler.jsonc` - Cloudflare Workers config
- `open-next.config.ts` - OpenNext adapter for Cloudflare
- `drizzle.config.ts` - Drizzle Kit configuration
- `middleware.ts` - Session refresh middleware (runs on every request)

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [OpenNext.js Cloudflare](https://opennext.js.org/cloudflare)
