import React, { useEffect, useState } from 'react'
import ActionBtn from '../../common/ActionBtn'
import { VscAdd } from "react-icons/vsc"
import { useNavigate } from 'react-router-dom'
import CourseTable from './InstructorCourses/CourseTable'
import { useSelector } from 'react-redux'
import {getInstructorCourses} from "../../../services/operations/courseAPI"

const MyCourses = () => {
    const navigate = useNavigate();
    const [courses , setCourses] = useState(null);
    const {token} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async() => {
        setLoading(true);
        const result = await getInstructorCourses(token);

        if(result)
        {
            setCourses(result);
        }
        setLoading(false);
    }
    useEffect( () => {
      fetchCourses();
    },[])

  return (
    <div>
        <div className='flex items-center justify-between mb-14'>
            <h2 className='text-3xl font-medium text-richblack-5'>My Courses</h2>
            <ActionBtn 
             text={"Add courses"}
             onclick={() => navigate("/dashboard/add-course")}
             disabled={loading}>
                <VscAdd/>
            </ActionBtn>
        </div>

        {courses && <CourseTable courses={courses} setCourses={setCourses}/>}
    </div>
  )
}

export default MyCourses