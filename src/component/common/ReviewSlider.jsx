import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component"
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
import { Autoplay,FreeMode, Pagination}  from 'swiper/modules'
import { FaStar } from 'react-icons/fa'
import {apiConnector} from "../../services/apiConnector"
import {ratingsEndpoints} from "../../services/apis";

const ReviewSlider = () => {
    const [reviews , setReviews] = useState([]);

    useEffect(() => {
        const fetchAllReview = async() => {
            const response = await apiConnector("GET" , ratingsEndpoints.REVIEWS_DETAILS_API);

            console.log("REVIEW RESPONSE : ",response.data.data);

            if(response.data.success)
            setReviews(response?.data?.data);
        }
        fetchAllReview();
    },[])
  return (
    <div>
      {
         reviews.length === 0 ? (
            <div>No Review Found at this movement</div>
         ) : (
            <div className='my-[50px] h-[184px] lg:max-w-maxContent max-w-maxContentTab '>
                <Swiper
                  slidesPerView={4}
                  spaceBetween={24}
                  loop={true}
                  freeMode={true}
                  autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                  }}
                  modules={[FreeMode, Pagination, Autoplay]}
                  className='w-full'>
                      {
                         reviews?.map((review) => (
                            <SwiperSlide
                              key={review._id}>
                               
                               <div className='flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 min-w-max'>
                                  
                                  <div className='flex items-center gap-4'>
                                     <img src={review?.user?.profileImage ? review.user.profileImage : 
                                              `https://api.dicebear.com/5.x/initials/svg?seed=${review.user.firstName} ${review.user.lastName}`}
                                          alt='user pic'
                                          className='h-9 w-9 object-cover rounded-full'
                                        /> 
                                     
                                     <div className='flex flex-col'>
                                        <p className='font-semibold text-richblack-5'>{`${review?.user?.firstName} ${review?.user?.lastName}`}</p>
                                        <p className='text-[12px] font-medium text-richblack-500'>{review?.course?.courseName}</p>
                                     </div>
                                  </div>

                                  <p className='font-medium text-richblack-25'>{review.review.split(" ").length > 15 ? 
                                      `${review.review.split(" ").slice(0 , 15).join(" ")}...` : 
                                        review.review}
                                  </p>

                                  <div className='flex items-center gap-2 '>
                                     <p className='font-semibold text-yellow-100'>
                                       {review.rating.toFixed(1)}
                                     </p>

                                     <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaStar />}
                                        fullIcon={<FaStar />}
                                     />
                                  </div>
                               </div>
                          
                           </SwiperSlide>
                         ))
                      }
                </Swiper>
            </div>
         )
      }    
    </div>
  )
}

export default ReviewSlider