import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RenderSteps from './AddCourse/RenderSteps';
import { useParams } from 'react-router-dom';
import { setCourse, setEditCourse } from '../../../Redux/Slices/courseSlice';
import { getFullCourseDetails } from '../../../services/operations/courseAPI';

const EditCourse = () => {
    const {course} = useSelector((state) => state.course);
    const dispatch = useDispatch();
    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async() => {
            setLoading(true);
            const result = await getFullCourseDetails(courseId , token);

            if(result.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result.courseDetails));
            }
            setLoading(false);
        })()
    }, [])


    if(loading){
       return (
        <div className='grid flex-1 place-items-center'>
           <div className='spinner'></div>
        </div>
       )
    }
  return (
    <div>
        <h2 className='mb-14 text-3xl font-medium text-richblack-5'>Edit Course</h2>
        
        <div className='mx-auto max-w-[600px]'> 
        {
            course ? (<RenderSteps/>) : (
                <p className='mt-14 text-center text-3xl font-semibold text-richblack-100'>No Course Found!!</p>
            )
        }
        </div>
    </div>
  )
}

export default EditCourse