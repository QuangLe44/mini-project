import React from 'react';
import { Box } from '@mui/material';
import "./LayoutStyle.css"


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Box maxWidth="lg">
        {children}
      </Box>
    </div>
  );
};

export default Layout;
