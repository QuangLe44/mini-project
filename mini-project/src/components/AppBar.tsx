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
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface SearchAppBarProps {
  user: User | null;
}

export default function SearchAppBar({user}: SearchAppBarProps) {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
  const [taskAnchor, setTaskAnchor] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const isMenuOpen = Boolean(anchorEl);
  const isUserOpen = Boolean(userAnchor);
  const isTaskOpen = Boolean(taskAnchor);

  const handleLogout = () =>{
      logout();
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserTabOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleTaskTabOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTaskAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setUserAnchor(null);
    setTaskAnchor(null);
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
      <MenuItem onClick={() => {
        navigate("/index/users", { state: { user } });
        setUserAnchor(null);
      }}>
        User list
      </MenuItem>
      <MenuItem onClick={() => {
        navigate("index/users/new", { state: { user } });
        setUserAnchor(null);
      }}>
        New user
      </MenuItem>
    </Menu>
  );

  const taskId = 'primary-search-task';
  const renderTaskTab = (
    <Menu
      anchorEl={taskAnchor}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      id={taskId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isTaskOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {
        navigate("/index")
        setTaskAnchor(null);
      }}>
        Task list
      </MenuItem>
      {user?.is_admin ? (
        <MenuItem onClick={() => {
          navigate("/index/new", { state: { user } });
          setTaskAnchor(null);
        }}>
          New task
        </MenuItem>
      ) : null}
    </Menu>
  );

  return (
    <>
    <Box sx={{ 
        maxWidth: "100%"
     }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h2"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              textAlign: 'center',
              width: '100%',
            }}
          >
            Task
          </Typography>
          <Box sx={{
              position: 'absolute',
              right: 0,
              display: 'flex', 
              alignItems: 'center', 
            }}>
            {user?.is_admin ? (
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
            ) : null}
            <Box sx={{ display: 'flex', paddingRight: '2rem' }}>
              <Button sx={{
                margin: "0"
              }}
                variant="outlined"
                size="large"
                aria-controls={taskId}
                onClick={handleTaskTabOpen}
                color="inherit"
              >
                Tasks
              </Button>
            </Box>
            <Box sx={{ display: 'flex', paddingRight: '2rem' }}>
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
          </Box>
        </Toolbar>
      </AppBar>
      {renderUserTab}
      {renderTaskTab}
      {renderMenu}
    </Box>
    </>
  );
  
}

