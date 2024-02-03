import React from 'react'
import HighlightText from '../component/core/HomePage/HighlightText'
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import FoundingStoryImage from  "../assets/Images/FoundingStory.png"
import StatsComponent from '../component/core/AboutPage/StatsComponent'
import LearningGrid from "../component/core/AboutPage/LearningGrid"
import ContactFormSection from "../component/core/AboutPage/ContactFormSection"
import Footer from "../component/common/Footer"
import ReviewSlider from '../component/common/ReviewSlider' 

const About = () => {
  return (
    <div className='w-full'>

        {/* section1  */}
        <section className='bg-richblack-700'>
            <div className='relative w-11/12 max-x-maxContent mx-auto flex flex-col gap-10 text-center'>{/*  justify-between */}

                <div className='lg:w-[70%] mx-auto my-20'>
                    <h2 className='font-semibold text-4xl text-white'>
                        Driving Innovation in Online Eduction for a  <br/>
                        <HighlightText text={"Brighter Future"}/>
                    </h2>

                    <p className='text-richblack-300 lg:w-[90%] text-base font-medium text-center mx-auto mt-3'>
                        Studynotion is at the forefront of driving innovation in online education. 
                        We're passionate about creating a brighter future by offering cutting-edge courses, 
                        leveraging emerging technologies, and nurturing a vibrant learning community.
                    </p>
                </div>
                

                <div className="sm:h-[70px] lg:h-[150px] "></div>

                <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-48%] translate-y-[30%] gap-3 lg:gap-5 grid-cols-3">
                    <img
                        src={BannerImage1}
                        alt=''
                        loading='lazy'
                    />
                    <img
                        src={BannerImage2}
                        alt=''
                        loading='lazy'
                    />
                    <img
                        src={BannerImage3}
                        alt=''
                        loading='lazy'
                    />
                </div>
            </div>
        </section>

        {/* section 2  */}
        <section className='border-b border-richblack-700'>
            <div className='w-11/12 max-w-maxContent mx-auto'>
                <div className='h-[100px]'></div>

                <div className='text-4xl font-semibold text-center text-white py-20 w-[90%] mx-auto'>
                    We are passionate about revolutionizing the way we learn. Our innovative platform
                    <HighlightText text={"combines technology"}/> , 
                    <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
                        {" "}
                        expertise
                    </span>
                    , and community to create an 
                    <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
                        {" "}
                        unparalleled educational experience.
                    </span>

                </div>

            </div>
        </section>

        {/* section 3  */}
        <section>
            <div className='w-11/12 max-w-maxContent mx-auto text-richblack-300'>
                <div className='flex lg:flex-row flex-col justify-between items-center gap-10 my-24'>
                    <div className='lg:w-[50%] flex flex-col gap-10'>
                        <h2 className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%]'>Our Founding Story</h2>
                        <p className='text-base font-medium lg:w-[90%]'>
                            Our e-learning platform was born out of a shared vision and passion for transforming education. 
                            It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, 
                            flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                        </p>
                        <p className='text-base font-medium lg:w-[90%]'>
                            As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. 
                            We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. 
                            We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                        </p>
                    </div>
                    <div>
                        <img
                            src={FoundingStoryImage}
                            alt=''
                            loading='lazy'
                            className="shadow-[0_0_20px_0] shadow-[#FC6767]"
                        />
                    </div>
                </div>

                <div className='flex justify-between items-center lg:gap-10 gap-5 lg:flex-row flex-col my-24 pt-10'>
                    <div className='flex flex-col gap-10 lg:w-[40%]'>
                        <h2 className='bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>Our Vision</h2>
                        <p className='text-base font-medium lg:w-[90%]'>
                            With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. 
                            Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, 
                            fostering a dynamic and interactive learning experience.
                        </p>
                    </div>
                    <div className='flex flex-col gap-10 lg:w-[40%]'>
                        <h2 className='text-4xl font-semibold'> <HighlightText text={"Our Mission"}/></h2>
                        <p  className='text-base font-medium lg:w-[90%]'>
                            Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, 
                            where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an 
                            environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* section 4 */}
        <StatsComponent/>

        {/* section 5  */}
        <section>
            <LearningGrid />
            <ContactFormSection />
      </section>

      {/* Review slider  */}
       <div className='w-11/12 max-w-maxContent mx-auto my-20'>
            <h2 className='text-center text-4xl font-semibold text-richblack-5'> 
              Reviews from other learners
            </h2>

            <ReviewSlider/>
        </div>

      {/* footer  */}
      <Footer/>
    </div>
  )
}

export default About