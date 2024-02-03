import React, { useDebugValue, useState } from 'react'
import { useForm } from 'react-hook-form'
import ActionBtn from "../../../../common/ActionBtn"
import { IoAdd, IoAddCircleOutline } from "react-icons/io5"
import { useDispatch, useSelector } from 'react-redux'
import { MdNavigateNext } from "react-icons/md"
import { setCourse, setEditCourse, setStep } from '../../../../../Redux/Slices/courseSlice'
import { updateSection } from '../../../../../services/operations/courseAPI'
import { createSection } from  '../../../../../services/operations/courseAPI'
import NestedView from './NestedView'
import {toast} from "react-hot-toast"

const CourseBuilderForm = () => {
  const dispatch = useDispatch();
  const [loading , setLoading] = useState(false);
  const [editSectionName , setEditSectionName] = useState(null);  //we are willing to store the section id of section
  const {course} = useSelector( (state) => state.course);
  const {token } = useSelector( (state) => state.auth);
  const {register , setValue , 
        formState: { errors } , 
        handleSubmit} = useForm();


  // handle form submission 
  const onSubmit = async(data) => {
      setLoading(true);

      let result;

      if(editSectionName)
      {
          result = await updateSection({
                          sectionName : data.sectionName,
                          sectionId : editSectionName,
                          courseId : course._id
                         },
                         token);   
      }
      else{
          result  = await createSection({
                           sectionName : data.sectionName,
                           courseId : course._id,
                          },
                          token);
      }
      

      if(result)
      {
         dispatch(setCourse(result));
         setEditSectionName(null);
         setValue("sectionName", "");
      }

      setLoading(false);
  }


  const handleChangeEditSectionName = (sectionId , sectionName) => {  //when  some click the edit button to update the section name
      if(editSectionName === sectionId)  //edit section name was enabled , now cancel edit
      {
         cancelEdit();
         return;
      }

      setEditSectionName(sectionId);
      setValue("sectionName", sectionName);
  } 


  const cancelEdit =  () => { 
     setValue("sectionName", "");  //set value of input field  as  "" 
     setEditSectionName(null);
  }

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const gotoNext = () => {
     if(course?.courseContent?.length === 0)
     {
        toast.error("please add atleast one section");
        return;
     }

     if(course.courseContent.some((section) => section?.subSection?.length === 0)){  //every section should have a subsection
        toast.error("please add atleast one lecture in each section");
        return;
     }

     dispatch(setStep(3));
  }


  return (
    <div className='space-y-8 rounded-md bg-richblack-800 p-6 border border-richblack-700'>

        <h2 className='text-2xl font-semibold text-richblack-5'>Course Builder</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
           <div className='flex flex-col gap-y-2'>
              <label htmlFor="sectionName" className='label-style'>
                 Section Name <span className='text-pink-200'>*</span>
              </label>
              <input
                type='text'
                placeholder='Add a section to build your course'
                id='sectionName'
                disabled = {loading}
                {...register("sectionName" , {required:true})}
                className='form-style'
              />
              {
                 errors.sectionName && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>
                 )
              }
           </div>

           <div className='mt-4 flex items-end gap-x-4' >
              <ActionBtn 
                type= "submit"
                text={editSectionName ? "Edit Section Name" : "Create Section"}
                outline={true}

              >
                <IoAddCircleOutline size={20} className='text-yellow-50'/>
              </ActionBtn>

              {
                 editSectionName && (
                  <button
                    type="submit"
                    onClick={cancelEdit}
                    className='text-sm text-richblack-300 underline'>
                     Cancel Edit
                  </button>
                 )
              }
           </div>
        </form>
        {
           course.courseContent && course.courseContent.length > 0 && (
              <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
           )
        }

        {/* next and back button  */}
        <div className='flex justify-end gap-x-3'>
           <button
              onClick={goBack}
              className='cursor-pointer rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900'>
              Back
           </button>

           <ActionBtn 
              text="Next"
              onclick={gotoNext}
              disabled={loading}
              customClasses={`${loading && "bg-yellow-500"}`}
              >
              <MdNavigateNext/>
           </ActionBtn>
        </div>


    </div>
  )
}

export default CourseBuilderForm