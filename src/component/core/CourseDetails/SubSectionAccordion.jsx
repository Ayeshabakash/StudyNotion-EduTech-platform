import React from 'react'
import { HiOutlineVideoCamera } from "react-icons/hi"

const SubSectionAccordion = ({subSection}) => {
    
  return (
    <div className='flex justify-between py-2'>
        <div className='flex items-center gap-2'>
            <HiOutlineVideoCamera/>
            <span>{subSection?.title}</span>
        </div>
    </div>
  )
}

export default SubSectionAccordion