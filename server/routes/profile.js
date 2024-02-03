const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middleware/auth")
const {
  deleteAccount,
  updateDetails,
  getAllUserDetails,
  updateProfileImage,
  getEnrolledCourses,
  getInstructorDashboard,
} = require("../controllers/profile")


// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateDetails)
router.get("/getUserDetails", auth, getAllUserDetails)


// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateProfileImage)
router.get("/instructorDashboard", auth, isInstructor, getInstructorDashboard)

module.exports = router
