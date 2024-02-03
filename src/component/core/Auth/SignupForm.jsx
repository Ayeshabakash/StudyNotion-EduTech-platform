import React, { useState } from 'react'
import {AiOutlineEyeInvisible , AiOutlineEye} from 'react-icons/ai'
import {toast} from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSignupData } from '../../../Redux/Slices/authSlice';
import {sendOtp} from "../../../services/operations/authAPI"




const SignupForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[accountType , setAccountType] = useState("Student");
    const [formData, setFormData] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        confirmPassword : ""
    });
    const [showPassword , setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);

    function changeHandler(event){
        const {name , value} = event.target;
        setFormData( (prev) => (
            {
                ...prev,
                [name] : value
            }
        ))
    }

    function submitHandler(event){
        event.preventDefault();

        if(formData.password !== formData.confirmPassword)
        {
            toast.error("Password does not match");
            formData.password="";
            formData.confirmPassword="";
            event.target.password.value ="";
            event.target.confirmPassword.value = "";
            return;
        }

        const signupData = {
            ...formData,
            accountType,
        }

        // storing signup data to state to be used after otp verification
        dispatch(setSignupData(signupData))
        // // Send OTP to user for verification
        dispatch(sendOtp(formData.email, navigate))

         // Reset
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
        setAccountType("Student"); 

        console.log("user Details : ", signupData);
    }

  return (
    <div>
        {/* accountType tab  */}
        <div className='rounded-full p-1 flex gap-1 bg-richblack-800 w-fit border-b-[2px] border-richblack-700 my-3'>

            <button className={`py-2 px-5 rounded-full transition-all duration-200
                                ${accountType === "Student" ? "text-richblack-5 bg-richblack-900" : "text-richblack-200 bg-transparent"}`}
            onClick={() => setAccountType("Student")}>
                Student
            </button>

            <button className={`py-2 px-5 rounded-full transition-all duration-200
                                ${accountType === "Instructor" ? "text-richblack-5 bg-richblack-900" : "text-richblack-200 bg-transparent"}`}
            onClick={() => setAccountType("Instructor")}>
                Instructor
            </button>
        </div>

        <form onSubmit={submitHandler}
        className='flex flex-col w-full gap-4 mt-6 w-fit'>

            {/* first name and last name  */}
            <div className='flex gap-4 md:flex-row flex-col w-full'>

                {/* first name  */}
                <label>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>First Name <sup className='text-pink-200'>*</sup></p>
                    <input
                        type='text'
                        required
                        name='firstName'
                        value={formData.firstName}
                        placeholder='Enter first name'
                        onChange={changeHandler}
                        className='bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400 w-full'
                    />
                </label>
                
                {/* last name  */}
                <label>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>Last Name <sup className='text-pink-200'>*</sup></p>
                    <input
                        type='text'
                        required
                        name='lastName'
                        value={formData.lastName}
                        placeholder='Enter last name'
                        onChange={changeHandler}
                        className='bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400 w-full'
                    />
                </label>
            </div>

            {/* email */}
            <label>
                <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>Email Address<sup className='text-pink-200'>*</sup></p>
                <input
                    type='email'
                    required
                    name='email'
                    value={formData.email}
                    placeholder='Enter email address'
                    onChange={changeHandler}
                    className='w-full bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400'/>
            </label>

            {/* password and confirmPassword */}
            <div className='flex gap-4 md:flex-row flex-col'>

                {/* password */}
                <label className='w-full relative'>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>Create Password <sup className='text-pink-200'>*</sup></p>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        name='password'
                        value={formData.password}
                        placeholder='Enter password'
                        onChange={changeHandler}
                        className='bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400 w-full'
                    />
                    <span className='absolute right-3 top-[38px] cursor-pointer'
                    onClick={() => setShowPassword(!showPassword)}>
                        { showPassword ? (<AiOutlineEyeInvisible fontSize={24}  fill="#AFB2Bf"/>): (<AiOutlineEye fontSize={24}  fill="#AFB2Bf"/>)}    
                    </span>
                </label>
                
                {/* confirm password */}
                <label className='w-full relative'>
                    <p className='text-[0.875rem] text-richblack-5 leading-[1.375] mb-1'>Confirm Password<sup className='text-pink-200'>*</sup></p>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        placeholder='Confrim password'
                        onChange={changeHandler}
                        className='bg-richblack-700 text-richblack-5 rounded-[0.5rem] p-3 border-b-[1px] border-richblack-200 placeholder-richblack-400 w-full'
                    />

                    <span className='absolute right-3 top-[38px] cursor-pointer'
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        { showConfirmPassword ? (<AiOutlineEyeInvisible fontSize={24}  fill="#AFB2Bf"/>): (<AiOutlineEye fontSize={24}  fill="#AFB2Bf"/>)}    
                    </span>
                </label>
            </div> 


            <button 
            type='submit'
            className='rounded-[8px] bg-yellow-50 font-medium text-richblack-900 px-3 py-2 mt-5'>
                Create Account
            </button>
        </form>
    </div>
  )
}

export default SignupForm