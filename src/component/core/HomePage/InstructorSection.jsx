import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from "react-icons/fa";

const InstructorSection = () => {
  return (
    <div className='flex lg:flex-row flex-col gap-10 lg:gap-20 items-center'>

        <div className='lg:w-[50%]'>
            <img src={Instructor}
                alt='instructor'
                loading='lazy'
                className='shadow-white shadow-[-20px_-20px_0_0]'
            />
        </div>

        <div className='flex flex-col  gap-10 lg:w-[50%]'>

            <div className='font-semibold text-4xl w-[50%]'>
                Become an
                <HighlightText text={"Instructor"}/>
            </div>

            <p className='font-medium text-[16px] text-richblack-300 w-[90%]'>
             Instructors from around the world teach millions of students on StudyNotion. 
             We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'> 
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Teaching Today
                        <FaArrowRight/>
                    </div>
                    
                </CTAButton>
            </div>
            
        </div>
    </div>
  )
}

export default InstructorSection