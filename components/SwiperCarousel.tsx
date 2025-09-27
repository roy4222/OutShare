import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SwiperPagination, { type SwiperPaginationRef } from "./ui/swiper-pagination";
import "swiper/css";
import "swiper/css/navigation";

interface SwiperCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

/**
 * Swiper 輪播圖元件
 * 
 * 用於顯示多張圖片的輪播效果，支援：
 * - 獨立的分頁指示器元件
 * - 滾動條
 * - 響應式設計
 * - 使用 useRef 控制分頁狀態
 * 
 * @param images - 圖片 URL 陣列
 * @param alt - 圖片替代文字的前綴
 * @param className - 可選的額外 CSS 類名
 * @returns JSX.Element - 渲染的 Swiper 輪播元件
 */
const SwiperCarousel = ({ images, alt, className }: SwiperCarouselProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const paginationRef = useRef<SwiperPaginationRef>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    if (paginationRef.current) {
      paginationRef.current.update(swiper.activeIndex);
    }
  };

  const handlePaginationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const index = target.getAttribute('data-index');
    
    if (index && swiperRef.current) {
      swiperRef.current.slideTo(parseInt(index));
    }
  };

  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden">
      <div className="flex-1 relative">
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
      
      <div onClick={handlePaginationClick}>
        <SwiperPagination
          ref={paginationRef}
          totalSlides={images.length}
          clickable={true}
        />
      </div>
    </div>
  );
};

export default SwiperCarousel;
