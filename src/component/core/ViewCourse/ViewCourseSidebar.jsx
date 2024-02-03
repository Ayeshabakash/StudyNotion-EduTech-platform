import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ActionBtn  from "../../common/ActionBtn"
import { MdArrowBackIosNew } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs"
import { BsChevronUp } from "react-icons/bs"

const ViewCourseSidebar = ({setReviewModal, setIsClose}) => {
    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState("");
    const [videoActive , setVideoActive] = useState("");
    const location = useLocation();
    const {sectionId , subSectionId} = useParams();
    const {totalNoOfLectures,
           courseSectionsData,
           completedLectures,
           courseEntireData
           } = useSelector((state) => state.viewCourse);

    // console.log("TESTING : ", courseSectionsData);
   useEffect( () => {
      const SetActiveStatus = () => {
        if(!courseSectionsData?.length)
       return;

       const activeSectionIndex = courseSectionsData?.findIndex((data) => data._id === sectionId);
       const activeLectureIndex = courseSectionsData?.[activeSectionIndex]?.subSections?.findIndex(
                                                        (data) => data._id === subSectionId
                                                      );

        const activeSubSectionId = courseSectionsData[activeSectionIndex]?.subSections[activeLectureIndex]?._id;
        //   set current section 
        setActiveStatus(courseSectionsData[activeSectionIndex]?._id);
        //   set current lecture 
        setVideoActive(activeSubSectionId);
      }

      SetActiveStatus();
   },[courseSectionsData , courseEntireData , location.pathname]);


    const handleAddReview = () => {
    console.log("I am inside Add handleAddReview")
    setReviewModal(true);
    }

  return (
    <div className='h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex flex-col border-r border-richblack-700 bg-richblack-800'>

        {/* buttons and heading  */}
        <div className='flex flex-col justify-between items-start mx-5 gap-y-4 border-b border-richblack-700 py-5 text-lg font-bold text-richblack-25'>
            <div className='flex justify-between items-center w-full'>
                <div 
                onClick={() => setIsClose(true)}
                className='flex items-center justify-center h-[35px] w-[35px] rounded-full text-richblack-700 bg-richblack-100 p-1 cursor-pointer hover:scale-90'>
                <MdArrowBackIosNew />
                </div>
                <div>
                    <ActionBtn
                        text={"Add Review"}
                        onclick={handleAddReview}
                    />
                </div>
            </div>

            <div className='flex flex-col'>
               <h3>{courseEntireData.courseName}</h3>
               <p className='text-sm text-richblack-400'>{`${completedLectures?.length} / ${totalNoOfLectures}`}</p>
            </div>
        </div>


        {/* section and subsection  */}
        <div  className="h-[calc(100vh-5rem)] overflow-y-auto">   {/* */}
            {
                courseSectionsData.map((section) => (
                    <div
                      className='mt-2 cursor-pointer  text-sm text-richblack-5'
                       onClick={() => setActiveStatus(section._id)}
                       key={section._id}>

                        <div className='flex items-center justify-between bg-richblack-600 px-5 py-4'>
                           <div className=' font-semibold w-[70%]'>{section?.sectionName}</div>
                           <span className={`${activeStatus === section._id && "rotate-180"} transition-all duration-500`}><BsChevronDown/></span>
                        </div>

                        {/* subsection  */}
                        {
                            activeStatus === section._id && (
                                <div className='transition-[height] duration-500 ease-in-out'>
                                    {
                                        section?.subSections.map((subSection) => (
                                            <div key={subSection._id}
                                              className={`flex gap-3 px-5 py-2 ${videoActive === subSection._id ? 
                                                "bg-yellow-200 font-semibold text-richblack-800" : 
                                                "bg-richblack-700 hover:bg-richblack-900"}`}
                                                onClick={() =>{ navigate(`view-course/${courseEntireData._id}/section/${section._id}/sub-section/${subSection._id}`)
                                                         setVideoActive(subSection._id)}}>
                                                <input
                                                    type='checkbox'
                                                    checked= {completedLectures.includes(subSection._id)}
                                                    onChange={() => {}}
                                                />

                                                <span>{subSection.title}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                ))
            }       
        </div>
    </div>
  )
}

export default ViewCourseSidebar