import React from "react";

export const getLanguages = async (value) => {
    const eng = {
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
    };

    const rus = {
        base: {
            login: 'Войти',
            signUp: 'Реестрация',
            profile: 'Профиль',
            training: 'Тренировка',
            users: 'Пользователи',
            complexes: 'Комлпексы',
            Programs: 'Програмы',
            Wiki: 'Wiki',
            authorization: 'Авторизация',
            lblEmail: 'Ваш E-mail',
            lblPass: 'Ваш пароль',
            lblName: 'Ваше имя',
            plHolName: 'Имя',
            plHolEmail: 'E-mail',
            plHolPass: 'Пароль',
            notHaveAcc: 'Если у вас нет учетной записи',
            haveAcc: 'Если у вас есть аккаунт',

        }
    };

    const ua = {
        base: {
            login: 'Вхід',
            signUp: 'Реєстрація',
            profile: 'Профіль',
            training: 'Тренування',
            users: 'Користувачі',
            complexes: 'Комплекси',
            Programs: 'Програми',
            Wiki: 'Wiki',
            authorization: 'Авторизація',
            lblEmail: 'Ваш E-mail',
            lblPass: 'Ваш пароль',
            lblName: 'Ваше Ім\'я',
            plHolName: 'Ім\'я',
            plHolEmail: 'E-mail',
            plHolPass: 'Пароль',
            notHaveAcc: 'Якщо у вас немає облікового запису',
            haveAcc: 'Якщо у вас є обліковий запис',

        }
    };

    switch (value) {
        case 'english' : return eng;
        case 'russian' : return rus;
        case 'ukrainian' : return ua;
    }
}