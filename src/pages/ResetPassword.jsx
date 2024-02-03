import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { BiArrowBack } from "react-icons/bi"
import { getResetPasswordToken } from '../services/operations/authAPI';

const ResetPassword = () => {
    const [emailSent , setEmailSent] = useState(false);
    const {loading} = useSelector( (state) => state.auth);
    const [email , setEmail] = useState("");
    const dispatch = useDispatch();


    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(getResetPasswordToken(email , setEmailSent));
    }
  return (
    <div className='text-white min-h-[calc(100vh-3.5rem)] flex justify-center items-center'>
        {
            loading ? 
            (<div className='spinner'></div>) : 
            (<div className='flex flex-col max-w-[500px] p-8 gap-4'>

                <h2 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
                    {
                        !emailSent ? "Reset your password" : "Check email"
                    }
                </h2>

                <p className='text-[1.125rem] leading-[1.625rem] text-richblack-100'>
                    {
                        !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" :  `We have sent the reset email to ${email}` 
                    }
                </p>

                <form onSubmit={submitHandler}>
                    {
                        !emailSent && (
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    Email Address <sup className='text-pink-200'>*</sup>
                                </p>

                                <input
                                    required
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder='Enter email address'
                                    className='w-full bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400' 
                                />
                            </label>
                        )
                    }

                    <button type='submit'
                    className='rounded-[8px] bg-yellow-50 font-medium text-richblack-900 px-3 py-3 mt-5 w-full'>
                    {
                        !emailSent ? "Reset Password" : "Resend email"
                    }
                   </button>
                </form>
  
                

                <Link to="/login">
                    <p className='flex items-center gap-2 mt-1'>
                        <BiArrowBack/>
                        Back To Login
                    </p>
                </Link>
            </div>)
        }
    </div>
  )
}

export default ResetPassword


