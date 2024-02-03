const mailSender = require("../utils/mailSender");

exports.contactUs = async(req,res) => {
    try{
        const {firstName , lastName, email , phoneNumber , message} = req.body;

        if(!firstName || !lastName || !email || !message){
            return res.status(403).json({
                success : false,
                message : "All field are required"
            })
        }

        // send  mail to user 
        await mailSender(email , "Response received successfully", "we will react you soon \n Thanking for contact us..... " );

        // now send mail to admin of user's response
        await mailSender("patidarnilesh7223@gmail.com" , "Response from an user" , 
                        `As recorded : - 
                        name : ${firstName} ${lastName},
                        email : ${email},
                        phoneNumber : ${phoneNumber ? phoneNumber : "-"}
                        message : ${message}`);

        return res.status(200).json({
            success : true,
            message : "Response sended successfully"
        })


    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "Response could not be send",
            error : error.message,
        })
    }

}