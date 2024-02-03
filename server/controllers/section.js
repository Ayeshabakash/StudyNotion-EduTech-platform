const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");


// a handler to create a section 
exports.createSection = async (req , res) => {
    try{
        // fetch the sectionName
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success : false,
                message : "please fill the required properties",
            })
        }

        // create entry into DB 
        const newSection = await Section.create({sectionName});

        
        // update the course schema for new section 
        const updateCourseDetails  = await Course.findByIdAndUpdate({_id: courseId},
                                                                    {
                                                                        $push : {
                                                                            courseContent : newSection._id,
                                                                        }
                                                                    },
                                                                    {new : true},
                                                                    )
                                                                    .populate("courseContent")
                                                                    .populate({
                                                                        path: "courseContent",
                                                                        populate : {
                                                                            path : "subSections"
                                                                        }
                                                                    })
                                                                    .exec();
        // console.log("checking error......");  
            
            // console.log("just checking what went wrong");

        // return  response 
        return res.status(200).json({
            success : true,
            message : "Section Created Successfully",
            updateCourseDetails,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message  : "unable to create section, please try again",
            error : error.message,
        })
    }
}



// a handler to update a section 
exports.updateSection = async (req , res ) => {
    try {
        //fetch the data 
        const {sectionId , courseId, sectionName} = req.body;

        // data validation 
        if(!sectionId || !sectionName)
        {
            return  res.status(401).json({
                success : false,
                message :  "properties missing",
            })
        }

        // update the section 
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                              {sectionName}, {new: true} );
            
        // console.log("just checking error");

        const course = await Course.findById(courseId)
                                            .populate("courseContent")
                                            .populate({
                                                path : "courseContent",
                                                populate: {
                                                    path : "subSections",
                                                },
                                            })
                                            .exec();

        // return response 
        return res.status(200).json({
            success: true,
            message : "section Updated Successfully",
            course,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message  : "unable to update section, please try again",
            error : error.message,
        })
    }
}


// a handler to delete a section  
exports.deleteSection = async (req , res) => {
    try{
        // fetch section id  -> assuming that we are sending section id into params
        const {sectionId , courseId} = req.body;
        
        await Course.findByIdAndUpdate(courseId, {
            $pull : {
                courseContent : sectionId,
            },
        })

        const section = await Section.findById(sectionId)
        // console.log(sectionId, courseId);
        
        if(!section)
        {
            return res.status(403).json({
                success : false,
                message : "Section not found",
            })
        }

        // delete the associated subsections  
        await SubSection.deleteMany({_id : {$in: section.subSections}});

        // delete entry of section
        await Section.findByIdAndDelete(sectionId);

        // find the updated course course and return it 
        const course = await Course.findById({_id:courseId})
                                            .populate({
                                                path : "courseContent",
                                                populate : {
                                                    path : "subSections",
                                                }
                                            })
                                            .exec();

        // console.log("nothing just cheking error");
        

        // return response 
        return res.status(200).json({
            success : true,
            message  : "section deleted successfully",
            data : course,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message  : "unable to delete section, please try again",
            error : error.message,
        })
    }
}