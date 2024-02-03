import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import demoImage from "../../../assets/Images/Instructor.png"
import ProgressBar from '@ramonak/react-progress-bar'
import { useNavigate } from 'react-router-dom'
import {getUserEnrolledCourses} from "../../../services/operations/profileAPI"


const EnrolledCourses = () => {
    const {token} = useSelector( (state) => state.auth);
    const [enrolledCourses , setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getEnrolledCourses = async() => {
        setLoading(true);
        try{

            const result = await getUserEnrolledCourses(token);

            
            // Filtering the published course out
            const filterPublishCourse = result.filter((ele) => ele.status !== "Draft")
            // console.log("REsult", result);

            if(filterPublishCourse)
            setEnrolledCourses(filterPublishCourse);
        }
        catch(error)
        {
            console.log("Could not fetched enrolled courses");
        }
        setLoading(false);
    }

    useEffect( () => {
        getEnrolledCourses();
    },[])


    if(loading){
        return (
            <div className='min-h-[calc(100vh-12rem)] grid place-items-center'>
                <div className='spinner'></div>
            </div>
        )
    }
  return (
    <div>
         
        <h2 className='text-3xl text-richblack-50'>Enrolled Courses</h2>

        <div className='min-h-[calc(100vh-12rem)]'>
            {
                    enrolledCourses.length === 0 ? (
                        <p className="text-richblack-5 h-[20vh] flex justify-center items-center">You have not enrolled in any course yet.</p>
                    ) :
                    (
                        <div className='my-8 text-richblack-5'>
                            <div className='flex bg-richblack-500 rounded-t-lg py-3'>
                                <p className='w-[45%] px-5' >Course Name</p>
                                <p className='w-[25%] px-2'>Duration</p>
                                <p className='flex-1 px-2'>Progress</p>
                            </div>

                            {
                                enrolledCourses.map( (course,index) =>(
                                    <div key={index}
                                    className={`flex items-center border border-richblack-700
                                                ${index === enrolledCourses.length - 1} ? "rounded-b-lg" : "rounded-none"`}>

                                        <div className='flex md:flex-row flex-col items-center gap-4 cursor-pointer px-5 py-3 w-[45%]'
                                        onClick={() => navigate(`/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0].subSections?.[0]?._id}`)}>
                                            <img src={course.thumbnail}
                                                alt=''
                                                loading='lazy'
                                                className='md:h-14 md:-14 object-cover rounded-lg'
                                            />

                                            <div className='space-y-2 max-w-xs'>
                                                <p className='font-semibold'>{course.courseName}</p>
                                                <p className='text-xs text-richblack-300'>
                                                  {
                                                     course.courseDescription.length > 50 ? (
                                                        `${course.courseDescription.slice(0,50)}...`
                                                     ) : (
                                                        course.courseDescription
                                                     )
                                                  }
                                                </p>
                                            </div>

                                        </div>

                                        <div className='w-1/4 px-2 py-3'>
                                            {course.totalDuration || "2h 30min"}
                                        </div>

                                        <div className='flex flex-col gap-2 px-2 py-3 w-1/5'>
                                            <p>Progress: {course.progressPercentage || 0}%</p>
                                            <ProgressBar
                                                completed={0}
                                                height='8px'
                                                isLabelVisible={false}
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
            }
        </div>

    </div>
  )
}

export default EnrolledCourses