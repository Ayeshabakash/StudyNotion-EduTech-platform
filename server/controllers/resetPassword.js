const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


// send reset password mail with link  
exports.resetPassowordLink = async (req , res) =>{
    try{
        // fetch the email 
        const email = req.body.email;

        // validation 
        if(!email)
        {
            return res.status(401).json({
                success : false,
                message : "Please enter the email first",
            })
        }

        // check if user exist or not 
        const user = await User.findOne({email : email});

        if(!user){
            return res.status(401).json({
                success : false,
                message : "your email is not registered with us",
            })
        }

        // generate a reset password link 
        const token = crypto.randomUUID();

        // const token = crypto.randomBytes(20).toString("hex")


        // update user by adding the token and expiration time  
        const updatedUser = await User.findOneAndUpdate(
                                                        {email :email},
                                                        {
                                                            token : token,
                                                            tokenExpires : Date.now() + 5*60*1000,
                                                        },
                                                        {new : true});   //new : true return the update user details
       
        // create url 
        const url = `https://studynotion-edutech-platform-nileshp07.vercel.app/reset-password/${token}`;

        // send the mail containing the url 
        await mailSender(email , "password reset link" , 
                        `Your Link for email verification is ${url}. Please click this url to reset your password.`);


        // return the response 
        return res.status(200).json({
            success: true,
            message : "you have successfully received the password reset mail, check it out",
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Somthing wrong wrong, while sending the reset password mail",
        })
    }
}



// reset password 
exports.resetPassword = async (req, res) =>{
    try{
        // fetch the data 
        const {password , confirmPassword , token} = req.body; //here we are getting token in req.body, because it will be send in frontend

        // validation 
        if(password !== confirmPassword)
        {
            return res.status(401).json({
                success : false,
                message : "password and confirm password does not match",
            })
        }

        // fetch user from DB using token 
        const user = await User.findOne({token : token});

        // if no entry found - invalid token 
        if(!user)
        {
            return res.status(403).json({
                success : false,
                message : "Invalid token , please try again"
            })
        }

        //check if token expires 
        if(user.tokenExpires < Date.now())
        {
            return res.status(401).json({
                success : false,
                message : "token is expired , please regenerate the token",
            })
        }


        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // now update the password into DB 
        await User.findOneAndUpdate({token : token},
                                    {password : hashedPassword},
                                    {new : true});


        //  return the response 
        return res.status(200).json({
            success : true,
            message : "password has been updated successfully",
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "password could not be reset, please try again",
        })
    }
}
