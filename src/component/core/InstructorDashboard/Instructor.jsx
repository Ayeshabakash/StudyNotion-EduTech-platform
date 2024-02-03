import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {getInstructorCourses} from "../../../services/operations/courseAPI";
import {getInstructorData} from "../../../services/operations/profileAPI";
import { Link } from 'react-router-dom';
import InstructorChart from "./InstructorChart";

const Instructor = () => {
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const [courses , setCourses] = useState([]);
    const [instructorData , setInstructorData] = useState(null);
    const [loading ,setLoading] = useState(false);


    useEffect(() => {
        const getDashboardDetails = async() => {
            setLoading(true);

            const coursesDetails = await getInstructorCourses(token);
            const result = await getInstructorData(token);

            console.log(coursesDetails)
            console.log(result)

            if(coursesDetails?.length)
            setCourses(coursesDetails);

            if(result)
            {
                setInstructorData(result);
            }

            setLoading(false);
        }
        getDashboardDetails();
    }, [])

    let totalStudents = 0 ;
    let totalRevenue = 0;


    if(instructorData !== null)
    {
        totalStudents =  instructorData?.reduce((acc , curr) => acc + curr.totalStudentsEnrolled , 0);
        totalRevenue =  instructorData?.reduce((acc , curr) => acc + curr.totalCourseRevenue , 0);
    }

  return (
    <div >
        <h2 className='text-2xl font-bold text-richblack-5'>Hi {user.firstName} 👋</h2>
        <p className='font-medium text-richblack-200 mt-2'>Let's start something new</p>

        {
            loading ? (<div className='mt-10 grid place-items-center'>
                            <div className='spinner'></div>
            </div>)  : 
            (
                courses.length > 0 ? (
                    <div>   {/* relative */}
                        <div className='my-4 gap-x-4 flex lg:flex-row flex-col gap-y-5 '>
                            <div className='w-full'>  {/* flex absolute */}
                                {
                                    (totalStudents > 0 || totalRevenue > 0) ? (
                                        <InstructorChart courses={instructorData}/>
                                    ) : (
                                        <div className='flex-1 min-w-[250px] h-full flex-col rounded-md bg-richblack-800 p-6'>
                                            <p className='text-lg font-bold text-richblack-5'>Visualize</p>
                                            <h2 className='mt-10 text-xl font-medium text-richblack-50 grid place-items-center'>Not Enough Data To Visualize</h2>
                                        </div>
                                    )
                                }
                            </div>

                            {/* statistics data  */}
                            <div className='flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6'>
                                <p className='text-lg font-bold text-richblack-5'>Statistics</p>

                                <div className='mt-4 gap-4 flex lg:flex-col items-center'>

                                    <div>
                                        <p className='text-lg text-richblack-200'>Total Courses</p>
                                        <p className='text-3xl font-semibold text-richblack-50'>{courses.length}</p>
                                    </div>

                                    <div>
                                        <p className='text-lg text-richblack-200'>Total Students</p>
                                        <p className='text-3xl font-semibold text-richblack-50'>{totalStudents}</p>
                                    </div>

                                    <div>
                                        <p className='text-lg text-richblack-200'>Total Income</p>
                                        <p className='text-3xl font-semibold text-richblack-50'>Rs. {totalRevenue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* render 3 courses  */}
                        <div className='rounded-md bg-richblack-800 p-6 my-4'>
                            
                            <div className='flex justify-between'>
                                <p className='text-lg font-bold text-richblack-5'>
                                    Your Courses
                                </p>
                                <Link to="/dashboard/my-courses">
                                    <p className='text-xs font-semibold text-yellow-50'>View all</p>
                                </Link>
                            </div>

                            <div className='mt-4 flex lg:flex-row flex-col items-center gap-x-6'>
                                {
                                    courses.slice(0,3).map((course) => (
                                        <div key={course._id}>
                                            <img
                                                src={course.thumbnail}
                                                alt={course.courseName}
                                                loading='lazy'
                                                className='h-[201px] w-full rounded-md object-cover '
                                            />
                                            <p className='mt-3 text-md font-medium text-richblack-50'>{course.courseName}</p>
                                            <p className='text-xs font-medium text-richblack-300 mt-1'>{course?.studentsEnrolled?.length } Students | Rs. {course.price}</p>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className='mt-20 grid place-items-center'>
                        <h2 className='text-2xl font-semibold text-richblack-25'>You have not created any courses yet</h2>
                        <Link to="/dashboard/add-course">
                            <p className='mt-3 py-2 px-3 bg-yellow-100 rounded-md text-richblack-900 font-semibold text-md'>
                                Create a Course
                            </p>
                        </Link>
                    </div>
                )
            )
        }
    </div>
  )
}

export default Instructor