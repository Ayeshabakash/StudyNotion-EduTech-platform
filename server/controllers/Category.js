const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
// handler to create a category 
exports.createCategory = async (req , res) => {
    try{
        // fetch the data 
        const {name , description} = req.body;


        // validation 
        if(!name || !description)
        {
            return res.status(401).json({
                success : false,
                message : "All Fields are required!",
            })
        }


        // create entry in DB
        const CategorysDetails = await Category.create({name:name , description:description});

        // console.log("category is created", CategorysDetails);


        // return response 
        return res.status(200).json({
            success : true,
            message : "Category is successfully created",
            CategorysDetails,
        })

    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : "issue while creating a category",
        })
    }
}



// handler to show all category 
exports.showAllCategories = async (req , res) => {
    try{
        // find the the tags in which name and description must be included 
        const allCategories = await Category.find({}, {name : true , description : true});

        // now, return the response 
        return res.status(200).json({
            success : true,
            message : "All Cateogies are successfully showned",
            allCategories,
        })
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : "all category could not be showned",
        })
    }
}


// handler for category page details
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
                                                            .populate({
                                                            path: "courses",
                                                            match: { status: "Published" },
                                                            populate: "ratingAndReviews",
                                                            })
                                                            .exec()
  
      // console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
                                                        .populate({
                                                        path: "courses",
                                                        match: { status: "Published" },
                                                        })
                                                        .exec()
      console.log()
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
                                            .populate({
                                            path: "courses",
                                            match: { status: "Published" },
                                            })
                                            .exec()

      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)
  
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }