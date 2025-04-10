import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    programs: [],
};

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setPrograms: (state, {payload}) => {
            state.programs = payload;
        },
    },
});

export const { setPrograms } = mainSlice.actions;
export default mainSlice.reducer;
