import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import SearchAppBar from '../components/SearchAppBar';

const AuthLayout: React.FC = () => {
    return (
        <Box sx={{
            boxSizing: "border-box",
            backgroundColor: "white",
            maxWidth: "100vw",
            minHeight: "100vh",
            overflow: "auto"
          }}>
            <SearchAppBar/>
                <Outlet />
        </Box>

    );
};

export default AuthLayout;
