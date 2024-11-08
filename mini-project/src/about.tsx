import React, { useState, useEffect } from "react";
import { Typography, Button, TextField, styled, alpha, InputBase, Box, Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import SearchAppBar from "./components/AppBar";
import SearchIcon from '@mui/icons-material/Search';
import ResponsiveGrid from "./components/TaskGrid";

const AboutPage: React.FC = () => {

  const [filters, setFilters] = useState({ name:'', sort_by: 'created_at', order: 'asc' });
  const [sort_by, setSort] = useState('created_at');
  const [order, setOrderBy] = useState('asc');

  const handleFilterChange = () => {
    setFilters({
      ...filters,
      sort_by,
      order,
    });
  };

  const Search = styled('div')(() => ({
    position: 'relative',
    border: '1px solid black',
    borderRadius: "10px",
    padding: "1rem",
    backgroundColor: "white",
    '&:hover': {
      backgroundColor: alpha('rgb(255, 255, 255)', 0.8),
    },
    width: '50%',
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(1, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'inline',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 1),
      // vertical padding + font size from searchIcon
      paddingLeft: "calc(1em + " + theme.spacing(5) + ")",
      transition: theme.transitions.create('width'),
      width: '100%',
    },
  }));
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
            sx={{
              minWidth: "9rem",
              color: "black",
              backgroundColor: "white",
              padding: "0.3rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "2px", // Set the border thickness here
                borderColor: "black", // Optional: change border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderWidth: "2px",
                borderColor: "#1976d2", // Optional: change border color on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderWidth: "2px",
                borderColor: "#1976d2", // Optional: change border color when focused
              },
            }}
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
              sx={{
                minWidth: "9rem",
                color: "black",
                backgroundColor: "white",
                padding: "0.3rem"
              }}
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
        <Button onClick={handleFilterChange} sx={{
          width: "auto"
        }}>Apply</Button>
      </Box> 

      <ResponsiveGrid filters={filters}/>
</Box>
    </>
  );
};

export default AboutPage;
