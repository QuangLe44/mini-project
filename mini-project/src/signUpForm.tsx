import React, { useEffect, useState } from "react";
import { Formik, Form, useField, useFormikContext, FieldAttributes } from "formik";
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
        <input className="text-input" {...field} {...props} />
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
    const handleRegister = async () => {
        try {
        //   await register(name, email, password);
        console.log(name,email,password);
        setName("");
        setEmail("");
        setPassword("");
        } catch (error) {
          console.error('Registration failed:', error);
          // Show error message
        }
      };
  return (
    <>
      <h1>Sign up</h1>
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
        {({setFieldValue}) =>  (<Form>
          <MyTextInput
            label="Username"
            name="name"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value)
              setFieldValue("name", e.target.value)
            }}
            placeholder=""
          />
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
          <MyTextInput
            label="Confirm password"
            name="passwordConfirm"
            type="password"
            placeholder=""
          />
          <br />

          <button type="submit">Sign up</button>
        </Form>)}
      </Formik>
    </>
  );
};

export default SignupForm;
