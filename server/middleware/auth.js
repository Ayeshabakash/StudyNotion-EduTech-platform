const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// authentication
exports.auth = async (req , res, next) => {
    try{
        // extract the token  first 
        const token  =  req.cookies.token ||
                        req.body.token ||
                        req.header("Authorization").replace("Bearer ", "");
        
        // console.log("checking error");
        // if token missing then return response 
        if(!token)
        {
            return res.status(401).json({
                success : false,
                message : "Token is missing",
            });
        }

        // verify the token to get the payload 
        try{
            const decodedPayload = jwt.verify(token ,process.env.JWT_SECRET);
            console.log("payload" , decodedPayload);
            req.user = decodedPayload;
        }
        catch(error){
            // verification issue 
            return res.status(401).json({
                success : false,
                message : "Invalid Token",
            });
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message : "somthing went wront while token validation"
        })
    }
}

// isStudent 
exports.isStudent = async(req , res , next) => {
    try{
        const email = req.user.email;  //fetch the email
        // console.log("email ->>", email);

        const user = await User.findOne({email});  //fetch the user 
        // console.log("user", user);

        if(user.accountType !== "Student")
        {
            return res.status(400).json({
                success : false,
                message :  "this is a protected route for student only"
            });
        }
        next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "User role cannot be verified, please try again"
        })
    }
}

// isInstructor 
exports.isInstructor = async(req , res , next) => {
    try{
        const email = req.user.email;  //fetch the email

        const user = await User.findOne({email});  //fetch the user 

        if(!user)
        {
            return res.status(404).json({
                success : false,
                message : "user does not found"
            })
        }
        if(user.accountType !== "Instructor")
        {
            return res.status(400).json({
                success : false,
                message :  "this is a protected route for Instructor only"
            });
        }
        next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "User role cannot be verified, please try again"
        })
    }
}

// isAdmin 
exports.isAdmin = async(req , res , next) => {
    try{
        const email = req.body.email;  //fetch the email

        const user = await User.findOne({email});  //fetch the user 
        
        if(req.user.accountType!== "Admin")
        {
            return res.status(400).json({
                success : false,
                message :  "this is a protected route for Admin only"
            });
        }
        next();
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "User role cannot be verified, please try again"
        })
    }
}