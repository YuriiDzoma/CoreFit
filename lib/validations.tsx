export const emailOptions = {
    required: "Email is required",
    pattern: {
        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
        message: "Email is not valid"
    }
}

export const phoneOptions = {
    required: "Phone number is required",
    minLength: {
        value: 6,
        message: "Phone should be at-least 6 characters"
    },
    pattern: {
        value: /^\+?[0-9]{10,14}$/,
        message: "Invalid phone number format"
    }
}

export const passwordOptions = {
    required: "Password is required",
    minLength: {
        value: 10,
        message: "Password must be at least 10 characters long with at least one capital letter"
    }
}

export const firstNameOptions = {
    required: "First name",
    minLength: {
        value: 3,
        message: "First name should be at-least 3 characters"
    },
    pattern: {
        value: /^[A-Za-z]+$/i,
        message: "First name is not valid"
    }
}

export const lastNameOptions = {
    required: "Last name",
    minLength: {
        value: 3,
        message: "Last name should be at-least 3 characters"
    },
    pattern: {
        value: /^[A-Za-z]+$/i,
        message: "Last name is not valid"
    }
}

export const countryOptions = {
    minLength: {
        value: 3,
        message: "Country should be at-least 6 characters"
    },
}