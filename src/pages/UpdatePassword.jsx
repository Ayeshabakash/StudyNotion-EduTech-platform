import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi"
import { resetPassword } from '../services/operations/authAPI'




const UpdatePassword = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading } = useSelector( (state) => state.auth);
    const[showPassword , setShowPassword] = useState(false);
    const[showConfirmPassword , setShowConfirmPassword] = useState(false);
    const[password, setPassword] = useState("");
    const[confirmPassword , setConfirmPassword] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();
        const passwordToken = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password, confirmPassword,passwordToken, navigate))
    }
  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex justify-center items-center'>
        {
            loading ? (
                <div className='spinner'></div>
            ) : (
                <div className='max-w-[500px] p-8 flex flex-col gap-4'>
                    <h2 className='text-[1.875rem] text-richblack-5 font-semibold leading-[2.375rem]'>Create new password</h2>
                    <p className='text-[1.125rem] leading-[1.625rem] text-richblack-100'>Almost done. Enter your new password and youre all set.</p>

                    <form onSubmit={submitHandler}>
                        {/* new password */}
                        <label className='relative'>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                New Password <sup className='text-pink-200'>*</sup>
                            </p>

                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={password}
                                placeholder='Create Password'
                                onChange={(event) => setPassword(event.target.value)}
                                className='w-full bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400'
                            />

                            <span onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {
                                    showPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>) : (<AiOutlineEye  fontSize={24} fill="#AFB2BF"/>)
                                }
                            </span>

                        </label>
                        
                        {/* confirm new password  */}
                        <label className='relative'>
                            <p className="mb-1 mt-4 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                               Confirm New Password <sup className='text-pink-200'>*</sup>
                            </p>

                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                placeholder='Confirm new password'
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className='w-full bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400'
                            />

                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 -bottom-1 z-[10] cursor-pointer">
                                {
                                    showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>) : (<AiOutlineEye  fontSize={24} fill="#AFB2BF"/>)
                                }
                            </span>

                        </label>

                        {/* TODO : add the remaining code here */}

                        <button type='submit'
                          className='rounded-[8px] bg-yellow-50 font-medium text-richblack-900 px-3 py-3 mt-6 w-full'>
                                Reset Password
                        </button>
                    </form>
                    <Link to="/login">
                    <p className='flex items-center gap-2 mt-1 text-richblack-5'>
                        <BiArrowBack/>
                        Back To Login
                    </p>
                </Link>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword