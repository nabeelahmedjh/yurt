import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-creative";

import { EffectCreative } from "swiper/modules";

export default function SwiperContainer({
  children,
}: {
  /** Wrap the children in SwiperSlide from swiper/react */
  children: React.ReactNode;
}) {
  return (
    <Swiper
      grabCursor={true}
      effect={"creative"}
      creativeEffect={{
        prev: {
          shadow: true,
          translate: ["-20%", 0, -1],
        },
        next: {
          translate: ["100%", 0, 0],
        },
      }}
      modules={[EffectCreative]}
      className="mySwiper3"
    >
      {children}
    </Swiper>
  );
}
