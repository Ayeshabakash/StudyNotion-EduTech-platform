import { paymentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import {setPaymentLoading} from "../../Redux/Slices/courseSlice";
import {resetCart , removeFromCart} from "../../Redux/Slices/cartSlice"


const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = paymentEndpoints;



// this function create a script element (sdk) and append it to the document 
function loadScript(src) {
    return new Promise( (resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);
    })
}


export const buyCourse = async (token, courses, userDetails, navigate, dispatch) => {
    const toastId = toast.loading("loading...");

    try{
        // load the script 
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Check your Internet Connection.");
            return;
        }


        //initiate the order 
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses} , {
            Authorization: `Bearer ${token}`,
        });


        if(!orderResponse.data.success)
        {
            throw new Error(orderResponse.data.message);
        }

        console.log("COURSE PAYMENT API  RESPONSE : ",orderResponse);

        // options 
        const options = {
            key : 'rzp_test_xO1PAu5dCiUtjP',
            currency : orderResponse.data.paymentResponse.currency,
            amount : orderResponse.data.paymentResponse.amount,
            order_id : orderResponse.data.paymentResponse.id,
            name : "StudyNotion",
            description: "Thank You for Purchasing the Course",
            image: "https://api.dicebear.com/5.x/initials/svg?seed=S%20N",
            prefill: {
                name: `${userDetails.firstName} ${userDetails.lastName}`,
                email: userDetails.email
            },
            handler : function (response){
                // send payment success mail 
                sendPaymentSuccessEmail(response, orderResponse.data.paymentResponse.amount, token)
                 //verifyPayment
                verifyPayment({...response, courses }, token, navigate, dispatch);
            }
        }
        console.log("error checking 1")

        // remember to add razorpay model
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed" , function(response){
            toast.error("Payment Failed!!");
            console.log(response.error);
        })
        console.log("error checking 2")

    }
    catch(error)
    {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment, Instructors cannot buy courses. If you are a student try again");
    }
    toast.dismiss(toastId);
} 


export const sendPaymentSuccessEmail = async (response, amount, token) => {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,{
                                                                    orderId: response.razorpay_order_id,
                                                                    paymentId: response.razorpay_payment_id,
                                                                    amount,
                                                                }, {
                                                                     Authorization: `Bearer ${token}`
                                                                   });
    }
    catch(error)
    {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}



export const verifyPayment = async(bodyData, token, navigate, dispatch) => {
    const toastId = toast.loading("verifying payment....");
    dispatch(setPaymentLoading(true));

    try{
        const response = await apiConnector("POST" , COURSE_VERIFY_API , bodyData, {
                                            Authorization: `Bearer ${token}`,
                                        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        console.log("VERIFY PAYMENT API RESPONSE: ",response);

        toast.success("Payment Sucessful..");
        navigate("/dashboard/enrolled-courses");
        if (response.data.courses.length > 1)
            dispatch(resetCart());
        else {
            dispatch(removeFromCart(response.data.courses[0]));
        }
    }
    catch(error)
    {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }

    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}