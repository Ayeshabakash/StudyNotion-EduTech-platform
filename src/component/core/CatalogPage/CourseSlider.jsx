import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'
import CatalogCourseCard from './CatalogCourseCard'
const CourseSlider = ({courses}) => {
  return (
    <div>
      {
         courses?.length > 0 ? (
          <Swiper
              slidesPerView={1}
              loop={true}
              spaceBetween={20}
              pagination={true}
              modules={[Autoplay,Pagination,Navigation]}
              // className="mySwiper"
              autoplay={{
              delay: 1000,
              disableOnInteraction: false,
              }}
              navigation={true}
              breakpoints={{
                  1024:{slidesPerView:3,}
              }}
              >
             {
               courses.map((course) => (
                 <SwiperSlide key={course._id}>
                     <CatalogCourseCard course={course} height={"h-[250px]"}/>
                 </SwiperSlide>
               ))
             }
          </Swiper>
         ) : (
            <p className='text-xl text-richblack-5'>No Courses Found!!</p>
         ) 
      }
    </div>
  )
}

export default CourseSlider