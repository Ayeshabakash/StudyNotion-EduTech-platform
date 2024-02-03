import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import {buyCourse, sendPaymentSuccessEmail } from "../services/operations/paymentAPI"
import {fetchCourseDetails} from "../services/operations/courseAPI";
import getAvgRating from "../utils/getAvgRating";
import RatingStars from '../component/common/RatingStars';
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { BiInfoCircle } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { BsFillCaretRightFill } from "react-icons/bs"
import CourseDetailsCard from '../component/core/CourseDetails/CourseDetailsCard';
import SectionsAccordionBar from '../component/core/CourseDetails/SectionsAccordionBar';
import Footer from "../component/common/Footer"
import ConfirmationModal from "../component/common/ConfirmationModal"
import {formatDate} from "../services/formatDate"

const CourseDetails = () => {
  const [courseData ,setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [totalLectures, setTotalLecture] = useState(0);
  const [isActive , setIsActive] = useState([]);   //for handling the collapsion of the sections
  const [avgRating , setAvgRating] = useState(0);
  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);
  const {loading} = useSelector((state) => state.auth);
  const {paymentLoading} = useSelector((state) => state.course);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {courseId} = useParams();

  useEffect(() => {
      const GetCourseDetails = async() => {
         const result = await fetchCourseDetails(courseId);
         if (!result) return;
        // console.log(result)
        setCourseData(result);

        const courseAvgRating = getAvgRating(result?.ratingAndReviews);
        // console.log("AVG rating ",courseAvgRating)
        setAvgRating(courseAvgRating);
         
      }
      GetCourseDetails();
  },[courseId])


  // calculating numbers of lecture in each section 
  useEffect(() => {
      if(!loading){
        let lectures = 0;
        courseData?.courseContent.forEach((section) => {
           lectures += section.subSections.length || 0;
        })

        setTotalLecture(lectures)
      }
  }, [courseData])


  const handleActive = (id) => {
      isActive?.includes(id) ? setIsActive(isActive.filter((e) => e !== id)) : 
                              setIsActive([...isActive, id]);
  }

  // another way 

//   const handleActive = (id) => {
//     setIsActive(!isActive.includes(id) ?
//         isActive.concat(id) :
//         isActive.filter((e) => e !== id)
//     )
// }


  const handleBuyCourse = () => {
    if(token)
    {
      buyCourse(token , [courseId], user , navigate , dispatch);
      return;
    }

    setConfirmationModal({
      text1 : "You are not Logged in",
      text2  :"Please login to purchase the course",
      btn1Text : "Login",
      btn2Text : "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler : () => setConfirmationModal(null),
    })

  }


  if (loading || !courseData) {
    return ( 
        <div className="text-center text-white my-auto" >
        Loading... 
        </div>
    )
  }

  if(paymentLoading)
  {
     return (
      <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
         <div className='spinner'></div>
      </div>
     )
  }

  // const {
  //   category,
  //   courseName,
  //   courseDescription,
  //   ratingAndReviews,
  //   studentsEnrolled,
  //   instructor,
  //   createdAt,
  //   whatYouWillLearn,
  //   thumbnail,
  //   price,
  // } = courseData;
  
  const Benefits = courseData.whatWillYouLearn.split('\r\n').filter(sentence => sentence.trim() !== '');

  console.log("course details -> ",courseData);
  return (
    <div className='min-h-screen bg-richblack-900 text-richblack-5'>
        <div className='bg-richblack-800'>
           <div className='w-11/12 max-w-maxContent mx-auto box-content p-6 space-y-2'>
              <h2 
                onClick={() => navigate(-1)}
                className=' text-sm text-richblack-300 cursor-pointer'>
                 {`Home / ${courseData?.category.name} / `}
                 <span  
                  onClick={(e) => e.stopPropagation()}
                  className='text-yellow-100'
                 >{courseData?.courseName}</span>
              </h2>


              <div className='py-8 lg:py-16 space-y-3 relative'>
                  {/* show this div only on small screen  */}
                  <div className='relative block max-h-[30rem] lg:hidden mb-5'>
                    <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                    <img
                      src={courseData?.thumbnail}
                      alt='course-thumbnail'
                      loading='lazy'
                      className='aspect-auto w-full'
                    />
                  </div>
                  <h2 className='text-4xl font-semibold text-richblack-5'>{courseData?.courseName}</h2>
                  <p className='text-richblack-200  lg:max-w-[50vw]'>{courseData?.courseDescription}</p>

                  <div className='text-md flex items-center gap-2'>
                    <span className='text-yellow-25'>{avgRating}</span>
                    <RatingStars ReviewCount={avgRating} starSize={24}/>
                    <span>{`(${courseData?.ratingAndReviews?.length} Reviews)`}</span>
                    <span>{`${courseData?.studentsEnrolled?.length} students enrolled`}</span>
                  </div>

                  <p>{`Created by ${courseData?.instructor.firstName} ${courseData?.instructor.lastName}`}</p>

                  <div className='flex flex-wrap gap-5 text-lg'>
                    <p className='flex items-center gap-2'>
                      <BiInfoCircle/>
                      {`Created at ${formatDate(courseData?.createdAt)}`}
                    </p>

                    <p className='flex items-center gap-2'>
                      <HiOutlineGlobeAlt/>
                      English
                    </p>
                  </div>


                  {/* show the buy button only on small screen  */}
                  <div className=' flex flex-col  gap-4 w-full border-y border-richblack-500 py-4 lg:hidden'>
                      <p className='text-3xl font-semibold text-richblack-5 pb-4'>Rs. {courseData?.price}</p>
                      <button
                        onClick={handleBuyCourse}
                        className='cursor-pointer rounded-md px-[20x] py-[8px] bg-yellow-50 font-semibold text-richblack-900'>
                         Buy Now
                      </button>

                      <button className='cursor-pointer rounded-md bg-richblack-700 px-[20px] py-[8px] font-semibold text-richblack-5;'>
                         Add to Cart
                      </button>
                  </div>


                  {/* course card to buy  */}
                  <div className='min-h-[600px]  w-1/3 max-w-[410px] lg:absolute  lg:block hidden right-[1rem] top-[30px] mx-auto'>
                    <CourseDetailsCard 
                        course = {courseData}
                        handleBuyCourse = {handleBuyCourse}
                        setConfirmationModal = {setConfirmationModal}
                    />
                  </div>

              </div>
           </div>



        </div>

        <div className='w-11/12 max-w-maxContent mx-auto px-4 text-richblack-5 box-content'>
          <div className='max-w-maxContentTab lg:mx-0 mx-auto xl:max-w-[810px]'>
              {/* what will you learn section  */}
              <div  className='border border-richblack-600 my-8 p-8'>
                <h3 className="text-3xl font-semibold mb-5">What you'll learn</h3>
                {
                  Benefits.map((item, index) => (
                    <div key={index}
                      className='flex items-start gap-2 space-y-1'>
                      <BsFillCaretRightFill className='mt-2'/>
                      <p className='text-md text-richblack-200'>
                         {item}
                      </p>
                    </div>
                  ))
                }
              </div>


              {/* course content section  */}
              <div className='flex flex-col gap-3'>
                <h3 className='text-[28px] font-semibold '>Course Content</h3>
                <div className='flex justify-between flex-wrap  gap-2'>
                  <div className='flex gap-2 text-richblack-25 '>
                    <span>
                      {`${courseData.courseContent.length} Section(s)`}
                    </span>
                    <span>
                      {`${totalLectures} Lecture(s)`}
                    </span>
                    <span>
                      {`${courseData.totalDuration} total Length`}
                    </span>
                  </div>
                  <div>
                    <button
                     className='text-yellow-25'
                     onClick={() => setIsActive([])}>
                      Collapse all sections
                    </button>
                  </div>
                </div>
                {
                   courseData?.courseContent?.length > 0 ? (
                      <div className='py-4'>
                         {
                           courseData?.courseContent.map((section) => (
                              <SectionsAccordionBar
                                key={section._id}
                                section = {section}
                                isActive = {isActive}
                                handleActive={handleActive}
                              />
                           ))
                         }
                      </div>
                   ) : (
                    <div className='py-4 text-center text-4xl text-richblack-500 font-bold'>
                       No section Found!!
                    </div>
                   )
                }
              </div>

              {/* instructor details  */}
              <div className='mb-12 py-4'>
                <p className="text-[28px] font-semibold">instructor</p>
                <div className='flex items-center gap-4 py-4'>
                   <img
                     src={courseData?.instructor?.profileImage ? 
                      courseData?.instructor?.profileImage
                     : `https://api.dicebear.com/5.x/initials/svg?seed=${courseData?.instructor?.firstName} ${courseData?.instructor.lastName}`
                     }
                     alt="instructor"
                     loading='lazy'
                     className='h-14 w-14 rounded-full object-cover'
                   />
                   <p className='text-lg'>{`${courseData?.instructor?.firstName} ${courseData?.instructor?.lastName}`}</p>
                </div>
                <p className='text-richblack-50 lg:max-w-[70%]' >{courseData?.instructor?.additionalDetails?.about}</p>
              </div>
          </div>
        </div>

        <Footer/>

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default CourseDetails