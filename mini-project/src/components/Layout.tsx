import { Box, styled} from '@mui/material';

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

