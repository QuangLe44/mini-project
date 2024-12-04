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

const TaskDetail: React.FC = () => {
    const { access_token } = useAuth();  
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();
    const [updatedTask, setUpdatedTask] = useState({
      name: "",
      description: "",
      status: "",
      priority: "",
      start_date: "",
      end_date: "",
    });

    const deleteTask = async (taskId: string): Promise<void> => {
        try {
            await axios.delete(`http://laravel.test/api/tasks/${taskId}`, {
                headers: {
                    Authorization: "Bearer " + access_token,
                },
              });
        } catch (error) {
          console.error('Error deleting task:', error);
        }
      };

    const handleClickOpen = (taskId: string|undefined) => {
        setSelectedTaskId(taskId);
        setOpen(true);
      };
    
      const handleClose = () => {
        setSelectedTaskId("");
        setOpen(false);
      };

    const getTask = async () => {
        try {
          if(!access_token){
            return
          }
          const response = await axios.get(`http://laravel.test/api/tasks/${id}`, {
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
    
    useEffect(() => {
      const fetchTask = async () => {
        try {
          const taskData = await getTask();
          setUpdatedTask({...taskData})
        } catch (error) {
          console.log(error);
        }
      };
      fetchTask();
    }, [id]);

    if (!updatedTask.name) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <Typography variant="h6">Loading task details...</Typography>
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
                        name: updatedTask.name,
                        description: updatedTask.description,
                        status: updatedTask.status,
                        priority: updatedTask.priority,
                        start_date: updatedTask.start_date,
                        end_date: updatedTask.end_date,
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string()
                        .required("This field is required"),
                        description: Yup.string()
                        .required("This field is required"),
                        status: Yup.string()
                        .required("This field is required"),
                        priority: Yup.string()
                        .required("This field is required"),
                        start_date: Yup.date()
                        .required("This field is required"),
                        end_date: Yup.date()
                        .required("This field is required"),
                    })}
                    onSubmit={(values) => {
                      const updateTask = async () => {
                        try {
                          if (!updatedTask) return;
                      
                          const updatePayload = {
                            name: values.name,
                            description: values.description,
                            status: values.status,
                            priority: values.priority,
                            start_date: values.start_date,
                            end_date: values.end_date,
                          };
                          
                          await axios.put(`http://laravel.test/api/tasks/${id}`, updatePayload, {
                              headers: {
                                Authorization: `Bearer ${access_token}`,
                              },
                            }
                          );
                          window.location.reload();
                        } catch (error) {
                          console.error("Error updating task:", error);
                        }
                      };
                        updateTask();
                    }}
                    >
                    {({setFieldValue, values, errors, handleBlur, touched}) => (
                        <StyledForm>
                            <Typography variant="h3"><strong>Update task</strong></Typography>
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
                            <TextField
                                label="Description"
                                name="description"
                                value={values.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("description", e.target.value)           
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.description && touched.description)}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                label="Status"                    
                                name="status"
                                value={values.status}
                                onChange={(event: SelectChangeEvent<string>) => {
                                    setFieldValue("status", event.target.value)
                                }}
                                >
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Priority</InputLabel>
                                <Select
                                label="Priority"                    
                                name="priority"
                                value={values.priority}
                                onChange={(event: SelectChangeEvent<string>) => {
                                    setFieldValue("priority", event.target.value)
                                }}
                                >
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Start Date"
                                name="start_date"
                                type="date"
                                value={values.start_date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("start_date", e.target.value)           
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.start_date && touched.start_date)}
                            />
                            <TextField
                                label="End Date"
                                name="end_date"
                                type="date"
                                value={values.end_date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFieldValue("end_date", e.target.value)           
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.end_date && touched.end_date)}
                            />
                            <Box sx={{ 
                                display: "flex", 
                                gap: "10px", 
                                width: '100%' 
                                }}>
                                <Button variant="contained" color="primary" type="submit">
                                Save
                                </Button>
                                <Button variant="outlined" onClick={() => navigate("/index")}>
                                Cancel
                                </Button>
                                {user?.is_admin && (
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
                                          padding: "0px",
                                          zIndex: "5"               
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
                                          const taskid: string = selectedTaskId ?? "";
                                          deleteTask(taskid);
                                          navigate("/index");
                                          }}
                                          >
                                          Yes
                                          </Button>
                                      </DialogActions>
                                    </Dialog>
                                  </>
                                  )}
                            </Box>
                        </StyledForm>)}
                    </Formik>
                </Box>
        </Paper>
        </Box>
        </>
    );
};

export default TaskDetail;
