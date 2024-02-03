import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom'
import {getFullCourseDetails} from "../services/operations/courseAPI";
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../Redux/Slices/viewCourseSlice';
import { IoCodeWorkingOutline } from 'react-icons/io5';
import ViewCourseSidebar from '../component/core/ViewCourse/ViewCourseSidebar';
import CourseReviewModal from '../component/core/ViewCourse/CourseReviewModal';
import { MdArrowBackIosNew } from "react-icons/md";

const ViewCourse = () => {
    const {courseId} = useParams();
    const [reviewModal , setReviewModal] = useState(false);
    const [loading , setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const {courseSectionsData} = useSelector((state) => state.viewCourse);
    const [isClose , setIsClose] = useState(false);


    // const entireState = useSelector((state) => state);
    // console.log("Entire state" ,entireState);

    const fetchCourseDetails = async() => {
        setLoading(true);
        try{
            const result = await getFullCourseDetails(courseId , token);

            if(result)
            {
                // console.log("RESULT :", result)
                dispatch(setEntireCourseData(result?.courseDetails));
                dispatch(setCourseSectionData(result?.courseDetails?.courseContent));
                // console.log(result?.courseDetails?.courseContent);
                // 
                dispatch(setCompletedLectures(result?.completedVideos));
                
                let totalLectures = 0;
                result?.courseDetails?.courseContent?.forEach( (sec) => {
                    totalLectures += sec?.subSections?.length;
                })
                dispatch(setTotalNoOfLectures(totalLectures));
            }
        }catch(error)
        {
            console.log(error.message);
        }
        setLoading(false);
    }


    useEffect(() => {
        fetchCourseDetails();
    },[]);

    // console.log(courseSectionsData);
    
  return (
     loading ? (
        <div className='grid place-items-center h-[calc(100vh-3.5rem)] w-full'>
            <div className='spinner'></div>
        </div>
     ) : (
        <div className='relative flex min-h-[calc(100vh-3.5rem)] text-white'>
            <div>
                {
                   !isClose ? (<ViewCourseSidebar setReviewModal={setReviewModal} setIsClose={setIsClose}/>) : (
                    <div  
                        onClick={() => setIsClose(false)}
                        className='flex items-center justify-center h-[35px] w-[35px] rounded-full text-richblack-700 bg-richblack-100 p-1 cursor-pointer hover:scale-90 rotate-180 mt-10 ml-5'>
                        <MdArrowBackIosNew />
                    </div>
                   )
                }
            </div>

            <div className='min-h-[calc(100vh-3.5rem)] flex-1 overflow-auto w-full'>
                <div className='px-6 mt-10'>
                    <Outlet/>
                </div>
            </div>
            {
                reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>
            }
        </div>
     )
  )
} 

export default ViewCourse