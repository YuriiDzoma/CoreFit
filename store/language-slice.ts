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
        },
        training: {
            programName: 'Name of program',
            plHolProgramName: 'Enter the program name',
            errorName: 'The name must contain at least 3 letters',
            next: 'Next',
            back: 'Back',
            name: 'Name',
            type: 'Type',
            difficulty: 'Difficulty',
            days: 'Days',
            exercises: 'Exercises',
            aerobicInfo: 'Aerobic - fitness, cardio training',
            anaerobicInfo: 'Anaerobic - strength training',
            crossfitInfo: 'CrossFit - mixed training, aerobic + anaerobic',
            selectType: 'Select Program Type',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
            expert: 'Expert',
            professional: 'Professional',
            selectDifficulty: 'Select Difficulty Level',
            day: 'day',
            changeDay: 'How many training days per week?',
            generalTraining: 'day general training',
            splitTraining: 'day split workout',
            create: 'Create',
            editExercises: 'Edit Exercises',
            addExercises: 'Add exercises',
            cancel: 'Cancel',
            confirm: 'Confirm',
            createProgram: 'Create new program',
            myPrograms: 'My programs',
            secondaryMuscles: 'Secondary muscles',
            compound: 'Compound',
            isolation: 'Isolation',
            none: 'None',
        },
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