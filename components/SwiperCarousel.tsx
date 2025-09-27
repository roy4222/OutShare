import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
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
 * - 分頁指示器
 * - 滾動條
 * - 可點擊的分頁控制
 * - 響應式設計
 * 
 * @param images - 圖片 URL 陣列
 * @param alt - 圖片替代文字的前綴
 * @param className - 可選的額外 CSS 類名
 * @returns JSX.Element - 渲染的 Swiper 輪播元件
 */
const SwiperCarousel = ({ images, alt, className }: SwiperCarouselProps) => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={10}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      className={`h-full ${className || ""}`}
    >
      {images.map((imageUrl, index) => (
        <SwiperSlide key={index} className="relative">
          <Image
            src={imageUrl}
            alt={`${alt} - 圖片 ${index + 1}`}
            fill
            className="object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperCarousel;
