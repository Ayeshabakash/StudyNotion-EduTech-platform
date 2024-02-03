import { toast } from "react-hot-toast";
import { courseEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";

const {
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    GET_ALL_COURSE_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATE_RATING_API,
    LECTURE_COMPLETION_API,
} = courseEndpoints


export const addCourseDetails = async(data, token) => {
    console.log("Token ->>>>" , token);
    // console.log("DATA -> ",data.courseName);
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_COURSE_API, data, {
            "Content-Type": "multipart/form-data",   //bcz we are sending the data using FormData
             Authorization: `Bearer ${token}`,
        })
        console.log("CREATE COURSE API RESPONSE............", response)
        if (!response.data.success) {
            throw new Error("Could Not Add Course Details")
        }
        toast.success("Course Details Added Successfully")
        // console.log("first")
        result = response.data.newCourse;
        console.log(result);
        // console.log("second")
    } catch (error) {
        console.log("CREATE COURSE API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}


export const editCourseDetails = async (data , token) => {
    const toastId = toast.loading("loading..");
    let result;
    try{
        const response  = await apiConnector("POST" , EDIT_COURSE_API , data , {
            "Content-Type": "multipart/form-data",   //bcz we are sending the data using FormData
            Authorization: `Bearer ${token}`,
        })

        if(!response.data.success)
        {
            throw new Error("could not edit the course details");
        }

        console.log("EDIT COURSE API RESPONSE",response);


        toast.success("Course Details updated successfully");

        result = response.data.course;

    }
    catch(error)
    {
        console.log("EDIT COURSE API ERROR", error);
        console.log(error.message);
        toast.error("Could details could not be updated");

    }
    toast.dismiss(toastId);
    return result;
}

export const createSection = async(data , token) => {
    const toastId = toast.loading("loading...");
    let result;
    try{
        const response = await apiConnector("POST", CREATE_SECTION_API , data, {
            Authorization: `Bearer ${token}`,
        })

        if(!response.data.success)
        {
            throw new Error("Section Could not be created");
        }

        console.log("CREATE SECTION API RESPONSE..",response);

        toast.success("Section Created Successfully");
        result = response.data.updateCourseDetails;
    }
    catch(error)
    {
        console.log("CREATE SECTION API ERROR",error.message);
        console.log(error.message);
        toast.error("Section could not be created");
    }
    toast.dismiss(toastId);
    return result;
}

export const updateSection = async(data , token) => {
    const toastId = toast.loading("loading..");
    let result;
    try{
        const response = await apiConnector("POST", UPDATE_SECTION_API , data , {
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success)
        {
            throw new Error("Section could not be updated");
        }

        console.log("UPDATE SECTION API RESPONSE",response);

        toast.success("Section Updated successfully");

        result = response.data.course;

    }
    catch(error)
    {
        console.log("UPDATE SECTION API ERROR",error);
        console.log(error.message);
        toast.error("Section could not be updated");
    }
    toast.dismiss(toastId);
    return result;
}


export const createSubSection = async(data, token) => {
    const toastId = toast.loading("loading...");
    let result;
    try{
        const response = await apiConnector("POST" , CREATE_SUBSECTION_API , data , {
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success)
        {
            throw new Error("Subsection not could created");
        }

        console.log("CREATE SUBSECTION API RESPONSE",response);

        toast.success("Lecture added");

        result = response.data.updatedSection;
    }
    catch(error){
        console.log("CREATE SUBSECTION API ERROR",error);
        console.log(error.message);
        toast.error("Lecture could not be created");
    }
    toast.dismiss(toastId);
    return result;
}


export const updateSubSection = async(data, token) => {
    const toastId = toast.loading("loading..");
    let result;

    try{
        const response = await  apiConnector("POST" , UPDATE_SUBSECTION_API , data , {
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success)
        {
            throw new Error("subsection could not be created");
        }

        console.log("UPDATE SUBSECTION API RESPONSE",response);

        toast.success("Lecture Updated");
        result = response.data.data;
    }
    catch(error)
    {
        console.log("UPDATE SUBSECTION API ERROR", error);
        console.log(error.message);
        toast.error("Lecture could not be update");
    }
    toast.dismiss(toastId);
    return  result;
}



export const deleteSection = async(data, token) => {
     let result;
     const toastId = toast.loading("loading...");

     try{
        const response = await apiConnector("POST" , DELETE_SECTION_API, data , {
            Authorization: `Bearer ${token}`,
        })

        if(!response.data.success){
            throw new Error("Section Could not be deleted");
        }

        console.log("DELETE SECTION API RESPONSE",response);

        toast.success("Section deleted");

        result = response.data.data;
     }
     catch(error)
     {
        console.log("DELETE SECTION API ERROR",error);
        console.log(error.message);
        toast.error("section could not be deleted");
     }
     toast.dismiss(toastId);
     return result;
}


export const deleteSubSection = async (data , token ) => {
    let result;
    const toastId = toast.loading("loading...");
    
    try{
        const response = await apiConnector("POST", DELETE_SUBSECTION_API, data , {
            Authorization: `Bearer ${token}`,
        })

        console.log("DELETE SUBSECTION API RESPONSE",response);

        if(!response.data.success){
            throw new Error("Subsection could not be deleted");
        }

        toast.success("Lecture deleted");

        result = response.data.data;

    }
    catch(error)
    {
        console.log("DELETE SUBSECTION API ERROR",error);
        console.log(error.message);
        toast.error("Lecture could not be deleted");
    }
    toast.dismiss(toastId);
    return result;
}


export const getInstructorCourses = async(token) => {
    const toastId = toast.loading("loading...");
    let result;

    try{
        const response = await apiConnector("GET" , GET_ALL_INSTRUCTOR_COURSES_API , null ,  {
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success){
            throw new Error("Could not fetched instructor courses");
        }

        console.log("GET INSTRUCTOR COURSES API RESPONSE..",response);

        result = response.data.instructorCourses;
    }
    catch(error)
    {
        console.log("GET INSTRUCTOR COURSES API ERROR", error);
        console.log(error.message);
        toast.error("courses could be not fetched");
    }
    toast.dismiss(toastId);
    return result;    
}


export const deleteCourse = async (data, token) => {
    const toastId = toast.loading("loading...");
    try{
        const response = await apiConnector("DELETE", DELETE_COURSE_API, data , {
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success){
            throw new Error("Course could not be deleted");
        }

        console.log("DELETE COURSE API REPONSE", response);

        toast.success("Course Deleted");
    }
    catch(error)
    {
        console.log("DELETE COURSE API ERROR,", error);
        console.log(error.message);
        toast.error("Course could not be deleted");
    }
    toast.dismiss(toastId);
}


export const getFullCourseDetails = async (courseId , token) => {
    const toastId = toast.loading("loading...");
    let result;
    try{
        const response = await apiConnector("POST" , GET_FULL_COURSE_DETAILS_AUTHENTICATED , {courseId:courseId},{
                                                Authorization: `Bearer ${token}`,
                                            })

        if(!response.data.success){
            throw new Error("Course details could not be fetched")
        }

        console.log("GET FULL COURSE DETAILS API RESPONSE : ",response);

        // toast.success("Course details fetched");

        result = response.data.data;
    }
    catch(error){
        console.log("GET FULL COURSE DETAILS API ERROR: ",error);
        console.log(error.message);
        toast.error("Course could not be fetched");
    }
    toast.dismiss(toastId);
    return result;
}


export const fetchCourseDetails = async (courseId , token) => {
    const toastId = toast.loading("loading...");
    let result;
    try{
        const response = await apiConnector("POST" , COURSE_DETAILS_API , {courseId});

        if(!response.data.success)
        {
            throw new Error(response.data.message);
        }

        console.log("FETCH COURSE DETAILS API RESPONSE : ",response );

        result = response.data.data;
    }
    catch(error)
    {
        console.log("FETCH COURSE DETAILS API ERROR",error);
        // console.log(erro)
        toast.error("Course Details Could not be fetched")
    }
    toast.dismiss(toastId);
    return result;
} 


export const createRating = async (data , token) => {
    const toastId = toast.loading("loading...");
    try{
        const response = await apiConnector("POST", CREATE_RATING_API , data , {
            Authorization: `Bearer ${token}`,
        });

        if(!response.data.success)
        {
            throw new Error("could not rate the course");
        }

        console.log("CREATING RATING API RESPONSE: ", response);

        toast.success("Rated Successfully");

    }
    catch(error)
    {
        console.log("CREATING RATING API ERROR :",error.message);
        console.log(error);
        toast.error("Rating failed")
    }

    toast.dismiss(toastId);
    return true;
}

export const markLectureAsComplete = async(data, token) => {
    let result = null
    console.log("mark complete data", data)
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log(
            "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
            response
        )

        if (!response.data.message) {
            throw new Error(response.data.error)
        }
        toast.success("Lecture Completed")
        result = true
    } catch (error) {
        console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
        toast.error(error.message)
        result = false
    }
    toast.dismiss(toastId)
    return result
}