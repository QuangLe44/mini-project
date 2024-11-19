import React, { useState, useEffect} from "react";
import { Box, Paper, Typography, Button, Dialog, DialogTitle, DialogActions} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const TaskDetail: React.FC = () => {
    const [task, setTask] = useState<any>();
    const { access_token } = useAuth();  
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const user = location.state?.user;
    const navigate = useNavigate();

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

    const handleClickOpen = (taskId: string) => {
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
          setTask(taskData);
        } catch (error) {
          console.log(error);
        }
      };
      fetchTask();
    }, [id]);

    if (!task) {
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
            <Typography variant="h5"><strong>{task.name}</strong></Typography>
                <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: '10px'
                }}>
                    <Typography><strong>Description: </strong>{task.description}</Typography>
                    <Typography><strong>Status: </strong>{task.status}</Typography>
                    <Typography><strong>Priority: </strong>{task.priority}</Typography>
                    <Typography><strong>Start Date: </strong>{task.start_date}</Typography>
                    <Typography><strong>End Date: </strong>{task.end_date}</Typography>
                </Box>
                <Box sx={{
                    display: 'flex', 
                    gap: '16px',
                    justifyContent: "center",
                    paddingTop: '20px',
                }}>
                    <Button variant="outlined" sx={{
                    width: '25%',
                    margin: '0'
                    }}
                    >
                    Update
                    </Button>
                    {user?.is_admin && (
                    <>
                    <Button 
                    variant="contained" 
                    color="error" 
                    sx={{
                        width: '25%',
                        margin: '0'
                    }}
                    onClick={() => handleClickOpen(task.id)}
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
                        aria-describedby="delete-dialog-description"
                        >
                        <DialogTitle id="delete-dialog-title">
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
                            deleteTask(selectedTaskId);
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
        </Paper>
        </Box>
        </>
    );
};

export default TaskDetail;
