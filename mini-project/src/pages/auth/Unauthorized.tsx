import React from "react";
import { Typography, Box} from "@mui/material";

const UnauthorizedPage: React.FC = () => {
  return (
    <>
    <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center', 
        paddingTop:"10rem",
        }}>
        <Typography variant='h2'>You do not have access to view this page.</Typography>
    </Box>
    </>
  );
};

export default UnauthorizedPage;