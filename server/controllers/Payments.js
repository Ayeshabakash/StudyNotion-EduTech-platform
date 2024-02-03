const User = require("../models/User");
const Course = require("../models/Course");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const {instance} = require("../config/razorpay");
const mongoose  = require("mongoose");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const {courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const CourseProgress = require("../models/CourseProgress")

exports.capturePayment = async (req, res) =>{
    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0)
    {
        return res.status(404).json({
            success : false,
            message : "courses does not found"
        })
    }

    let totalAmount = 0;
    // calculate the total amount of all courses 
    for(const courseId of courses){
        let course;
        try{
            course = await Course.findById(courseId);
            if(!course)
            {
                return res.status(404).json({
                    success : false,
                    message : "course could not be found"
                })
            }

             // check if user already bought that course 
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid))
            {
                return res.status(401).json({
                    success : false,
                    message : "Student is already enrolled in a course"
                })
            }
            totalAmount += course?.price;
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success : false,
                message : error.message
            })
        }
    } 
    
    // now create the razorpay order 
    // const currency = "INR";

    const options = {
        amount : totalAmount*100,  //we have to pass the price * 100 of the course
        currency : "INR", 
        receipt: Math.random(Date.now()).toString(),
    }

    try{
          // initiate the payment using razorpay 
        const paymentResponse = await instance.orders.create(options)
        return res.status(200).json({
            success : true,
            paymentResponse
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "could not initiate the order"
        })

    }
}


// make the student enroll to all the courses 
exports.enrollStudents = async (courses , userId , res) => {
    // console.log("TESTING 3");
    if(!courses || !userId){
        return res.status(401).json({
            success : false,
            message : "please provide courses or userid"
        })
    }

    
    for(const courseId of courses){
        try{
            // find the course and push the student in it 
            const course = await Course.findOneAndUpdate({_id :courseId},
                                                    {
                                                        $push : {
                                                            studentsEnrolled : userId
                                                        }
                                                    },
                                                    {new : true});

            if(!course){
                return res.status(200).json({
                    success : false,
                    message : "course could not be found"
                })
            }

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })


            // now find the student and enroll him to the course 
            const user = await User.findByIdAndUpdate(userId,
                                                {
                                                    $push :{
                                                        courses : courseId,
                                                        courseProgress : courseProgress._id 
                                                    }
                                                },
                                                {new : true});


            // now send mail to student about new course enrolled 
            const mailResponse = await mailSender(
                                        user.email,
                                        `Successfully Enrolled into ${course.courseName}`,
                                        courseEnrollmentEmail(
                                                   course.courseName,
                                                   `${user.firstName}  ${user.lastName}`
                                        )
            ) 
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}


// payment verification 
exports.verifyPayment = async (req , res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed" });
    }

    
    let body = razorpay_order_id +  "|" + razorpay_payment_id;   //syntax part
    
    const expectedSignature = crypto
                                .createHmac("sha256" , process.env.RAZORPAY_SECRET)  //this is a hashing function that accepts a hashing algorithm and secret key to encrypt that secret key, and will return Hmac object
                                .update(body.toString())   //convert the content of hmac object into string formate and update the object
                                .digest("hex");  //when an hashing algorithm is applied on a text and it is also refered as digest


    if(expectedSignature === razorpay_signature)
    {
        // make the student enroll to the courses 
        await exports.enrollStudents(courses , userId , res);   //i had to exports it bcz it was giving error that enrollStudents is not defined
        return res.status(200).json({
            success : true,
            message : "payment verified",
            courses,
        })
    }

    // console.log("TESTING 2")



    return res.status(402).json({
        success: false,
        message : "Payment verification failed"
    })
}


// send payment sucessful mail to the student 
exports.sendPaymentSuccessEmail = async (req , res) => {
    const {orderId , paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try{
        const user = await User.findById(userId);

        await mailSender(
                    user.email,
                    `Payment Recieved`,
                    paymentSuccessEmail(
                                `${user.firstName}  ${user.lastName}`,
                                amount/100,
                                orderId,
                                paymentId
                    )
        )
    }
    catch(error)
    {
        console.log("error in sending mail", error)
        return res.status(500).json({ success: false, message: "Could not send email" })
    }
}
