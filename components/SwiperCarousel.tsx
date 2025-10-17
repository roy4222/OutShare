import Image from "next/image";
import { useRef, forwardRef, useImperativeHandle, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

interface SwiperCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  onSlideChange?: (swiper: SwiperType) => void;
}

export interface SwiperCarouselRef {
  swiper: SwiperType | null;
  slideTo: (index: number) => void;
}

/**
 * Swiper 輪播圖元件
 * 
 * 用於顯示多張圖片的輪播效果，支援：
 * - 滾動條
 * - 響應式設計
 * - 通過 ref 暴露 swiper 實例控制
 * - 外部 pagination 控制
 * 
 * @param images - 圖片 URL 陣列
 * @param alt - 圖片替代文字的前綴
 * @param className - 可選的額外 CSS 類名
 * @param onSlideChange - 投影片變更時的回調函數
 * @returns JSX.Element - 渲染的 Swiper 輪播元件
 */
const SwiperCarousel = forwardRef<SwiperCarouselRef, SwiperCarouselProps>(
  ({ images, alt, className, onSlideChange }, ref) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // 預設載入第一張

    useImperativeHandle(ref, () => ({
      swiper: swiperRef.current,
      slideTo: (index: number) => {
        if (swiperRef.current) {
          swiperRef.current.slideTo(index);
        }
      }
    }), []);

    // 預載相鄰的圖片
    const preloadAdjacentImages = useCallback((activeIndex: number) => {
      setLoadedImages(prevLoadedImages => {
        const imagesToLoad = new Set(prevLoadedImages);
        
        // 載入當前圖片
        imagesToLoad.add(activeIndex);
        
        // 載入前一張圖片
        if (activeIndex > 0) {
          imagesToLoad.add(activeIndex - 1);
        }
        
        // 載入下一張圖片
        if (activeIndex < images.length - 1) {
          imagesToLoad.add(activeIndex + 1);
        }
        
        // 如果是第一張，預載下兩張圖片
        if (activeIndex === 0 && images.length > 2) {
          imagesToLoad.add(1);
          imagesToLoad.add(2);
        }
        
        return imagesToLoad;
      });
    }, [images.length]);

    // 初始化時預載第一張和下一張圖片
    useEffect(() => {
      preloadAdjacentImages(0);
    }, [images, preloadAdjacentImages]);

    const handleSlideChange = (swiper: SwiperType) => {
      const activeIndex = swiper.activeIndex;
      preloadAdjacentImages(activeIndex);
      
      if (onSlideChange) {
        onSlideChange(swiper);
      }
    };

    return (
      <div className="w-full h-full rounded-lg overflow-hidden">
        <Swiper
          // install Swiper modules
          modules={[Navigation, Scrollbar, A11y]}
          spaceBetween={10}
          scrollbar={{ draggable: true }}
          className={`w-full h-full ${className || ""}`}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
        >
          {images.map((imageUrl, index) => (
            <SwiperSlide key={index} className="relative w-full h-full">
              {loadedImages.has(index) ? (
                <Image
                  src={imageUrl}
                  alt={`${alt} - 圖片 ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                // 顯示佔位符或載入中狀態
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-sm">載入中...</div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }
);

SwiperCarousel.displayName = "SwiperCarousel";

export default SwiperCarousel;