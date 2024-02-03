import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ActionBtn from '../../../common/ActionBtn'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useNavigate } from 'react-router-dom'
import {updatePassword} from "../../../../services/operations/settingsAPI";
const ChangePassword = () => {

  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const [showPassword , setShowPassword] = useState(false);
  const [showNewPassword , setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleChangePassword = async(data) => {
      try{
        await updatePassword(data, token)
      }
      catch(error)
      {
        console.log("Error message : ",error.message);
      }
  }
  return (
    <div className='md:p-8 md:px-12 p-6 rounded-md bg-richblack-800 border border-richblack-700 flex flex-col gap-y-6'>
        <h2 className='text-lg font-semibold  text-richblack-5'>Change Password</h2>

        <form onSubmit={handleSubmit(handleChangePassword)}>
            <div className='flex flex-col lg:flex-row gap-5'>
               <div className='relative flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='password' className='label-style'>Current Password</label>
                  <input
                     type= {showPassword ? "text" : "password"}
                     name="password"
                     placeholder='Enter current password'
                     className='form-style'
                     {...register("password" , {required: true})}
                  />
                  <span 
                     onClick={() => setShowPassword(!showPassword)}
                     className='absolute right-3 top-[38px] z-10 cursor-pointer'>
                     {
                       showPassword ? (
                         <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                       ) : (
                         <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                       )
                     }
                  </span>
                  {
                     errors.password && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your current password</span>
                     )
                  }
               </div>
               <div className='relative flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='newPassword' className='label-style'>New Password</label>
                  <input
                     type={showNewPassword ? "text" :  "password"}
                     name="newPassword"
                     placeholder='Enter new password'
                     className='form-style'
                     {...register("newPassword" , {required: true})}
                  />
                  <span 
                     onClick={() => setShowNewPassword(!showNewPassword)}
                     className='absolute right-3 top-[38px] z-10 cursor-pointer'>
                     {
                       showNewPassword ? (
                         <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF"/>
                       ) : (
                         <AiOutlineEye fontSize={24} fill="#AFB2BF"/>
                       )
                     }
                  </span>
                  {
                     errors.newPassword && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your new password</span>
                     )
                  }
               </div>
            </div>
            <div className='flex justify-end items-center gap-2 mt-10'>
               <button  
                  className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'>
                 Cancel
               </button>
               <ActionBtn
                type="submit"
                text="Update"
               />
            </div>
        </form>
    </div>
  )
}

export default ChangePassword