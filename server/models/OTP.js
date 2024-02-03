const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },

    otp : {
        type : String,
        required : true,
    },

    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5*60,
    }
});

// a function to send mail 
async function sendVerificationMail(email , otp){
    try{

        const mailResponse = await mailSender(email, "Verification Email from StudyNotion" , emailTemplate(otp));
        console.log("Email Sent Successfully" , mailResponse);

    }catch(error)
    {
        console.log("error while sending verification mail" , error);
        throw  error;
    } 
}

// defining a pre middleware to send the verification email before creating user's entry to the database 
OTPSchema.pre("save" , async function(next) {
	// Only send an email when a new document is created
    if(this.isNew)
    {
        await sendVerificationMail(this.email , this.otp);   //why we are using this keyword here???
    }
    next();  //to automatically process the next defined middleware
})

module.exports = mongoose.model("OTP" , OTPSchema);
