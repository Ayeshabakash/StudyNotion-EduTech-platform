import toast from "react-hot-toast";
import {setLoading , setToken} from "../../Redux/Slices/authSlice"
import {resetCart}  from "../../Redux/Slices/cartSlice";
import { setUser } from "../../Redux/Slices/profileSlice";
import {apiConnector} from "../apiConnector";
import { authEndpoints } from "../apis";

const {
    SIGNUP_API,
    LOGIN_API,
    SENDOTP_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API
} = authEndpoints;


export function sendOtp(email, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("loading...");

        try{
            const response = await apiConnector("POST", SENDOTP_API , {email , checkUserPresent: true,});

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            console.log("SEND OTP API RESPONSE", response);

            toast.success("OTP send successfully");

            navigate("/verify-email");

        }
        catch(error)
        {
            console.log("SEND OTP API ERROR...",error.message);
            toast.error("otp could not send");
        }
        toast.dismiss(toastId);
    }    
}

export function signUp(firstName, lastName, password, confirmPassword,email,accountType,otp, navigate)
{
    return async (dispatch) =>{
        const  toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("POST" , SIGNUP_API , {
                firstName,
                lastName,
                password,
                confirmPassword,
                email,
                accountType,
                otp,
            });

            console.log("Signup api response...", response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Account Created");
            navigate("/login");
       }
       catch(error)
       {
          console.log("signUp api Error",  error);
          toast.error("Signup Failed");
          navigate("/signup");
       }
       dispatch(setLoading(false));
       toast.dismiss(toastId);
    }
}

export function login(email , password, navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", LOGIN_API , {email , password});

            
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            
            console.log("LOGIN API RESPONSE.. ", response);

            toast.success("Login Successful");
            dispatch(setToken(response.data.token))

            const userImage = response.data?.user?.image
            ? response.data.user.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.userExist.firstName} ${response.data.userExist.lastName}`

            dispatch(setUser({...response.data.userExist, image : userImage}));

            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem("user", JSON.stringify(response.data.userExist));

            navigate("/dashboard/my-profile");        
        }
        catch(error)
        {
            console.log("LOGIN API ERROR...", error.message);
            toast.error("Login Failed");
        }

        dispatch(setLoading(false));
    }
}


export function getResetPasswordToken(email , setEmailSent){
    return  async(dispatch) => {
        // const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" , RESETPASSTOKEN_API , {email});

            console.log("RESETPASSTOKEN RESPONSE...", response);

            if(!response.data.message)
            {
                throw new Error(response.data.message);
            }

            toast.success("Email Sent Successfully");
            setEmailSent(true);
        }
        catch(error)
        {
            console.log("RESET PASSWORD TOKEN ERROR...",error);
            toast.error("failed  to send the email");
        }

        // toast.dismiss(toastId);
        dispatch(setLoading(false)); 

    }

}


export function resetPassword(password , confirmPassword , token, navigate){
    return async (dispatch) => {
        setLoading(true);
        try{
            if(password !== confirmPassword)
            {
                toast.error("password does not matched");
                return;
            }
            const response = await apiConnector("POST" , RESETPASSWORD_API , {password , confirmPassword, token});

            console.log("RESET password RESPONSE ", response);

            if(!response.data.success)
            {
                throw new Error(response.data.message);
            }

            toast.success("password has been changed");
            navigate("/login");
        }
        catch(error)
        {
            console.log("RESET PASSWORD API ERROR", error);
            toast.error("password cannot be changed");
        }
    }
}

export function logOut(navigate){
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart());
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logout Successfully");
        navigate("/")
    }
}