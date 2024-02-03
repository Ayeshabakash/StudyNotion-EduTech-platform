import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";
import toast from "react-hot-toast";


const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API,
  } = profileEndpoints

  
export async function getUserEnrolledCourses(token){
   const toastId = toast.loading("loading...");
   let result = [];

   try{
        const response = await apiConnector( "GET", GET_USER_ENROLLED_COURSES_API, null,
            {
                Authorization : `Bearer ${token}`,
            }
         )

        console.log("GET USER ENROLLED COURSE API RESPONSE....",response);

        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }

        result = response.data.enrolledCourses;

   }
   catch(error)
   {
        console.log("GET USER ENROLLED COURSE API FAILED",error.message);
        toast.error("Could not get enrolled courses");
   }
   toast.dismiss(toastId);
   return result;
}


export async function getInstructorData(token) {
    const toastId = toast.loading("loading...");
    let result;
    try{
        const response = await apiConnector("GET" , GET_INSTRUCTOR_DATA_API , null, 
                                            {
                                            Authorization: `Bearer ${token}`,
                                            });

        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }

        console.log("GET INSTRUCTOR DATA API RESPONSE: ",response);

        result = response?.data?.coursesData;
    }
    catch(error)
    {
        console.log("GET INSTRUCTOR DATA API ERROR : ",error);
        console.log(error.message);
    }

    toast.dismiss(toastId);
    return result;
}
