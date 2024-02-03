import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import CTAButton  from "../HomePage/CTAButton";

const LearningGridArray = [
{
  order: 0,
  heading: "World-Class Learning for",
  highlight: "Anyone, Anywhere",
  description:
    "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
  BtnText: "Learn More",
  BtnLink: "/",
},
{
  order: 1,
  heading: "Curriculum Based on Industry Needs",
  description:
    "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
},
{
  order: 2,
  heading: "Our Learning Methods",
  description:
    "Studynotion partners with more than 275+ leading universities and companies to bring",
},
{
  order: 3,
  heading: "Certification",
  description:
    "Studynotion partners with more than 275+ leading universities and companies to bring",
},
{
  order: 4,
  heading: `Rating "Auto-grading"`,
  description:
    "Studynotion partners with more than 275+ leading universities and companies to bring",
},
{
  order: 5,
  heading: "Ready to Work",
  description:
    "Studynotion partners with more than 275+ leading universities and companies to bring",
},
];

const LearningGrid = () => {

  return (
    <div className='w-11/12 max-w-maxContent mx-auto mt-20'>
        <div className='grid grid-cols-1 xl:w-fit xl:grid-cols-4 mb-12'>
        {
            LearningGridArray.map( (card , index) => {
                return(
                    <div key={index}
                    className={`${index === 0 && "xl:col-span-2 bg-richblack-900"}
                    ${card.order % 2 === 1 ? "bg-richblack-700" : "bg-richblack-800"}
                    ${card.order === 3 && " xl:col-start-2"} xl:h-[294px]`}>
                    {
                        card.order ===  0 ? (
                            <div className='flex flex-col gap-3 xl:w-[90%] xl:pb-0'>

                                <h2 className='text-4xl font-semibold text-white'>
                                    {card.heading}
                                    <HighlightText text={"Anyone, Anywhere"}/>
                                </h2>

                                <p className="text-richblack-300 font-medium mb-2">
                                    {card.description}
                                </p>

                                <div className='w-fit mb-5'>
                                  <CTAButton active={true} to={card.BtnLink}>
                                      {card.BtnText}
                                  </CTAButton> 
                                </div>
                                

                            </div>
                        ) : (
                            <div className='flex flex-col gap-8 p-8'>
                                 <h2 className='text-lg text-richblack-5'>{card.heading}</h2>
                                 <p className='text-richblack-300 font-medium'>{card.description}</p>
                            </div>
                        )
                    }
                    </div>
                )
            })
        }
        </div>
    </div>
  )
}

export default LearningGrid