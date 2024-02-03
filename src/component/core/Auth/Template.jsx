import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import frame from "../../../assets/Images/frame.png"
import { useSelector } from 'react-redux'

const Template = ({title , description1 , description2 , image , formType}) => {
    const {loading}  = useSelector( (state) => state.auth);

  return (
    <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
        {
            loading ? (
                <div className='spinner'></div>
            ) : (
            <div className='w-11/12 max-w-maxContent mx-auto flex lg:flex-row flex-col-reverse justify-between gap-12 py-12'>

                <div className='flex flex-col gap-4 w-11/12 max-w-[450px] '> 
                    
                    <h2 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>{title}</h2>

                    <div className='text-[1.125rem] leading-[1.625rem]'>
                        <p className='text-richblack-100'>{description1}</p>
                        <p  className="font-edu-sa text-[1rem] font-bold italic text-blue-100">{description2}</p>
                    </div>

                    {
                        (formType === "login") ?
                        <LoginForm/> : 
                        <SignupForm/>
                    }
                </div>

                <div className='relative w-11/12 max-w-[450px]'>
                    <img
                        src={frame}
                        alt='frame'
                        loading='lazy'
                        width={558}
                        height={504}
                    />

                    <img
                        src={image}
                        alt={formType}
                        loading='lazy'
                        width={558}
                        height={504}
                        className='absolute -top-4 right-4 z-10'
                    />
                </div>

            </div>
            )
        }
    </div>
   
  )
}

export default Template