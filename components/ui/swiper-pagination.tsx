"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

/**
 * SwiperPagination 組件的 Props 介面定義
 */
interface SwiperPaginationProps {
  /** 容器的額外 CSS 類名 */
  className?: string;
  /** 分頁點的 CSS 類名 */
  bulletClass?: string;
  /** 活躍分頁點的 CSS 類名 */
  bulletActiveClass?: string;
  /** 是否可點擊切換 */
  clickable?: boolean;
  /** 總投影片數量 */
  totalSlides?: number;
}

/**
 * SwiperPagination 組件暴露給父組件的 ref 方法介面
 */
export interface SwiperPaginationRef {
  /** 分頁容器的 DOM 元素 */
  element: HTMLDivElement | null;
  /** 更新活躍狀態的方法 */
  update: (activeIndex: number) => void;
  /** 銷毀分頁點的方法 */
  destroy: () => void;
}

/**
 * 獨立的 Swiper 分頁指示器元件
 * 
 * 提供可重複使用的分頁控制功能：
 * - 支援點擊切換
 * - 自訂樣式
 * - 響應式設計
 * - 通過 ref 暴露控制方法
 * 
 * @param className - 容器的額外 CSS 類名
 * @param bulletClass - 分頁點的 CSS 類名
 * @param bulletActiveClass - 活躍分頁點的 CSS 類名
 * @param clickable - 是否可點擊
 * @param totalSlides - 總投影片數量
 */
const SwiperPagination = forwardRef<SwiperPaginationRef, SwiperPaginationProps>(
  ({ 
    className, 
    bulletClass, 
    bulletActiveClass, 
    clickable = true,
    totalSlides = 0
  }, ref) => {
    // 分頁容器的 DOM 引用
    const paginationRef = useRef<HTMLDivElement>(null);
    // 所有分頁點元素的引用陣列
    const bulletsRef = useRef<HTMLElement[]>([]);

    /**
     * 使用 useImperativeHandle 暴露方法給父組件
     * 讓父組件可以通過 ref 控制分頁器的行為
     */
    useImperativeHandle(ref, () => ({
      // 暴露分頁容器的 DOM 元素
      element: paginationRef.current,
      
      /**
       * 更新活躍分頁點的方法
       * @param activeIndex - 當前活躍的投影片索引
       */
      update: (activeIndex: number) => {
        // 遍歷所有分頁點，更新活躍狀態
        bulletsRef.current.forEach((bullet, index) => {
          if (bullet) {
            // 使用 toggle 方法添加或移除活躍類名
            bullet.classList.toggle(
              bulletActiveClass || 'swiper-pagination-bullet-active',
              index === activeIndex
            );
          }
        });
      },
      
      /**
       * 銷毀分頁器的方法
       * 清空所有分頁點和引用
       */
      destroy: () => {
        if (paginationRef.current) {
          // 清空容器內容
          paginationRef.current.innerHTML = '';
          // 清空分頁點引用陣列
          bulletsRef.current = [];
        }
      }
    }), [bulletActiveClass]); // 依賴 bulletActiveClass，當它變化時重新建立方法

    /**
     * 當相關 props 變化時，重新建立分頁點
     */
    useEffect(() => {
      // 如果容器不存在或沒有投影片，則不執行
      if (!paginationRef.current || totalSlides === 0) return;

      // 清空現有的分頁點
      paginationRef.current.innerHTML = '';
      bulletsRef.current = [];

      // 根據投影片數量建立分頁點
      for (let i = 0; i < totalSlides; i++) {
        // 建立分頁點元素
        const bullet = document.createElement('span');
        
        // 設定分頁點的 CSS 類名
        bullet.className = cn(
          'swiper-pagination-bullet', // 基礎類名
          bulletClass, // 自訂類名
          // 第一個分頁點預設為活躍狀態
          i === 0 && (bulletActiveClass || 'swiper-pagination-bullet-active')
        );
        
        // 如果可點擊，設定相關屬性
        if (clickable) {
          bullet.style.cursor = 'pointer'; // 設定滑鼠游標樣式
          bullet.setAttribute('data-index', i.toString()); // 設定索引屬性，供點擊事件使用
        }

        // 將分頁點添加到容器中
        paginationRef.current.appendChild(bullet);
        // 將分頁點元素添加到引用陣列中
        bulletsRef.current.push(bullet);
      }
    }, [totalSlides, bulletClass, bulletActiveClass, clickable]); // 當這些 props 變化時重新執行

    /**
     * 渲染分頁容器
     * 使用 ref 綁定 DOM 元素，並應用樣式類名
     */
    return (
      <div
        ref={paginationRef}
        className={cn(
          "swiper-pagination", // Swiper 預設類名
          "flex justify-center items-center gap-2 mt-1", // Tailwind CSS 樣式：水平居中、垂直居中、間距、上邊距
          className // 自訂額外類名
        )}
      />
    );
  }
);

// 設定組件的顯示名稱，便於 React DevTools 中識別
SwiperPagination.displayName = "SwiperPagination";

export default SwiperPagination;
