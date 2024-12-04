import React, { useState } from "react";
import { Typography, Button, TextField, styled, Paper, Box, FormControlLabel, Checkbox } from "@mui/material";
import { Formik, Form, useField, FieldAttributes } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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
const CreateUser: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const location = useLocation();
    const currentUser = location.state?.user;
    const { access_token } = useAuth();

    const createUser = async (name: string, email: string, is_admin: number, password: string, password_confirmation: string) => {
        try {
          const requestData = {
            name,
            email,
            is_admin,
            password,
            password_confirmation,
          };
    
          await axios.post('http://laravel.test/api/users', requestData, {
            headers: {
                Authorization: `Bearer ${access_token}`,
              },
          });
    
        } catch (error) {
          throw error;
        }
      };

    return (
        <>
        <Box
        sx={{
            display: 'flex',
            margin:"auto",
            justifyContent: "center",
            alignItems: "center", 
        }}
        >
            <Paper elevation={10} sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: "30%",
                justifyContent: "center",
                alignItems: "center",
                padding: '16px',
                marginBottom: "20px"
            }}>
                <Typography variant="h2" sx={{
                    marginTop: '30px'
                }}>Create user</Typography>
                <Formik
                initialValues={{
                    name: "",
                    email: "",
                    admin: 0,
                    password: "",
                    passwordConfirm: "",
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                    .min(5, "Username is too short!")
                    .max(50, "Username is too Long!")
                    .required("Required"),
                    email: Yup.string()
                    .email("Invalid email")
                    .required("Required"),
                    admin: Yup.number()
                    .oneOf([0, 1], "Invalid value for admin")
                    .required("Required"),
                    password: Yup.string()
                    .min(8, "Password is too short - should be 8 chars minimum.")
                    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
                    .required("Required"),
                    passwordConfirm: Yup.string()
                    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
                    .required("Required"),
                })}
                onSubmit={(values) => {
                    const handleRegister = async () => {
                    try {
                        console.log(values);
                        await createUser(values.name, values.email, values.admin, values.password, values.passwordConfirm);
                        setErrorMessage(null);  
                        navigate("/index/users", { state: { currentUser } });
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
                {({ setFieldValue, values }) => (
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
                    <FormControlLabel
                        label="Admin"
                        control={
                        <Checkbox
                            name="admin"
                            checked={values.admin === 1}
                            onChange={(e) => {
                            setFieldValue("admin", e.target.checked ? 1 : 0);
                            }}
                        />
                        }
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
                        <Typography
                        color="error"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            marginBottom: "20px",
                            marginTop: "20px",
                        }}
                        >
                        {errorMessage}
                        </Typography>
                    )}
                    <Button variant="contained" type="submit">
                        Save
                    </Button>
                    </StyledForm>
                )}
                </Formik>
            </Paper>
        </Box>            
        </>
    );
};

export default CreateUser;
