import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合併 Tailwind CSS 類名
 * 
 * 使用 clsx 和 tailwind-merge 智能合併類名，避免衝突
 * 
 * @param inputs - 類名陣列
 * @returns 合併後的類名字串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
