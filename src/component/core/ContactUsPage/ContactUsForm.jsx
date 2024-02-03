import React, { useState } from 'react'
import {useForm} from "react-hook-form"
import { useEffect } from 'react';
import countryCode from "../../../data/countrycode.json";
import {contactusEndpoint} from "../../../services/apis";
import {apiConnector} from "../../../services/apiConnector";


const ContactUsForm = () => {
  const [loading , setLoading]  = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();
 

  const submitContactForm = async (data) => {
    console.log("Form Data - ", data)
    try {
      setLoading(true)
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      console.log("Email Res - ", res)
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        contactno: "",
      })
    }
  }, [reset, isSubmitSuccessful])


  return (
     <form
      onSubmit={handleSubmit(submitContactForm)}
     className='flex flex-col gap-7 mx-auto'>
        {/* first and  last name  */}
        <div className='flex gap-5 '>
            <div className='flex flex-col gap-2 w-[48%]'>
              <label htmlFor="firstName" className='label-style'>First Name</label>
              <input
                type='text'
                name='firstName'
                id='firstName'
                placeholder='Enter first name'
                className='form-style'
                {...register("firstName", {required:true})}
              />
              {
                errors.firstName && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    please enter your first name
                  </span>
                )
              }
           </div>

           <div className='flex flex-col gap-2 w-[48%]'>
              <label htmlFor="lastName" className='label-style'>Last Name</label>
              <input
              type='text'
              name='lastName'
              id='lastName'
              placeholder='Enter last name'
              className='form-style'
              {...register("lastName", {required:true})}
              />
              {
                errors.lastName && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    please enter your last name
                  </span>
                )
              }
           </div>
        </div>

        {/* email  */}
        <div className='flex flex-col gap-2'>
          <label htmlFor="email" className='label-style'>Email Address</label>
          <input
          type='email'
          name='email'
          id='email'
          placeholder='Enter email address'
          className='form-style'
          {...register("email", {required:true})}
          />
          {
            errors.email && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                please enter your email address
              </span>
            )
          }
        </div>

        {/* contact no  */}
        <div className='flex flex-col gap-2'>
           <label htmlFor='contactno' className='label-style'>Contact Number</label>

           <div className='flex gap-5'>
              <select
                type="text"
                name='countrycode'
                id='countrycode'
                className='form-style w-[81px]'
                {...register("countrycode", {required :true})}>
                {
                   countryCode.map( (element , index) => {
                     return(
                      <option key={index} value={element.code}>
                         {element.code} - {element.country}
                      </option>
                     )
                   })
                }
              </select>

              <input
                type='number'
                name='contactno'
                id='contactno'
                placeholder='12345 67890'
                className='form-style w-[calc(100%-90px)] '
                {...register("contactno", 
                    {required :{
                         value:true,
                         message : "please Enter your contact number"
                     },
                     maxLength : {value:10 , message:"Invalid phone number"},
                     minLength : {value:10, message:"Invalid phone number"}
                    })}
              />
           </div>
           {
                errors.contactno && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  {errors.contactno.message}
                </span>
              )
            }

        </div>



        {/* message  */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='message' className='label-style'>Message</label>
          <textarea
            name='message'
            id='message'
            cols="30"
            rows="7"
            placeholder="Enter your message here"
            className='form-style'
            {...register("message", { required: true })}
          />
          {
            errors.message && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                please enter your message
              </span>
            )
          }
        </div>

        {/* submit button  */}
       <button
          disabled={loading}
          type="submit"
          className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
          ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
          }  disabled:bg-richblack-500 sm:text-[16px] `}
           >
            Send Message
        </button>
     </form>
  )
}

export default ContactUsForm