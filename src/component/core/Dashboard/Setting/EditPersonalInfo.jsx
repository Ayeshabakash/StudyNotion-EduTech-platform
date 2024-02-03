import React from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import ActionBtn from '../../../common/ActionBtn';
import {updateProfileDetails} from "../../../../services/operations/settingsAPI"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]


const EditPersonalInfo = () => {
  const {user} = useSelector((state) => state.profile);
  const {token}  = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileInfomation = async(data) => {
      try{
            await updateProfileDetails(data , token , dispatch);
      }
      catch(error)
      {
         console.log("Error message :", error.message);
      }
  }
  return (
      <div className='my-10 rounded-md border border-richblack-700 bg-richblack-800 md:p-8 md:px-12 p-6 '>
        <h2 className='text-lg font-semibold text-richblack-5 mb-6'>Personal Information</h2>
        <form onSubmit={handleSubmit(submitProfileInfomation)}
          className='flex flex-col gap-y-6'>
            {/* first and last name   */}
            <div className='flex flex-col lg:flex-row gap-5'>
               <div className='flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='firstName' className='label-style'>First Name</label>
                  <input
                     type='text'
                     name="firstName"
                     placeholder='Enter your first name'
                     defaultValue = {user.firstName}
                     className='form-style'
                     {...register("firstName" , {required: true})}
                  />
                  {
                     errors.firstName && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your first name</span>
                     )
                  }
               </div>
               <div className='flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='lastName' className='label-style'>Last Name</label>
                  <input
                     type='text'
                     name="lastName"
                     placeholder='Enter your last name'
                     defaultValue = {user.lastName}
                     className='form-style'
                     {...register("lastName" , {required: true})}
                  />
                  {
                     errors.lastName && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your last name</span>
                     )
                  }
               </div>
            </div>

            {/* D.O.B and Gender  */}
            <div className='flex flex-col lg:flex-row gap-5'>
               <div className='flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='dateOfBirth' className='label-style'>Date of Birth</label>
                  <input
                     type='date'
                     name="dateOfBirth"
                     placeholder='Enter your Date of birth'
                     defaultValue = {user.dateOfBirth}
                     className='form-style'
                     {...register("dateOfBirth", {
                        required: {
                          value: true,
                          message: "Please enter your Date of Birth.",
                        },
                        max: {
                          value: new Date().toISOString().split("T")[0],
                          message: "Date of Birth cannot be in the future.",
                        },
                      })}
                   />
                  {
                     errors.dateOfBirth && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>{errors.dateOfBirth.message}</span>
                     )
                  }
               </div>
               <div className="flex flex-col gap-2 lg:w-[48%]">
                  <label htmlFor="gender" className="label-style">
                    Gender
                  </label>
                  <select
                    type="text"
                    name="gender"
                    id="gender"
                    className="form-style"
                    {...register("gender", { required: true })}
                    defaultValue={user.additionalDetails.gender}
                    >
                  {
                     genders.map((ele, i) => {
                       return (
                       <option key={i} value={ele}>
                        {ele}
                      </option>
                  )
                  })}
                  </select>
                  {errors.gender && (
                  <span className="-mt-1 text-[12px] text-yellow-100">
                    Please enter your Date of Birth.
                  </span>
                  )}
               </div>
            </div>

            {/* contactNumber and about  */}
            <div className='flex flex-col lg:flex-row gap-5'>
               <div className='flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='contactNumber' className='label-style'>Contact Number</label>
                  <input
                     type='tel'
                     name="contactNumber"
                     placeholder='Enter your contact number'
                     defaultValue = {user.additionalDetails.contactNumber}
                     className='form-style'
                     {...register("contactNumber" ,
                        {required: {
                           value : true,
                           message : "Please enter your contact number",
                        },
                        maxLength : {value: 12, message : "Invalid contact number"},
                        minLength : {value:10 , message :"Invalid contact number"}
                        })}
                  />
                  {
                     errors.contactNumber && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>{errors.contactNumber.message}</span>
                     )
                  }
               </div>
               <div className='flex flex-col gap-y-2 lg:w-[48%]'>
                  <label htmlFor='about' className='label-style'>About</label>
                  <input
                     type='text'
                     name="about"
                     placeholder='Enter Bio details'
                     defaultValue = {user?.additionalDetails?.about}
                     className='form-style'
                     {...register("about" , {required: true})}
                  />
                  {
                     errors.about && (
                      <span className='-mt-1 text-[12px] text-yellow-100'>Please enter your About</span>
                     )
                  }
               </div>
            </div>
            {/* buttons */}
            <div className='flex justify-end gap-2 mt-4'>
               <button
                 onClick={() => navigate("/dashboard/my-profile")}
                 className='cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50'>
                  Cancel
               </button>
               <ActionBtn text="save" type="submit"/>
            </div>
        </form>
      </div>
  )
}

export default EditPersonalInfo