import React, { useEffect, useRef, useState } from 'react'
import { FiUpload } from "react-icons/fi"
import ActionBtn from "../../../common/ActionBtn"
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {updateDisplayPicture} from "../../../../services/operations/settingsAPI"

const ChangeProfileImage = () => {
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const [image , setImage]  = useState(null);
    const [previewSource, setPreviewSource] = useState(null)

    const fileInputRef = useRef(null)

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) =>{
          const file = e.target.files[0];

          if(file)
          {
             setImage(file);
             setPreviewSource(file);
          }
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
        setPreviewSource(reader.result)
        }
    }


    useEffect(() => {
        if(image){
            previewFile(image);
        }
    } , [image])


    const handleFileUpload = async() => {
        if(image == null)
        {
            toast.error("Please select an image")
            return;
        }

        setLoading(true);

        const formData = new FormData();
        // append the profile image to the formdata 
        formData.append("profileImage" , image);

        await updateDisplayPicture(token , formData, dispatch);

        setLoading(false);
        
    }

  return (
    <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 md:p-8 md:px-12 p-6 text-richblack-5'>

        <div className='flex items-center gap-x-4'>
            <img
                src={previewSource || user?.profileImage}
                alt="ProfileImage"
                className='w-[78px] rounded-full aspect-square object-cover'
            />
            <div className='space-y-2'>
                <p>Change Profile Picture</p>
                <div className='flex md:flex-row flex-col gap-3'>
                    <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className='hidden'
                        accept="image/png, image/gif, image/jpeg"
                    />

                    <button
                        onClick={handleClick}
                        disabled={loading}
                        className='cursor-pointer rounded-md bg-richblack-700 px-5 py-2 font-semibold text-richblack-50'>
                          Select
                    </button>
                    <ActionBtn
                        disabled={loading}
                        text={loading ? "Uploading..." : "Upload"}
                        onclick={handleFileUpload}
                    >
                        {!loading && (
                            <FiUpload className="text-lg text-richblack-900" />
                        )}
                    </ActionBtn>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChangeProfileImage