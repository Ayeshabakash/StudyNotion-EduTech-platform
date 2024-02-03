import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../component/core/HomePage/HighlightText';
import CTAButton from '../component/core/HomePage/CTAButton';
import BannerVideo from '../assets/Images/banner.mp4'
import CodeBlock from '../component/core/HomePage/CodeBlock';
import TimelineSection from "../component/core/HomePage/TimelineSection";
import LearningLanguageSection from '../component/core/HomePage/LearningLanguageSection';
import InstructorSection from '../component/core/HomePage/InstructorSection';
import ExploreMore from "../component/core/HomePage/ExploreMore";
import Footer from '../component/common/Footer';
import ReviewSlider from '../component/common/ReviewSlider';

const Home = () => {
  return (
    <div>
        {/* section 1*/}
        <div className='relative flex flex-col w-11/12 max-w-maxContent mx-auto items-center justify-between gap-8 text-white'>

            <div className='flex flex-col gap-8 mt-16 '>
                {/* become an Instructor button */}
                <Link to={"/signup"}>

                    <div className='group mx-auto w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 transition-all duration-200 hover:scale-95  drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
                        <div className='flex gap-2 items-center rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
                            <p>Become an Instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div> 

                </Link>
                {/* heading  */}
                <div className='text-center text-4xl font-semibold'>
                   Empower Your Future with 
                   <HighlightText text={" Coding Skills"}/>
                </div>

                {/* subheading  */}
                <div className='text-richblack-200 font-bold text-center text-lg w-[90%] -mt-3'>
                   With our online coding courses, you can learn at your own pace, 
                   from anywhere in the world, and get access to a wealth of resources, 
                   including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                {/* Buttons  */}
                <div className='flex mx-auto gap-7 mt-8'>
                    <CTAButton linkto={"/signup"} active={true}>
                        Learn More
                    </CTAButton>
                    <CTAButton linkto={"/login"} active={false}>
                        Book a Demo
                    </CTAButton>
                </div>
            </div>

            {/*banner video section */}
            <div className='mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
                <video
                className="shadow-[20px_20px_rgba(255,255,255)]"
                muted
                autoPlay
                loop>
                    <source src={BannerVideo}/>
                </video>
            </div>


            {/* code section 1*/}
            <div>
                <CodeBlock 
                    position={"flex-row"}

                    heading = {
                        <div className='text-4xl font-semibold'>
                            Unlock your  
                            <HighlightText text={"coding potential "}/>
                            with our online courses.
                        </div>
                    }

                    subheading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}

                    ctabtn1={
                        {
                           btnText : "Try it Yourself",
                           linkto : "/signup",
                           active : true
                        }
                    }

                    ctabtn2={
                        {
                           btnText : "Learn More",
                           linkto : "/login",
                           active : false
                        }
                    }

                    codeBlock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}

                    codeColor={"text-yellow-25"}

                    bgGradient={<div className='codeblock1Gradient absolute'></div>}
                />
            </div>


             {/* code section 2*/}
             <div>
                <CodeBlock 
                    position={"flex-row-reverse"}

                    heading = {
                        <div className='text-4xl font-semibold'>
                            Start 
                            <HighlightText text={"coding in seconds "}/>
                        </div>
                    }

                    subheading={"Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."}

                    ctabtn1={
                        {
                           btnText : "Continue Lesson",
                           linkto : "/signup",
                           active : true
                        }
                    }

                    ctabtn2={
                        {
                           btnText : "Learn More",
                           linkto : "/login",
                           active : false
                        }
                    }

                    codeBlock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}

                    codeColor={"text-white"}

                    bgGradient={<div className="codeblock2Gradient absolute"></div>}
                />
            </div>

            {/* Explore more section  */}
            <ExploreMore/> 

        </div>

        {/* section 2*/}
        <div className='bg-pure-greys-5 text-richblack-700'>
                
            <div className='pt-10 lg:pt-0 lg:h-[320px] bg_home'>
                 
                <div className='w-11/12 max-w-maxContent mx-auto h-full flex items-end justify-center '>  {/*flex-col items-center justify-between gap-8*/}

                    <div className='h-[100px] bottom-0 flex gap-7'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3'>
                            Explore Full Catalog
                            <FaArrowRight/>
                            </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/login"}>
                            Learn More
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className='w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8'>

                <div className='w-full my-20 flex lg:flex-row gap-y-5 flex-col justify-between'>

                    <div className='font-semibold text-4xl lg:w-[45%]'>
                        Get the skills you need for a 
                        <HighlightText text={"job that is in demand."}/>
                    </div>
                    <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
                        <p className='text-[16px] flex text-richblack-600'>
                            The modern StudyNotion is the dictates its own terms. Today, 
                            to be a competitive specialist requires more than professional skills.
                        </p>
                        <CTAButton active={true} linkto={"/signup"}>
                            Learn More
                        </CTAButton>
                    </div>
                </div>

                {/* timeline section  */}
                <TimelineSection/>


                {/* learning language section  */}
                <LearningLanguageSection/>
            </div>


        </div>

        {/* section 3*/}
        <div className='w-11/12 my-20 max-w-maxContent mx-auto flex flex-col items-center justify-between gap-8 text-white'>

            <InstructorSection/>
            
        </div>


        {/* review section  */}
        <div className='w-11/12 max-w-maxContent mx-auto my-20'>
            <h2 className='text-center text-4xl font-semibold text-richblack-5'> 
              Reviews from other learners
            </h2>

            <ReviewSlider/>
        </div>

        {/*footer*/} 
        <Footer/>
    </div>
  )
}

export default Home