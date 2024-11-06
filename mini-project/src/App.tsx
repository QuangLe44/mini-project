import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './signUpForm';
import Layout from './components/Layout';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const AppRoutes = () => {
  // Define routes using useRoutes
  const routes = useRoutes([
    { path: '/', element: <LoginForm /> },
    { path: '/signup', element: <SignupForm /> },
  ]);

  return routes;
};

const App: React.FC = () => {
  return (
    
      <Layout>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes/>
          </BrowserRouter>
        </AuthProvider>
      </Layout>
  );
}

export default App;
