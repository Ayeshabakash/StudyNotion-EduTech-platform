import React from 'react'

const Stats = [
    { count: "5K", label: "Active Students" },
    { count: "10+", label: "Mentors" },
    { count: "200+", label: "Courses" },
    { count: "50+", label: "Awards" },
];

const StatsComponent = () => {
  return (
    <div className='bg-richblack-700'>
        <div className='w-11/12 max-w-maxContent mx-auto'>
            <div className='grid grid-cols-2 md:grid-cols-4 text-center'>
                {
                    Stats.map( (element , index) => (
                        <div className='flex flex-col py-10 items-center' key={index}>
                            <h2 className='text-[30px] font-bold text-richblack-5'>{element.count}</h2>
                            <p className="font-semibold text-[16px] text-richblack-500">{element.label}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  )
}

export default StatsComponent