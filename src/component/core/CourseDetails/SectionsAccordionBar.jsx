import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { AiOutlineDown } from "react-icons/ai"
import SubSectionAccordion from "./SubSectionAccordion"

const SectionsAccordionBar = ({section , isActive , handleActive}) => {
    const contentEl = useRef(null)
    const [active , setActive] = useState(false);
    const [sectionHeight, setSectionHeight] = useState(0);

    useEffect(() => {
        isActive.includes(section._id) ? setActive(true) : setActive(false);
         // setActive(isActive.includes(section._id))
    },[isActive])


    useEffect(() => {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0);
    },[active])


  return (
    <div className='overflow-hidden border border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0'>

        <div
        className='flex justify-between cursor-pointer items-start hover:bg-opacity-20 px-7 py-6 transition-[0.3s]'
        onClick={() => handleActive(section._id)}>
            <div className='flex items-center gap-2'>
                <i 
                  className={isActive.includes(section._id) ? "rotate-180" : "rotate-0"}>
                    <AiOutlineDown/>
                </i>
                <p> {section?.sectionName}</p>
            </div>
            <div className='text-yellow-25'>
                {`${section?.subSections?.length || 0} lecture(s)`}
            </div>
        </div>

        <div
            ref={contentEl}
            className={`relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
            style={{
                height: sectionHeight,
            }}>
               <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
                    {
                        section?.subSections.map((subSection) => (
                           <SubSectionAccordion
                              key={subSection._id}
                              subSection = {subSection}
                           />
                        ))
                    }
               </div>
        </div>
    </div>
  )
}

export default SectionsAccordionBar