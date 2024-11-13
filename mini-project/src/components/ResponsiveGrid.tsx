import React, { useState, useEffect } from "react";
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { Typography, Paper } from "@mui/material";
import axios from 'axios';
import { useAuth } from "../context/AuthContext";

interface ResponsiveGridProps {
    filters: any;
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

export default function ResponsiveGrid({ filters }: ResponsiveGridProps) {
    const { access_token } = useAuth();  
    const [tasks, setTasks] = useState<any[]>([]);
    const [status, setStatus] = useState<{ [key: string]: string }>({});

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

    const handleStatusChange = async (taskId: string, newStatus: string) => {
      setStatus((prevStatuses) => ({
        ...prevStatuses,
        [taskId]: newStatus,
      }));

      const updatedTask = tasks.find((task) => task.id === taskId);

      if (updatedTask) {
        try {
          const requestData = {
            name: updatedTask.name,
            description: updatedTask.description,
            priority: updatedTask.priority,
            status: newStatus,
            start_date: updatedTask.start_date,
            end_date: updatedTask.end_date
          };
  
        await axios.put("http://laravel.test/api/tasks/" + taskId, requestData, {
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
  
    interface Task {
      id: string;
      name: string;
      description: string;
      priority: string;
      status: string;
      start_date: string;
      end_date: string;
    }
    
    interface ID {
      [key: string]: string; 
    }

    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const taskData = await getTasks(filters); 
            setTasks(taskData.data);
            const initialStatuses = taskData.data.reduce((acc: ID, task: Task) => {
              acc[task.id] = task.status;
              return acc;
            }, {});
            setStatus(initialStatuses);
            console.log("fetch")
          } catch (error) {
            console.log(error)
          }
        };
        fetchTasks();

      }, [filters]);

  return (
      <Grid container spacing={4} sx={{
        margin: "0 1.8rem"
      }}>
        {tasks.map((task: any) => {
          const taskStatus = status[task.id];
          return (
          <Grid key={task.id} size={3}>
            <Item sx={{
                textAlign: 'left',
                boxShadow: "0 0 10px 2px black",
            }}>
              <Typography variant="h6">{task.name}</Typography>
              <Typography><strong>Description: </strong>{task.description}</Typography>
              <Typography><strong>Status: </strong>
              <select 
              value={taskStatus} 
              onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Cancelled">Cancelled</option>  
              </select>    
              </Typography>
              <Typography><strong>Priority: </strong>{task.priority}</Typography>
              <Typography><strong>Start Date: </strong>{task.start_date}</Typography>
              <Typography><strong>End Date: </strong>{task.end_date}</Typography>
            </Item>
          </Grid>
        )})}
      </Grid>
  );
}