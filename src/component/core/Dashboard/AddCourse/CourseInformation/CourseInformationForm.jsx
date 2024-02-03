import React, { useEffect, useState } from 'react'
import { Form, useForm } from 'react-hook-form'
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { useDispatch, useSelector } from 'react-redux';
import { apiConnector } from '../../../../../services/apiConnector';
import {categories} from "../../../../../services/apis";
import TagsInput from './TagsInput';
import UploadFile from '../UploadFile';
import RequirementField from './RequirementField';
import ActionBtn from "../../../../common/ActionBtn"
import { MdNavigateNext } from "react-icons/md"
import { toast } from 'react-hot-toast';
import {addCourseDetails}  from "../../../../../services/operations/courseAPI"
import {setStep , setCourse} from "../../../../../Redux/Slices/courseSlice";
import { COURSE_STATUS } from '../../../../../utils/constant';

const CourseInformationForm = () => {
    const [loading , setLoading] = useState(false);
    const [courseCategories , setCourseCategories] = useState([]);
    const {course , editCourse, step} = useSelector( (state) => state.course);
    const {token} = useSelector( (state) => state.auth)
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const getCategories = async() => {
        setLoading(true);
        try{
            const result = await apiConnector("GET" , categories.CATEGORIES_API);
            console.log("printing the the categories ", result?.data?.allCategories);
            if(result?.data?.allCategories.length > 0)
            {
                setCourseCategories(result?.data?.allCategories);
            }
        }
        catch(error)
        {
            console.log("Categories could not be fetched");
        }
        setLoading(false);
    }


    useEffect(() => {
        getCategories();

         // if form is in edit mode
        if (editCourse) {
        // console.log("data populated", editCourse)
        setValue("courseTitle", course.courseName)
        setValue("courseShortDesc", course.courseDescription)
        setValue("coursePrice", course.price)
        setValue("courseTags", course.tag)
        setValue("courseBenefits", course.whatWillYouLearn)
        setValue("courseCategory", course.category)
        setValue("courseRequirements", course.instructions)
        setValue("courseImage", course.thumbnail)
      }
    }, [])

    const isUpdated = () => {
        const currentValues = getValues();

        if(currentValues.courseTitle !== course.courseName ||
           currentValues.courseShortDesc !== course.courseDescription ||
           currentValues.coursePrice  !== course.price ||
           currentValues.courseTags.toString() !== course.tag.toString() ||
           currentValues.courseBenefits !== course.whatWillYouLearn ||
           currentValues.courseCategory._id !== course.category._id ||
           currentValues.courseRequirements.toString() !== course.instructions.toString() ||
           currentValues.courseImage !== course.thumbnail
           )
           return true;
           else
           return false;
    }

    console.log("course", course);

    const onSubmit = async (data) => {

        if(editCourse)
        {

            if(isUpdated())
            {
                const currentValues = getValues();
                const formData = new FormData();

                formData.append("courseId" , course._id)
                if(currentValues.courseTitle !==  course.courseName)
                    formData.append("courseName", data.courseTitle)

                if(currentValues.courseShortDesc !== course.courseDescription)
                    formData.append("courseDescription" , data.courseShortDesc)

                if(currentValues.coursePrice  !== course.price)
                    formData.append("price" , data.coursePrice)

                if( currentValues.courseTags.toString() !== course.tag.toString())
                    formData.append("tag" , JSON.stringify(data.courseTags))

                if(currentValues.courseBenefits !== course.whatWillYouLearn)
                    formData.append("whatWillYouLearn" , data.courseBenefits)

                if(currentValues.courseCategory._id !== course.category._id)
                    formData.append("category" , data.courseCategory)

                if(currentValues.courseRequirements.toString() !== course.instructions.toString())
                    formData.append("instructions" , JSON.stringify(data.courseRequirements))

                if(currentValues.courseImage !== course.thumbnail)
                    formData.append("thumbnailImage" , data.courseImage)

                
                // now make network call to update the course details 
                setLoading(true);
                // const result = await editCourseDetails(formData , token);
                 const result = true;
                setLoading(false);

                if(result)
                {
                    dispatch(setStep(2));
                    dispatch(setCourse(result))
                }
                else{
                    toast.error("Changes could not be done");
                }
                return;
            }
        }

        const formData = new FormData();
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatWillYouLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        // console.log("form data" ,formData);

        setLoading(true)
        const result = await addCourseDetails(formData, token)
        console.log("Result", result);
        if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
        }
        setLoading(false)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
    className='space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6 w-fit sm:w-[100%]  overflow-auto '>
        {/* course title  */}
        <div className='flex flex-col gap-y-2'>
            <label htmlFor='courseTitle' className='label-style'>Course Title <sup className='text-pink-200'>*</sup></label>
            <input
                type='text'
                id='courseTitle'
                placeholder='Enter Course Title'
                {...register("courseTitle" , {required:true})}
                className='form-style w-full'
            />
            {
                errors.courseTitle && (
                    <span className='ml-2 text-xs text-pink-200 tracking-wide'>
                        Course title is required
                    </span>
                )
            }
        </div>

        {/* course description  */}
        <div className='flex flex-col gap-y-2'>
            <label htmlFor="courseShortDesc" className="label-style">Course Short Description <span className='text-pink-200'>*</span></label>
            <textarea
                id='courseShortDesc'
                placeholder='Enter Course Description'
                {...register("courseShortDesc" , {required:true})}
                className='form-style  min-h-[130px]'
            />
            {
                errors.courseShortDesc && (
                    <span className='ml-2 text-xs text-pink-200 tracking-wide'>
                        Course description is required
                    </span>
                )
            }
        </div>

        {/* price  */}
        <div className='flex flex-col gap-y-2'>
            <label htmlFor="coursePrice" className="label-style">Course Price <span className='text-pink-200'>*</span></label>
            <div className='relative'>
                <input
                    type='number'
                    id='coursePrice'
                    placeholder='Enter Price'
                    {...register("coursePrice" , {
                        required:true,
                        valueAsNumber: true,
                        pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        },
                    }, 
                    )}
                    className='form-style !pl-12 w-full'
                />
                <HiOutlineCurrencyRupee className='absolute top-[50%] left-3 inline-block -translate-y-1/2 text-2xl text-richblack-400'/>
            </div>
                {
                    errors.coursePrice && (
                        <span className='ml-2 text-xs text-pink-200 tracking-wide'>
                            course price is required
                        </span>
                    )
                }
        </div>

        {/* course categories  */}
        <div className='flex flex-col gap-y-2'>
            <lable htmlFor="courseCaterory" className="label-style">Course Category  <span className='text-pink-200'>*</span></lable>
            <select
                id='courseCategory'
                defaultValue=""
                {...register("courseCategory", {required :true})}
                className='form-style'
            >
                <option value="" disabled selected>Choose a Category</option>
                {
                    courseCategories.map( (category, index) => (
                        <option key={index} value={category._id}>{category.name}</option>
                    ))
                }
            </select>
            {
                errors.courseCategory && (
                    <span className='ml-2 text-xs text-pink-200 tracking-wide'>
                        Course category is required
                    </span>
                )
            }
        </div>

        {/* Course Tags  */}  
        {/* create a custom input tags for tag input  */}
        <TagsInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press Enter"
            register = {register}
            setValue = {setValue}
            getValues = {getValues}
            errors = {errors}
        />


        {/* upload course thumbnail  */}
        <UploadFile
            name="courseImage"
            label="Course Thumbnail"
            register ={register}
            errors = {errors}
            setValue = {setValue}
            editData = {editCourse ? course.thumbnail  : null}
        />

        {/* benefits of the course  */}
        <div className='flex flex-col gap-y-2'>
            <label htmlFor='courseBenefits' className='label-style'>Benefits of the Course <sup className='text-pink-200'>*</sup></label>
            <textarea
                id='courseBenefits'
                placeholder='Enter benefits of the course'
                {...register("courseBenefits" , {required:true})}
                className='form-style resize-none min-h-[130px]'
            />
            {
                errors.courseBenefits && (
                    <span className='ml-2 text-xs text-pink-200 tracking-wide'>Course Benefits is required</span>
                )
            }
        </div>


        {/* requirements / instructions field */}
        <RequirementField
            name="courseRequirements"
            label = "Requirement / Instructions"
            register={register}
            setValue = {setValue}
            errors = {errors}
            getValues = {getValues}
        />


        {/* Button group  */}
        <div className='flex gap-x-2 justify-end'>
          {
            editCourse && (
                <button onClick={() => dispatch(setStep(2))}
                    disabled={loading}
                    className='cursor-pointer py-2 px-[20px] rounded-md bg-richblack-300 font-semibold text-richblack-900'>
                      Continue Without Saving
                </button>

            )
          }

          <ActionBtn 
          disabled={loading}
          type={"submit"}
          text={!editCourse ? "Next" : "Save Changes"}
          customClasses={`${loading && "bg-yellow-500"}`}>
            <MdNavigateNext/>
          </ActionBtn>

        </div>

    </form>
  )
}

export default CourseInformationForm









// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "react-hot-toast"
// import { HiOutlineCurrencyRupee } from "react-icons/hi"
// import { MdNavigateNext } from "react-icons/md"
// import { useDispatch, useSelector } from "react-redux"
// import { apiConnector } from "../../../../../services/apiConnector"
// import { categories } from "../../../../../services/apis"

// import {
//   addCourseDetails,
// //   editCourseDetails,
// //   fetchCourseCategories,
// } from "../../../../../services/operations/courseAPI"
// import { setCourse, setStep } from "../../../../../Redux/Slices/courseSlice"
// // import { COURSE_STATUS } from "../../../../../utils/constants"
// import ActionBtn from "../../../../common/ActionBtn"
// import UploadFile  from "../UploadFile"
// import TagsInput from "./TagsInput"
// import RequirementField from "./RequirementField"

// export default function CourseInformationForm() {
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     getValues,
//     formState: { errors },
//   } = useForm()

//   const dispatch = useDispatch()
//   const { token } = useSelector((state) => state.auth)
//   const { course, editCourse } = useSelector((state) => state.course)
//   const [loading, setLoading] = useState(false)
//   const [courseCategories, setCourseCategories] = useState([])

//   const getCategories = async() => {
//       setLoading(true);
//       try{
//           const result = await apiConnector("GET" , categories.CATEGORIES_API);
//           console.log("printing the the categories ", result?.data?.allCategories);
//           if(result?.data?.allCategories.length > 0)
//           {
//               setCourseCategories(result?.data?.allCategories);
//           }
//       }
//       catch(error)
//       {
//           console.log("Categories could not be fetched");
//       }
//       setLoading(false);
//   }
//   useEffect(() => {
//     // if form is in edit mode
//     if (editCourse) {
//       // console.log("data populated", editCourse)
//       setValue("courseTitle", course.courseName)
//       setValue("courseShortDesc", course.courseDescription)
//       setValue("coursePrice", course.price)
//       setValue("courseTags", course.tag)
//       setValue("courseBenefits", course.whatWillYouLearn)
//       setValue("courseCategory", course.category)
//       setValue("courseRequirements", course.instructions)
//       setValue("courseImage", course.thumbnail)
//     }
//     getCategories()

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const isFormUpdated = () => {
//     const currentValues = getValues()
//     // console.log("changes after editing form values:", currentValues)
//     if (
//       currentValues.courseTitle !== course.courseName ||
//       currentValues.courseShortDesc !== course.courseDescription ||
//       currentValues.coursePrice !== course.price ||
//       currentValues.courseTags.toString() !== course.tag.toString() ||
//       currentValues.courseBenefits !== course.whatWillYouLearn ||
//       currentValues.courseCategory._id !== course.category._id ||
//       currentValues.courseRequirements.toString() !==
//         course.instructions.toString() ||
//       currentValues.courseImage !== course.thumbnail
//     ) {
//       return true
//     }
//     return false
//   }

//   //   handle next button click
//   const onSubmit = async (data) => {
//     // console.log(data)
//     // if (editCourse) {
//     //   // const currentValues = getValues()
//     //   // console.log("changes after editing form values:", currentValues)
//     //   // console.log("now course:", course)
//     //   // console.log("Has Form Changed:", isFormUpdated())
//     //   if (isFormUpdated()) {
//     //     const currentValues = getValues()
//     //     const formData = new FormData()
//     //     // console.log(data)
//     //     formData.append("courseId", course._id)
//     //     if (currentValues.courseTitle !== course.courseName) {
//     //       formData.append("courseName", data.courseTitle)
//     //     }
//     //     if (currentValues.courseShortDesc !== course.courseDescription) {
//     //       formData.append("courseDescription", data.courseShortDesc)
//     //     }
//     //     if (currentValues.coursePrice !== course.price) {
//     //       formData.append("price", data.coursePrice)
//     //     }
//     //     if (currentValues.courseTags.toString() !== course.tag.toString()) {
//     //       formData.append("tag", JSON.stringify(data.courseTags))
//     //     }
//     //     if (currentValues.courseBenefits !== course.whatWillYouLearn) {
//     //       formData.append("whatWillYouLearn", data.courseBenefits)
//     //     }
//     //     if (currentValues.courseCategory._id !== course.category._id) {
//     //       formData.append("category", data.courseCategory)
//     //     }
//     //     if (
//     //       currentValues.courseRequirements.toString() !==
//     //       course.instructions.toString()
//     //     ) {
//     //       formData.append(
//     //         "instructions",
//     //         JSON.stringify(data.courseRequirements)
//     //       )
//     //     }
//     //     if (currentValues.courseImage !== course.thumbnail) {
//     //       formData.append("thumbnailImage", data.courseImage)
//     //     }
//     //     // console.log("Edit Form data: ", formData)
//     //     setLoading(true)
//     //     const result = await editCourseDetails(formData, token)
//     //     setLoading(false)
//     //     if (result) {
//     //       dispatch(setStep(2))
//     //       dispatch(setCourse(result))
//     //     }
//     //   } else {
//     //     toast.error("No changes made to the form")
//     //   }
//     //   return
//     // }

//     const formData = new FormData()
//     formData.append("courseName", data.courseTitle)
//     formData.append("courseDescription", data.courseShortDesc)
//     formData.append("price", data.coursePrice)
//     formData.append("tag", JSON.stringify(data.courseTags))
//     formData.append("whatWillYouLearn", data.courseBenefits)
//     formData.append("category", data.courseCategory)
//     // formData.append("status", COURSE_STATUS.DRAFT)
//     formData.append("instructions", JSON.stringify(data.courseRequirements))
//     formData.append("thumbnailImage", data.courseImage)


//     console.log("form data" ,formData);
//     // const formDataLength = Array.from(formData.entries()).length;

//     // console.log("formData Length",formDataLength); // 2

//     // const formData = {};

//     // formData.courseName = data.courseTitle;
//     // formData.courseDescription = data.courseShortDesc;
//     // formData.price = data.coursePrice;
//     // formData.tag = data.courseTags;
//     // formData.whatWillYouLearn = data.courseBenefits;
//     // formData.category = data.courseCategory;
//     // formData.instructions = data.courseTitle;
//     // formData.thumbnailImage = data.courseImage;

//     console.log("checking course thumbnail",formData.get('thumbnailImage'));
//     setLoading(true)
//     const result = await addCourseDetails(formData, token);
//     if (result) {
//       dispatch(setStep(2))
//       dispatch(setCourse(result))
//     }
//     setLoading(false)
//   }

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
//     >
//       {/* Course Title */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseTitle">
//           Course Title <sup className="text-pink-200">*</sup>
//         </label>
//         <input
//           id="courseTitle"
//           placeholder="Enter Course Title"
//           {...register("courseTitle", { required: true })}
//           className="form-style w-full"
//         />
//         {errors.courseTitle && (
//           <span className="ml-2 text-xs tracking-wide text-pink-200">
//             Course title is required
//           </span>
//         )}
//       </div>
//       {/* Course Short Description */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
//           Course Short Description <sup className="text-pink-200">*</sup>
//         </label>
//         <textarea
//           id="courseShortDesc"
//           placeholder="Enter Description"
//           {...register("courseShortDesc", { required: true })}
//           className="form-style resize-x-none min-h-[130px] w-full"
//         />
//         {errors.courseShortDesc && (
//           <span className="ml-2 text-xs tracking-wide text-pink-200">
//             Course Description is required
//           </span>
//         )}
//       </div>
//       {/* Course Price */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="coursePrice">
//           Course Price <sup className="text-pink-200">*</sup>
//         </label>
//         <div className="relative">
//           <input
//             id="coursePrice"
//             placeholder="Enter Course Price"
//             {...register("coursePrice", {
//               required: true,
//               valueAsNumber: true,
//               pattern: {
//                 value: /^(0|[1-9]\d*)(\.\d+)?$/,
//               },
//             })}
//             className="form-style w-full !pl-12"
//           />
//           <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
//         </div>
//         {errors.coursePrice && (
//           <span className="ml-2 text-xs tracking-wide text-pink-200">
//             Course Price is required
//           </span>
//         )}
//       </div>
//       {/* Course Category */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseCategory">
//           Course Category <sup className="text-pink-200">*</sup>
//         </label>
//         <select
//           {...register("courseCategory", { required: true })}
//           defaultValue=""
//           id="courseCategory"
//           className="form-style w-full"
//         >
//           <option value="" disabled>
//             Choose a Category
//           </option>
//           {!loading &&
//             courseCategories.map((category, indx) => (
//               <option key={indx} value={category._id}>
//                 {category.name}
//               </option>
//             ))}
//         </select>
//         {/* {errors.courseCategory && (
//           <span className="ml-2 text-xs tracking-wide text-pink-200">
//             Course Category is required
//           </span>
//         )} */}
//       </div>
//       {/* Course Tags */}
//       <TagsInput
//         label="Tags"
//         name="courseTags"
//         placeholder="Enter Tags and press Enter"
//         register={register}
//         errors={errors}
//         setValue={setValue}
//         getValues={getValues}
//       />
//       {/* Course Thumbnail Image */}
//       <UploadFile
//         name="courseImage"
//         label="Course Thumbnail"
//         register={register}
//         setValue={setValue}
//         errors={errors}
//         editData={editCourse ? course.thumbnail : null}
//       />
//       {/* Benefits of the course */}
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
//           Benefits of the course <sup className="text-pink-200">*</sup>
//         </label>
//         <textarea
//           id="courseBenefits"
//           placeholder="Enter benefits of the course"
//           {...register("courseBenefits", { required: true })}
//           className="form-style resize-x-none min-h-[130px] w-full"
//         />
//         {errors.courseBenefits && (
//           <span className="ml-2 text-xs tracking-wide text-pink-200">
//             Benefits of the course is required
//           </span>
//         )}
//       </div>
//       {/* Requirements/Instructions */}
//       <RequirementField
//         name="courseRequirements"
//         label="Requirements/Instructions"
//         register={register}
//         setValue={setValue}
//         errors={errors}
//         getValues={getValues}
//       />
//       {/* Next Button */}
//       <div className="flex justify-end gap-x-2">
//         {editCourse && (
//           <button
//             onClick={() => dispatch(setStep(2))}
//             disabled={loading}
//             className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
//           >
//             Continue Wihout Saving
//           </button>
//         )}
//         {/* <ActionBtn
//           disabled={loading}
//           text={!editCourse ? "Next" : "Save Changes"}
//         >
//           <MdNavigateNext />
//         </ActionBtn> */}

//         <button
//         type="submit"
//         disabled={loading}
//         className="p-3 bg-yellow-50 rounded-md">
//         {
//             !editCourse ? "Next" : "Save Changes"
//         }
//         </button>
//       </div>
//     </form>
//   )
// }