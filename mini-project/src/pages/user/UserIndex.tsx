import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableHead, TableRow, Box, Button, TablePagination, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { StyledCell, StyledHead, Search, SearchIconWrapper, StyledInputBase } from '../../layouts/Layout';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState({search:'', page: 1, per_page: 5});
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const location = useLocation();
  const currentUser = location.state?.user;
  const navigate = useNavigate();
  const { access_token } = useAuth(); 

  const handleClickOpen = (taskId: string) => {
    setSelectedTaskId(taskId);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedTaskId("");
    setOpen(false);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };  

  const deleteUser = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`http://laravel.test/api/users/${userId}`, {
            headers: {
                Authorization: "Bearer " + access_token,
            },
          });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get('http://laravel.test/api/users', {
          params: debouncedSearch,
          headers: {
              Authorization: 'Bearer ' + access_token,
            },
      }); 
      const formattedUsers = response.data.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin === 1,
      }));
      setTotal(response.data.total)
      setUsers(formattedUsers); 

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      await getUsers();
    };

    fetchUsers();
  }, [debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(debouncedSearch => ({
        ...debouncedSearch,
        search: search,
        page: page + 1,
        per_page: rowsPerPage
        })
      );
    }, 500);
    return () => clearTimeout(handler);
  }, [search, page, rowsPerPage]);

  if (currentUser && !currentUser?.is_admin) {
    navigate("/index/unauthorized", { replace: true });
    return null; 
  }

  return (
    <>
      <Box sx={{display: 'flex',flexDirection: 'column', alignItems: "center"}}>
          <Search sx={{
            minWidth: "60%",
            margin: "0 0 30px 0"
          }}>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={search}
              onChange={handleInputChange}
            />
          </Search>
        <Table sx={{ width: "80%", overflow: 'auto', border: '3px solid'}} aria-label="user list">
          <TableHead>
            <TableRow>
              <StyledHead>#</StyledHead>
              <StyledHead>Name</StyledHead>
              <StyledHead>Email</StyledHead>
              <StyledHead>Admin</StyledHead>
              <StyledHead></StyledHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.map((user, index) => (
              <TableRow key={user.id}>
                <StyledCell>{index + 1}</StyledCell>
                <StyledCell>{user.name}</StyledCell>
                <StyledCell>{user.email}</StyledCell>
                <StyledCell>{user.is_admin ? 'Yes' : 'No'}</StyledCell>
                <StyledCell sx={{padding:"0px", margin:"0px", maxHeight: "30px"}}>
                    <Button 
                      variant="outlined" 
                      sx={{
                      maxWidth:"40%", 
                      margin: "15px 20px 15px 0",
                      padding:"5px 0 5px 0"
                      }}
                      onClick={() => navigate(`/index/users/${user.id}`, { state: { currentUser } })}
                      >
                        Detail
                    </Button>
                    <Button 
                      variant="contained" 
                      color='error' 
                      sx={{
                      maxWidth:"40%", 
                      margin: "15px 0 15px 0",
                      padding: "5px 0 5px 0"
                      }}
                      onClick={() => handleClickOpen(user.id)}
                      >
                        Delete
                    </Button>
                </StyledCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog 
          sx={{
              margin: "0px",
              padding: "0px"
          }}
          open={open}
          onClose={handleClose}
          aria-labelledby="delete-dialog"
          >
          <DialogTitle id="delete-dialog">
              {"Are you sure?"}
          </DialogTitle>
          <DialogActions>
              <Button variant="outlined" sx={{
              width: '50%',
              margin: '0'
              }} onClick={handleClose}
              >
              No
              </Button>
              <Button variant="outlined" sx={{
              width: '50%',
              margin: '0'
              }} onClick={() => {
              deleteUser(selectedTaskId);
              window.location.reload();
              }}
              >
              Yes
              </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ 
          alignSelf: 'flex-start',
          width:"30%",
          padding: "10px 0 30px 0"
          }}>
          <TablePagination sx={{
            '& .MuiTablePagination-selectLabel': {
              fontSize: '1rem',
            }
          }}
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          labelRowsPerPage="Users per page:"
          />
        </Box>
      </Box>
    </>
  );
};

export default UserList;
