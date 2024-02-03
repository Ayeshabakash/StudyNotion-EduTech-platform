import React from 'react'
import { useSelector } from 'react-redux'
import CartCourses from './CartCourses';
import CartTotalAmount from './CartTotalAmount';

const Cart = () => {
    const {totalItems} = useSelector( (state) => state.cart);
  return (
    <div >
        <h2 className='text-3xl font-medium text-richblack-5'>Cart</h2>
        <p className='mt-14 border-b-[1px] border-richblack-400 pb-2 font-semibold text-richblack-400'>{totalItems} Courses in Cart</p>
        {
            totalItems > 0 ? (
                <div className='mt-3 flex lg:flex-row flex-col items-start gap-x-8 '>
                    <CartCourses/>
                    <CartTotalAmount/>
                </div>
            ) : (
                <p className='mt-14 text-center text-3xl text-richblack-100'>Your cart is empty</p>
            )
        }
    </div>
  )
}

export default Cart