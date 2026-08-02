import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentId: null,
    isAuth: false,
    dark: true,
    language: 'eng',
    // Program Detail's I/II/III view-density tab, synced via
    // `profiles.program_view_density` — `2` until the user picks one.
    programViewDensity: 2,
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
        setProgramViewDensity: (state, {payload}) => {
            state.programViewDensity = payload;
        },
    },
});

export const { setIsDarkTheme, setLanguage, setCurrentUserId, setProgramViewDensity } = accountSlice.actions;
export default accountSlice.reducer;
