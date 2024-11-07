import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './signUpForm';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AboutPage from './about';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <LoginForm /> },
    { path: '/register', element: <SignupForm /> },
    { path: '/about', element: <AboutPage /> },
  ]);
  return routes;
};

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
            <AppRoutes/>
          </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
