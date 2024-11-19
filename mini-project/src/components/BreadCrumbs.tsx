import * as React from 'react';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom'; // Import from react-router-dom
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

export default function DynamicBreadcrumbs() {
  const location = useLocation(); // Get the current location
  const pathnames = location.pathname.split('/').filter((x) => x);
  const navigate = useNavigate();

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

    return index === pathnames.length - 1 ? (
      <Typography key={to}  sx={{ color: 'text.primary', fontSize: '1.2rem' }}>
        {capitalize(value)} 
      </Typography>
    ) : (
      <Link
        underline="hover"
        key={to}
        color="inherit"
        component={RouterLink}
        to={to}
        onClick={() => navigate(to)}
        sx={{ fontSize: '1.2rem' }}
      >
        {capitalize(value)} 
      </Link>
    );
  });

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{
        margin: "2rem 0 1rem 3rem"
    }}>
      {breadcrumbs}
    </Breadcrumbs>
  );
}
