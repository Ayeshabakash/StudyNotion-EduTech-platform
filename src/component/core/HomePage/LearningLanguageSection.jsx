import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.svg"
import compare_with_other from "../../../assets/Images/Compare_with_others.svg"
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg"
import CTAButton from './CTAButton'

const LearningLanguageSection = () => {
  return (
    <div className='flex flex-col items-center my-10'>

        <div className='font-semibold text-4xl'>
          Your swiss knife for 
          <HighlightText text={"learning any language"}/>
        </div>

        <div className='text-base text-richblack-700 font-medium lg:w-[75%] text-center mt-3 leading-6 font-inter'>
            Using spin making learning multiple languages easy.
             with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex mt-8 lg:mt-0 lg:flex-row flex-col items-center justify-center '>
            <img
                src={know_your_progress}
                alt='knowYourProgress'
                loading='lazy'
                className='object-contain ;g:-mr-32'
            />

            <img
                src={compare_with_other}
                alt='compareWithOther'
                loading='lazy'
                className="object-contain lg:-mb-10 lg:mt-0 -mt-12 "
            />
            <img
                src={plan_your_lessons}
                alt='planYourLessons'
                loading='lazy'
                className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
            />

        </div>

        <div className='mt-6 lg:mb-10'>
            <CTAButton active={true} linkto={"/signup"}>
                Learn More
            </CTAButton>
        </div>



    </div>
  )
}

export default LearningLanguageSection