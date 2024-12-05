import React, { useState } from "react";
import { Formik, Form, useField, FieldAttributes } from "formik";
import { Typography, Button, TextField, styled, Link} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";
import { StyledBody, StyledBox } from "../../layouts/Layout";

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
const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <>
    <StyledBody>
      <StyledBox>
        <Typography variant="h2" sx={{
                  marginTop: "30px"
              }}>Login</Typography>
        <Typography variant="h6"  sx={{
                  margin: "20px"
              }}>Not a user yet? <Link href="/register">Sign up here</Link></Typography>
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email")
              .required("Required"),
            password: Yup.string()
              .required("Required")
          })}
          onSubmit={(values, { resetForm }) => {
            const handleLogin = async () => {
              try {
                  await login(values.email, values.password);
                  setErrorMessage(null);
                  navigate("/index");
              } catch (error) {
                if (error instanceof Error) {
                  resetForm();
                  setErrorMessage("Incorrect email or password");
                } else {
                  setErrorMessage("An unexpected error occurred.");
                }
                console.error("Login failed:", error);
              }
            };
            handleLogin();
          }}
        >
          {({setFieldValue}) => (<StyledForm>
            <MyTextInput
              label="Email"
              name="email"
              type="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("email", e.target.value)              
                // setEmail(e.target.value)
              }}
              placeholder=""
            />
            <MyTextInput
              label="Password"
              name="password"
              type="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("password", e.target.value)              
                // setPassword(e.target.value)
              }}
              placeholder=""
            />
            {errorMessage ? (
              <Typography color="error" sx={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginBottom: "20px",
                marginTop: "20px",
              }}>
                {errorMessage}
              </Typography>
            ) : null}
            <Button variant="contained" type="submit">Login</Button>
          </StyledForm>)}
        </Formik>
      </StyledBox>
    </StyledBody>
    </>
  );
};

export default LoginForm;
