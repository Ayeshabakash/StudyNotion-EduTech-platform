import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import CourseSlider from "../component/core/CatalogPage/CourseSlider"
import {apiConnector} from "../services/apiConnector"
import {categories} from "../services/apis";
import {getCatalogPageData} from "../services/operations/CatalogAPI";
import CatalogCourseCard from "../component/core/CatalogPage/CatalogCourseCard"
import Footer from "../component/common/Footer"

const Catalog = () => {
    const {catalogName} = useParams();
    const [categoryId, setCategoryId] = useState("");
    const [catalogPageData , setCatalogPageData] = useState(null);
    const [active, setActive] = useState(1) //which tab is active in section 1
    const [loading , setLoading] = useState(false);

    // console.log("catalogPageData : " ,catalogPageData );
    // console.log("SelectedCategory: ", catalogPageData?.selectedCategory)
    // console.log("length", catalogPageData?.mostSellingCourses.length);

    useEffect(() => {
        
        const getCategory = async () => {
            setLoading(true);
            try{
                const allCategories = await apiConnector("GET" , categories.CATEGORIES_API);

                const category_id = allCategories.data.allCategories.filter((category) => category.name.split((/[\/ ]/)).join("-").toLowerCase() === catalogName)[0]._id;

                setCategoryId(category_id);
            }
            catch(error)
            {
                console.log("catalog catogory could not be fetched", error);
            }
            setLoading(false);
        }

        getCategory();
    },[catalogName] )


    useEffect(() => {
        const getCategoryDetails = async () => {
            setLoading(true);
            try{
                const catalogData  = await getCatalogPageData(categoryId);
                
                setCatalogPageData(catalogData);
            }
            catch(error)
            {
                console.log("catalog courses could not be fetched : ", error);
            }
            setLoading(false);
        }

        if(categoryId){
          getCategoryDetails();
        }
    }, [categoryId])

    if(loading){
        return(
            <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
                <div className='spinner'></div>
            </div>
        )
    }

  return (
      <div className>
          
          <div className='bg-richblack-800 box-content'>
              <div className='w-11/12 min-h-[260px] max-w-maxContent mx-auto flex flex-col justify-center gap-4 px-4 '>
                 <p className='text-md text-richblack-300'>
                    Home / Catalog / {" "}
                    <span className='text-yellow-25'>{catalogPageData?.selectedCategory?.name}</span>
                 </p>
                 <p className='text-3xl text-richblack-5'>{catalogPageData?.selectedCategory?.name}</p>
                 <p className='max-w-[870px] text-richblack-200'>{catalogPageData?.selectedCategory?.description}</p>
              </div>
          </div>


          
          <div className='w-11/12 max-w-maxContent mx-auto box-content px-4'>
          
            {/* section 1  */}
            <div className='w-full py-12'>
                
                <h2 className='text-4xl font-semibold text-richblack-5'>Courses to get you started</h2>
                
                <div className='text-sm my-4 flex border-b border-richblack-600'>
                    <p 
                     className={`px-4 py-2 cursor-pointer ${active === 1 ? "border-b-yellow-25 border-b text-yellow-25" : "text-richblack-50"}`}
                     onClick={() => setActive(1)}>
                       Most Popular
                     </p>
                    <p
                     className={`px-4 py-2 cursor-pointer ${active === 2 ? "border-b-yellow-25 border-b text-yellow-25" : "text-richblack-50"}`}
                     onClick={() => setActive(2)}>
                      New
                    </p>
                </div>

                <div>
                    <CourseSlider courses ={catalogPageData?.selectedCategory?.courses}/>
                </div>
            </div>

            {/* section 2  */}
            <div className='w-full py-12'>
                
                <h2 className='text-4xl font-semibold text-richblack-5'>Top courses in {catalogPageData?.differentCategory?.name}</h2>
                
                <div className='py-8'>
                    <CourseSlider courses={catalogPageData?.differentCategory?.courses}/>
                </div>
            </div>


            {/* section 3  */}
            <div className='w-full py-12'>
                
                <h2 className='text-4xl font-semibold text-richblack-5'>Frequently Bought</h2>

                <div className='py-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {
                            catalogPageData?.mostSellingCourses?.splice(0,4).map((course) => (
                                <CatalogCourseCard course={course} key={course._id} height={"h-[400px]"}/>
                            ))
                        }
                    </div>
                </div>
            </div>

          </div>
          
        {/* footer  */}
        <Footer/>
      </div>
  )
}

export default Catalog