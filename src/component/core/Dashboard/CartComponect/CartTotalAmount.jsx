import React from 'react'
import {useDispatch, useSelector } from 'react-redux'
import ActionBtn from '../../../common/ActionBtn';
import { buyCourse } from '../../../../services/operations/paymentAPI';
import { useNavigate } from 'react-router-dom';

const CartTotalAmount = () => {
    const {totalPrice, cart} = useSelector( (state) => state.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);

    const buyCourseHandler = () => {
       const courses = cart.map((course) => course._id);

       if(token){
        buyCourse(token , courses , user , navigate , dispatch )
       }
    }

  return (
    <div className='min-w-[280px] border border-richblack-700 bg-richblack-800 p-6 rounded-md mt-6'>
        <p className='mb-1 text-sm font-medium text-richblack-300'>Total :</p>
        <p className='mb-6 text-3xl font-medium text-yellow-100'>₹ {totalPrice}</p>
        <ActionBtn
            text={"Buy Now"}
            onclick={buyCourseHandler}
            customClasses={"w-full justify-center"}
        />
    </div>
  )
}

export default CartTotalAmount