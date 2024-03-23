import { createSlice } from '@reduxjs/toolkit';

const intialState = {
    posts:{},
};

const postSlice = createSlice({
   name: 'posts',
    initialState:intialState,
   reducers: {
       getPosts(state, action){
           state.posts = action.payload
       },
   },
});

export default postSlice.reducer;