import React from 'react';
import LoginForm from './pages/auth/LoginForm';
import SignupForm from './pages/auth/signUpForm';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import TaskIndex from './pages/tasks/TaskIndex';
import AuthRoute from './components/AuthRoute';
import TaskDetail from './pages/tasks/TaskDetail';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <LoginForm /> },
    { path: '/register', element: <SignupForm /> },
    {
      path: '/',
      element: <AuthRoute />,
      children: [
          { path: 'index', element: <TaskIndex /> },
          { path: 'index/detail/:id', element: <TaskDetail /> },
      ],
    },
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
    MuiSelect:{      
      styleOverrides:{
        root:{
          minWidth: "9rem",
          color: "black",
          backgroundColor: "white",
          padding: "0.3rem",
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px", // Set the border thickness here
            borderColor: "black", // Optional: change border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "#1976d2", // Optional: change border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "#1976d2", // Optional: change border color when focused
          },
        },
    },

    }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthProvider>
          <BrowserRouter>
            <AppRoutes/>
          </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
