import { createSlice } from '@reduxjs/toolkit';

const intialState = {
    posts: []
};

const postSlice = createSlice({
    name: 'post',
    initialState: intialState,
    reducers: {
        getPosts(state, action) {
            state.posts = action.payload
        },
    },
});

export default postSlice.reducer;

export function SetPosts(post) {
    return (dispatch, getState) => {
        dispatch(postSlice.actions.getPosts(post));
    };
}