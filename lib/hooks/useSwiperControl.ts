/**
 * useSwiperControl Hook
 * 
 * 封裝 Swiper 輪播控制邏輯
 */

import { useRef, useCallback } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import type { SwiperCarouselRef } from '@/components/SwiperCarousel';
import type { SwiperPaginationRef } from '@/components/ui/swiper-pagination';

/**
 * useSwiperControl 的返回值
 */
interface UseSwiperControlResult {
  swiperRef: React.RefObject<SwiperCarouselRef | null>;
  paginationRef: React.RefObject<SwiperPaginationRef | null>;
  handleSlideChange: (swiper: SwiperType) => void;
  handlePaginationClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Swiper 輪播控制邏輯
 * 
 * 提供 Swiper 和 Pagination 的雙向控制功能
 * 
 * @returns Swiper 控制相關的 refs 和 handlers
 * 
 * @example
 * const { swiperRef, paginationRef, handleSlideChange, handlePaginationClick } = useSwiperControl();
 * 
 * <SwiperCarousel ref={swiperRef} onSlideChange={handleSlideChange} />
 * <SwiperPagination ref={paginationRef} onClick={handlePaginationClick} />
 */
export function useSwiperControl(): UseSwiperControlResult {
  const swiperRef = useRef<SwiperCarouselRef>(null);
  const paginationRef = useRef<SwiperPaginationRef>(null);

  // 當 Swiper 滑動時，更新 Pagination
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    if (paginationRef.current) {
      paginationRef.current.update(swiper.activeIndex);
    }
  }, []);

  // 當點擊 Pagination 時，控制 Swiper 滑動
  const handlePaginationClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const index = target.getAttribute('data-index');
    
    if (index && swiperRef.current) {
      swiperRef.current.slideTo(parseInt(index));
    }
  }, []);

  return {
    swiperRef,
    paginationRef,
    handleSlideChange,
    handlePaginationClick,
  };
}

