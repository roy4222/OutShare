/**
 * Drizzle Database Client 單例
 *
 * 在開發環境中避免建立過多的資料庫連線
 * 在生產環境中使用單一實例
 *
 * 使用方式：
 * ```typescript
 * import { db } from '@/lib/db'
 *
 * // 查詢所有 profiles
 * const profilesList = await db.query.profiles.findMany()
 *
 * // 查詢單一 profile
 * const profile = await db.query.profiles.findFirst({
 *   where: eq(profiles.user_id, userId)
 * })
 *
 * // 建立 trip
 * const [newTrip] = await db.insert(trip).values({
 *   user_id: userId,
 *   title: 'My Trip',
 * }).returning()
 * ```
 *
 * ⚠️ 重要提醒：
 * - 僅用於資料庫查詢，Auth 操作請使用 @/lib/supabase/client 或 @/lib/supabase/server
 * - 所有寫入操作必須包含權限檢查（驗證 user_id）
 * - RLS 政策在 Supabase 中啟用，但 Drizzle 不會自動執行，需在應用層檢查
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

const db = drizzle(client, { schema });

// Singleton pattern for development
declare const globalThis: {
  dbGlobal: typeof db;
} & typeof global;

const dbClient = globalThis.dbGlobal ?? db;

// Named export (推薦使用)
export { dbClient as db };

// Default export (向後相容)
export default dbClient;

if (process.env.NODE_ENV !== 'production') globalThis.dbGlobal = dbClient;
