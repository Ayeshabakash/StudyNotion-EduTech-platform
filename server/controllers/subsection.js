const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// handler to create a SubSection
exports.createSubSection = async (req , res) => {
    try{
        // fetch all the data from req.body 
        const {title , timeDuration , description , sectionId} = req.body;

        // console.log("req files" , req.files);

        // fetch the video file
        const video = req.files.videoFile;
        
        // apply validation 
        if(!title  || !description || !sectionId  || !video)
        {
            return res.status(400).json({
                success : false,
                message : "all fields are required",
            })
        }

        // upload video to Cloudinary
        const uploadDetails =  await uploadImageToCloudinary(video , process.env.FOLDER_NAME);

        // create a subsection 
        const newSubSection = await  SubSection.create({
                                                        title: title,
                                                        timeDuration : timeDuration,
                                                        description : description,
                                                        videoUrl : uploadDetails.secure_url,
                                                        });
        

        // console.log("just checking  error");
        
       // update the section for new subsection objectId 
       const  updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {
                                                                    $push:{
                                                                        subSections: newSubSection._id,
                                                                    }
                                                                },
                                                                {new : true})
                                                                .populate("subSections").exec();


        // TODO:-> use populate to log the the details for subSections in section 
        return res.status(200).json({
            success : true,
            message : "subsection created successfully",
            newSubSection,
            updatedSection,
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success: false,
            message : "subsection could not created",
            error: error.message,
        })
    }
}


// TODO:  HW -> update subsection
exports.updateSubSection = async (req , res) => {
    try{

        // fetch the details 
        const {title , description , subSectionId, sectionId} = req.body;
        const video = req.files?.video;
        // fetch the subsection 
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection)
        {
            return res.status(404).json({
                success : false,
                message : "subsection not found",
            })
        }

        if(title)
        {
            subSection.title = title;
        }

        if(description)
        {
            subSection.description = description;
        }

        let uploadDetails;
        if(video)
        {
            uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME);
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        
        await subSection.save();
        // console.log("updated subsection" , subSection);
        
        const updatedSection = await Section.findById(sectionId)
                                                            .populate("subSections").exec();

        return res.status(200).json({
            success : true,
            message : "subsection updated successfully",
            data : updatedSection,
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


// HW -> deleteSubsection
exports.deleteSubSection = async (req, res) => {
    try{
        // fetch sectionid and subSectionId 
        const {sectionId , subSectionId} = req.body;

        // remove subSection from section's collection 
        const updatedSection = await Section.findByIdAndUpdate(
                                    {_id: sectionId},
                                    {
                                        $pull :{
                                            subSections :  subSectionId,
                                        },
                                    },
                                    {new : true})
                                    .populate("subSections");

        const deletedSubSection = await SubSection.findByIdAndDelete({_id: subSectionId})

        if(!deletedSubSection)
        {
            return res.status(404).json({
                success : false,
                message :  "subsection could not be deleted"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Subsection Deleted successfully",
            data : updatedSection,
            deletedSubSection,
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "An error occured while deleting a subsection",
        })
    }
}