import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    language: 'eng',
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
            lblName: 'Your first name',
            lblLastName: 'Your last name',
            plHolName: 'Name',
            plHolLastName: 'Last name',
            plHolEmail: 'E-mail',
            plHolPass: 'Password',
            notHaveAcc: 'If you don\'t have an account',
            haveAcc: 'If you have an account',
            allUsers: 'All users',
            edit: 'Edit',
            save: 'Save',
        },
        settings: {
            language: 'Language',
            profile: 'Profile',
            english: "English",
            russian: "Russian",
            ukrainian: "Ukrainian",
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