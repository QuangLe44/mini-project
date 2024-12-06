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
import UserIndex from './pages/user/UserIndex';
import UnauthorizedPage from './pages/auth/Unauthorized';
import CreateTask from './pages/tasks/CreateTask';
import UserDetail from './pages/user/UserDetail';
import CreateUser from './pages/user/CreateUser';

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <LoginForm /> },
    { path: '/register', element: <SignupForm /> },
    {
      path: '/',
      element: <AuthRoute />,
      children: [
          { path: 'index', element: <TaskIndex /> },
          { path: 'index/users', element: <UserIndex /> },
          { path: 'index/:id', element: <TaskDetail /> },
          { path: 'index/unauthorized', element: <UnauthorizedPage/> },
          { path: 'index/new', element: <CreateTask/> },
          { path: 'index/users/:id', element: <UserDetail/> },
          { path: 'index/users/new', element: <CreateUser/> },
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
            borderWidth: "2px",
            borderColor: "black",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "#1976d2",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
            borderColor: "#1976d2",
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
