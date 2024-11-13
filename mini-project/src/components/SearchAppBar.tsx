import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { Button, Divider } from '@mui/material';

export default function SearchAppBar() {
  const { getUserInfo, user } = useAuth();
  const { logout } = useAuth();
  const [loading, setLoading] = React.useState(true);  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
  // const [anchorE3, setAnchorE3] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const isUserOpen = Boolean(userAnchor);

  const handleLogout = () =>{
      logout();
  };

  React.useEffect(() => {
    if (!user) {
      getUserInfo().finally(
        () => setLoading(false)
      );
    } else {
      setLoading(false); 
    }
  }, [user, getUserInfo]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserTabOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setUserAnchor(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>{user?.name}</MenuItem>
      <Divider sx={{ border: "1px solid black" }} />
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const userId = 'primary-search-user';
  const renderUserTab = (
    <Menu
      anchorEl={userAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      id={userId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isUserOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>User list</MenuItem>
      <MenuItem>New user</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ 
        maxWidth: "100%"
     }}>
      <AppBar position="static">
        <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Task
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!loading && user?.is_admin && (
          <Box sx={{ display: 'flex', paddingRight: '2rem' }}>
          <Button sx={{
            margin: "0"
          }}
            variant="outlined"
            size="large"
            aria-label="user tab"
            aria-controls={userId}
            aria-haspopup="true"
            onClick={handleUserTabOpen}
            color="inherit"
          >
            User
          </Button>
          </Box>
          )}
          <Box sx={{ display: 'flex' }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle fontSize='large'/>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderUserTab}
      {renderMenu}
    </Box>
  );
}

