import React, { useEffect } from 'react'
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import { useForm } from 'react-hook-form';
import ActionBtn from '../../common/ActionBtn';
import { useParams } from 'react-router-dom';
import { createRating } from '../../../services/operations/courseAPI';


const CourseReviewModal = ({setReviewModal}) => {
  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth);
  const {courseId} = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm();

  useEffect(() => {
    setValue("courseFeedback" , "");
    setValue("courseRating" , 0)
  },[])

  const handleRatingChange = (newRating) => {
    setValue("courseRating" , newRating);
  }

  const onSubmit = async(data) => {
      await createRating( {courseId:courseId, rating:data.courseRating, review:data.courseFeedback}, token);

      setReviewModal(false);
  }
  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid h-screen place-items-center overflow-auto bg-white  bg-opacity-10 backdrop-blur-sm'>
        <div className='my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800'>
           
           {/* modal header  */}
           <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
              <h2 className='text-xl font-semibold text-richblack-5'>Add Review</h2>
              <button
                onClick={() => setReviewModal(false)}>
                <MdOutlineClose size={25} />
              </button>
           </div>
            {/* modal body  */}
           <div className='p-6'>
              <div className='flex items-center justify-center gap-x-4'>
                 <div
                   className='aspect-square w-[50px] rounded-full object-cover'>
                   <img
                     src={user?.profileImage}
                     alt="user Image"
                     loading='lazy'
                     className='h-full w-full rounded-full'
                   />
                 </div>
                 <div>
                   <p className='font-semibold text-richblack-5'>{`${user?.firstName} ${user?.lastName}`}</p>
                   <p className='text-sm text-richblack-5'>Posting Publicly</p>
                 </div>
              </div>
           </div>

           <form
             onSubmit={handleSubmit(onSubmit)}
             className=' flex flex-col items-center'>

              <ReactStars
                 count={5}
                 onChange={handleRatingChange}
                 size={24}
                 activeColor="#ffd700"
              />

              <div className='flex flex-col space-y-2 w-11/12'>
                 <label htmlFor='courseFeedback' className='label-style'>Add your feedback for the course <span className='text-pink-200'>*</span></label>
                 <textarea
                   id="courseFeedback"
                   placeholder='Add your feedback here'
                   {...register("courseFeedback" , {required: true})}
                   className='form-style resize-x-none min-h-[130px] w-full'
                 />
                 {
                   errors.courseFeedback && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Course Feedback is required</span>
                   )
                 }
              </div>

              {/* cancel and submit button  */}
              <div className='my-6 flex w-11/12 justify-end gap-x-2'>
                 <button
                   onClick={() => setReviewModal(false)}
                   className='cursor-poiner rounded-md bg-richblack-300 py-2 px-[20px] font-semibold text-richblack-900'>
                    Cancel
                 </button>
                 <ActionBtn
                   type={"submit"}
                   text="Save"
                 />
              </div>
           </form>


        </div>
    </div>
  )
}

export default CourseReviewModal