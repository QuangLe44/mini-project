import React from 'react';
import { Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';

const AuthRoute: React.FC = () => {
    const { authenticated } = useAuth();

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return <AuthLayout/>
};

export default AuthRoute;
