'use client'
import React from "react";
import {useForm} from "react-hook-form";
import InputBox from "../../components/inputBox/inputBox";
import {emailOptions, passwordOptions} from "../../settings/validations";
import Link from "next/link";


const Login = () => {
    // const dispatch = useDispatch();
    type LoginForm = {
        email: string;
        password: string;
    };

    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            console.log(data)
            // const response = await login(data.email, data.password);
            // if (response?.success) {
            //     dispatch(setEmail(data.email));
            //     navigate("/");
            // } else if (response?.errors?.[0]?.code === "authentication_failed") {
            //     setError("All");
            // }
        } finally {
            console.log('success')
        }
    };

    return (
        <form className={'form'} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={'title'}>Authorization</h2>
            <InputBox
                errors={errors}
                name="email"
                type="text"
                placeholder="E-mail"
                label="Your E-mail"
                options={{
                    ...register("email", {
                        ...emailOptions,
                        onChange: () => clearErrors(),
                    }),
                }}
            />
            <InputBox
                errors={errors}
                name="password"
                type="password"
                placeholder="Password"
                label="Your password"
                options={{
                    ...register("password", {
                        ...passwordOptions,
                        onChange: () => clearErrors(),
                    }),
                }}
            />
            <button type={"submit"} className={`submit`}>
                <span>Login</span>
            </button>
            <div className={'toSign'}>
                <p>If you don't have an account</p>
                <Link href={'/signin'}>Sign In</Link>
            </div>
        </form>
    )
}

export default Login;