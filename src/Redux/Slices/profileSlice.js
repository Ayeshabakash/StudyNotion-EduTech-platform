import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user  : localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,//we have check first if the user is present in the local storage otherwise ,there will be an issue when we reload the page the user will get null  and at point we are logged in but user will not present in the state 
    loading: false,
 }

const profileSlice = createSlice({
    name : "profile",
    initialState : initialState,
    reducers : {
        setUser(state , value){
            state.user = value.payload;
        },
        setLoading(state , value) {
            state.loading = value.payload;
        }
    },
})

export const {setUser , setLoading} = profileSlice.actions;
export default profileSlice.reducer;