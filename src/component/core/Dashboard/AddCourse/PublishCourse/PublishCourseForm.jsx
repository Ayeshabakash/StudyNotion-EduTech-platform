import React, { useEffect, useState } from 'react'
import {setStep, setEditCourse, resetCourseState} from "../../../../../Redux/Slices/courseSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ActionBtn from "../../../../common/ActionBtn"
import { COURSE_STATUS } from "../../../../../utils/constant"
import {editCourseDetails} from "../../../../../services/operations/courseAPI";
import toast from 'react-hot-toast';

const PublishCourseForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token} = useSelector( (state) => state.auth);
    const {course} = useSelector( (state) => state.course);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit , getValues, setValue} = useForm();


    useEffect(() => {
        if(course !== null && course.status === COURSE_STATUS.PUBLISHED){
            setValue("public" , true)
        }
    }, []);

    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses")
    }

    const onSubmit = async () => {
        if ((course.status === COURSE_STATUS.PUBLISHED &&  getValues("public") === true) ||
            (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
            // form has not been updated
            // no need to make api call
            goToCourses()
            return;
        }

        const formData = new FormData();

        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("courseId" , course._id);
        formData.append("status" , courseStatus);

        setLoading(true);

        const result = await editCourseDetails(formData, token);

        if(result){
            toast.success("Course Published")
            goToCourses();
        }
        setLoading(false);
    }


  return (
    <div className='bg-richblack-800 rounded-md p-6 border border-richblack-700 '>
        <h2 className='text-2xl font-semibold text-richblack-5'>Publish Course</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
            {/* checkbox */}
            <div className='my-6 mb-8'>
                <label htmlFor='public' className="inline-flex items-center text-lg">
                    <input
                        type='checkbox'
                        id='public'
                        {...register("public" , {required : true})}
                        className='border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400   focus:ring-2 focus:ring-richblack-5'
                    />
                    <span className='ml-2 text-richblack-400'>Make this course as public</span>
                </label>
            </div>

            {/* back and save button  */}
            <div className='flex items-center gap-x-4 ml-auto max-w-max'>
                <button
                  disabled={loading}
                  onClick={goBack}
                  className='cursor-pointer rounded-md bg-richblack-300 px-[20px] py-[8px] font-semibold  text-richblack-900'>
                    Back
                </button>

                <ActionBtn 
                   type="submit"
                   text = "Save Changes"
                   disabled={loading}
                />
            </div>
        </form>
    </div>
  )
}

export default PublishCourseForm