import React, { useState, useEffect, useCallback } from "react";
import { Box, Select, InputLabel, MenuItem, FormControl, TablePagination} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ResponsiveGrid from "../../components/ResponsiveGrid";
import { Search, SearchIconWrapper, StyledInputBase } from "../../layouts/Layout";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const TaskIndex: React.FC = () => {
  const [filters, setFilters] = useState({ name:'', sort_by: 'created_at', order: 'asc', page: 1, per_page: 4 });
  const [name, setName] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [sort_by, setSort] = useState('created_at');
  const [order, setOrderBy] = useState('asc');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [user, setUser] = useState<User | null>(null);
  const { access_token } = useAuth(); 

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

  const handleFilterChange = useCallback(() => {
    setFilters(filters => ({
      ...filters,
      name: debouncedName,
      sort_by,
      order,
      page: page + 1,
      per_page: rowsPerPage,
    }));
  }, [debouncedName, sort_by, order, page, rowsPerPage]);

  const getTasks = async (filters = {}) => {
    try {
      if(!access_token){
        return
      }
      const response = await axios.get('http://laravel.test/api/tasks', {
        params: filters,
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }; 

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };  

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const taskData = await getTasks(filters);
        const totalTasks = taskData.total;
        setTotal(totalTasks);
      } catch (error) {
        console.log(error)
      }
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      await getUserInfo();
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name);
    }, 500);
    return () => clearTimeout(handler);
  }, [name]);

  useEffect(() => {
    handleFilterChange();
  }, [debouncedName, sort_by, order, page, rowsPerPage, handleFilterChange]);

  return (
    <>
    <Box>
      <Box sx={{
                display: "flex",
                paddingTop: "0",
                paddingBottom: "3rem",
                margin:"auto",
                justifyContent: "center",
                alignItems: "center", 
                gap: "3rem"
            }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={name}
            onChange={handleInputChange}
          />
        </Search>
          <FormControl>
          <InputLabel id="demo-select-label" sx={{
            color: "black"
          }}>Order</InputLabel>
          <Select 
            labelId="demo-select-label"
            id="demo-select-small"
            label="Order"
            value={order} onChange={(e) => setOrderBy(e.target.value)}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="demo-select-label" sx={{
              color: "black"
            }}>Sort</InputLabel>
            <Select 
              labelId="demo-select-label"
              id="demo-select-small"
              label="Sort"
              value={sort_by} onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="created_at">Created</MenuItem>
              <MenuItem value="updated_at">Updated</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
              <MenuItem value="start_date">Start time</MenuItem>
              <MenuItem value="end_date">End time</MenuItem>
            </Select>
          </FormControl>
        </Box>
      <ResponsiveGrid 
      filters={filters} 
      user={user} 
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      setTotal={setTotal}
      />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'left', 
        marginTop: '1rem',
        paddingLeft: '3rem',
        width: '50%',
        }}>
        <TablePagination sx={{
          '& .MuiTablePagination-selectLabel': {
            fontSize: '1rem',
          }
        }}
        component="div"
        count={total}
        page={page}
        showFirstButton
        showLastButton
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[4, 8, 16, 40, 80]}
        labelRowsPerPage="Tasks per page:"
        />
    </Box>
      </Box>
    </>
  );
};

export default TaskIndex;
