import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AiOutlineEyeInvisible , AiOutlineEye} from 'react-icons/ai'
import { login } from '../../../services/operations/authAPI'
import { useDispatch } from 'react-redux'

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const[formData , setFormData] = useState({
    email : "",
    password : ""
  })

  const changeHandler = (event) => {
     setFormData( (prevData) => ({
      ...prevData,
      [event.target.name] : event.target.value,
     }))
  }

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(login(formData.email, formData.password, navigate))
  }

  const [showPassword , setShowPassword] = useState(false);
  return (
    <form onSubmit={submitHandler}
    className='w-full flex flex-col gap-y-4 mt-3'>

      {/* email  */}
      <label>
         <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>
            Email Address <sup className='text-pink-200'>*</sup>
         </p>

         <input
          type='text'
          required
          name='email'
          value={formData.email}
          onChange={changeHandler}
          placeholder='Enter email address'
          className='bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 w-full placeholder-richblack-400'
         />
      </label>

      {/* password */}
      <label className='w-full relative'>
          <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>Password <sup className='text-pink-200'>*</sup></p>
          <input
              type={showPassword ? "text" : "password"}
              required
              name='password'
              value={formData.password}
              placeholder='Enter Password'
              onChange={changeHandler}
              className='w-full bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400'
          />
          <span className='absolute right-3 top-[38px] cursor-pointer'
          onClick={() => setShowPassword(!showPassword)}>
              { showPassword ? (<AiOutlineEyeInvisible fontSize={24}  fill="#AFB2Bf"/>): (<AiOutlineEye fontSize={24}  fill="#AFB2Bf"/>)}    
          </span>

          <Link to="/forgot-password">
             <p  className="mt-1 ml-auto max-w-max text-xs text-blue-100">
                Forgot Password
             </p>
          </Link>
      </label>

      <button 
        type='submit'
        className='rounded-[8px] bg-yellow-50 font-medium text-richblack-900 px-3 py-2 mt-5'>
            Sign In
     </button>

    </form>
  )
}

export default LoginForm