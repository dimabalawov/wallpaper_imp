import React, { useRef } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselProps {
  children: React.ReactNode[];
  visibleCount?: number;
}

function ArrowBtn({
  onClick,
  dir,
  disabled,
}: {
  onClick?: () => void;
  dir: "left" | "right";
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded bg-teal text-white flex items-center justify-center disabled:opacity-40 hover:bg-transparent hover:border-teal hover:border-2 hover:text-teal transition-all"
      style={{}}
      aria-label={dir === "left" ? "Назад" : "Вперед"}
    >
      {dir === "left" ? <FaChevronLeft /> : <FaChevronRight />}
    </button>
  );
}

export default function Carousel({
  children,
  visibleCount = 4,
}: CarouselProps) {
  const sliderRef = useRef<Slider | null>(null);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: visibleCount,
    slidesToScroll: 1,
    arrows: false, // Hide default arrows
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 relative">
        <h2 className="text-3xl font-semibold text-navy max-sm:text-center w-full max-sm:mb-14">
          Також рекомендуємо
        </h2>
        <div className="flex gap-3 absolute right-3 top-0 max-sm:top-14 z-20">
          <ArrowBtn dir="left" onClick={() => sliderRef.current?.slickPrev()} />
          <ArrowBtn
            dir="right"
            onClick={() => sliderRef.current?.slickNext()}
          />
        </div>
      </div>
      <Slider ref={sliderRef} {...settings} className="flex gap-8">
        {children.map((child, idx) => (
          <div key={idx} className="flex-1 min-w-0 px-2">
            {child}
          </div>
        ))}
      </Slider>
    </div>
  );
}
