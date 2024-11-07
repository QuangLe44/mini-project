import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './signUpForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AboutPage from './about';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "400px",
        },
      },
    },
    MuiButton: {
      styleOverrides:{
        root:{
          marginTop: "2rem",
          marginBottom: "2rem",
          width: "100%"
        },
      },
    },  
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
          <BrowserRouter>
              <Routes>
                <Route>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<SignupForm />} />
                </Route>
                <Route path="/about" element={<AboutPage />} />  
              </Routes>       
          </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
