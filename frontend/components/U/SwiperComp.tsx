import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import StatsCard from "./StatsCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const SwiperComp: React.FC = ({ title, stats, pv }) => {
  return (
    <div className="">
      <div className="mb-6">
        <h3 className="text-white swiper-title text-sm">{title}</h3>
      </div>

      <Swiper slidesPerView={pv} spaceBetween={30} modules={[]} className="mySwiper">
        {stats.map((stat, index) => (
          <SwiperSlide key={stat.title} className="bg-slate-600 rounded-lg ">
            <StatsCard key={index} {...stat} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComp;
