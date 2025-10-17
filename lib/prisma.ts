// lib/prisma.ts
// TODO: 暫時停用 Prisma，等 schema.prisma 建立後再啟用
// import { PrismaClient } from '@prisma/client'
// import { withAccelerate } from '@prisma/extension-accelerate'

// // 💡 最佳實踐：在開發模式下避免多次創建 PrismaClient
// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma = globalForPrisma.prisma || new PrismaClient({
//   // 可以在這裡添加日誌或任何配置
// }).$extends(withAccelerate()) // <-- 核心：引入 Accelerate 擴展

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// // 導出一個單例實例，供您的 Next.js 路由或 Server Component 使用
// export default prisma

// 暫時的佔位符，避免編譯錯誤
export const prisma = null
export default prisma