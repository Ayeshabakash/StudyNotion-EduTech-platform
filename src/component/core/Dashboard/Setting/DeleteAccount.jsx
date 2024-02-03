import React, { useState } from 'react'
import { FiTrash2 } from "react-icons/fi"
import {deleteAccount} from "../../../../services/operations/settingsAPI"
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ConfimationModal from "../../../common/ConfirmationModal";
const DeleteAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth);
  const [confimationModal , setConfimatioModal] = useState(null);

  const handleDeleteAccount = async() => {
     try{
        await deleteAccount(token , navigate , dispatch);
     }
     catch(error)
     {
       console.log("ERROR MESSAGE : ", error.message);
     }
  }
  return (
    <div className='my-10 rounded-md md:p-8 md:px-12 p-6 border border-pink-700 bg-pink-900 flex sm:flex-row flex-col gap-x-5'>
        <div className='w-14 h-14 aspect-square rounded-full flex items-center justify-center bg-pink-700'>
          <FiTrash2 className='text-3xl text-pink-200'/>
        </div>
        <div className='flex flex-col gap-y-2'>
          <h2 className='text-lg font-semibold text-richblack-5 '>Delete Account</h2>
          <p className='text-pink-25'>Would you like to delete account?</p>
          <p className='lg:w-3/5 text-pink-25'>This account may contain Paid Courses. Deleting your account is permanent and will remove all the contain associated with it.</p>
          <button
            className='w-fit italic text-pink-300'
            onClick={() => setConfimatioModal({
               text1 : "Are you sure??",
               text2 : "All your enrolled courses will be deleted permanently",
               btn1Text : "Delete Account",
               btn2Text : "Cancel", 
               btn1Handler: () => handleDeleteAccount(),
               btn2Handler : () => setConfimatioModal(null)
            })}>
             I want to delete my account.
          </button>
        </div>

        {confimationModal && <ConfimationModal modalData={confimationModal}/>}
    </div>
  )
}

export default DeleteAccount