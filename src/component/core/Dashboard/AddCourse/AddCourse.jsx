import React from 'react'
import RenderSteps from './RenderSteps'

const AddCourse = () => {
  return (
    <div className='w-full flex lg:flex-row flex-col   items-start gap-6'>{/* */}
        <div className='flex flex-col flex-1'>
            <h2 className='text-3xl font-medium text-richblack-5 mb-14'>Add Course</h2>
            <div className='flex-1'>
                <RenderSteps/>
            </div>
        </div>
        <div className='sticky top-10 max-w-[400px] flex-1 bg-richblack-800 border border-richblack-700 rounded-md p-6'>  
            <h3 className='text-lg text-richblack-5 mb-8'>⚡ Course Upload Tips</h3>
            <ul className='ml-5 text-xs text-richblack-5  space-y-4 list-item list-disc '>
                <li>Set the Course Price option or make it free.</li>
                <li>Standard size for the course thumbnail is 1024x576.</li>
                <li>Video section controls the course overview video.</li>
                <li>Course Builder is where you create & organize a course.</li>
                <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
                <li>Information from the Additional Data section shows up on the course single page.</li>
                <li>Make Announcements to notify any important</li>
                <li>Notes to all enrolled students at once.</li>
            </ul>
        </div>
    </div>
  )
}

export default AddCourse