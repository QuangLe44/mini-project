import React, { useState, useEffect, useCallback } from "react";
import { Box, Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import SearchAppBar from "./components/AppBar";
import SearchIcon from '@mui/icons-material/Search';
import ResponsiveGrid from "./components/TaskGrid";
import { Search, SearchIconWrapper, StyledInputBase } from "./layouts/Layout";

const TaskIndex: React.FC = () => {
  const [filters, setFilters] = useState({ name:'', sort_by: 'created_at', order: 'asc' });
  const [name, setName] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [sort_by, setSort] = useState('created_at');
  const [order, setOrderBy] = useState('asc');

  const handleFilterChange = useCallback(() => {
    setFilters(filters => ({
      ...filters,
      name: debouncedName,
      sort_by,
      order,
    }));
  }, [debouncedName, sort_by, order]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name);
    }, 1000);

    return () => clearTimeout(handler);
  }, [name]);

  useEffect(() => {
    handleFilterChange();
  }, [debouncedName, sort_by, order, handleFilterChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <>
    <Box sx={{
      boxSizing: "border-box",
      backgroundColor: "white",
      maxWidth: "100vw",
      minHeight: "100vh",
      overflow: "auto"
    }}>
    <SearchAppBar/>   
      <Box sx={{
        display: "flex",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        margin:"auto",
        justifyContent: "center",  // Centers content horizontally
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
        <Box>
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
        </Box>
        <Box>
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
      </Box> 
      <ResponsiveGrid filters={filters}/>
</Box>
    </>
  );
};

export default TaskIndex;
