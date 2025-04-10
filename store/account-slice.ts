import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuth: false,
    isDarkTheme: true,
    language: 'eng',
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setIsDarkTheme: (state, {payload}) => {
            state.isDarkTheme = payload;
        },
        setLanguage: (state, {payload}) => {
            state.language = payload;
        },
    },
});

export const { setIsDarkTheme, setLanguage } = accountSlice.actions;
export default accountSlice.reducer;
