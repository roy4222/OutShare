import Image from "next/image";
import { useRef, forwardRef, useImperativeHandle } from "react";
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

    useImperativeHandle(ref, () => ({
      swiper: swiperRef.current,
      slideTo: (index: number) => {
        if (swiperRef.current) {
          swiperRef.current.slideTo(index);
        }
      }
    }), []);

    const handleSlideChange = (swiper: SwiperType) => {
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
              <Image
                src={imageUrl}
                alt={`${alt} - 圖片 ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }
);

SwiperCarousel.displayName = "SwiperCarousel";

export default SwiperCarousel;