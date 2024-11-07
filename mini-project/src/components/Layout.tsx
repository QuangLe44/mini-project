import React from 'react';
import { Box } from '@mui/material';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Box component="body" sx={{
            boxSizing: "border-box",
            backgroundColor: "gray",
            paddingTop: "5%",
            minHeight: "100vh"
      }}>
        <Box sx={{
          display: "flex",
          backgroundColor: "white",
          alignItems: "center",
          flexDirection: "column",
          margin: "auto",
          boxShadow: "0 0 10px black",
          padding: "0 30px 30px 30px",
          width: "fit-content",
          minHeight: "50vh",
          borderRadius: "30px",
        }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
