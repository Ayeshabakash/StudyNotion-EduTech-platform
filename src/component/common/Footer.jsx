import React from 'react'
import Logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link } from 'react-router-dom'
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";
import { FooterLink2 } from '../../data/footer-links';

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];
const Footer = () => {
  return (
    <div className='bg-richblack-800'>
        <div className='w-11/12 max-w-maxContent mx-auto flex flex-col text-richblack-400 relative py-14'>

            {/* upper footer  */}
            <div className='w-full border-b flex flex-col lg:flex-row flex-wrap pb-5 border-richblack-700 '>

                {/* section1  */}
                <div className='lg:w-[50%] flex flex-wrap lg:gap-0 gap-5 justify-between lg:border-r border-richblack-700'>

                    <div className='lg:w-[30%] flex flex-col gap-3'>
                        <img src={Logo}
                            alt=""
                            className='object-contain'
                        />

                        <h2 className='text-richblack-25 font-semibold text-[16px]'>
                            Company
                        </h2>

                        <div className='flex flex-col gap-2'>
                            {
                                ["About" , "Careers" , "Affiliates"].map((element, index) => {
                                    return(
                                        <div
                                        key={index}
                                        className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                                        
                                            <Link to={element.toLowerCase()}>
                                            {element}
                                            </Link>
                                            
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div className='flex gap-3 text-lg'> 
                            <FaFacebook/>
                            <FaGoogle/>
                            <FaTwitter/>
                            <FaYoutube/>
                        </div>
                    </div>

                    
                    <div className='lg:w-[30%] w-[48%] '>
                        {/* Resources */}
                        <div>
                            <p className='text-richblack-50 font-semibold text-[16px]'>
                                Resources
                            </p>

                            <div className='flex flex-col gap-2 mt-2'>
                                {
                                    Resources.map((element , index) => {
                                        return(
                                            <div
                                            key={index}
                                            className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>

                                            <Link to={element.toLowerCase()}>
                                                {element}
                                            </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* Support */}
                        <div className='mt-7'>

                            <p className='text-richblack-50 font-semibold text-[16px]'>Support</p>

                            <div className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2'>
                                <Link to={"/help-center"}>Help Center</Link>
                            </div>
                        </div>          

                    </div>


                    <div className='lg:w-[30%] w-[48%] '>
                        {/* plans  */}
                        <div>
                            <p className='text-richblack-50 font-semibold text-[16px]'>Plans</p>

                            <div className='flex flex-col gap-2 mt-2'>
                                {
                                    Plans.map( (element , index) => {
                                        return(
                                            <div
                                            key={index}
                                            className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                                                <Link to={element.split(" ").join("-").toLowerCase()}>{element}</Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* Community */}
                        <div className='mt-7'>
                            
                            <p className='text-richblack-50 font-semibold text-[16px]'>Community</p>

                            <div className='flex flex-col gap-2 mt-2'>
                                {
                                    Community.map( (element ,  index) => {
                                        return(
                                            <div
                                            key={index}
                                            className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                                                <Link to={element.toLowerCase()}>{element}</Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                </div>

                {/* section 2  */}
                <div className='lg:w-[50%] flex flex-wrap gap-5 lg:gap-0 justify-between lg:mt-0 mt-5 lg:pl-5 '>
                    {
                        FooterLink2.map( (heading, index) => {
                            return(
                                <div
                                key={index}
                                className='lg:w-[30%] w-[48%] '>
                                     <h1 className="text-richblack-50 font-semibold text-[16px]">
                                        {heading.title}
                                     </h1>

                                    <div className='flex flex-col gap-2 mt-2'>
                                        {
                                            heading.links.map((link, i) => {
                                                return(
                                                    <div
                                                    key={i}
                                                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                                                        <Link to={link.link}>
                                                            {link.title}
                                                        </Link>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>

               

            </div>

            {/* bottom footer  */}
            <div className='flex justify-between text-richblack-400 mt-14 lg:flex-row flex-col items-center gap-y-3'>
                <div className='flex gap-3 lg:items-start items-center flex-row'>
                    {
                        BottomFooter.map( (element , index) => {
                            return(
                                <div 
                                key={index}
                                className={`text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 px-3
                                            ${index === BottomFooter.length - 1 ? "" : "border-r border-richblack-700"}`}>
                                    <Link to={element.split(" ").join("-").toLowerCase()}>
                                        {element}
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='text-[14px]'>
                  Made with ❤️ By Nilesh © 2024 Studynotion
                </div>
            </div>

        </div>
    </div>
  )
}

export default Footer