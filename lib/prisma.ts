/**
 * Prisma Client 單例
 * 
 * 在開發環境中避免建立過多的 Prisma Client 實例
 * 在生產環境中使用單一實例
 * 
 * 使用方式：
 * ```typescript
 * import { prisma } from '@/lib/prisma'
 * 
 * // 查詢所有 profiles
 * const profiles = await prisma.profile.findMany()
 * 
 * // 查詢單一 profile
 * const profile = await prisma.profile.findUnique({
 *   where: { user_id: userId }
 * })
 * 
 * // 建立 trip
 * const trip = await prisma.trip.create({
 *   data: {
 *     user_id: userId,
 *     title: 'My Trip',
 *   }
 * })
 * ```
 * 
 * ⚠️ 重要提醒：
 * - 僅用於資料庫查詢，Auth 操作請使用 @/lib/supabase/client 或 @/lib/supabase/server
 * - 所有寫入操作必須包含權限檢查（驗證 user_id）
 * - RLS 政策在 Supabase 中啟用，但 Prisma 不會自動執行，需在應用層檢查
 */

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Named export (推薦使用)
export { prisma }

// Default export (向後相容)
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma




