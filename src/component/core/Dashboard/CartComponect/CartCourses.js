import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import demoImage from "../../../../assets/Images/Instructor.png"
import ReactStars from "react-star-rating-component";
import { FaStar } from 'react-icons/fa';
import {RiDeleteBin6Line} from "react-icons/ri"
import { removeFromCart } from '../../../../Redux/Slices/cartSlice';
import getAvgRating from "../../../../utils/getAvgRating"

const CartCourses = () => {
    const {cart} = useSelector( (state) => state.cart);
    const dispatch  = useDispatch();
  return (
    <div className='flex flex-1 flex-col'>
        {
            cart.map( (course , index) => (
                <div key={course._id}
                 className={`flex flex-wrap gap-6 w-full items-start justify-between mt-6
                          ${index !== cart.length - 1 && "border-b border-richblack-400 pb-6"} `}>
                   
                   <div className='flex flex-1 gap-4 xl:flex-row flex-col '>
                      <img src={course?.thumbnail}
                        alt={course?.courseName}
                        loading='lazy'
                        className='h-[148px] w-[220px] rounded-lg object-cover'
                      />

                      <div className='space-y-1'>
                        <p className='text-lg font-medium text-richblack-5'>{course?.course?.courseName}</p>
                        <p className='text-[15px] text-richblack-300'>{course?.category?.name}</p>
                    
                        <div className='flex items-center gap-2'>
                            <span className='text-yellow-5'>{getAvgRating(course?.ratingAndReviews)}</span>
                            <ReactStars
                                count ={5}
                                value={course?.ratingAndReviews?.length}
                                size={20}
                                edit ={false}
                                activeColor ="#ffd700"
                                emptyIcon={<FaStar />}
                                fullIcon={<FaStar />}
                            />
                            <span className='text-richblack-400' >{course?.ratingAndReviews?.length}</span>
                        </div>
                      </div>
                   </div>

                   <div className='flex flex-col items-end gap-y-2'>
                        <button className='flex items-center gap-x-1 rounded-md  border border-richblack-600 bg-richblack-700 p-3 text-pink-200'
                        onClick={() => dispatch(removeFromCart(course._id))}>   {/* if product does not adding to cart try to calling the reducer without arrow function  */}
                            <RiDeleteBin6Line/>
                            <span>Remove</span>
                        </button>

                        <p className='text-3xl text-yellow-100 font-medium'>₹ {course?.price}</p>
                   </div>
                </div>
            ))
        }
    </div>
  )
}

export default CartCourses