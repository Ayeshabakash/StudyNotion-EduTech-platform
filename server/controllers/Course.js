const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration")
const CourseProgress = require("../models/CourseProgress")
require("dotenv").config();


// handler to create course 
exports.createCourse = async(req , res) => {
    try {
        // console.log("checking error");

        // fetch the data first 
        const {courseName , courseDescription , whatWillYouLearn , price , tag , category, instructions}  = req.body;
        let {status}  = req.body;
        const thumbnail = req.files.thumbnailImage;   
        // console.log("thumbnail : ",thumbnail);
        // console.log(req.body);

        if(!status){
            status = "Draft";
        }


        // // validation 
        if(!courseName || !courseDescription || !whatWillYouLearn || !price  || !category)
        {
            return res.status(401).json({
                success : false,
                message : "All Fields are required.....",
            })
        }

        // extract the instructor 
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);


        if(!instructorDetails)
        {
            return res.status(404).json({
                success : false,
                message  : "instrutor not found"
            });
        }

        // check  if given  tag is valid or not 
        const CategoryDetails = await Category.findById(category); 

        if(!CategoryDetails)
        {
            return  res.status(401).json({
                success : false,
                message : "Category does not found",
            });
        }
        // upload thumbnail to cloudinary 
        const  thumbnailDetails = await uploadImageToCloudinary(thumbnail, "Studynotion");
        
        // console.log("checking what went wrong");

        // create an entry in DB for new course 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatWillYouLearn : whatWillYouLearn,
            price,
            tag,
            instructions,
            status,
            category: CategoryDetails._id,
            thumbnail :thumbnailDetails.secure_url,
        })



        //add the course to the user schema of the instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push :{
                    courses : newCourse._id,
                }
            },
            {new : true}
        )


        // update the category schema 
        updatedCategory = await Category.findByIdAndUpdate(
                                            {_id : category},
                                            {
                                                $push : {
                                                    courses : newCourse._id,
                                                }
                                            },
                                            {new : true}
                                        )
        

        // return  response 
        return res.status(200).json({
            success : true,
            message: "course created Successfully",
            newCourse,
            updatedCategory,
        })
    }
    catch(error)
    {
        console.log(error);
        return  res.status(500).json({
            success : false,
            message : "Course could not be created",
            error : error.message,
        })
    }
}



// get all the course handler 
exports.showAllCourse  = async (req , res) => {
    try{
        const allCourses = await Course.find({});

        return res.status(200).json({
            success : true,
            message : "All courses are fetched successfully",
            data: allCourses,
        })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message :  "issue while fetching all courses",
        })
    }
}


// handler to get course details 
exports.getCourseDetails = async (req , res) =>{
    try{
        // fetch the course id first 
        const {courseId} = req.body;

        // now find the course 
        const courseDetails = await Course.findOne(
                                            {_id:courseId})
                                            .populate(
                                                {
                                                    path: "instructor",
                                                    populate : {
                                                        path : "additionalDetails"
                                                    },
                                                }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .populate({
                                                path : "courseContent",
                                                populate: {
                                                    path : "subSections"
                                                }
                                            })
                                            .exec();
        
        // validation 
        if(!courseDetails)
        {
            return res.status(400).json({
                success : false,
                message : `Course could not be found for ${courseId}`
            })
        }

        // return response 
        return res.status(200).json({
            success : true,
            message : "course fetched successfully",
            data : courseDetails,
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success : false,
            message :  error.message
        });
    }
}


// edit a course 
exports.editCourse = async (req, res) => {
    try{
        const courseId  = req.body.courseId;

        const courseDetails = req.body;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success : false,
                message : "course does not found"
            })
        }

        // if thumbail is also updated then upload it to the cloudinary
        if(req.files)
        {
            const image = req.files.thumbnailImage;
            const thumbnail = await uploadImageToCloudinary(image, process.env.FOLDER_NAME);
            course.thumbnail = thumbnail.secure_url;
        }

        console.log("updated details,",courseDetails);
        // update only that field that are present in the req.body 
        for(const key  in courseDetails)
        {
            if(courseDetails.hasOwnProperty(key))
            {
                if(key === "tag" || key == "instructions")
                {
                    course[key] = JSON.parse(courseDetails[key]);
                }
                if (key.toLowerCase() === "tag" || key.toLowerCase() === "instructions") {
                    try {
                        course[key] = JSON.parse(courseDetails[key]);
                    } catch (error) {
                        console.error(`Error parsing JSON for key '${key}': ${error.message}`);
                        // Handle the error as needed
                    }
                } 
                else{
                    course[key] = courseDetails[key];
                }
            }
        }

        // now update the course
        await course.save();

        const updatedCourse = await Course.findOne({
                                                    _id: courseId,
                                                })
                                                .populate({
                                                    path: "instructor",
                                                    populate: {
                                                        path: "additionalDetails",
                                                    },
                                                })
                                                .populate("category")
                                                .populate("ratingAndReviews")
                                                .populate({
                                                    path: "courseContent",
                                                    populate: {
                                                        path: "subSections",
                                                    },
                                                })
                                                .exec()

        return res.status(200).json({
            success: true,
            message : "course edited successfully",
            course,
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).json({
            success : false,
            message  : "course could not be updated",
            error : error.message
        })
    }
}

// get an instructor courses 
exports.getInstructorCourses = async (req , res) => {
    try{
        const userId = req.user.id;

        const instructorCourses = await Course.find({instructor : userId}).sort({ createdAt: -1 });

        return res.status(200).json({
            success : true,
            message : "instructor courses fetched successfully",
            instructorCourses,
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,
        })
    }
}

// delete course 
exports.deleteCourse = async (req, res) => {
    try{
        const {courseId} = req.body;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                success : false,
                message  :"course does not found"
            })
        }

        // unenroll all the student enrolled to this course 
        const studentsEnrolled = course.studentsEnrolled;
        for(const studentId of studentsEnrolled){
            await User.findByIdAndUpdate(studentId, {
                                        $pull: {courses: courseId}
                                         });
        }

        // console.log("course ->>>",course);
        // also delete the course from the instructor courses 
        const instructorId = course.instructor;
        await User.findByIdAndUpdate(instructorId,{
                                                $pull : {courses: courseId} 
                                            });


        // delete section and subsection of the course also 
        const courseSections = course.courseContent;
        for(const sectionId of courseSections)
        {
            const section = await Section.findById(sectionId);

            const subSections = section.subSections;
            // first delete all the lecture from a section 
            for(const subsectionId of subSections)
            {
                await SubSection.findByIdAndDelete(subsectionId);
            }

            // then delete the section 
            await Section.findByIdAndDelete(sectionId);
        }


        // now delete the course 
        await Course.findByIdAndDelete(courseId);


        return res.status(200).json({
            success: true,
            message : "course deleted succesfully"
        })
    }
    catch(error){   
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Course could not be deleted",
            message : error.message
        })
    }
}


// get full course details 
exports.getFullCourseDetails = async (req , res) => {
    try{
        const {courseId} = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findById(courseId)
                                                            .populate({
                                                                path : "instructor",
                                                                populate : {
                                                                    path : "additionalDetails"
                                                                }
                                                            })
                                                            .populate({
                                                                path : "courseContent",
                                                                populate : {
                                                                    path : "subSections"
                                                                }
                                                            })
                                                            .populate("category")
                                                            .populate("ratingAndReviews")
                                                            .exec();


        if (!courseDetails) {
            console.log(courseId)
            return res.status(400).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            })
        }

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        console.log("courseProgressCount : ", courseProgressCount)

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
            content.subSections.forEach((subSection) => {
                const timeDurationInSeconds = parseInt(subSection.timeDuration)
                totalDurationInSeconds += timeDurationInSeconds
            })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)


        return res.status(200).json({
            success : true,
            message : "Course detail fetched succesfully",
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount != null && courseProgressCount.completedVideos != null ?
                    courseProgressCount.completedVideos : [],
            }

        })

        
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success :false,
            message : error.message

        })
    }
}