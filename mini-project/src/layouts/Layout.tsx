import { Box, styled, alpha, InputBase, TableCell} from '@mui/material';

export const StyledBody = styled(Box)({
  boxSizing: "border-box",
  backgroundColor: "gray",
  paddingTop: "5%",
  minHeight: "100vh"
});

export const StyledBox = styled(Box) ({
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
});

export const Search = styled('div')(() => ({
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

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'inline',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1),
    paddingLeft: "calc(1em + " + theme.spacing(5) + ")",
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export const StyledCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
}));

export const StyledHead = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  fontSize: "1.2rem",
  fontWeight: "bold"
}));

