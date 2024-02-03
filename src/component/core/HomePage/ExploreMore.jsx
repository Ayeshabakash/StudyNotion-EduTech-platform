import React, { useState } from 'react'
import HighlightText from './HighlightText';
import { HomePageExplore } from "../../../data/homepage-explore"; 
import CourseCard from './CourseCard';


const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];
  
const ExploreMore = () => {
    const [currentTab , setCurrentTab] = useState(tabsName[0]);
    const [courses , setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) => {
          setCurrentTab(value);
          const result = HomePageExplore.filter( (course) => course.tag === value);
          setCourses(result[0].courses);
          setCurrentCard(result[0].courses[0].heading);
    };
  return (
    <div className='flex flex-col '>

        <div className='font-semibold text-4xl text-center'>
            Unlock the 
            <HighlightText text={"Power of Code"}/>
        </div>

        <p className='text-richblack-300 text-[18px] text-center font-semibold mt-2'>
           Learn to Build Anything You Can Imagine
        </p>


        {/* tabs section  */}
        <div className=' hidden lg:flex rounded-full gap-5 bg-richblack-800 text-richblack-200 p-1 font-medium  border-b-[1.5px] border-[rgba(255,255,255,0.25)] mt-5 mb-3'>
            {
                tabsName.map( (tab , index) => {
                    return (
                        <div className={`text-[16px] px-4 py-[7px] rounded-full transition-all duratoin-200
                                        ${tab === currentTab ? "bg-richblack-900 flex text-richblack-5 " : ""}
                                        cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
                            key={index}
                            onClick={() => setMyCards(tab)}>
                            {tab}
                        </div>
                    )
                })
            }
        </div>

        <div className="hidden lg:block lg:h-[200px]"></div>
        
        {/* cards section  */}
        <div className='mt-5 gap-y-10 lg:absolute flex lg:flex-row flex-col lg:justify-between flex-wrap w-full lg:bottom-0 text-black lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] lg:mb-0 mb-7 lg:px-0 px-3 '>
            {
                courses.map( (card  , index) => {
                    return(
                        <CourseCard
                            key={index}
                            courseData = {card}
                            currentCard = {currentCard}
                            setCurrentCard = {setCurrentCard}
                        />
                    )
                })
            }
        </div>  
    </div>
  )
}

export default ExploreMore

