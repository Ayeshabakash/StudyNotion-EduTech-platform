import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import getAvgRating from '../../../utils/getAvgRating';
import RatingStars from '../../common/RatingStars';

const CatalogCourseCard = ({course, height}) => {
  // console.log("most selling course : ",course);
  const [avgRating , setAvgRating] = useState(0);
  
  useEffect(() => {
      const count = getAvgRating(course?.ratingAndReviews);
      setAvgRating(count);
  },[course])
  return (
    <div className='p-2 bg-richblack-700 rounded-md'>
        <Link to={`/course/${course._id}`}>
            <div className='rounded-lg'>
               <img
                 src={course?.thumbnail}
                 alt='courseThumbnail'
                 className={`${height} w-full rounded-md object-cover`}
               />
            </div>
            <div className="flex flex-col gap-2 px-2 py-3">
               <p className='text-xl text-richblack-5'>{course?.courseName}</p>
               <p className='text-sm text-richblack-50'>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
               <div className='flex gap-x-2 items-center'>
                 <span className='text-yellow-5'>{avgRating || 0}</span>
                 <RatingStars ReviewCount={0}/>
                 <span className='text-richblack-400'>{course?.ratingAndReviews?.length} Ratings</span>
               </div>
               <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
            </div>
        </Link>
    </div>
  )
}

export default CatalogCourseCard