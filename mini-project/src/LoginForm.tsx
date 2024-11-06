import React, { useState } from "react";
import { Formik, Form, useField, FieldAttributes } from "formik";
import { Typography, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import "./signInStyle.css";
import "./customstyle.css";
import { useAuth } from "./context/AuthContext";

interface MyTextInputProps extends FieldAttributes<any> {
    label: string;
    name: string;
  }

const MyTextInput: React.FC<MyTextInputProps> = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
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
const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (values: {email: string, password: string }, { resetForm }: any) => {
    try {
        console.log(email,password);
        // await login(email, password);      
        resetForm();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <>
      <Typography variant="h2" sx={{
                marginTop: '30px'
            }}>Login</Typography>
      <Typography variant="h6"  sx={{
                margin: '20px'
            }}>Not a user yet? <Link to="/register">Sign up here</Link></Typography>
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
        onSubmit={handleLogin}
      >
        {({setFieldValue}) => (<Form>
          <MyTextInput
            label="Email"
            name="email"
            type="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue("email", e.target.value)              
              setEmail(e.target.value)
            }}
            placeholder=""
          />
          <MyTextInput
            label="Password"
            name="password"
            type="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue("password", e.target.value)              
              setPassword(e.target.value)
            }}
            placeholder=""
          />
          <br />
          <br />
          <Button variant="contained" type="submit" sx={{
            width: "100%",
          }}>Login</Button>
        </Form>)}
      </Formik>
    </>
  );
};

export default LoginForm;
