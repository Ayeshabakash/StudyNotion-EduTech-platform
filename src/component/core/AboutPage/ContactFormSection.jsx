import React from 'react'
import ContactUsForm from '../ContactUsPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='w-11/12 max-w-maxContent mx-auto my-20 '>
        <h2 className='text-4xl font-semibold text-center text-white'>
          Get in Touch    
        </h2>
         
        <p className="text-center text-richblack-300 mt-3">
           We'd love to here for you, Please fill out this form.
        </p>

        <div className='mx-auto  lg:w-[40%] mt-10'>
           <ContactUsForm/>
        </div>

    </div>
  )
}

export default ContactFormSection