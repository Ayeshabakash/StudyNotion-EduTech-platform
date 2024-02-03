const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const { uploadImageToCloudinary} = require("../utils/imageUploader");
const mongoose = require("mongoose");
const {convertSecondsToDuration} = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")



// handler to update the user's details 
exports.updateDetails = async  (req , res) => {
    try{
        // fetch the data  
        const {firstName= "" , lastName= "" , gender = "", contactNumber = "", dateOfBirth="" , about = ""} = req.body;

        // fetch the user id 
        const id = req.user.id;

        // console.log("testing1")

        // validation 
        if(!id)
        {
            return res.status(400).json({
                success : false,
                message : "all fields are required!",
            })
        }
        
        // find profile 
        const userDetails = await User.findById({_id: id});
        // console.log("user details", userDetails);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        // console.log("testing2")
        

        const user = await User.findByIdAndUpdate(id, {
            firstName,
            lastName,
          })
          await user.save()
        //   console.log("testing3")


        //update  profile 
        profileDetails.gender = gender;
        profileDetails.DateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        
        await profileDetails.save(); //update profile into DB

        // console.log("testing4")

        // find the updated user  details 
        const updatedUserDetails = await User.findById(id)
                                                     .populate("additionalDetails")
                                                     .exec();

        // return response 
        return res.status(200).json({
            success : true,
            message : "profil Details updated successfully",
            updatedUserDetails,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message : "Profile Details cound not be updated!!",
            error : error.message,
        })
    }
}


// handler to delete the account 
// TODO:  EXPLORE -> how can we schedule a request (eg. deleting an account after 24 hrs of requset)
exports.deleteAccount = async (req , res) => {
    try{
        // fetch  the user id 
        const id = req.user.id;

        // find the user 
        const user  = await User.findById(id);

        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User not found",
            })
        }

       // Delete Assosiated Profile with the User
        await Profile.findByIdAndDelete({_id : user.additionalDetails});

        // TODO: unenroll the user from all the enrolled courses 
        for(const courseId of user.courses)
        {
            await Course.findByIdAndUpdate(
                courseId,
                {$pull : { studentsEnrolled :  id}},
                {new : true}
            )
        }

        // now, delete the user account 
        await User.findByIdAndDelete(id);


        // return response 
        return res.status(200).json({
            success: true,
            message : "Account Deleted Successfully",
        });
    }
    catch(error)
    {
        return  res.status(500).json({
            success : false,
            message : "Account Could not be deleted!!",
            error : error.message,
        })
    }
}



// get the all user details 
exports.getAllUserDetails = async (req , res) => {
    try{
        // get the id first 
        const id = req.user.id;

        // fetch user details 
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
            success : true,
            message : "User details successfully fetched",
            userDetails,
        })
    }
    catch(error)
    {   
        return res.status(500).json({
            success : false,
            message : "issue while fetching user details",
            error : error.message,
        })
    }
}



// update users profile image 
exports.updateProfileImage = async(req , res) => {
    try{
        const userId = req.user.id;
        profileImage = req.files.profileImage;

        // console.log("Profile Image : ",profileImage);

        if(!profileImage){
            return res.status(404).json({
                success : false,
                message : "Profile Image is required"
            })
        }

        // console.log("uploading...");
        const image = await uploadImageToCloudinary(profileImage, process.env.FOLDER_NAME , 1000 , 1000);

        const updatedImage = await User.findByIdAndUpdate({_id:userId},
                                                        {profileImage : image.secure_url},
                                                        {new : true})
                                                        .populate("additionalDetails").exec();
        
        return res.status(200).json({
            success : true,
            message : "Profile images is updated successfully",
            updatedUser : updatedImage
        })        
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success : false,
            message : "Profile Image could not be updated",
            error : error.message
        })
    }
}



// get Student's enrolled courses 
exports.getEnrolledCourses = async (req  , res) => {
    try{
        const userId = req.user.id;

        const user = await User.findById(userId)
                                    .populate({
                                        path : "courses",
                                        populate : {
                                            path : "courseContent",
                                            populate : {
                                                path : "subSections"
                                            }
                                        }
                                    }).exec();

        userDetails = user.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0
            SubsectionLength = 0
            for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[j]
                .subSections.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSections.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseID: userDetails.courses[i]._id,
                userId: userId,
            })
            console.log(courseProgressCount);
            if (courseProgressCount == null) {
                courseProgressCount = 0
            } else {
                courseProgressCount = courseProgressCount.completedVideos.length
            }
            if (SubsectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                // To make it up to 2 decimal point
                const multiplier = Math.pow(10, 2)
                userDetails.courses[i].progressPercentage =
                    Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier) / multiplier
            }
        }

        return res.status(200).json({
            success : true,
            message : "Enrolled courses of student is successfully fetched",
            enrolledCourses: user.courses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "enrolled courses could not be fetched",
            error : error.message,
        })
    }
}



// get a intructor's dashboard
exports.getInstructorDashboard = async (req, res) => {
    try{
        const userId = req.user.id;

        // find all the courses in which this user is instructor
        const courses = await Course.find({instructor : userId});

        const coursesData = courses.map( (course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalCourseRevenue = totalStudentsEnrolled * course.price;


            // now create a objects that contains some info and return it 
            const courseDataWithStats = {
                id : course._id,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                totalStudentsEnrolled,
                totalCourseRevenue
            }

            return courseDataWithStats;
        })

        return res.status(200).json({
            success : true,
            message : "instructor dashboard data fetched successfully",
            coursesData
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}