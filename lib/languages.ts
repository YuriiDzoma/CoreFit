export const getLanguages = async (value: string) => {
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
            lblLastName: 'Ваша фамилия',
            plHolName: 'Имя',
            plHolLastName: 'Фамилия',
            plHolEmail: 'E-mail',
            plHolPass: 'Пароль',
            notHaveAcc: 'Если у вас нет учетной записи',
            haveAcc: 'Если у вас есть аккаунт',
            allUsers: 'Все пользователи',
            edit: 'Редактировать',
            save: 'Сохранить',
        },
        settings: {
            language: 'Язык',
            profile: 'Профиль',
            english: "Английский",
            russian: "Руский",
            ukrainian: "Украинский",
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
            lblLastName: 'Ваше призвіще',
            plHolName: 'Ім\'я',
            plHolLastName: 'Призвіще',
            plHolEmail: 'E-mail',
            plHolPass: 'Пароль',
            notHaveAcc: 'Якщо у вас немає облікового запису',
            haveAcc: 'Якщо у вас є обліковий запис',
            allUsers: 'Всі користувачі',
            edit: 'Редагувати',
            save: 'Зберегти',
        },
        settings: {
            language: 'Мова',
            profile: 'Профіль',
            english: "Англійська",
            russian: "Російська",
            ukrainian: "Українська",
        }
    };

    switch (value) {
        case 'eng' : return eng;
        case 'rus' : return rus;
        case 'ukr' : return ua;
    }
}