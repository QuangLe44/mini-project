import React, { useState } from "react";
import { Typography, Button, TextField, styled } from "@mui/material";
import { Formik, Form, useField, FieldAttributes } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { StyledBody, StyledBox } from "../../layouts/Layout";
import { useNavigate } from "react-router-dom";

const StyledForm = styled(Form)({
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  });

interface MyTextInputProps extends FieldAttributes<any> {
    label: string;
    name: string;
}

const MyTextInput: React.FC<MyTextInputProps> = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <Typography component="label" htmlFor={props.id || props.name} sx={{
                fontWeight: 'bold',
            }}>{label}</Typography>
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
                <Typography variant="body1" color="error">{meta.error}</Typography>
            ) : null}
        </>
    );
};

// And now we can use these
const SignupForm: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <>
        <StyledBody>
            <StyledBox>
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
                    onSubmit={(values) => {
                        const handleRegister = async () => {
                            try {
                                await register(values.name, values.email, values.password, values.passwordConfirm);
                                setErrorMessage(null);  
                                navigate("/");
                            } catch (error) {
                                if (error instanceof Error) {
                                    setErrorMessage("The email has already been taken.");
                                  } else {
                                    setErrorMessage("An unexpected error occurred.");
                                  }
                                  console.error("Sign up failed:", error);
                            }
                        };
                        handleRegister();
                    }}
                >
                    {({ setFieldValue }) => (
                        <StyledForm>
                            <MyTextInput
                                label="Username"
                                name="name"
                                type="text"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("name", e.target.value);
                                }}
                                placeholder=""
                            />
                            <MyTextInput
                                label="Email"
                                name="email"
                                type="email"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("email", e.target.value);
                                }}
                                placeholder=""
                            />
                            <MyTextInput
                                label="Password"
                                name="password"
                                type="password"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("password", e.target.value);
                                }}
                                placeholder=""
                            />
                            <MyTextInput
                                label="Confirm password"
                                name="passwordConfirm"
                                type="password"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("passwordConfirm", e.target.value);
                                }}
                                placeholder=""
                            />
                            {errorMessage && (
                            <Typography color="error" sx={{
                                fontWeight: 'bold',
                                fontSize: "1.2rem",
                                marginBottom: "20px",
                                marginTop: "20px",
                            }}>
                                {errorMessage}
                            </Typography>
                            )}
                            <Button variant="contained" type="submit">Sign up</Button>
                        </StyledForm>
                    )}
                </Formik>
            </StyledBox>
        </StyledBody>            
        </>
    );
};

export default SignupForm;
