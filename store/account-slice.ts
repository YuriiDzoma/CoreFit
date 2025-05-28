import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentId: null,
    isAuth: false,
    dark: true,
    language: 'eng',
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setCurrentUserId: (state, {payload}) => {
            state.currentId = payload;
        },
        setIsDarkTheme: (state, {payload}) => {
            state.dark = payload;
        },
        setLanguage: (state, {payload}) => {
            state.language = payload;
        },
    },
});

export const { setIsDarkTheme, setLanguage, setCurrentUserId } = accountSlice.actions;
export default accountSlice.reducer;
