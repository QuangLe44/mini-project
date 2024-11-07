import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './signUpForm';
import Layout from './components/Layout';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const AppRoutes = () => {
  // Define routes using useRoutes
  const routes = useRoutes([
    { path: '/', element: <LoginForm /> },
    { path: '/register', element: <SignupForm /> },
  ]);

  return routes;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes/>
          </BrowserRouter>
        </AuthProvider>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
