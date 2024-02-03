const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    courseName : {
        type : String,
        trim : true,
    },

    courseDescription : {
        type : String,
        trim : true,
    },

    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },

    whatWillYouLearn : { 
        type : String,
    },

    courseContent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Section",
        }
    ],

    ratingAndReviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "RatingAndReviews",
        }
    ],

    price : {
        type : Number,
        trim : true,
    },

    thumbnail : {
        type : String
    },

    tag : {
        type : [String],
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },

    studentsEnrolled : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }],

    instructions : {
        type : [String],
    },

    status : {
        type : String,
        enum : ["Draft" , "Published"],
    },

    createdAt : {
        type : Date,
        default : Date.now,
    }
});

module.exports = mongoose.model("Course" , courseSchema);