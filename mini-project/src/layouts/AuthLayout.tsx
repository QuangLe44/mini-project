import { Box } from '@mui/material';
import React, { useEffect, useState} from 'react';
import { Outlet } from 'react-router-dom';
import SearchAppBar from '../components/SearchAppBar';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import DynamicBreadcrumbs from '../components/BreadCrumbs';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  }

const AuthLayout: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const { access_token } = useAuth();

    const getUserInfo = async () => {
        try {
          const response = await axios.post<User>('http://laravel.test/api/me', {}, {
            headers: {
              Authorization: 'Bearer ' + access_token,
            },
          });
      
          const userData = response.data;
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

    useEffect(() => {
      const fetchUserInfo = async () => {
        await getUserInfo();
      };
  
      fetchUserInfo();
    }, []);

        return (
            <Box sx={{
                boxSizing: "border-box",
                backgroundColor: "white",
                maxWidth: "100vw",
                minHeight: "100vh",
                overflow: "auto"
            }}>
                <SearchAppBar user={user}/>
                <DynamicBreadcrumbs user={user}/>
                    <Outlet />
            </Box>

        );
};

export default AuthLayout;
