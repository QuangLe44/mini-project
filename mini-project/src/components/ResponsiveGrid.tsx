import { useState, useEffect } from "react";
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { Typography, Paper, Button, Box, Dialog, DialogTitle, DialogActions} from "@mui/material";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

interface ResponsiveGridProps {
    filters: any;
    user: User | null;
    rowsPerPage: number;
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function ResponsiveGrid({ filters, user, rowsPerPage, setRowsPerPage, setTotal}: ResponsiveGridProps) {
    const { access_token } = useAuth();  
    const [tasks, setTasks] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");
    const navigate = useNavigate();

    const handleClickOpen = (taskId: string) => {
      setSelectedTaskId(taskId);
      setOpen(true);
    };
  
    const handleClose = () => {
      setSelectedTaskId("");
      setOpen(false);
    };

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

    const handleStatusChange = async (taskId: string, newStatus: string) => {
      const updatedTask = tasks.find((task) => task.id === taskId);

      if (updatedTask) {
        try {
          const requestData = {
            status: newStatus,
          };
        await axios.put(`http://laravel.test/api/tasks/${taskId}`, requestData, {
            headers: {
              Authorization: "Bearer " + access_token,
              'Content-Type': 'application/json',
            },
        });

        const taskData = await getTasks(filters); 
        setTasks(taskData.data);
  
        } catch (error) {
          throw error;
        }
      }
    };

    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const taskData = await getTasks(filters);
            setTasks(taskData.data);

            setTotal(taskData.total);
            if (taskData.data && taskData.per_page) {
              setRowsPerPage(taskData.per_page);
            }
          } catch (error) {
            console.log(error)
          }
        };
        fetchTasks();
      }, [filters, setRowsPerPage, setTotal]);

  return (
      <Grid container spacing={4} sx={{
        margin: "0 1.8rem"
      }}>
        {tasks.map((task: any) => {
          return (
          <Grid key={task.id} size={3}>
            <Item sx={{
                textAlign: 'left',
                boxShadow: "0 0 10px 2px black",
            }}>
              <Typography variant="h5" onClick={() => navigate(`/index/${task.id}`, { state: { user } })}
                  sx={{
                    cursor: 'pointer',
                    color: 'inherit',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  ><strong>{task.name}</strong></Typography>
              <Box sx={{
                width: '100%',
                paddingLeft: '30%'
              }}>
                <Typography><strong>Description: </strong>{task.description}</Typography>
                <Typography><strong>Status: </strong>
                <select 
                value={task.status} 
                onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Cancelled">Cancelled</option>  
                </select>    
                </Typography>
                <Typography><strong>Priority: </strong>{task.priority}</Typography>
                <Typography><strong>Start Date: </strong>{task.start_date}</Typography>
                <Typography><strong>End Date: </strong>{task.end_date}</Typography>
              </Box>
              <Box sx={{
                display: 'flex', 
                justifyContent: 'right',
                gap: '16px',
                marginTop: '10px'
              }}>
                <Button variant="outlined" sx={{
                  width: '25%',
                  margin: '0'
                }}
                onClick={() => navigate(`/index/${task.id}`, { state: { user } })}
                >
                  Details
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
                </>
                )}
              </Box>
            </Item>
          </Grid>
        )})}
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
                deleteTask(selectedTaskId);
                setOpen(false);
                window.location.reload();
              }}
              >
                Yes
              </Button>
            </DialogActions>
        </Dialog>
      </Grid>
  );
}