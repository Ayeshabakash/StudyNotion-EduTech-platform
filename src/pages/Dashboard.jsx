import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/core/Dashboard/Sidebar';

const Dashboard = () => {
    const {loading : authLoading} = useSelector( (state) => state.auth);
    const {loading : profileLoading} = useSelector( (state) => state.profile);

    if(authLoading || profileLoading)
    {
        return(
            <div className='spinner grid min-h-[calc(100vh-3.5rem)] place-items-center'></div>
        )
    }
  return (
    <div className='relative flex h-[calc(100vh-3.5rem)]'>
        <div className='hidden lg:block'>
           <Sidebar/>
        </div>

        <div className='h-[cal(100vh-3.5rem)] flex-1 overflow-auto w-full '>  
            
            <div className='w-11/12 max-w-[1000px] mx-auto py-10 text-white'>
                <Outlet/>
            </div>
        </div> 
    </div>
  )
}

export default Dashboard