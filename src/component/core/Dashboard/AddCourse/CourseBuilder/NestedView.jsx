import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import ConfirmationModal from '../../../../common/ConfirmationModal';
import {deleteSection , deleteSubSection} from "../../../../../services/operations/courseAPI"
import {setCourse} from "../../../../../Redux/Slices/courseSlice"
import SubSectionModal from './SubSectionModal';
const NestedView = ({handleChangeEditSectionName}) => {
  const [viewLecture, setViewlecture] = useState(null);
  const [editLecture, setEditLecture] = useState(null);
  const [addLecture , setAddLecture] = useState(null);
  const [confirmationModal , setConfirmationModal] = useState(null);
  const {course} = useSelector((state) => state.course);
  const {token } = useSelector( (state) => state.auth);
  const dispatch = useDispatch();
//   console.log("course",course);


  const handleDeleteSection = async (sectionId) => {
      const result = await deleteSection({sectionId , courseId:course._id, token});

      if(result){
         dispatch(setCourse(result));
      }

      setConfirmationModal(null);
  }


  const handleDeleteLecture = async (subSectionId , sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId}, token );
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }




  return (
    <div className='bg-richblack-700 rounded-lg p-6 px-8 '
    // id="nestedViewContainer"
    >
       {
          course?.courseContent?.map( (section) => (
             <details key={section._id} open>
                 {/* Section Dropdown Content */}
                 <summary className='flex justify-between items-center cursor-pointer border-b-[2px] border-richblack-600 py-2'>
                    <div className='flex gap-x-3 items-center'>
                       <RxDropdownMenu className='text-2xl text-richblack-50'/>
                       <p className='text-richblack-50 font-semibold'>{section.sectionName}</p>
                    </div>

                    <div className='flex gap-x-3 items-center'>

                       <button
                         onClick={() => handleChangeEditSectionName(section._id , section.sectionName)}
                         >
                         <MdEdit className='text-xl text-richblack-300'/>
                       </button>

                       <button
                         onClick={() => setConfirmationModal({
                          text1 : "Delete this section?",
                          text2 : "All lecture in this section will be deleted",
                          btn2Text : "Cancel",
                          btn1Text: "Confirm",
                          btn1Handler : () => handleDeleteSection(section._id),
                          btn2Handler : () => setConfirmationModal(null)
                         })}>
                         <RiDeleteBin6Line className='text-xl text-richblack-300'/>
                       </button>

                       <span className='font-medium text-richblack-300'>|</span>

                       <AiFillCaretDown className={`text-xl text-richblack-300`} />
                    </div>
                 </summary>

                 <div className='px-6 pb-4'>
                   {
                      section.subSections && section.subSections.map( (lecture) => (
                       <div key={lecture._id}
                          onClick={() => setViewlecture(lecture)}
                          className='flex items-center justify-between cursor-pointer border-b-2 border-richblack-600 py-2'>  

                          <div className='flex gap-x-3 items-center py-2'>
                            <RxDropdownMenu className='text-2xl text-richblack-50'/>
                            <p className='font-semibold text-richblack-50'>{lecture.title}</p>
                          </div>

                          <div className='flex items-center gap-x-3'
                               onClick={(e) => e.stopPropagation(lecture)}>

                            <button
                              onClick={() => setEditLecture({...lecture, sectionId: section._id})}>
                               <MdEdit className='tex-xl text-richblack-300'/>
                            </button>

                            <button
                              onClick={() => setConfirmationModal({
                                text1 : "Delete this lecture",
                                text2 : "This lecture will be deleted permanently",
                                btn1Text : "Cancel",
                                btn2Text : "Delete",
                                btn2Handler : () => handleDeleteLecture(lecture._id , section._id),
                                btn1Handler : () => setConfirmationModal(null)
                              })}>

                              <RiDeleteBin6Line className='text-xl text-richblack-300'/>
                            </button>
                          </div>
                       </div>
                     ))
                   }

                   {/* add new lecture button  */}
                   <button
                     onClick={() => setAddLecture(section._id)}
                     className='mt-3 flex items-center gap-x-1 text-yellow-50'>
                      <FaPlus className='text-lg'/>
                      <p>Add Lecture</p>
                   </button>
                 </div>
             </details>
          ))
       }

       {/*  display modal */}
       {
         addLecture && (
           <SubSectionModal 
              modalData= {addLecture}
              setModalData = {setAddLecture}
              add =  {true}
           />
         )
       }

       {
          viewLecture  && (
            <SubSectionModal
                modalData = {viewLecture}
                setModalData = {setViewlecture}
                view = {true}
            />
         )
       }


       {
          editLecture && (
             <SubSectionModal
                modalData = {editLecture}
                setModalData = {setEditLecture}
                edit = {true}
             />
          )
       }


       {/* confirmationModal  */}
       {
          confirmationModal ? (
             <ConfirmationModal modalData={confirmationModal}/>
          ) : (
            <></>
          )
       }

    </div>
  )
}

export default NestedView