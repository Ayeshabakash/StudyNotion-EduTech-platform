import React, { useState } from 'react'
import {sidebarLinks} from "../../../data/dashboard-links";
import { useDispatch, useSelector } from 'react-redux';
import SidebarLink from "./SidebarLink";
import { VscSignOut } from "react-icons/vsc"
import {logOut} from "../../../services/operations/authAPI";
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';

const Sidebar = () => {
    const {user} = useSelector( (state) => state.profile);
    const [modalData , setModalData] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const {loading : authLoading} = useSelector( (state) => state.auth);
    // const {loading : profileLoading} = useSelector( (state) => state.profile);

    // if(authLoading || profileLoading)
    // {
    //     return(
    //         <div className='spinner grid min-h-[calc(100vh-3.5rem)] place-items-center'></div>
    //     )
    // }
  return (
    <div className='min-w-[220px] h-[calc(100vh-3.5rem)] flex flex-col min-h-[100%] border-r-[1px] border-richblack-700 bg-richblack-800 py-10'>
        <div className='flex flex-col'>
            {
                sidebarLinks.map( (link) => {
                    if(link.type  && link.type !== user?.accountType)  return null
                    return(
                        <SidebarLink key={link.id} link={link} iconName={link.icon}/>
                    )
                })
            }
        </div>

        <div className='h-[1px] bg-richblack-700 w-10/12 mx-auto my-6'></div>

        <div className='flex flex-col'>
            <SidebarLink
                link={{ name: "Settings", path: "/dashboard/settings" }}
                iconName="VscSettingsGear"
            />

            <button
            onClick={() => setModalData({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler : () => dispatch(logOut(navigate)),
                btn2Handler : () => setModalData(null)
            })}
            className='px-8 py-2 text-richblack-300 font-medium text-sm'>
                <div className='flex items-center gap-2'>
                    <VscSignOut className='text-lg'/>
                    <span>Logout</span>
                </div>
            </button>
        </div>

        {modalData && <ConfirmationModal modalData={modalData}/>}
    </div>
  )
}

export default Sidebar