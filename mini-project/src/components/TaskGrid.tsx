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
    const [tasks, setTasks] = useState<any[]>([]); // State to store tasks
    const { access_token } = useAuth();

    const getTasks = async (filters = {}) => {
      try {
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
  
    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const taskData = await getTasks(filters); 
            setTasks(taskData.data);
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
        {tasks.map((task: any) => (
          <Grid key={task.id} size={3}>
            <Item sx={{
                textAlign: 'left',
                boxShadow: "0 0 10px 2px black",
            }}>
              <Typography variant="h6">{task.name}</Typography>
              <Typography><strong>Description:</strong> {task.description}</Typography>
              <Typography><strong>Status:</strong> {task.status}</Typography>
              <Typography><strong>Priority:</strong> {task.priority}</Typography>
              <Typography><strong>Start Date:</strong> {task.start_date}</Typography>
              <Typography><strong>End Date:</strong> {task.end_date}</Typography>
            </Item>
          </Grid>
        ))}
      </Grid>
  );
}