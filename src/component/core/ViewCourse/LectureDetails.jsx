import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BigPlayButton, Player } from 'video-react';
import 'video-react/dist/video-react.css';
import ActionBtn from '../../common/ActionBtn';
import { GrChapterNext } from "react-icons/gr";
import { GrChapterPrevious } from "react-icons/gr";
import { VscDebugRestart } from "react-icons/vsc";
import {markLectureAsComplete} from "../../../services/operations/courseAPI"
import {updateCompletedLectures} from "../../../Redux/Slices/viewCourseSlice"

const LectureDetails = () => {
  const {courseId , sectionId, subSectionId} = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const playerRef = useRef();
  const {token} = useSelector((state) => state.auth);
  const {courseEntireData , courseSectionsData , completedLectures} = useSelector((state) => state.viewCourse);

  const [lectureData , setLectureData] = useState([]);
  const [videoEnded , setVideoEnded] = useState(false);
  const [loading , setLoading] = useState(false);

  // console.log("course sections  : ", courseSectionsData);
  useEffect(() => {
    
    const setVideoSpecificDetails = () => {
      if(courseSectionsData?.length === 0)
      return;

      if(!courseId || !sectionId || !subSectionId)
      {
        navigate("/dashboard/enrolled-courses");
      }
      else{
        const currSection = courseSectionsData?.find((section) => section._id === sectionId);

        if (!currSection) {
          console.error("Section not found");
          return;
        }

        const currLecture = currSection.subSections?.find((subSection) => subSection._id === subSectionId);

        if (!currLecture) {
          console.error("Lecture not found");
          return;
        }

        // console.log("Current lecture :", currLecture);
        setLectureData(currLecture);
        setVideoEnded(false);
      }
    }

    setVideoSpecificDetails();

  },[courseEntireData , courseSectionsData , location.pathname])


  const isFirstLecture = () => {
    //  const currLectureId = videoDetails._id;

    //  if(currLectureId === courseSectionsData?.[0]?.subSections?.[0]._id)
    //  return true;
    //  else 
    //  return false;

    const currentSectionIndex = courseSectionsData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndex = courseSectionsData[currentSectionIndex]?.subSections?.findIndex(
        (data) => data._id === subSectionId
    )
    if(currentSectionIndex === 0 && currentSubSectionIndex === 0) {
        return true;
    }
    else {
        return false;
    }
  }

  const isLastLecture = () => {
     const currSectionIndex = courseSectionsData.findIndex((section) => section._id === sectionId);

     const currSubSectionIndex = courseSectionsData[currSectionIndex]?.subSections.findIndex((sub) => sub._id === subSectionId);

     const totalLectures = courseSectionsData[currSectionIndex]?.subSections?.length;


     if(currSectionIndex === courseSectionsData?.length - 1 && 
        currSubSectionIndex === totalLectures - 1){
          return true;
        }
        else{
          return false;
        }
  }

  const goToNext = () => {
     const currSectionIndex = courseSectionsData?.findIndex((section) => section._id === sectionId);

     const currSubSectionIndex = courseSectionsData[currSectionIndex]?.subSections?.findIndex((sub) => sub._id === subSectionId);

     const numberOfLectures = courseSectionsData[currSectionIndex]?.subSections?.length;

     if(currSubSectionIndex !==  numberOfLectures - 1)
     {
        // current lecture is not the last lecture of curr section 
        const nextLectureId = courseSectionsData[currSectionIndex]?.subSections[currSubSectionIndex + 1]._id;

        navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextLectureId}`);

     }
     else{
      //  last video of curr section then go to the first lecture of next section 
       const nextSectionId = courseSectionsData[currSectionIndex + 1]._id;

       const nextLectureId = courseSectionsData[currSectionIndex + 1]?.subSections[0]._id;

       navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextLectureId}`);

     }
    }

    const goToPrev = () => {
      const currSectionIndex = courseSectionsData?.findIndex((section) => section._id === sectionId);

      const currSubSectionIndex = courseSectionsData[currSectionIndex]?.subSections?.findIndex((sub) => sub._id === subSectionId);
 
       if(currSubSectionIndex !== 0)
       {
          // curr lecture is not the first lecture of the currsection 
          const prevSubSectionId = courseSectionsData[currSectionIndex]?.subSections[currSubSectionIndex - 1]._id;

          navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
       }
       else{
          // first lecture of the curr section, then go to the last lecture of prev section 
          const prevSectionId = courseSectionsData[currSectionIndex - 1]._id;

          const prevSectionLength = courseSectionsData[currSectionIndex - 1]?.subSections?.length;

          const prevLectureId = courseSectionsData[currSectionIndex - 1]?.subSections[prevSectionLength - 1]._id;

          navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevLectureId}`);
       }
     }


     console.log("LECTURE", lectureData);
     const handleLectureCompleted = async() => {
      console.log("testing");
      setLoading(true);
      const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
      //state update
      if(res) {
          dispatch(updateCompletedLectures(subSectionId)); 
      }
      setLoading(false);
     }
  return (
    <div>
      {
         !lectureData ? (
           <div>
             No Lecture Found!!
           </div>
         ) : (
           <div>
              <Player
                ref = {playerRef}
                aspectRatio="16:9"
                playsInline 
                onEnded={() => setVideoEnded(true)}
                src={lectureData.videoUrl}
                >
                <BigPlayButton position="center" /> 

              {
                videoEnded && (
                    <div
                      style={{
                        backgroundImage:
                        "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                        }}
                        className='full absolute inset-0 z-[100] grid h-full place-content-center font-inter'>
                          {
                              !completedLectures.includes(subSectionId)  &&  (
                                <ActionBtn
                                  disabled={loading}
                                  text={!loading ? "Mark as Completed" : "loading..."}
                                  onclick={handleLectureCompleted}
                                  customClasses={"text-xl max-w-max px-4 mx-auto "}
                                />
                              )
                          }                          

                          <div className='mt-10 flex min-w-[250px] justify-between gap-x-4 text-xl'>

                              <button 
                                    disabled={loading || isFirstLecture()}
                                    onClick={goToPrev}
                                    className={`${isFirstLecture() && "opacity-40"}`}>
                                    <GrChapterPrevious />
                              </button>
                              
                              <button
                                onClick={() => {
                                 if(playerRef.current) {
                                     playerRef.current.seek(0);
                                     setVideoEnded(false);
                                 }
                                 }}
                                 disabled={loading}>
                                <VscDebugRestart size={24} />
                              </button>

                              <button
                                    disabled={loading || isLastLecture()}
                                    onClick={goToNext}
                                    className={`${isLastLecture() && "opacity-40"}`}>
                                    <GrChapterNext />
                              </button>
                          </div>
                    </div>
                )
              }
              </Player>
           </div>
         )
      }
      <h2 className='mt-4 text-3xl font-semibold '>{lectureData?.title}</h2>
      <p className='pt-2 pb-6'>{lectureData?.description}</p>
    </div>
  )
}


export default LectureDetails