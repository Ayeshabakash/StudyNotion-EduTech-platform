import React from 'react'
import { FaShareSquare } from "react-icons/fa"
import { TbCertificate, TbDevices, TbShare3 } from "react-icons/tb";
import { BsCursorFill } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {addToCart} from "../../../Redux/Slices/cartSlice"
import {ACCOUNT_TYPE} from "../../../utils/constant"
import toast from 'react-hot-toast';
import copy from 'copy-to-clipboard';

const CourseDetailsCard = ({course , handleBuyCourse , setConfirmationModal}) => {
    const {user} = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();


    const handleAddToCart = () => {
        if(user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("An instrutor cannot buy a course");
            return;
        }

        if(token){
            dispatch(addToCart(course));
            return;
        }

        // if user is not logged in 
        setConfirmationModal({
            text1 : "You are not logged in",
            text2:"Please login to add to cart",
            btn1Text : "Login",
            btn2Text : "Cancel",
            btn1Handler : ()=>navigate("/login"),
            btn2Handler : () => setConfirmationModal(null)
        })
    }

    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link copied to clipboard");
    }
    return (
    <div className='rounded-md bg-richblack-700 p-2 text-richblack-5 w-fit'>
        <img
            src={course?.thumbnail}
            alt='course-thumbnail'
            loading='lazy'
            className='max-h-[300px] min-h-[180px] w-[350px] overflow-hidden rounded-md bject-cover md:max-w-full'
        />

        <div className='px-2 space-y-4'>
            <p className='text-xl mt-4 font-semibold'>Rs. {course?.price}</p>

            <div className='flex flex-col gap-3'>
                <button
                className='cursor-pointer rounded-md px-[20x] py-[8px] bg-yellow-50 font-semibold text-richblack-900'
                onClick={
                        user && course.studentsEnrolled.includes(user._id)
                        ? ()=> navigate("/dashboard/enrolled-courses")
                        : handleBuyCourse
                }>
                    {
                        user && course?.studentsEnrolled.includes(user._id) ? (
                            "Go to Course"
                        ) : (
                            "Buy Course"
                        )
                    }
                </button>

                {/* show add to cart button if user have not bought this course already  */}
                {
                    !user || !course?.studentsEnrolled.includes(user._id) && (
                        <button
                        className='cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5;'
                        onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    )
                }
            </div>

            <div>
                <p className='text-center  text-sm text-richblack-25  px-6 py-3'>30-Day Money-Back Guarantee</p>

                <p className='my-2 mb-1 text-lg font-semibold'>This Course Includes:</p>

                <ul>
                    <li className="flex items-center gap-1 text-sm font-medium text-caribbeangreen-100">
                    <FiClock />8 hours on-demand video
                    </li>
                    <li className="flex items-center gap-1 text-sm font-medium text-caribbeangreen-100">
                    <BsCursorFill />
                    Full Lifetime access.
                    </li>
                    <li className="flex items-center gap-1 text-sm font-medium text-caribbeangreen-100">
                    <TbDevices />
                    Access on mobile and tv
                    </li>
                    <li className="flex items-center gap-1 text-sm font-medium text-caribbeangreen-100">
                    <TbCertificate />
                    Certificate of completion
                    </li>
                </ul>
            </div>

            <div className='flex justify-center'>
                <button
                className='py-6 text-yellow-100 flex items-center gap-2'
                onClick={handleShare}>
                    <FaShareSquare size={20}/> Share
                </button>
            </div>
        </div>
    </div>
  )
}

export default CourseDetailsCard