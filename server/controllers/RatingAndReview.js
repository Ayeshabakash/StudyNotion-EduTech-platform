const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const mongoose  = require("mongoose");

// creating rating and reivew 
exports.createRating = async (req , res) => {
    try{
        // fetch the userId 
        const userId = req.user.id;

        // fetch the rating and review 
        const {rating , review , courseId} = req.body;

        // console.log("Rating : ", rating , "review : ", review , "courseId : ",courseId);

        // check if user is enrolled or not 
        const courseDetails = await Course.findOne(
                                                {_id: courseId,
                                                studentsEnrolled : {$elemMatch: {$eq : userId}}   //find the course by courseid if the user is enrolled in it
                                             });

        // console.log("Course Details : ", courseDetails);

        if(!courseDetails)
        {
            return res.status(400).json({
                success : false,
                message : "you haven't enrolled for that course"
            });
        }

        // check if user is already reviewed for that course 
        const alreadyReviewed = await RatingAndReviews.findOne({
                                                        course : courseId,
                                                        user : userId
                                                     });

        if(alreadyReviewed){
            return res.status(401).json({
                success : false,
                message : "You have already reviewed for this course"
            })
        }

        //creating the rating and review 
        const ratingReview = await RatingAndReviews.create({
                                                        rating , review ,
                                                        user : userId,
                                                        course : courseId
                                                    });

        // update the course for rating and review
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                                            {_id:courseId},
                                                            {
                                                                $push : {
                                                                    ratingAndReviews : ratingReview._id
                                                                },
                                                            },
                                                            {new  : true}
                                                        );

        console.log(updateCourseDetails);

        // return response 
        return res.status(200).json({
            success : true,
            message  : "rating and review created successfully",
            ratingReview,
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message: error.message,
        })
    }
}


// get average rating 
exports.getAverageRating = async (req , res) => {
    try{
        // get course id
        const courseId = req.body.courseId;

        // calculate average rating using aggregation 
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),  //match all the entries with courseid after coverting courseid from string to objectId
                },
            },
            {
                $group: {
                    _id : null,
                    averageRating : {$avg: "$rating"},   //grouping  all the entries and finding the average of ratings
                }
            }
        ]);

        // return rating 
        if(result.length > 0)
        {
            return res.status(200).json({
                success : true,
                averageRating : result[0].averageRating,
                message : "rating for course is successfully fetched"
            })
        }

        // if no rating exist 
        return res.status(200).json({
            success : true,
            message : "rating is 0 , bcz no one rated for that course",
            averageRating: 0
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


// get all rating and reviews not specific to the course 
exports.getAllRatingReview = async (req , res) => {
    try{
        // fetch all rating and review 
        const ratingReview = await RatingAndReviews.find({})
                                                    .sort({rating : "desc"})  //sorting the rating on the decreasing order
                                                    .populate({
                                                        path: "user",
                                                        select: "firstName lastName email image"    //populate the firstName, lastName , email and image from the user       
                                                    })
                                                    .populate({
                                                        path : "course",
                                                        select : "courseName"
                                                    })
                                                    .exec();

        // return response 
        return res.status(200).json({
            success: true,
            message : "all rating and review fetched successfully",
            data: ratingReview,
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