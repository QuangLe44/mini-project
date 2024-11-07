import React, { useState } from "react";
import { Formik, Form, useField, FieldAttributes } from "formik";
import { Typography, Button, TextField, styled } from "@mui/material";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "./context/AuthContext";

const AboutPage: React.FC = () => {
  const { logout } = useAuth();
  const handleLogout = () =>{
    const authTokenA = localStorage.getItem('authToken');
    console.log('Auth token:', authTokenA);
    logout();
    const authTokenB = localStorage.getItem('authToken');
    if (authTokenB) {
      console.log('Auth token:', authTokenB);
    } else {
      console.log('Auth token not found');
    }
  }
  return (
    <>
    <Typography variant="h1">
        hello
    </Typography>
    <Button
      variant="contained" 
      color="primary"
      onClick={handleLogout}
    >
      logout
    </Button>
    </>
  );
};

export default AboutPage;
