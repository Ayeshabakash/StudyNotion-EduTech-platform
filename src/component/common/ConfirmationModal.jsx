import React from 'react'
import ActionBtn from './ActionBtn'

const ConfirmationModal = ({modalData}) => {
  return (
    <div className='flex justify-center items-center bg-white bg-opacity-10 backdrop-blur-sm fixed inset-0 !mt-0  overflow-auto   z-[1000]  '>
       
        <div className='w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6'>
           
            <h2 className='text-2xl font-semibold text-richblack-5'>{modalData.text1}</h2>

            <p className='mt-3 leading-6 text-richblack-200'>{modalData.text2}</p>

            <div className='flex mt-6 items-center gap-x-2'>

                <ActionBtn
                    onclick={modalData?.btn1Handler}
                    text = {modalData?.btn1Text}
                />

                <button className='cursor-pointer bg-richblack-200 py-[8px] px-[20px] rounded-md font-semiboldon text-richblack-900'
                onClick={modalData?.btn2Handler}
                >
                    {modalData?.btn2Text}
                </button>

            </div>
        </div>
    </div>
    
  )
}

export default ConfirmationModal