# Prisma 到 Drizzle ORM 遷移完成報告

## 遷移日期
2025-10-30

## 遷移概要
成功將專案從 Prisma ORM 遷移至 Drizzle ORM，保持了 Supabase Auth + PostgreSQL 的架構。

## 完成的工作

### 1. 安裝 Drizzle 依賴
- ✅ `drizzle-orm` - Drizzle ORM 核心
- ✅ `postgres` - PostgreSQL 驅動
- ✅ `drizzle-kit` - Drizzle CLI 工具（dev dependency）

### 2. 創建 Drizzle 配置
- ✅ [lib/db/schema.ts](../lib/db/schema.ts) - 資料表 schema 定義
- ✅ [lib/db/index.ts](../lib/db/index.ts) - Database client 單例
- ✅ [drizzle.config.ts](../drizzle.config.ts) - Drizzle Kit 配置

### 3. 遷移服務層
創建新的 Drizzle 服務於 `lib/services/db/`：
- ✅ [lib/services/db/profiles.service.ts](../lib/services/db/profiles.service.ts) - Profile 查詢服務
- ✅ [lib/services/db/trips.service.ts](../lib/services/db/trips.service.ts) - Trip 查詢服務
- ✅ [lib/services/db/equipment.service.ts](../lib/services/db/equipment.service.ts) - Equipment 查詢服務
- ✅ [lib/services/db/index.ts](../lib/services/db/index.ts) - 統一導出

### 4. 更新應用程式碼
更新所有引用 Prisma 的檔案，從 `@/lib/services/prisma` 改為 `@/lib/services/db`：

#### API Routes
- ✅ [app/api/profiles/route.ts](../app/api/profiles/route.ts)
- ✅ [app/api/profiles/[username]/route.ts](../app/api/profiles/[username]/route.ts)
- ✅ [app/api/trips/route.ts](../app/api/trips/route.ts)
- ✅ [app/api/trips/[id]/route.ts](../app/api/trips/[id]/route.ts)
- ✅ [app/api/equipment/route.ts](../app/api/equipment/route.ts)
- ✅ [app/api/equipment/[id]/route.ts](../app/api/equipment/[id]/route.ts)

#### Auth & Hooks
- ✅ [app/auth/callback/route.ts](../app/auth/callback/route.ts)
- ✅ [lib/hooks/useProfile.ts](../lib/hooks/useProfile.ts)

### 5. 更新 package.json
更新 npm scripts：
```json
{
  "build": "next build",  // 移除 prisma generate
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:studio": "drizzle-kit studio",
  "db:migrate": "drizzle-kit migrate"
}
```

### 6. 清理 Prisma
- ✅ 移除 `@prisma/client` 和 `prisma` 套件
- ✅ 刪除 `/prisma` 目錄
- ✅ 刪除 `/lib/prisma.ts`
- ✅ 刪除 `/lib/services/prisma` 目錄

### 7. 驗證
- ✅ Build 成功通過（`npm run build`）
- ✅ 無 TypeScript 錯誤
- ✅ 所有路由正常編譯

## Schema 對照

### Profiles Table
```typescript
// Drizzle
export const profiles = pgTable('profiles', {
  user_id: uuid('user_id').primaryKey(),
  username: text('username').unique(),
  display_name: text('display_name'),
  bio: text('bio'),
  avatar_url: text('avatar_url'),
  social_links: jsonb('social_links').default({}).$type<Record<string, string>>(),
  gear_dashboard_title: text('gear_dashboard_title'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
```

### Trip Table
```typescript
// Drizzle
export const trip = pgTable('trip', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => profiles.user_id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location'),
  duration: text('duration'),
  date: date('date', { mode: 'date' }),
  images: text('images').array().default([]).notNull(),
  tags: text('tags').array().default([]).notNull(),
  slug: text('slug').unique(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
```

### Gear Table
```typescript
// Drizzle
export const gear = pgTable('gear', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => profiles.user_id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'),
  description: text('description'),
  image_url: text('image_url'),
  specs: jsonb('specs').$type<Record<string, unknown>>(),
  tags: text('tags').array().default([]).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
```

### TripGear Table
```typescript
// Drizzle
export const tripGear = pgTable('trip_gear', {
  id: uuid('id').defaultRandom().primaryKey(),
  trip_id: uuid('trip_id').notNull().references(() => trip.id, { onDelete: 'cascade' }),
  gear_id: uuid('gear_id').notNull().references(() => gear.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});
```

## API 語法變化範例

### 查詢單筆資料
```typescript
// Prisma
const profile = await prisma.profile.findUnique({
  where: { user_id: userId }
})

// Drizzle
const profile = await db.query.profiles.findFirst({
  where: eq(profiles.user_id, userId)
})
```

### 查詢多筆資料
```typescript
// Prisma
const trips = await prisma.trip.findMany({
  where: { user_id: userId },
  orderBy: { created_at: 'desc' }
})

// Drizzle
const trips = await db.query.trip.findMany({
  where: eq(trip.user_id, userId),
  orderBy: desc(trip.created_at)
})
```

### 建立資料
```typescript
// Prisma
const trip = await prisma.trip.create({
  data: {
    user_id: userId,
    title: 'My Trip',
  }
})

// Drizzle
const [trip] = await db.insert(trip).values({
  user_id: userId,
  title: 'My Trip',
}).returning()
```

### 更新資料
```typescript
// Prisma
const trip = await prisma.trip.update({
  where: { id: tripId },
  data: { title: 'New Title' }
})

// Drizzle
const [trip] = await db.update(trip)
  .set({ title: 'New Title' })
  .where(eq(trip.id, tripId))
  .returning()
```

### 刪除資料
```typescript
// Prisma
await prisma.trip.delete({
  where: { id: tripId }
})

// Drizzle
await db.delete(trip).where(eq(trip.id, tripId))
```

### 關聯查詢
```typescript
// Prisma
const trip = await prisma.trip.findUnique({
  where: { id: tripId },
  include: {
    trip_gear: {
      include: { gear: true }
    }
  }
})

// Drizzle
const trip = await db.query.trip.findFirst({
  where: eq(trip.id, tripId),
  with: {
    trip_gear: {
      with: { gear: true }
    }
  }
})
```

## 新的 Drizzle 指令

### 開發工具
```bash
# 推送 schema 到資料庫（不創建 migration）
npm run db:push

# 生成 migration 檔案
npm run db:generate

# 執行 migration
npm run db:migrate

# 打開 Drizzle Studio（資料庫 GUI）
npm run db:studio
```

## Drizzle 優勢

1. **更輕量**：bundle size 更小，更適合 Cloudflare Workers
2. **更快的啟動時間**：無需 `prisma generate` 步驟
3. **更接近 SQL**：查詢語法更直觀
4. **完整的 TypeScript 支援**：類型推導更強大
5. **更靈活**：可以直接執行原生 SQL

## 注意事項

1. **資料庫 Schema 不變**：Drizzle 使用現有的 PostgreSQL schema，無需修改資料庫結構
2. **Supabase Auth 保持不變**：只遷移資料層，Auth 仍使用 Supabase
3. **API 行為一致**：所有 API 端點的行為保持不變
4. **向後相容**：前端和 hooks 無需修改

## 後續步驟

1. 測試所有功能：
   - 登入/登出
   - Profile CRUD
   - Trip CRUD
   - Equipment CRUD
   - 關聯查詢

2. 部署到 Cloudflare Workers：
   ```bash
   npm run deploy
   ```

3. 監控效能改善：
   - 啟動時間
   - Bundle size
   - 查詢效能

## 相關文件

- [Prisma to Drizzle 遷移計劃](./PRISMA_TO_DRIZZLE_MIGRATION.md)
- [Drizzle ORM 官方文件](https://orm.drizzle.team/)
- [Drizzle Kit 文件](https://orm.drizzle.team/kit-docs/overview)

## 總結

✅ 遷移成功完成！
✅ Build 通過無錯誤
✅ 所有服務層已更新
✅ 所有 API routes 已更新
✅ Prisma 相關檔案已清理

專案現在使用 Drizzle ORM 作為資料層，更適合 Cloudflare Workers 環境，並提供更好的開發體驗。
