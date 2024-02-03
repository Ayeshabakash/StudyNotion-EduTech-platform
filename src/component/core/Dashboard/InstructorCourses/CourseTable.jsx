import React, { useState } from 'react'
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import {COURSE_STATUS} from "../../../../utils/constant";
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from "../../../common/ConfirmationModal"
import {getInstructorCourses} from "../../../../services/operations/courseAPI"
import { useSelector } from 'react-redux';
import { deleteCourse } from '../../../../services/operations/courseAPI';
import {formatDate} from "../../../../services/formatDate"

const CourseTable = ({courses , setCourses}) => {
    const [loading, setLoading] = useState(false)
    const [confirmationModal , setConfirmationModal] = useState(null);
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const deleteCourseHandler = async(courseId) => {
        setLoading(true);
        await deleteCourse({courseId : courseId}, token);
        const result = await getInstructorCourses(token);

        if(result){
            setCourses(result);
        }

        setConfirmationModal(null)
        setLoading(false)
    }
  return (
    <div>
        <Table className="border border-richblack-800"> 
            <Thead>
                <Tr className="flex gap-x-10 rounded-t-md border-b border-richblack-800 px-6 py-2">
                    <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">Courses</Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">Duration</Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">Price</Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">Actions</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    courses.length === 0 ? (
                        <Tr>
                            <Td className="py-10 text-center text-2xl font-medium text-richblack-100">No Courses Found!!</Td>
                        </Tr>
                    ) : (
                        courses.map((course) => (
                            <Tr key={course._id}
                                className="flex gap-x-4 border-b border-richblack-800 px-6 py-8">
                                <Td className="flex flex-1 gap-x-4">
                                    <img
                                        src={course?.thumbnail}
                                        alt={course?.courseName}
                                        className='h-[148px] w-[220px] object-cover rounded-lg'
                                    />

                                    <div className='flex flex-col justify-between'>
                                        <p className='text-lg font-semibold  text-richblack-5'>
                                          {course.courseName}
                                        </p>
                                        <p className='text-xs text-richblack-300'>
                                          {
                                             course.courseDescription.split(" ").length > 30 ? (
                                                course.courseDescription.split(" ").splice(0 , 30).join(" ") + "..."
                                             ) : (
                                                course.courseDescription
                                             )
                                          }
                                        </p>
                                        <p className='text-[12px] text-white'>
                                          created:{formatDate(course.createdAt)}
                                        </p>
                                        <p>
                                        {course.status === COURSE_STATUS.DRAFT ? (
                                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                                            <HiClock size={14} />
                                            Drafted
                                        </p>
                                        ) : (
                                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                            <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                            <FaCheck size={8} />
                                            </div>
                                            Published
                                        </p>
                                        )}
                                        </p>
                                    </div>
                                </Td>
                                
                                <Td className="text-sm font-medium text-richblack-100"> 
                                  {/* it is hardcoded make it according to the course duration */}
                                   2hr 30min  
                                </Td>

                                <Td className="text-sm font-medium text-richblack-100 ml-10">
                                  ₹{course.price}
                                </Td>

                                <Td className="text-sm font-medium text-richblack-100 ml-7">
                                    <button
                                      title="Edit"
                                      disabled={loading}
                                      onClick={ () => navigate(`/dashboard/edit-course/${course._id}`)}
                                      className='px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300'>
                                       <FiEdit2 size={20} />
                                    </button>

                                    <button
                                      disabled={loading}
                                      className='px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]'
                                      onClick={() => setConfirmationModal({
                                        text1 : "Do you want to delete this course?",
                                        text2 : "All the data related to this course will be deleted",
                                        btn1Text : "Delete",
                                        btn2Text : "Cancel",
                                        btn1Handler : !loading ? () => deleteCourseHandler(course._id) : {},
                                        btn2Handler : !loading ? () => setConfirmationModal(null) : {} 
                                      })}>
                                       <RiDeleteBin6Line size={20} />
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
        {
            confirmationModal && (<ConfirmationModal modalData={confirmationModal} setModalData={setConfirmationModal}/>)
        }
    </div>
  )
}

export default CourseTable