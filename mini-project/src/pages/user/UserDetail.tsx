import React, { useState, useEffect} from "react";
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogActions, TextField, FormControl, MenuItem, Select, InputLabel, SelectChangeEvent, styled} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, useField, FieldAttributes } from "formik";
import * as Yup from "yup";

const StyledForm = styled(Form)({
  display: "flex", 
  flexDirection: "column", 
  gap: "16px", 
  marginTop: "10px", 
  alignItems: "center",
});

const UserDetail: React.FC = () => {
    const { access_token } = useAuth();  
    const [open, setOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const currentUser = location.state?.currentUser;
    const navigate = useNavigate();
    const [updatedUser, setUpdatedUser] = useState({
        id: 0,
        name: "",
        is_admin: ""
    });

    const deleteUser = async (userID: string): Promise<void> => {
        try {
            await axios.delete(`http://laravel.test/api/users/${userID}`, {
                headers: {
                    Authorization: "Bearer " + access_token,
                },
              });
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };

    const handleClickOpen = (userID: string|undefined) => {
        setSelectedUserId(userID);
        setOpen(true);
      };
    
      const handleClose = () => {
        setSelectedUserId("");
        setOpen(false);
      };

    const getUser = async () => {
        try {
          if(!access_token){
            return
          }
          const response = await axios.get(`http://laravel.test/api/users/${id}`, {
            headers: {
              Authorization: "Bearer " + access_token,
            },
          });
          return response.data;
        } catch (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
    };
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userData = await getUser();
          setUpdatedUser({...userData})
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }, [id]);

    if (!updatedUser.name) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <Typography variant="h6">Loading user details...</Typography>
        </Box>
      );
    }
    
    return (
        <>
        <Box
        sx={{
            display: 'flex',
            margin:"auto",
            justifyContent: "center",
            alignItems: "center", 
        }}
        >
        <Paper elevation={10} sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: "30%",
            justifyContent: "center",
            alignItems: "center",
            padding: '16px'
        }}>
                <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "16px", 
                    marginTop: "10px", 
                    alignItems: "center",
                    }}>

                  <Formik
                    initialValues={{
                        id: updatedUser.id,
                        name: updatedUser.name,
                        is_admin: updatedUser.is_admin,
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .required("This field is required"),
                        is_admin: Yup.string()
                        .required("This field is required"),

                    })}
                    onSubmit={(values) => {
                      const updateUser = async () => {
                        try {
                          if (!updatedUser) return;
                      
                          const updatePayload = {
                            name: values.name,
                            is_admin: values.is_admin,
                          };

                          await axios.put(`http://laravel.test/api/users/${values.id}`, updatePayload, {
                              headers: {
                                Authorization: `Bearer ${access_token}`,
                              },
                            }
                          );
                          navigate("/index/users", { state: { user: currentUser } })
                        } catch (error) {
                          console.error("Error updating user:", error);
                        }
                      };
                        updateUser();
                    }}
                    >
                    {({setFieldValue, values, errors, handleBlur, touched}) => (
                        <StyledForm>
                            <Typography variant="h3"><strong>Update user</strong></Typography>
                            <TextField
                                label="Name"
                                name="name"
                                value={values.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("name", e.target.value);  
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.name && touched.name)}
                            />
                            {errors.name && touched.name && (<Typography variant="body1" color="error" sx={{ alignSelf: "flex-start" }}>{errors.name}</Typography>)}
                            <FormControl fullWidth>
                                <InputLabel>is_admin</InputLabel>
                                <Select
                                label="is_admin"                    
                                name="is_admin"
                                value={values.is_admin}
                                onChange={(event: SelectChangeEvent<string>) => {
                                    setFieldValue("is_admin", event.target.value)
                                }}
                                >
                                <MenuItem value="1">Yes</MenuItem>
                                <MenuItem value="0">No</MenuItem>
                                </Select>
                            </FormControl>
                            <Box sx={{ 
                                display: "flex", 
                                gap: "10px", 
                                width: '100%' 
                                }}>
                                <Button variant="contained" color="primary" type="submit">
                                Save
                                </Button>
                                <Button variant="outlined" onClick={() => navigate("/index/users", { state: { user: currentUser } })}>
                                Cancel
                                </Button>
                                  <>
                                  <Button 
                                  variant="contained" 
                                  color="error" 
                                  onClick={() => handleClickOpen(id)}
                                  >
                                      Delete
                                  </Button>
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
                                          const userid: string = selectedUserId ?? "";
                                          deleteUser(userid);
                                          navigate("/index/users", { state: { user: currentUser } })
                                          }}
                                          >
                                          Yes
                                          </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </>
                            </Box>
                        </StyledForm>)}
                    </Formik>
                </Box>
        </Paper>
        </Box>
        </>
    );
};

export default UserDetail;
