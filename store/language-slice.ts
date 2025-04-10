import {createSlice} from "@reduxjs/toolkit";
import React from "react";

const initialState = {
    language: 'english',
    text: {
        base: {
            login: 'Login',
            signUp: 'Sign up',
            profile: 'Profile',
            training: 'Training',
            users: 'Users',
            complexes: 'Complexes',
            Programs: 'Programs',
            Wiki: 'Wiki',
            authorization: 'Authorization',
            lblEmail: 'Your E-mail',
            lblPass: 'Your password',
            lblName: 'Your Name',
            plHolName: 'Name',
            plHolEmail: 'E-mail',
            plHolPass: 'Password',
            notHaveAcc: 'If you don\'t have an account',
            haveAcc: 'If you have an account',
        }
    }
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setText(state, {payload}) {
            state.text = payload;
        },
    }
})

export default languageSlice.reducer;

export const {
    setText,
} = languageSlice.actions;