import React, { useState } from "react";
import { Formik, Form, useField, useFormikContext, FieldAttributes } from "formik";
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
        <input className="text-input" {...field} {...props} />
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
  const handleLogin = async () => {
    try {
      console.log(email,password);
      setEmail("");
      setPassword("");
      // await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <>
      <h1>Login</h1>
      <h6>Not a user yet? <Link to="/signup">Sign up here</Link></h6>
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
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value)
              setFieldValue("email", e.target.value)
            }}
            placeholder=""
          />
          <MyTextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value)
              setFieldValue("password", e.target.value)
            }}
            placeholder=""
          />
          <br />
          <br />
          <button type="submit">Login</button>
        </Form>)}
      </Formik>
    </>
  );
};

export default LoginForm;
