import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { RxCross2 } from "react-icons/rx"
import UploadFile from "../UploadFile"
import ActionBtn from "../../../../common/ActionBtn"
import toast from 'react-hot-toast';
import {setCourse} from "../../../../../Redux/Slices/courseSlice"
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseAPI';

const SubSectionModal = ({modalData , setModalData, add = false , view = false, edit = false}) => {

  const dispatch = useDispatch();
  const {course} = useSelector( (state) => state.course);
  const {token } = useSelector( (state) => state.auth);
  const [loading , setLoading] = useState(false);
  const {register,
        handleSubmit,
        setValue,
        formState: { errors },
        getValues,
       } = useForm();

  
  useEffect( () => {
      if(view || edit)
      {
        setValue("lectureTitle" , modalData.title)
        setValue("lectureDesc" , modalData.description)
        setValue("lectureVideo" , modalData.videoUrl)
      }
  }, []);


  const isFormUpdated = () => {
      const currentValues = getValues();

      if(
        currentValues.lectureTitle !== modalData.title ||
        currentValues.lectureDesc  !== modalData.description || 
        currentValues.lectureVideo !== modalData.videoUrl
      )
      return true
      else
      return false;
  }

  const handleEditSubSection = async() => {
      const currentValues = getValues();

      const formData = new FormData();

      formData.append("sectionId", modalData.sectionId);
      formData.append("subSectionId",modalData._id);

      if(currentValues.lectureTitle !== modalData.title)
      {
        formData.append("title" , currentValues.lectureTitle);
      }
      if(currentValues.lectureDesc !== modalData.description)
      {
        formData.append("description", currentValues.lectureDesc);
      }
      if(currentValues.lectureVideo !== modalData.videoUrl)
      {
        formData.append("video" , currentValues.lectureVideo);
      }

      setLoading(true);
      const result = await updateSubSection(formData , token);
      console.log("REsult", result);
      if(result){
        // updating the section of course slice 
         const updatedCourseContent = course.courseContent.map((section) => 
         section._id === modalData.sectionId  ? result  : section 
         )

         const updatedCourse = {...course, courseContent : updatedCourseContent}
         dispatch(setCourse(updatedCourse));
      }
      setModalData(null);
      setLoading(false);
  }

  const onSubmit = async(data) => {
     if(view)
     return;

     if(edit)
     {
        if(isFormUpdated())
        {
           handleEditSubSection();
        }
        else{
           toast.error("No changes made");
        }
        return;
     }


    //  add new lecture case
    const formData = new FormData();
    formData.append("title" , data.lectureTitle);
    formData.append("description" , data.lectureDesc);
    // console.log("VideoFile : ",data.lectureVideo);
    formData.append("videoFile" , data.lectureVideo)
    formData.append("sectionId" , modalData);  //because in case of add new lecture we only passing sectionid in modal data

    setLoading(true);
    const result = await createSubSection(formData, token);
    console.log("RESULT : ",result);
     if(result){
       // update the structure of course
       const updatedCourseContent = course.courseContent.map((section) =>
       section._id === modalData ? result : section)
       const updatedCourse = { ...course, courseContent: updatedCourseContent }
       dispatch(setCourse(updatedCourse));
       console.log("course : -> ", course);
     }

     setModalData(null);
     setLoading(false);
  }

  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center h-screen w-screen overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>

        <div className='my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400  bg-richblack-800'>
           {/* modal header */}
           <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
              <h2 className='text-xl font-semibold text-richblack-5'>{add && "Adding"} {edit && "Editing"} {view && "Viewing "} Lecture</h2>

              <button onClick={() => (!loading ? setModalData(null) : {})}>
                  <RxCross2 className='text-2xl text-richblack-5'/>
              </button>
           </div>

           {/* modal form  */}
           <form 
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-8 px-8 py-10'> 

                <UploadFile
                  name = "lectureVideo"
                  label = "Lecture Video"
                  register={register}
                  setValue={setValue}
                  errors={errors}
                  video = {true}
                  viewData={view ? modalData.videoUrl : null}
                  editData={edit ? modalData.videoUrl : null}
                />


                {/* lecture title  */}
                <div className='flex flex-col gap-y-2'>
                   <label htmlFor="lectureTitle" className='label-style'>Lecture Title <sup className='text-pink-200'>*</sup></label>
                   <input
                    type='text'
                    disabled = {loading || view}
                    id='lectureTitle'
                    placeholder='Enter Lecture Title'
                    {...register("lectureTitle" , {required: true})}
                    className='form-style'
                   />
                   {
                     errors.lectureTitle && (
                      <span className='ml-2 text-xs tracking-wide text-pink-200'>Lecture title is required</span>
                     )
                   }
                </div>

                {/* lecture description  */}
                <div className='flex flex-col gap-y-2'>
                   <label className='label-style'>Lecture Description <sup className='text-pink-200'>*</sup></label>
                   <textarea
                    disabled= {loading || view}
                    placeholder='Enter Lecture description'
                    id='lectureDesc'
                    {...register("lectureDesc", {required :true}) }
                    className='form-style resize-x-none min-h-[130px]'
                   />
                   {
                    errors.lectureDesc && (
                       <span className='ml-2 text-xs tracking-wide text-pink-200'>
                         Lecture description is required
                       </span>
                    )
                   }
                </div>
                {
                   !view && (
                     <div className='flex justify-end'>
                        <ActionBtn
                          type={"submit"}
                          disabled= {loading}
                          text = {loading ? "loading..." : edit ? "Save Changes" : "Save"}
                        />
                     </div>
                   )
                }
              
           </form>
        </div>
    </div>
  )
}

export default SubSectionModal