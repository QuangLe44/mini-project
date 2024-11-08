import React, { useState, useEffect } from "react";
import { Typography, Button, TextField, styled, alpha, InputBase, Box, Select, InputLabel, MenuItem } from "@mui/material";
import SearchAppBar from "./components/AppBar";
import SearchIcon from '@mui/icons-material/Search';
import ResponsiveGrid from "./components/TaskGrid";

const AboutPage: React.FC = () => {

  const [filters, setFilters] = useState({ name:'', sort_by: 'created_at', order: 'asc' });

  const [sort_by, setSort] = useState('created_at');
  const [order, setOrderBy] = useState('asc');

  useEffect(() => {
    setFilters({
      name:'',
      sort_by: 'created_at',
      order: 'asc',
    });
  }, [setFilters]);

  const handleFilterChange = () => {
    // Build filters object in the required format
    const filters: any = {};

    if (sort_by) {
      filters.sort_by = sort_by;
    }

    if (order) {
      filters.order = order;
    }

    setFilters(filters);
  };

  const Search = styled('div')(({ theme }) => ({
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
      backgroundColor: "gray",
      maxWidth: "100vw",
      minHeight: "100vh",
      overflow: "auto"
    }}>
    <SearchAppBar/>   
      <Box sx={{
        display: "flex",
        paddingTop: "3rem",
        paddingBottom: "3rem",
        margin:"auto"
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
      <InputLabel id="demo-select-small-label">Sort by: </InputLabel>
      <Select 
        labelId="demo-select-small-label"
        id="demo-select-small"
        label="Sort"
        value={sort_by} onChange={(e) => setSort(e.target.value)}
      >
        <MenuItem value="asc">Ascending</MenuItem>
        <MenuItem value="desc">Descending</MenuItem>
      </Select>
      </Box> 

      <ResponsiveGrid filters={filters}/>
</Box>
    </>
  );
};

export default AboutPage;
