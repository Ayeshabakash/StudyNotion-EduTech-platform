import { toast } from "react-hot-toast"

import { setUser } from "../../Redux/Slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logOut } from "./authAPI"

const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints


export const updateDisplayPicture = async (token, formData, dispatch) => {
    const toastId = toast.loading("loading...");

    try{
        const response = await apiConnector("PUT" , UPDATE_DISPLAY_PICTURE_API , formData , {
                                                "Content-Type": "multipart/form-data",
                                                Authorization: `Bearer ${token}`,
                                            });

        console.log("UPDATE PROFILE IMAGE API RESPONSE : ",response);
        
        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }


        dispatch(setUser(response.data.updatedUser));

        toast.success("Profile Image Updated");

    }
    catch(error)
    {
        console.log("UPDATE PROFILE PICTURE API ERROR : ", error);
        console.log(error.message);
    }
    toast.dismiss(toastId);
}



export const updateProfileDetails = async (formData , token, dispatch) => {
    const toastId = toast.loading("loading...");

    try{
        const response = await apiConnector("PUT" , UPDATE_PROFILE_API , formData , {
                                                Authorization: `Bearer ${token}`,
                                            });

        console.log("UPDATE PROFILE INFORMATION API RESPONSE : ",response);
        
        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }


        const profileImage =response.data.updatedUserDetails.profileImage ?
                            response.data.updatedUserDetails.profileImage :
                            `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`

        
        dispatch(setUser({...response.data.updatedUserDetails , profileImage: profileImage}))
        toast.success("Profile Details Updated");

    }
    catch(error)
    {
        console.log("UPDATE USER DETAILS API ERROR : ",error);
        console.log(error.message);
    }

    toast.dismiss(toastId);
}


export const updatePassword = async(formData , token) => {

    const toastId = toast.loading("loading...");

    try{
        const response = await apiConnector("POST" , CHANGE_PASSWORD_API , formData , {
                                                Authorization: `Bearer ${token}`,
                                            });

        console.log("UPDATE PASSWORD API RESPONSE : ",response);

        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }

        toast.success("Password Updated");
        
    }
    catch(error)
    {
        console.log("CHANGE PASSWORD API ERROR : ", error);
        console.log(error.message);
    }
    toast.dismiss(toastId);
}



export const deleteAccount  = async (token , navigate, dispatch) => {
    const toastId = toast.loading("loading...");
    try{
        const response = await apiConnector("DELETE" , DELETE_PROFILE_API , null ,  {
                                            Authorization: `Bearer ${token}`,
                                        })

        console.log('DELETE ACCOUNT API RESPONSE : ',response);

        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }

        toast.success("Account Deleted");
        
        dispatch(logOut(navigate));
    }
    catch(error)
    {
        console.log("DELETE ACCOUNT API ERROR : ", error);
        console.log(error.message);
    }
    toast.dismiss(toastId);
}