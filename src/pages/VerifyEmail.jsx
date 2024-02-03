import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OTPInput from 'react-otp-input';
import { RxCountdownTimer } from "react-icons/rx";
import { BiArrowBack } from "react-icons/bi"
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../services/operations/authAPI';
import { sendOtp } from '../services/operations/authAPI';

const VerifyEmail = () => {
    const dispatch  = useDispatch();
    const navigate = useNavigate();
    const {loading, signupData}  = useSelector( (state) => state.auth);
    const [otp , setOtp] = useState("");

    useEffect( () =>{
            // only allow to access this route if user's signup data is stored
            if(!signupData)
            {
                navigate("/signup")
            }
    },[])

    const submitHandler = (event) => {
        console.log(otp);
        console.log(FormData);
        event.preventDefault();

        const {
            firstName,
            lastName,
            password,
            confirmPassword,
            email,
            accountType,
        } = signupData;

        dispatch(signUp(firstName, lastName,password,confirmPassword,email,accountType,otp, navigate));
    }
  return (
    <div className='min-h-[calc(100vh-3.5rem)] flex justify-center items-center'>
        {loading ? (
            <div className='spinner'> </div>
        ) : (
            <div className='max-w-[500px] p-8 flex flex-col gap-4'>   
                <h2 className='text-[1.875rem] leading-[2.375rem] font-semibold text-richblack-5'>Verify Email</h2>
                <p className='text-[1.125rem] leading-[1.625rem] text-richblack-100'>A verification code has been sent to you. Enter the code below</p>

                <form onSubmit={submitHandler}>
                    <OTPInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                            <input
                            {...props}
                            placeholder="-"
                            style={{
                                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                            }}
                            className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                            />
                        )}
                        containerStyle={{
                            justifyContent: "space-between",
                            gap: "0 6px",
                        }}
                    />

                    <button type='submit'
                    className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
                        Verify and Register
                    </button>
                </form>

                <div className='flex justify-between mt-2'>
                    <Link to="/signup">
                        <p className='flex items-center gap-2 text-richblack-5'>
                            <BiArrowBack/>
                            Back To SignUp
                        </p>
                    </Link>

                    <button
                        onClick={() => dispatch(sendOtp(signupData.email)) }
                        className="flex items-center text-blue-100 gap-x-2">
                        <RxCountdownTimer/>
                        Resend it
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}

export default VerifyEmail