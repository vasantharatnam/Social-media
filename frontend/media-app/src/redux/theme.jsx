import {createSlice} from "@reduxjs/toolkit";

const intialState  = {
    theme:JSON.parse(window?.localStorage.getItem('theme'))??'dark',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState: intialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload
            window.localStorage.setItem('theme', JSON.stringify(action.payload))
        },
    }
})

export default themeSlice.reducer;

export  function setTheme(value){
    return (dispatch) => {dispatch(themeSlice.actions.setTheme(value))};
}