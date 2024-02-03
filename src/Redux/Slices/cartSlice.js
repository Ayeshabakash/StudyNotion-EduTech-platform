import { createSlice } from "@reduxjs/toolkit";
import { json } from "react-router-dom";
import toast from "react-hot-toast";

const initialState = {
    totalItems : localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0,
    cart : localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    totalPrice : localStorage.getItem("totalPrice")  ? JSON.parse(localStorage.getItem("totalPrice")) : 0,
 }

const cartSlice = createSlice({
    name : "cart",
    initialState : initialState,
    reducers : {
        setTotalItems(state , value){
            state.totalItems = value.payload;
        },

        // add to cart
        addToCart : (state, action)  => {
            const course = action.payload

            // check if course is already present in the cart or not 
            const index = state.cart.findIndex( (item) => item._id === course._id)

            if(index >= 0)  //course found
            {
                toast.error("Course is already present in cart");
                return;
            }


            // we can add the course to the cart 
            state.cart.push(course);
            // update the totalItems and totalprice 
            state.totalItems++;
            state.totalPrice += course.price;

            // now update the localStorage
            localStorage.setItem("cart" , JSON.stringify(state.cart));
            localStorage.setItem("totalItems" , JSON.stringify(state.totalItems));
            localStorage.setItem("totalPrice" , JSON.stringify(state.totalPrice));

            // show toast 
            toast.success("Course added to cart");
        },

        // remove from cart 
        removeFromCart : (state , action) => {
            const courseId = action.payload;

            // check if course is present in the cart or not 
            const index = state.cart.findIndex( (item) => item._id === courseId);

            if(index >= 0) //course found in the cart
            {

                //first set totalItems and totalPrice
                state.totalItems--;
                state.totalPrice -= state.cart[index].price;

                state.cart.splice(index , 1);  //remove the course from cart


                // now update the localStorage
                localStorage.setItem("cart", JSON.stringify(state.cart))
                localStorage.setItem("totalPrice", JSON.stringify(state.totalPrice))
                localStorage.setItem("totalItems", JSON.stringify(state.totalItems))


                // show the toast 
                toast.success("Course removed from cart");
            }
        },

        // reset cart items 
        resetCart : (state) => {
            // re - initialize all the value 
            state.cart = [];
            state.totalItems = 0;
            state.totalPrice = 0;

            // now update the localStorage 
            localStorage.removeItem("cart");
            localStorage.removeItem("totalPrice");
            localStorage.removeItem("totalItems");
        }
    },
})

export const {addToCart , removeFromCart , resetCart} = cartSlice.actions;
export default cartSlice.reducer;