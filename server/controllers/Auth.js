const User = require("../models/User");
const OTP= require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate")
const Profile = require("../models/Profile");
require("dotenv").config();


// send verification otp 
exports.sendOTP = async (req , res) =>{
    try{

        // fetch the email first 
        const {email} = req.body;

        // check if user is already registered 
        const userExists = await  User.findOne({email});

        // if user already exist, return a response 
        if(userExists)
        {
            return res.status(401).json({
                success : false,
                message : "User Already Registered"
            })
        }

        // otp generate 
        var otp = otpGenerator.generate(6 ,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
        });

        console.log("otp generated successfully", otp);


        // check  if otp is unique or not 
        let otpResult =await OTP.findOne({otp: otp});
        // console.log("OTP", otp)
        console.log("Result", otpResult)

        while(otpResult)  //this is a brute force logic , not a optimal way because we are interacting with DB frequently to check if otp is unique
        {
            otp = otpGenerator.generate(6 ,{
                upperCaseAlphabets : false,
                lowerCaseAlphabets : false,
                specialChars : false,
            });

            otpResult =await OTP.findOne({otp: otp});
        }
        // unique otp is found 

        const otpPayload = {email , otp};

        // create an entry for otp 
        const  newOtp = await OTP.create(otpPayload);
        console.log("otp is store in DB : ",  newOtp);

        res.status(200).json({
            success : true,
            message : "otp sent successfully",
            otp,
        });
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
};



// SignUp
exports.signUp = async(req , res )=>{
    try{
        // fetch the data first 
        const {firstName , lastName, 
               email , password, 
               confirmPassword , accountType,
               otp} = req.body;

        // validation 
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp)
        {
            return res.status(403).json({
                success : false,
                message : "all Fields are required"
            })
        }
        // console.log("confirm password", confirmPassword);
        // ensure that both the passowords are same 
        if(password !== confirmPassword)
        {
            return res.status(400).json({
                success : false,
                message : "password does not match with confirm password"
            })
        }


        // checkk if user is already registered or not 
        const userExists = await User.findOne({email});

        // if user exists, then  return the response 
        if(userExists)
        {
            return res.status(400).json({
                success : false,
                message: "User is already registered"
            });
        }

        // find most recent otp stored in DB for user 
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);  //confusion
        console.log("recentOpt:", recentOtp);

        // validate otp 
        if(recentOtp.length === 0)
        {
            // OTP does not found 
            return  res.status(400).json({
                success : false,
                message : "OTP does not found!!"
            });
        }
        else if(recentOtp[0].otp !== otp) 
        {
            // Invalid otp 
            return res.status(400).json({
                success : false,
                message : "Invalid OTP!!"
            });
        }

        // now hash the password for security 
        const hashedPassword = await bcrypt.hash(password , 10);

        // Create the user  --> what is the use  of this ??? 
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        // create entry in DB 
        const profileDetails = await Profile.create({
            gender : null,
            DateOfBirth : null,
            about: null,
            contactNumber : null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType : accountType,
            approved : approved,
            additionalDetails:profileDetails._id,  //storing the reference of the addition detail in DB
            profileImage : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`   //an api to fetch the image by user's first and last name
        });

        // return response 
        return res.status(200).json({
            success  : true,
            message: "User registered Successfully",
            user
        })
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success  : false,
            message: "User could not registered , please try again"
        });
    }
}


// Login 
exports.login = async (req , res) =>{
    try{

        // fetch the email and password 
        const {email , password } = req.body;

        // validation 
        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : "All Fields are required!!",
            });
        }

        // check that user exist or not 
        const userExist = await User.findOne({email}).populate("additionalDetails").exec();

        if(!userExist) {
            return res.status(401).json({
                success : false,
                message :"user not Found, please signup first",
            });
        }


        // generate JWT token, after matching the password 
        if(await bcrypt.compare(password , userExist.password))
        {
            const payload ={
                email : userExist.email,
                id : userExist._id,
                accountType : userExist.accountType,
            }

            // creating jwt token 
            const token = jwt.sign(payload, process.env.JWT_SECRET ,{
                expiresIn : "2h",
            });

            userExist.token = token;   //may be we need to convert the userExist to object first, if get error
            userExist.password = undefined;


            // create cookie and send response 
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true,
            }
            res.cookie("token" , token , options).status(200).json({
                success : true,
                message : "User Logged In Successfully",
                token,
                userExist,
            });
        }
        else {
            return res.status(400).json({
                success : false,
                message : "Password is incorrect, please try again"
            });
        }

    }catch(error)
    {
        return  res.status(500).json({
            success : false,
            message : " Login Failed , please try again",
        })
    }
}


// change password 
exports.changePassword = async (req , res) =>{
    try {
        const userDetails = await User.findById(req.user.id);

        // fetch password , newPassoword and confirmnewPassword
        const{password , newPassword } = req.body;

        // console.log("password",password , "new password : ",newPassword);


        // validationn 
        if(!password || !newPassword)
        {
            return res.status(400).json({
                success : false,
                messsage : "All Fields are required!!",
            })
        }


        // check if password or not , by matching it from DB 
        if(await bcrypt.compare(password , userDetails.password))
        {

              // now update the password after hashing
              const hashedNewPassword = await bcrypt.hash(newPassword , 10);

              const updatedUser = await User.findByIdAndUpdate({_id: userDetails.id} , {password:hashedNewPassword}, {new : true});


              // send a mail for change password 
              try {

                const emailResponse = await mailSender(
                                                userDetails.email,
                                                "Password for your account has been updated",
                                                passwordUpdated(
                                                userDetails.email,
                                                `Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}`
                                                )
                                            )

                console.log("Email sent successfully:", emailResponse.response)
                } 
                catch (error) {
                // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
                console.error("Error occurred while sending email:", error)
                return res.status(500).json({
                  success: false,
                  message: "Error occurred while sending email",
                  error: error.message,
                })
              }

              return res.status(200).json({
                  success : true,
                  message : "password changed successfully",
                  updatedUser,
                  hashedNewPassword,
              })
        
        }
        else{
            // password is incorrect 
            return res.status(401).json({
                success: false,
                message : "your current password does not matching",
            })
        }

        
    }catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "password Could not changed, please try again"
        });
    }
}