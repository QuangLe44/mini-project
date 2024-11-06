import React, { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import { Formik, Form, useField, FieldAttributes } from "formik";
import * as Yup from "yup";
import "./signInStyle.css";
import "./customstyle.css";
import { useAuth } from "./context/AuthContext";

interface MyTextInputProps extends FieldAttributes<any> {
    label: string;
    name: string;
}

const MyTextInput: React.FC<MyTextInputProps> = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <TextField variant="filled" className="text-input" {...field} {...props} sx={{
                '& .MuiFilledInput-underline:before': {
                    borderBottom: 'none',
                },
                '& .MuiFilledInput-underline:after': {
                    borderBottom: 'none',
                },
                '& .MuiFilledInput-input': {
                    paddingTop: '12px',
                },
            }}/>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

// And now we can use these
const SignupForm: React.FC = () => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (values: { name: string, email: string, password: string }, { resetForm }: any) => {
        try {
            console.log(name,email,password);
            // await register(values.name, values.email, values.password);
            resetForm();
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <>
            <Typography variant="h2" sx={{
                marginTop: '30px'
            }}>Sign up</Typography>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    passwordConfirm: ""
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .min(5, "Username is too short!")
                        .max(50, "Username is too Long!")
                        .required("Required"),
                    email: Yup.string()
                        .email("Invalid email")
                        .required("Required"),
                    password: Yup.string()
                        .min(8, "Password is too short - should be 8 chars minimum.")
                        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                        .required("Required"),
                    passwordConfirm: Yup.string()
                        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
                        .required("Required")
                })}
                onSubmit={handleRegister}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <MyTextInput
                            label="Username"
                            name="name"
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldValue("name", e.target.value);
                                setName(e.target.value);
                            }}
                            placeholder=""
                        />
                        <MyTextInput
                            label="Email"
                            name="email"
                            type="email"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldValue("email", e.target.value);
                                setEmail(e.target.value);
                            }}
                            placeholder=""
                        />
                        <MyTextInput
                            label="Password"
                            name="password"
                            type="password"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldValue("password", e.target.value);
                                setPassword(e.target.value);
                            }}
                            placeholder=""
                        />
                        <MyTextInput
                            label="Confirm password"
                            name="passwordConfirm"
                            type="password"
                            placeholder=""
                        />
                        <br />
                        <br />

                        <Button variant="contained" type="submit" sx={{
                            width: "100%"
                        }}>Sign up</Button>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default SignupForm;
